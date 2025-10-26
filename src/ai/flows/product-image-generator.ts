'use server';

/**
 * @fileOverview A flow for generating product images using an AI model.
 *
 * - generateProductImage - A function that handles the image generation process.
 * - GenerateProductImageInput - The input type for the generateProductImage function.
 * - GenerateProductImageOutput - The return type for the generateProductImage function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'genkit';

const GenerateProductImageInputSchema = z.object({
  prompt: z.string().describe('A text prompt describing the desired scene for the product image.'),
  productImage: z.string().describe("The product image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateProductImageInput = z.infer<typeof GenerateProductImageInputSchema>;

const GenerateProductImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateProductImageOutput = z.infer<typeof GenerateProductImageOutputSchema>;

export const generateProductImageFlow = ai.defineFlow(
  {
    name: 'generateProductImageFlow',
    inputSchema: GenerateProductImageInputSchema,
    outputSchema: GenerateProductImageOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-image-preview'),
        prompt: [
          { media: { url: input.productImage } },
          { text: `Generate a photorealistic image of the product in the following scene: ${input.prompt}` },
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      if (!media || !media.url) {
        throw new Error('Failed to generate image');
      }

    return {
      imageUrl: media.url,
    };
  }
);

export async function generateProductImage(input: GenerateProductImageInput): Promise<GenerateProductImageOutput> {
    return generateProductImageFlow(input);
}

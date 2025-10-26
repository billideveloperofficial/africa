'use server';

/**
 * @fileOverview A flow for generating video content using an AI model.
 *
 * - generateVideo - A function that handles the video generation process.
 * - GenerateVideoInput - The input type for the generateVideo function.
 * - GenerateVideoOutput - The return type for the generateVideo function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'genkit';
import { Readable } from 'stream';
import * as fs from 'fs';

const GenerateVideoInputSchema = z.object({
  prompt: z.string().describe('A text prompt describing the video to generate.'),
  productImage: z.string().optional().describe('A base64 encoded image of the product to feature in the video.'),
});
export type GenerateVideoInput = z.infer<typeof GenerateVideoInputSchema>;

const GenerateVideoOutputSchema = z.object({
  videoUrl: z.string().describe('The data URI of the generated video.'),
});
export type GenerateVideoOutput = z.infer<typeof GenerateVideoOutputSchema>;

async function toBase64(stream: Readable): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
      stream.on('error', reject);
    });
}

export const generateVideoFlow = ai.defineFlow(
  {
    name: 'generateVideoFlow',
    inputSchema: GenerateVideoInputSchema,
    outputSchema: GenerateVideoOutputSchema,
  },
  async (input) => {
    let promptParts: (string | { media: { url: string, contentType?: string } })[] = [
        // This is our AI influencer, Nova.
        { media: { url: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=1932&auto=format&fit=crop', contentType: 'image/jpeg' } },
        { text: `An AI influencer showcasing a product. ${input.prompt}` }
    ];

    if (input.productImage) {
        promptParts.push({ media: { url: input.productImage } });
    }

    let { operation } = await ai.generate({
      model: googleAI.model('veo-2.0-generate-001'),
      prompt: promptParts,
      config: {
        durationSeconds: 5,
        aspectRatio: '16:9',
      },
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    if (operation.error) {
      throw new Error('failed to generate video: ' + operation.error.message);
    }

    const video = operation.output?.message?.content.find((p: any) => !!p.media);
    if (!video || !video.media) {
      throw new Error('Failed to find the generated video');
    }

    // This is a simplified example. In a real app, you'd want to use a proper fetch implementation
    // that works in the Next.js Edge runtime or serverless function environment.
    // We are also assuming GEMINI_API_KEY is available as an environment variable.
    const fetch = (await import('node-fetch')).default;
    const videoDownloadResponse = await fetch(
      `${video.media.url}&key=${process.env.GEMINI_API_KEY}`
    );

    if (!videoDownloadResponse.ok || !videoDownloadResponse.body) {
        throw new Error(`Failed to download video: ${videoDownloadResponse.statusText}`);
    }

    const videoBase64 = await toBase64(Readable.from(videoDownloadResponse.body));

    return {
      videoUrl: `data:video/mp4;base64,${videoBase64}`,
    };
  }
);


export async function generateVideo(input: GenerateVideoInput): Promise<GenerateVideoOutput> {
    return generateVideoFlow(input);
}

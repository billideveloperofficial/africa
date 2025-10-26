// The AI flow will generate compelling brand deal pitches for creators.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BrandDealPitchGeneratorInputSchema = z.object({
  brandName: z.string().describe('The name of the brand to pitch to.'),
  creatorName: z.string().describe('The name of the content creator.'),
  contentType: z.string().describe('The type of content the creator produces (e.g., YouTube videos, Instagram posts, blog articles).'),
  audienceDemographics: z.string().describe('Description of the creator\'s audience demographics.'),
  uniqueSellingPoints: z.string().describe('The unique selling points or key value propositions of the creator.'),
  previousBrandDeals: z.string().optional().describe('A list of previous brand deals the creator has done.'),
});
export type BrandDealPitchGeneratorInput = z.infer<typeof BrandDealPitchGeneratorInputSchema>;

const BrandDealPitchGeneratorOutputSchema = z.object({
  pitch: z.string().describe('The generated brand deal pitch.'),
});
export type BrandDealPitchGeneratorOutput = z.infer<typeof BrandDealPitchGeneratorOutputSchema>;

export async function generateBrandDealPitch(input: BrandDealPitchGeneratorInput): Promise<BrandDealPitchGeneratorOutput> {
  return brandDealPitchGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'brandDealPitchGeneratorPrompt',
  input: {schema: BrandDealPitchGeneratorInputSchema},
  output: {schema: BrandDealPitchGeneratorOutputSchema},
  prompt: `You are an expert in crafting compelling brand deal pitches for content creators. Your goal is to generate a pitch that grabs the brand\'s attention and highlights the creator\'s value. Use the following information to create the pitch:\n\nBrand Name: {{{brandName}}}\nCreator Name: {{{creatorName}}}\nContent Type: {{{contentType}}}\nAudience Demographics: {{{audienceDemographics}}}\nUnique Selling Points: {{{uniqueSellingPoints}}}\nPrevious Brand Deals: {{{previousBrandDeals}}}\n\nCraft a pitch that is concise, engaging, and clearly demonstrates the benefits of partnering with the creator. Focus on how the creator can help the brand reach its target audience and achieve its marketing goals. The pitch should be no more than 200 words.\n\nHere's the pitch:\n`,
});

const brandDealPitchGeneratorFlow = ai.defineFlow(
  {
    name: 'brandDealPitchGeneratorFlow',
    inputSchema: BrandDealPitchGeneratorInputSchema,
    outputSchema: BrandDealPitchGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

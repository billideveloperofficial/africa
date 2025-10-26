'use server';

/**
 * @fileOverview A flow for checking if content is brand-safe.
 *
 * - checkContent - A function that analyzes text for brand safety.
 * - ContentCheckerInput - The input type for the checkContent function.
 * - ContentCheckerOutput - The return type for the checkContent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ContentCheckerInputSchema = z.object({
  text: z.string().describe('The text content to be checked for brand safety.'),
});
export type ContentCheckerInput = z.infer<typeof ContentCheckerInputSchema>;

const ContentCheckerOutputSchema = z.object({
  isBrandSafe: z.boolean().describe('Whether the content is considered brand-safe.'),
  feedback: z.string().describe('Detailed feedback on why the content is or is not brand-safe.'),
  suggestions: z.string().optional().describe('Suggestions for improving the content if it is not brand-safe.'),
});
export type ContentCheckerOutput = z.infer<typeof ContentCheckerOutputSchema>;

export async function checkContent(input: ContentCheckerInput): Promise<ContentCheckerOutput> {
  return contentCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contentCheckerPrompt',
  input: { schema: ContentCheckerInputSchema },
  output: { schema: ContentCheckerOutputSchema },
  prompt: `You are an expert in brand marketing and social media content. Your task is to analyze the following text to determine if it is "brand-safe".

A brand-safe post is professional, positive, and avoids controversial or sensitive topics. It should be free of profanity, hate speech, political statements, and any content that a major brand would not want to be associated with.

Analyze the following text:
---
{{{text}}}
---

Based on your analysis, determine if the content is brand-safe. Provide clear feedback explaining your reasoning. If the content is not brand-safe, offer specific suggestions for how to improve it.
`,
});

const contentCheckerFlow = ai.defineFlow(
  {
    name: 'contentCheckerFlow',
    inputSchema: ContentCheckerInputSchema,
    outputSchema: ContentCheckerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

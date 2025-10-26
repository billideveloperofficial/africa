'use server';

/**
 * @fileOverview Provides a personal AI assistant that advises creators on content and engagement strategies.
 *
 * - personalAIAssistant - A function that provides content and engagement strategies.
 * - PersonalAIAssistantInput - The input type for the personalAIAssistant function.
 * - PersonalAIAssistantOutput - The return type for the personalAIAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalAIAssistantInputSchema = z.object({
  creatorProfile: z
    .string()
    .describe('Description of the creator, their niche, and target audience.'),
  contentExamples: z
    .string()
    .describe('Examples of the creator\'s existing content.'),
  goals: z.string().describe('The creator\'s goals for content creation.'),
});
export type PersonalAIAssistantInput = z.infer<typeof PersonalAIAssistantInputSchema>;

const PersonalAIAssistantOutputSchema = z.object({
  contentSuggestions: z
    .string()
    .describe('Suggestions for content the creator can create.'),
  engagementStrategies: z
    .string()
    .describe('Strategies to increase audience engagement.'),
});
export type PersonalAIAssistantOutput = z.infer<typeof PersonalAIAssistantOutputSchema>;

export async function personalAIAssistant(input: PersonalAIAssistantInput): Promise<PersonalAIAssistantOutput> {
  return personalAIAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalAIAssistantPrompt',
  input: {schema: PersonalAIAssistantInputSchema},
  output: {schema: PersonalAIAssistantOutputSchema},
  prompt: `You are a personal AI assistant for content creators.

  Based on the creator's profile, content examples, and goals, provide suggestions for content and engagement strategies.

  Creator Profile: {{{creatorProfile}}}
  Content Examples: {{{contentExamples}}}
  Goals: {{{goals}}}

  Content Suggestions:
  Engagement Strategies:`,
});

const personalAIAssistantFlow = ai.defineFlow(
  {
    name: 'personalAIAssistantFlow',
    inputSchema: PersonalAIAssistantInputSchema,
    outputSchema: PersonalAIAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

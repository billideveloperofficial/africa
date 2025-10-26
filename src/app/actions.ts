"use server";

import {
  generateBrandDealPitch,
  type BrandDealPitchGeneratorOutput,
} from "@/ai/flows/brand-deal-pitch-generator";
import {
  personalAIAssistant,
  type PersonalAIAssistantOutput,
} from "@/ai/flows/personal-ai-assistant";
import { generateVideo, type GenerateVideoOutput } from "@/ai/flows/video-generator";
import { checkContent, type ContentCheckerOutput } from "@/ai/flows/content-checker";
import { generateProductImage, type GenerateProductImageOutput } from "@/ai/flows/product-image-generator";
import {
  BrandDealPitchGeneratorInputSchema,
  PersonalAIAssistantInputSchema,
  GenerateVideoInputSchema,
  ContentCheckerInputSchema,
  GenerateProductImageInputSchema,
} from "@/lib/validators";
import { z } from "zod";

type FormState<T> = {
  data: T | null;
  error: string | null;
};

export async function handleGeneratePitch(
  values: z.infer<typeof BrandDealPitchGeneratorInputSchema>
): Promise<FormState<BrandDealPitchGeneratorOutput>> {
  const validatedFields = BrandDealPitchGeneratorInputSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid input.", data: null };
  }
  try {
    const result = await generateBrandDealPitch(validatedFields.data);
    return { data: result, error: null };
  } catch (error) {
    console.error(error);
    return { error: "Failed to generate pitch. Please try again.", data: null };
  }
}

export async function handleGetAdvice(
  values: z.infer<typeof PersonalAIAssistantInputSchema>
): Promise<FormState<PersonalAIAssistantOutput>> {
  const validatedFields = PersonalAIAssistantInputSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid input.", data: null };
  }
  try {
    const result = await personalAIAssistant(validatedFields.data);
    return { data: result, error: null };
  } catch (error) {
    console.error(error);
    return { error: "Failed to get advice. Please try again.", data: null };
  }
}

export async function handleGenerateVideo(
    values: z.infer<typeof GenerateVideoInputSchema>
  ): Promise<FormState<GenerateVideoOutput>> {
    const validatedFields = GenerateVideoInputSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid input.", data: null };
    }
    try {
      const result = await generateVideo(validatedFields.data);
      return { data: result, error: null };
    } catch (error) {
      console.error(error);
      return { error: "Failed to generate video. Please try again.", data: null };
    }
}

export async function handleCheckContent(
  values: z.infer<typeof ContentCheckerInputSchema>
): Promise<FormState<ContentCheckerOutput>> {
  const validatedFields = ContentCheckerInputSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid input.", data: null };
  }
  try {
    const result = await checkContent(validatedFields.data);
    return { data: result, error: null };
  } catch (error) {
    console.error(error);
    return { error: "Failed to check content. Please try again.", data: null };
  }
}

export async function handleGenerateProductImage(
    values: z.infer<typeof GenerateProductImageInputSchema>
  ): Promise<FormState<GenerateProductImageOutput>> {
    const validatedFields = GenerateProductImageInputSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid input.", data: null };
    }
    try {
      const result = await generateProductImage(validatedFields.data);
      return { data: result, error: null };
    } catch (error) {
      console.error(error);
      return { error: "Failed to generate image. Please try again.", data: null };
    }
}

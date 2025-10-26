
import { z } from "zod";

export const BrandDealPitchGeneratorInputSchema = z.object({
  brandName: z.string().min(1, { message: "Brand name is required." }),
  creatorName: z.string().min(1, { message: "Creator name is required." }),
  contentType: z
    .string()
    .min(1, { message: "Content type is required." }),
  audienceDemographics: z
    .string()
    .min(1, { message: "Audience demographics are required." }),
  uniqueSellingPoints: z
    .string()
    .min(1, { message: "Unique selling points are required." }),
  previousBrandDeals: z.string().optional(),
});
export type BrandDealPitchGeneratorInput = z.infer<
  typeof BrandDealPitchGeneratorInputSchema
>;

export const PersonalAIAssistantInputSchema = z.object({
  creatorProfile: z
    .string()
    .min(1, { message: "Creator profile is required." }),
  contentExamples: z
    .string()
    .min(1, { message: "Content examples are required." }),
  goals: z.string().min(1, { message: "Your goals are required." }),
});
export type PersonalAIAssistantInput = z.infer<
  typeof PersonalAIAssistantInputSchema
>;

export const GenerateVideoInputSchema = z.object({
    prompt: z.string().min(1, { message: "A prompt is required." }),
    productImage: z.string().optional(),
});
export type GenerateVideoInput = z.infer<
    typeof GenerateVideoInputSchema
>;

export const ContentCheckerInputSchema = z.object({
  text: z.string().min(1, { message: "Please enter some text to analyze." }),
});
export type ContentCheckerInput = z.infer<typeof ContentCheckerInputSchema>;

export const GenerateProductImageInputSchema = z.object({
    prompt: z.string().min(1, { message: "A prompt is required." }),
    productImage: z.string().min(1, { message: "An image is required." }),
});
export type GenerateProductImageInput = z.infer<typeof GenerateProductImageInputSchema>;


export const SignUpFormSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters."}),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters."}),
});
export type SignUpFormValues = z.infer<typeof SignUpFormSchema>;

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required."}),
});
export type LoginFormValues = z.infer<typeof LoginFormSchema>;


export const ProfileFormSchema = z.object({
    displayName: z.string().min(2, { message: "Name must be at least 2 characters." }),
    photoURL: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
    bio: z.string().max(280, { message: "Bio must be less than 280 characters."}).optional(),
    tags: z.string().optional(),
    socialHandle: z.string().optional(),
});
export type ProfileFormValues = z.infer<typeof ProfileFormSchema>;

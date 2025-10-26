"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonalAIAssistantInputSchema } from "@/lib/validators";
import { useState, useTransition } from "react";
import { handleGetAdvice } from "@/app/actions";
import type { PersonalAIAssistantOutput } from "@/ai/flows/personal-ai-assistant";
import { Loader2, Lightbulb, BarChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function PersonalAIAssistant() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<PersonalAIAssistantOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof PersonalAIAssistantInputSchema>>({
    resolver: zodResolver(PersonalAIAssistantInputSchema),
    defaultValues: {
      creatorProfile: "",
      contentExamples: "",
      goals: "",
    },
  });

  function onSubmit(values: z.infer<typeof PersonalAIAssistantInputSchema>) {
    setResult(null);
    setError(null);
    startTransition(async () => {
      const formResult = await handleGetAdvice(values);
      if (formResult.error) {
        setError(formResult.error);
        toast({
          title: "Error",
          description: formResult.error,
          variant: "destructive",
        });
      } else {
        setResult(formResult.data);
      }
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start py-8">
      <Card>
        <CardHeader>
          <CardTitle>Creator Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="creatorProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Creator Profile</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your niche, target audience, and brand voice..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contentExamples"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Examples</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List or describe some of your recent content pieces..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Goals</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What are you trying to achieve? (e.g., increase engagement, grow followers, land bigger deals)"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Get AI Advice
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-8 lg:sticky top-24">
        {isPending && (
          <Card className="min-h-[300px]">
            <CardContent className="flex items-center justify-center h-full pt-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </CardContent>
          </Card>
        )}
        {!isPending && !result && (
            <Card className="min-h-[300px]">
                <CardContent className="h-full flex items-center justify-center pt-6">
                    <p className="text-center text-muted-foreground">
                        Your AI-powered content and engagement strategies will appear here.
                    </p>
                </CardContent>
            </Card>
        )}
        {result?.contentSuggestions && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Content Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                {result.contentSuggestions}
              </div>
            </CardContent>
          </Card>
        )}
        {result?.engagementStrategies && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Engagement Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                {result.engagementStrategies}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandDealPitchGeneratorInputSchema } from "@/lib/validators";
import { useState, useTransition } from "react";
import { handleGeneratePitch } from "@/app/actions";
import type { BrandDealPitchGeneratorOutput } from "@/ai/flows/brand-deal-pitch-generator";
import { Loader2, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function BrandDealPitchGenerator() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<BrandDealPitchGeneratorOutput | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof BrandDealPitchGeneratorInputSchema>>({
    resolver: zodResolver(BrandDealPitchGeneratorInputSchema),
    defaultValues: {
      brandName: "",
      creatorName: "",
      contentType: "",
      audienceDemographics: "",
      uniqueSellingPoints: "",
      previousBrandDeals: "",
    },
  });

  function onSubmit(
    values: z.infer<typeof BrandDealPitchGeneratorInputSchema>
  ) {
    setResult(null);
    setError(null);
    startTransition(async () => {
      const formResult = await handleGeneratePitch(values);
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

  const handleCopy = () => {
    if (result?.pitch) {
      navigator.clipboard.writeText(result.pitch);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start py-8">
      <Card>
        <CardHeader>
          <CardTitle>Pitch Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="brandName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Nike, Gymshark" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="creatorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Creator Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Alex Creator" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="contentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Type</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Fitness vlogs on YouTube"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="audienceDemographics"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Audience Demographics</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 18-35, fitness enthusiasts, 60% male"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="uniqueSellingPoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unique Selling Points</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Certified personal trainer, high engagement rate"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="previousBrandDeals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Previous Brand Deals (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., MyProtein, Lululemon" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Generate Pitch
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="lg:sticky top-24">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Generated Pitch</CardTitle>
          {result?.pitch && (
            <Button variant="ghost" size="icon" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">Copy</span>
            </Button>
          )}
        </CardHeader>
        <CardContent className="min-h-[300px]">
          {isPending && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {result?.pitch && (
            <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
              {result.pitch}
            </div>
          )}
          {!isPending && !result && (
            <div className="text-center text-muted-foreground h-full flex items-center justify-center">
              <p>Your AI-generated pitch will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

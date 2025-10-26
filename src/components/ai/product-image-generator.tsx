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
import { GenerateProductImageInputSchema } from "@/lib/validators";
import { useState, useTransition } from "react";
import { handleGenerateProductImage } from "@/app/actions";
import type { GenerateProductImageOutput } from "@/ai/flows/product-image-generator";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export function ProductImageGenerator() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<GenerateProductImageOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof GenerateProductImageInputSchema>>({
    resolver: zodResolver(GenerateProductImageInputSchema),
    defaultValues: {
      prompt: "",
      productImage: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        form.setValue("productImage", dataUrl);
        setSourceImage(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(values: z.infer<typeof GenerateProductImageInputSchema>) {
    setResult(null);
    setError(null);
    startTransition(async () => {
      const formResult = await handleGenerateProductImage(values);
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
          <CardTitle>Image Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scene Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., on a clean white background, on a rustic wooden table, in a forest."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Image</FormLabel>
                     {sourceImage && (
                        <div className="relative aspect-square w-full max-w-sm mx-auto">
                            <Image src={sourceImage} alt="Uploaded product" layout="fill" objectFit="contain" className="rounded-md" />
                        </div>
                     )}
                    <FormControl>
                      <Input type="file" accept="image/*" onChange={handleFileChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Generate Image
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="lg:sticky top-24">
        <CardHeader>
          <CardTitle>Generated Image</CardTitle>
        </CardHeader>
        <CardContent className="min-h-[300px] flex items-center justify-center">
          {isPending && (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2">Generating image...</p>
            </div>
          )}
          {result?.imageUrl && (
            <div className="relative aspect-square w-full">
                <Image src={result.imageUrl} alt="Generated product shot" layout="fill" objectFit="contain" className="rounded-md" />
            </div>
          )}
          {!isPending && !result && (
            <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center">
                <ImageIcon className="h-12 w-12 mb-4 text-muted-foreground/50"/>
                <p>Your AI-generated product shot will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

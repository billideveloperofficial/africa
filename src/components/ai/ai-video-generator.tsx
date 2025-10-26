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
import { GenerateVideoInputSchema } from "@/lib/validators";
import { useState, useTransition } from "react";
import { handleGenerateVideo } from "@/app/actions";
import type { GenerateVideoOutput } from "@/ai/flows/video-generator";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AIVideoGenerator() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<GenerateVideoOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof GenerateVideoInputSchema>>({
    resolver: zodResolver(GenerateVideoInputSchema),
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
        form.setValue("productImage", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(values: z.infer<typeof GenerateVideoInputSchema>) {
    setResult(null);
    setError(null);
    startTransition(async () => {
      const formResult = await handleGenerateVideo(values);
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
          <CardTitle>Video Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., A cinematic shot of the product on a clean white background."
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
                    <FormLabel>Product Image (Optional)</FormLabel>
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
                Generate Video
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="lg:sticky top-24">
        <CardHeader>
          <CardTitle>Generated Video</CardTitle>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          {isPending && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Generating video... this may take a minute.</p>
            </div>
          )}
          {result?.videoUrl && (
            <video controls src={result.videoUrl} className="w-full rounded-md" />
          )}
          {!isPending && !result && (
            <div className="text-center text-muted-foreground h-full flex items-center justify-center">
              <p>Your AI-generated video will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

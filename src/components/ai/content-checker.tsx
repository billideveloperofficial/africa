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
import { ContentCheckerInputSchema } from "@/lib/validators";
import { useState, useTransition } from "react";
import { handleCheckContent } from "@/app/actions";
import type { ContentCheckerOutput } from "@/ai/flows/content-checker";
import { Loader2, Shield, ShieldOff, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function ContentChecker() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ContentCheckerOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof ContentCheckerInputSchema>>({
    resolver: zodResolver(ContentCheckerInputSchema),
    defaultValues: {
      text: "",
    },
  });

  function onSubmit(values: z.infer<typeof ContentCheckerInputSchema>) {
    setResult(null);
    setError(null);
    startTransition(async () => {
      const formResult = await handleCheckContent(values);
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
          <CardTitle>Check Your Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your caption, script, or post text here..."
                        className="min-h-[200px]"
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
                Analyze Content
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="lg:sticky top-24">
        <CardHeader>
          <CardTitle>Analysis Result</CardTitle>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          {isPending && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Analyzing...</p>
            </div>
          )}
          
          {result && (
             <div className="space-y-4">
                <div 
                    className={cn(
                        "flex items-center gap-4 rounded-lg p-4",
                        result.isBrandSafe ? "bg-green-500/10 text-green-700" : "bg-red-500/10 text-red-700"
                    )}
                >
                    {result.isBrandSafe ? (
                        <CheckCircle className="h-8 w-8 flex-shrink-0" />
                    ) : (
                        <AlertTriangle className="h-8 w-8 flex-shrink-0" />
                    )}
                    <div>
                        <h3 className="font-bold text-lg">
                            {result.isBrandSafe ? "Content is Brand-Safe" : "Content May Not Be Brand-Safe"}
                        </h3>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Feedback:</h4>
                    <p className="text-sm text-muted-foreground">{result.feedback}</p>
                </div>

                {result.suggestions && (
                    <div>
                        <h4 className="font-semibold mb-2">Suggestions:</h4>
                        <p className="text-sm text-muted-foreground">{result.suggestions}</p>
                    </div>
                )}
             </div>
          )}

          {!isPending && !result && (
            <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center">
              <Shield className="h-12 w-12 mb-4 text-muted-foreground/50"/>
              <p>Your content analysis will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

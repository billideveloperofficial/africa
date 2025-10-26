"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

interface HowItWorksContent {
  title?: string;
  subtitle?: string;
  steps?: any[];
}

export function HowItWorksSection() {
  const [content, setContent] = useState<HowItWorksContent>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/frontend?section=how_it_works');
        if (response.ok) {
          const data = await response.json();
          const howItWorksData: HowItWorksContent = {};
          if (data.contents.how_it_works) {
            Object.keys(data.contents.how_it_works).forEach((key) => {
              howItWorksData[key as keyof HowItWorksContent] = data.contents.how_it_works[key];
            });
          }
          setContent(howItWorksData);
        }
      } catch (error) {
        console.error('Error fetching how it works content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const defaultSteps = [
    {
      step: "1",
      title: "Create Your Profile",
      description: "Set up your creator profile with your skills, portfolio, and audience insights."
    },
    {
      step: "2",
      title: "Get Matched",
      description: "Our AI matches you with relevant brands and sponsorship opportunities."
    },
    {
      step: "3",
      title: "Start Creating",
      description: "Begin creating content and earning from brand partnerships."
    }
  ];

  if (loading) {
    return (
      <section id="how-it-works" className="bg-background py-10 md:py-14">
        <div className="container">
          <div className="bg-card p-8 md:p-12 rounded-2xl shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-80 mb-6"></div>
                  <div className="aspect-video bg-gray-200 rounded-xl"></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-gray-100 p-6 rounded-lg">
                        <div className="flex items-center gap-6">
                          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="how-it-works" className="bg-background py-10 md:py-14">
      <div className="container">
        <div className="bg-card p-8 md:p-12 rounded-2xl shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                      {content.title || 'How it works'}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        {content.subtitle || 'Get started in just three simple steps'}
                    </p>
                    <div className="relative aspect-video rounded-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                            alt="Content creator"
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-105"
                            data-ai-hint="woman content creator"
                        />
                    </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-4">
                    {(content.steps || defaultSteps).map((step: any, index: number) => (
                      <Card key={step.step || index} className="bg-background/50">
                        <CardContent className="flex items-center gap-6 p-6">
                          <div className="flex-shrink-0 bg-primary/20 text-primary h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg">
                            {step.step || (index + 1)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}

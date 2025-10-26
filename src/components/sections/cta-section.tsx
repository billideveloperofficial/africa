"use client";

import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CTAContent {
  title?: string;
  subtitle?: string;
  primary_button_text?: string;
  primary_button_link?: string;
  secondary_button_text?: string;
  secondary_button_link?: string;
}

export function CtaSection() {
  const [content, setContent] = useState<CTAContent>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/frontend?section=cta');
        if (response.ok) {
          const data = await response.json();
          const ctaData: CTAContent = {};
          if (data.contents.cta) {
            Object.keys(data.contents.cta).forEach((key) => {
              ctaData[key as keyof CTAContent] = data.contents.cta[key];
            });
          }
          setContent(ctaData);
        }
      } catch (error) {
        console.error('Error fetching CTA content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <section className="bg-card">
        <div className="container py-20 md:py-28">
          <div className="text-center max-w-2xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-80 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-8"></div>
              <div className="h-12 bg-gray-200 rounded w-64 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-card">
      <div className="container py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {content.title || 'Ready to take your creator career to the next level?'}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {content.subtitle || 'Join thousands of creators who are already earning more with Content Africa.'}
          </p>
          <div className="mt-8">
            <Link href={content.primary_button_link || "/become-a-creator"}>
              <Button size="lg">
                {content.primary_button_text || 'Get Started Today'} <MoveRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

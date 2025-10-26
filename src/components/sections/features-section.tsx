"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Megaphone, ShieldCheck, Sparkles, Target, BarChart3, Users, DollarSign, HeadphonesIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface FeaturesContent {
  title?: string;
  subtitle?: string;
  features_list?: any[];
}

const iconMap: Record<string, any> = {
  Sparkles: Sparkles,
  Target: Target,
  BarChart3: BarChart3,
  Users: Users,
  DollarSign: DollarSign,
  HeadphonesIcon: HeadphonesIcon,
  Megaphone: Megaphone,
  ShieldCheck: ShieldCheck,
};

export function FeaturesSection() {
  const [content, setContent] = useState<FeaturesContent>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/frontend?section=features');
        if (response.ok) {
          const data = await response.json();
          const featuresData: FeaturesContent = {};
          if (data.contents.features) {
            Object.keys(data.contents.features).forEach((key) => {
              featuresData[key as keyof FeaturesContent] = data.contents.features[key];
            });
          }
          setContent(featuresData);
        }
      } catch (error) {
        console.error('Error fetching features content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <section className="py-20 md:py-28" id="features">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-80 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-card">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const features = content.features_list || [
    {
      icon: 'Sparkles',
      title: "AI Content Generator",
      description: "Generate engaging content ideas and scripts with our advanced AI technology.",
    },
    {
      icon: 'Target',
      title: "Brand Deal Matching",
      description: "Get matched with relevant brands and sponsorship opportunities.",
    },
    {
      icon: 'BarChart3',
      title: "Analytics Dashboard",
      description: "Track your performance and growth with detailed analytics.",
    },
    {
      icon: 'Users',
      title: "Creator Community",
      description: "Connect with other creators and share experiences.",
    },
    {
      icon: 'DollarSign',
      title: "Monetization Tools",
      description: "Multiple ways to monetize your content and creator skills.",
    },
    {
      icon: 'HeadphonesIcon',
      title: "Professional Support",
      description: "Get help from our team of experts whenever you need it.",
    }
  ];

  return (
    <section className="py-20 md:py-28" id="features">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            {content.title || 'Everything you need to succeed'}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {content.subtitle || 'Powerful AI tools and features designed specifically for UGC creators and brands.'}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature: any, index: number) => {
            const IconComponent = iconMap[feature.icon] || Sparkles;
            return (
              <Card key={feature.title || index} className="bg-card hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-primary/10 rounded-full">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  <p>{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

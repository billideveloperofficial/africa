"use client";

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star, TrendingUp } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";

interface SocialProofContent {
  title?: string;
  testimonials?: any[];
  stats?: any[];
}

export function SocialProofSection() {
    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    );

    const [content, setContent] = useState<SocialProofContent>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchContent = async () => {
        try {
          const response = await fetch('/api/frontend?section=social_proof');
          if (response.ok) {
            const data = await response.json();
            const socialProofData: SocialProofContent = {};
            if (data.contents.social_proof) {
              Object.keys(data.contents.social_proof).forEach((key) => {
                socialProofData[key as keyof SocialProofContent] = data.contents.social_proof[key];
              });
            }
            setContent(socialProofData);
          }
        } catch (error) {
          console.error('Error fetching social proof content:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchContent();
    }, []);

    const defaultTestimonials = [
      {
        name: 'Sarah Johnson',
        role: 'Lifestyle Influencer',
        content: 'Content Africa helped me land my first brand deal. The platform is incredibly user-friendly and the AI tools are game-changing.',
        avatar: '/avatars/sarah.jpg'
      },
      {
        name: 'Mike Chen',
        role: 'Tech Reviewer',
        content: 'The analytics dashboard gives me insights I never had before. My engagement rates have increased by 40% since joining.',
        avatar: '/avatars/mike.jpg'
      },
      {
        name: 'Emma Davis',
        role: 'Food Blogger',
        content: 'Finally, a platform that understands creators! The brand matching is spot-on and the community is amazing.',
        avatar: '/avatars/emma.jpg'
      }
    ];

    const defaultStats = [
      { number: '10,000+', label: 'Active Creators' },
      { number: '500+', label: 'Partner Brands' },
      { number: '$2M+', label: 'Creator Earnings' },
      { number: '95%', label: 'Satisfaction Rate' }
    ];

    if (loading) {
      return (
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-80 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="p-8">
                <div className="animate-pulse">
                  <div className="h-12 w-12 bg-gray-200 rounded mx-auto mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-24 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
                </div>
              </Card>
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i} className="p-6">
                      <div className="animate-pulse">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                          </div>
                        </div>
                        <div className="h-16 bg-gray-200 rounded mb-4"></div>
                        <div className="flex">
                          {[...Array(5)].map((_, j) => (
                            <div key={j} className="h-4 w-4 bg-gray-200 rounded mr-1"></div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            {content.title || 'Trusted by creators worldwide'}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Don't just take our word for it. Here's what our community is saying.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="flex flex-col justify-center items-center text-center p-8 bg-primary text-primary-foreground">
                <TrendingUp className="h-12 w-12 mb-4" />
                <h3 className="text-4xl font-bold mb-2">$2,500+</h3>
                <p className="text-lg text-primary-foreground/80">Average monthly earnings for creators on Content Africa.</p>
            </Card>

            <div className="lg:col-span-2">
                <Carousel
                    opts={{
                    align: "start",
                    loop: true,
                    }}
                    plugins={[plugin.current]}
                    className="w-full"
                >
                    <CarouselContent>
                    {(content.testimonials || defaultTestimonials).map((item: any, index: number) => (
                        <CarouselItem key={index} className="md:basis-1/2">
                        <div className="p-1 h-full">
                            <Card className="h-full flex flex-col">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={item.avatar} alt={item.name} />
                                    <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">{item.role}</p>
                                </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-muted-foreground italic">"{item.content}"</p>
                            </CardContent>
                            <div className="p-6 pt-0 flex text-yellow-400">
                                <Star className="h-5 w-5 fill-current" />
                                <Star className="h-5 w-5 fill-current" />
                                <Star className="h-5 w-5 fill-current" />
                                <Star className="h-5 w-5 fill-current" />
                                <Star className="h-5 w-5 fill-current" />
                            </div>
                            </Card>
                        </div>
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex" />
                    <CarouselNext className="hidden md:flex"/>
                </Carousel>
            </div>
        </div>
      </div>
    </section>
  );
}

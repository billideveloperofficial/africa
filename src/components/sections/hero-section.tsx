"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

interface HeroContent {
  badge_text?: string;
  title?: string;
  subtitle?: string;
  primary_button_text?: string;
  primary_button_link?: string;
  secondary_button_text?: string;
  secondary_button_link?: string;
  creators?: any[];
}

export function HeroSection() {
  const [content, setContent] = useState<HeroContent>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/frontend?section=hero');
        if (response.ok) {
          const data = await response.json();
          const heroData: HeroContent = {};
          if (data.contents.hero) {
            Object.keys(data.contents.hero).forEach((key) => {
              heroData[key as keyof HeroContent] = data.contents.hero[key];
            });
          }
          setContent(heroData);
        }
      } catch (error) {
        console.error('Error fetching hero content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <section className="relative bg-background overflow-hidden">
        <div className="container pt-24 pb-12 text-center px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
            <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-80 mx-auto mb-8"></div>
            <div className="flex justify-center gap-4">
              <div className="h-12 bg-gray-200 rounded w-32"></div>
              <div className="h-12 bg-gray-200 rounded w-40"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-background overflow-hidden">
      <div className="container pt-24 pb-12 text-center px-4 sm:px-6 lg:px-8">
        <Badge
          variant="outline"
          className="mb-4 py-1.5 px-4 text-sm bg-yellow-400/10 border-yellow-400/30 text-yellow-300"
        >
          {content.badge_text || 'UGC & Brand Deals'}
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-[length:400%_auto] animate-gradient">
            {content.title || 'Influencers & User Generated Content Creators'}
          </span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground mb-8">
          {content.subtitle || 'Put your brand where your audience is - hire influencers, creators, streamers, and podcasters. Access brand deals and sponsorships as a creator.'}
        </p>
        <div className="flex justify-center gap-4">
          <Link href={content.primary_button_link || "/hire-creators"}>
            <Button size="lg" className="bg-indigo-500 hover:bg-indigo-600">
              {content.primary_button_text || 'Hire Creators'}
            </Button>
          </Link>
          <Link href={content.secondary_button_link || "/become-a-creator"} passHref>
            <Button size="lg" variant="outline">
              {content.secondary_button_text || 'Become a Creator'}
            </Button>
          </Link>
        </div>
      </div>
      <div className="pb-16">
        <Swiper
          modules={[Autoplay, Pagination]}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          slidesPerView={1.5}
          spaceBetween={24}
          centeredSlides={true}
          pagination={{ clickable: true }}
          breakpoints={{
            640: {
              slidesPerView: 2.5,
            },
            1024: {
              slidesPerView: 4.5,
            },
            1280: {
                slidesPerView: 5.5,
            },
          }}
          className="!pb-12"
        >
          {(content.creators || [
            { name: 'Podcasters', image: '/49439.jpg', hint: 'man podcasting' },
            { name: 'YouTubers', image: '/26745.jpg', hint: 'man youtube content' },
            { name: 'UGC Creators', image: '/7918.jpg', hint: 'woman content creator' },
            { name: 'Streamers', image: '/12709.jpg', hint: 'woman streaming' },
            { name: 'Bloggers', image: '/2151914220.jpg', hint: 'woman blogging' },
            { name: 'Influencers', image: '/2149194126.jpg', hint: 'woman influencer' },
            { name: 'TikTok Creators', image: '/2149416508.jpg', hint: 'woman tiktok' },
            { name: 'Photographers', image: '/2151609206.jpg', hint: 'photographer taking picture' },
            { name: 'Musicians', image: '/2148847041.jpg', hint: 'musician playing guitar' },
          ]).map((creator: any) => (
            <SwiperSlide key={creator.name}>
              <div className="relative group rounded-xl overflow-hidden aspect-[4/5] md:aspect-[3/4]">
                <img
                  src={creator.image}
                  data-ai-hint={creator.hint}
                  alt={creator.name}
                  width={400}
                  height={500}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-white text-3xl font-bold">
                    {creator.name}
                  </h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

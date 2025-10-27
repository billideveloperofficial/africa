
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Clock, RefreshCw, PlayCircle, ChevronLeft, ChevronRight, Share2, Check } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';

// In a real app, you would fetch this data based on the handle
const creators = [
    {
      name: "Avery Greene",
      handle: "@averygreene",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
      aiHint: "woman portrait",
      followers: "1.2M",
      price: 38000,
      tags: ["Skincare", "Beauty", "Content Creation"],
      rating: 4.9,
      reviews: 124,
      gigTitle: "I Will Create An Engaging UGC Content That Will Drive Massive Sales For Your Brand.",
      description: "A high-quality, scroll-stopping UGC video designed to authentically showcase your product in a relatable, engaging, and conversion-focused way.",
      deliverables: [
        "One 15-30 second vertical UGC video (fully edited)",
        "Scriptwriting & concept creation",
        "Natural voiceover (if needed)",
        "On-brand visuals & storytelling",
        "Optimized for TikTok, Instagram Reels, or YouTube Shorts"
      ],
      gallery: [
        { src: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1887&auto=format&fit=crop", hint: "fashion man", type: "video" },
        { src: "https://images.unsplash.com/photo-1581338834647-b0fb40702de3?q=80&w=1887&auto=format&fit=crop", hint: "beauty product", type: "image" },
        { src: "https://images.unsplash.com/photo-1529941914920-554992b1548a?q=80&w=1887&auto=format&fit=crop", hint: "lifestyle flatlay", type: "image" },
        { src: "https://images.unsplash.com/photo-1512496015851-a90137ba0a43?q=80&w=1887&auto=format&fit=crop", hint: "skincare routine", type: "image" },
      ],
      about: {
        hello: "Hello Brand,",
        bio: "My name is Avery Greene and I am a UGC creator with a growing passion for Skincare, Beauty and Lifestyle. I am also committed to producing high-quality content that aligns with your brand's image and values. I am eager to collaborate with your brand to introduce your products to my community. My content focuses on Skincare, Lifestyle, beauty and I am committed to creating engaging and authentic posts that highlight the best features of your products.",
        socialHandle: "tiktok.com/@averygreene",
        socialLink: "https://tiktok.com/@averygreene",
        workLinks: [
            "https://vm.tiktok.com/ZMSW8G6NY/",
            "https://vm.tiktok.com/ZMSW8CAm8/",
            "https://vm.tiktok.com/ZMSW8CDhj/",
        ],
        closing: "Thank you for considering my proposal. I am looking forward to the possibility of working together and helping your brand reach new heights.",
        regards: "Best regards,",
        name: "Avery Greene"
      }
    },
    {
      name: "Leo Maxwell",
      handle: "@leomax",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
      aiHint: "man portrait",
      followers: "850K",
      price: 25000,
      tags: ["Tech", "Gaming"],
      rating: 5.0,
      reviews: 98,
      gigTitle: "I Will Create A Viral Tech Unboxing Video For Your Product.",
      description: "An expert unboxing video that provides in-depth analysis and engaging content for the latest gadgets and games, designed to go viral.",
      deliverables: [
        "One 60-90 second horizontal video (fully edited)",
        "In-depth feature breakdown",
        "Clear and engaging voiceover",
        "Optimized for YouTube",
        "Thumbnails included"
      ],
      gallery: [
        { src: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=2069&auto=format&fit=crop", hint: "tech gadget", type: "video" },
        { src: "https://images.unsplash.com/photo-1587831990711-23d7e9a606b8?q=80&w=1974&auto=format&fit=crop", hint: "gaming setup", type: "image" },
        { src: "https://images.unsplash.com/photo-1555774698-0b77e0abfe79?q=80&w=2070&auto=format&fit=crop", hint: "vr headset", type: "image" },
        { src: "https://images.unsplash.com/photo-1629429408209-1f912262dbd8?q=80&w=2070&auto=format&fit=crop", hint: "drone photography", type: "image" },
      ],
      about: {
        hello: "Hello Brand,",
        bio: "My name is Leo Maxwell and I am a UGC creator with a growing passion for Tech and Gaming. I am also committed to producing high-quality content that aligns with your brand's image and values. I am eager to collaborate with your brand to introduce your products to my community. My content focuses on Tech, Gaming and I am committed to creating engaging and authentic posts that highlight the best features of your products.",
        socialHandle: "tiktok.com/@leomax",
        socialLink: "https://tiktok.com/@leomax",
        workLinks: [
            "https://vm.tiktok.com/ZMSW8G6NY/",
            "https://vm.tiktok.com/ZMSW8CAm8/",
            "https://vm.tiktok.com/ZMSW8CDhj/",
        ],
        closing: "Thank you for considering my proposal. I am looking forward to the possibility of working together and helping your brand reach new heights.",
        regards: "Best regards,",
        name: "Leo Maxwell"
      }
    },
];

const findCreatorByHandle = (handle: string) => {
    return creators.find(c => c.handle === `@${handle}`);
}

export default async function CreatorProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const creator = findCreatorByHandle(handle);

  if (!creator) {
    return <div className="container py-12 text-center">Creator not found.</div>;
  }

  return (
    <div className="bg-background text-foreground">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                    <AvatarImage src={creator.avatar} alt={creator.name} />
                    <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-xl font-bold">{creator.name}</h2>
                    <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="h-5 w-5 fill-current" />
                        <Star className="h-5 w-5 fill-current" />
                        <Star className="h-5 w-5 fill-current" />
                        <Star className="h-5 w-5 fill-current" />
                        <Star className="h-5 w-5 fill-current" />
                        <span className="text-foreground ml-1 font-semibold">{creator.rating.toFixed(1)}</span>
                    </div>
                </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{creator.gigTitle}</h1>
            
            <div className="flex flex-wrap gap-2">
                {creator.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-sm border-primary text-primary">{tag}</Badge>
                ))}
            </div>

            <div className="relative">
                <Card className="overflow-hidden aspect-video">
                    <div className="relative w-full h-full">
                        <Image 
                            src={creator.gallery.find(item => item.type === 'video')?.src || creator.gallery[0].src}
                            alt="Creator's main content"
                            layout="fill"
                            objectFit="cover"
                            data-ai-hint={creator.gallery[0].hint}
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <PlayCircle className="h-20 w-20 text-white/70 hover:text-white transition-colors cursor-pointer"/>
                        </div>
                    </div>
                </Card>
                <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4">
                    <Button variant="secondary" size="icon" className="rounded-full bg-background/50 hover:bg-background/80 -ml-8">
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button variant="secondary" size="icon" className="rounded-full bg-background/50 hover:bg-background/80 -mr-8">
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                </div>
            </div>
            
            <div className="flex justify-between items-center">
                 <p className="text-muted-foreground">Applying Sheet mask for the first time...</p>
                 <Button variant="ghost"><Share2 className="mr-2"/> Share</Button>
            </div>

            <div className="space-y-4 pt-8 border-t">
              <h3 className="text-2xl font-bold">About</h3>
              <p className="text-muted-foreground">{creator.about.hello}</p>
              <p className="text-muted-foreground whitespace-pre-line">{creator.about.bio}</p>
              <p className="text-muted-foreground">I have linked my social media below.</p>
              <Link href={creator.about.socialLink} target="_blank" className="text-primary hover:underline">{creator.about.socialHandle}</Link>
              <p className="text-muted-foreground">And also links of beauty and skincare reviews I've done in the past.</p>
              <ul className="list-decimal list-inside space-y-2">
                {creator.about.workLinks.map((link, index) => (
                  <li key={index}><Link href={link} target="_blank" className="text-primary hover:underline">{link}</Link></li>
                ))}
              </ul>
              <p className="text-muted-foreground">{creator.about.closing}</p>
              <p className="text-muted-foreground">{creator.about.regards}</p>
              <p className="text-muted-foreground">{creator.about.name}</p>
            </div>

          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
                <Card className="bg-card">
                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-transparent p-2">
                            <TabsTrigger value="basic" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-md">Basic</TabsTrigger>
                            <TabsTrigger value="standard" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-md">Standard</TabsTrigger>
                            <TabsTrigger value="premium" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-md">Premium</TabsTrigger>
                        </TabsList>
                        <TabsContent value="basic" className="p-6 pt-4">
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-semibold">NGN</span>
                                <span className="text-2xl font-bold">₦{creator.price.toLocaleString()}</span>
                            </div>
                            <p className="text-muted-foreground text-sm mb-4">{creator.description}</p>
                            <div className="flex gap-4 text-sm mb-6">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4 text-muted-foreground"/>
                                    <span className="font-semibold">2 Days Delivery</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <RefreshCw className="h-4 w-4 text-muted-foreground"/>
                                    <span className="font-semibold">1 Revision</span>
                                </div>
                            </div>
                            
                            <h4 className="font-bold mb-3">Deliverables</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                {creator.deliverables.map((item, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-500" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button className="w-full mt-6 text-lg py-6">Hire</Button>
                            <p className="text-center text-xs text-muted-foreground mt-4">Powered by AvibeUGC.com</p>
                        </TabsContent>
                        {/* You can add TabsContent for standard and premium here */}
                         <TabsContent value="standard" className="p-6 pt-4">
                           <p className="text-muted-foreground text-center">Standard package details coming soon.</p>
                         </TabsContent>
                         <TabsContent value="premium" className="p-6 pt-4">
                            <p className="text-muted-foreground text-center">Premium package details coming soon.</p>
                         </TabsContent>
                    </Tabs>
                </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

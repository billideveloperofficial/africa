"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, DollarSign } from "lucide-react";
import Link from 'next/link';

type Creator = {
  name: string;
  handle: string;
  avatar: string;
  aiHint: string;
  followers: string;
  price: number;
  tags: string[];
  isAi?: boolean;
};

export function CreatorCard({ creator }: { creator: Creator }) {
  const profileUrl = creator.isAi ? '/checkout' : `/creator/${creator.handle.substring(1)}`;
  
  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300">
      <div className="relative aspect-[4/3]">
        <Avatar className="h-full w-full rounded-none">
          <AvatarImage
            src={creator.avatar}
            alt={creator.name}
            data-ai-hint={creator.aiHint}
            className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
          />
          <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      <CardContent className="p-4 relative">
        <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-12 w-12 border-2 border-background -mt-10">
                <AvatarImage src={creator.avatar} alt={creator.name} />
                <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <h3 className="font-bold text-lg">{creator.name}</h3>
                <p className="text-sm text-muted-foreground">{creator.handle}</p>
            </div>
        </div>
        
        <div className="flex justify-between text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>{creator.followers}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4" />
                <span>Starts at ${creator.price}</span>
            </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {creator.tags.map((tag) => (
            <Badge key={tag} variant={tag === 'AI Influencer' ? 'default' : 'secondary'} className="font-normal">
              {tag}
            </Badge>
          ))}
        </div>
        <Button asChild className="w-full">
            <Link href={profileUrl}>
                {creator.isAi ? 'Use AI Model' : 'View Profile'}
            </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

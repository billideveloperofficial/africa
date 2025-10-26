import { CreatorCard } from "@/components/creator-card";
import { FilterSidebar } from "@/components/filter-sidebar";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const creators = [
  {
    name: "Avery Greene",
    handle: "@averygreene",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
    aiHint: "woman portrait",
    followers: "1.2M",
    price: 250,
    tags: ["Fashion", "Beauty", "Lifestyle"],
  },
  {
    name: "Leo Maxwell",
    handle: "@leomax",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
    aiHint: "man portrait",
    followers: "850K",
    price: 180,
    tags: ["Tech", "Gaming"],
  },
  {
    name: "Zara Patel",
    handle: "@zarastyles",
    avatar:
      "https://images.unsplash.com/photo-1521146764736-56c929d59c83?q=80&w=1887&auto=format&fit=crop",
    aiHint: "woman fashion",
    followers: "980K",
    price: 200,
    tags: ["Fashion", "Travel", "Food"],
  },
  {
    name: "Caleb Kim",
    handle: "@calebcreates",
    avatar:
      "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=2070&auto=format&fit=crop",
    aiHint: "man photography",
    followers: "500K",
    price: 150,
    tags: ["Photography", "Art", "DIY"],
  },
  {
    name: "Isla Chen",
    handle: "@islaskitchen",
    avatar:
      "https://images.unsplash.com/photo-1496302662116-35cc4f36df92?q=80&w=2070&auto=format&fit=crop",
    aiHint: "woman cooking",
    followers: "2.5M",
    price: 450,
    tags: ["Food", "Health", "Wellness"],
  },
  {
    name: "Owen Hayes",
    handle: "@owenexplores",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop",
    aiHint: "man travel",
    followers: "720K",
    price: 190,
    tags: ["Travel", "Adventure", "Outdoors"],
  },
  {
    name: "Nora Evans",
    handle: "@nora.sings",
    avatar:
      "https://images.unsplash.com/photo-1589697130312-a43ddab1e4a6?q=80&w=1887&auto=format&fit=crop",
    aiHint: "woman singing",
    followers: "350K",
    price: 120,
    tags: ["Music", "Lifestyle"],
  },
  {
    name: "Liam Rivera",
    handle: "@liamfits",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887&auto=format&fit=crop",
    aiHint: "man fitness",
    followers: "1.8M",
    price: 350,
    tags: ["Fitness", "Health"],
  },
  {
    name: "Nova",
    handle: "@nova_ai",
    avatar:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=1932&auto=format&fit=crop",
    aiHint: "robot woman",
    followers: "5.1M",
    price: 1200,
    tags: ["AI", "Tech", "Futurism", "AI Influencer"],
    isAi: true,
  },
];

export default function HireCreatorsPage() {
  return (
    <div className="bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <FilterSidebar />
          </div>
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search creators by name, niche, etc."
                  className="pl-10 text-base"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {creators.map((creator) => (
                <CreatorCard key={creator.handle} creator={creator} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

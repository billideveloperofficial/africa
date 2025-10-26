
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Mic, Lightbulb, Video, ShieldCheck, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard", label: "Pitch Generator", icon: Mic },
  { href: "/dashboard/ai-assistant", label: "AI Assistant", icon: Lightbulb },
  { href: "/dashboard/content-checker", label: "Content Checker", icon: ShieldCheck },
  { href: "/dashboard/ai-video", label: "AI Video", icon: Video },
  { href: "/dashboard/product-shots", label: "Product Shots", icon: Camera },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              isActive && "bg-muted text-primary"
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

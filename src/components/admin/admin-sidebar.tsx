"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Briefcase, Settings, BarChart3, Shield, UserCheck, DollarSign, MessageSquare, FileText, TrendingUp, ChevronDown, UserPlus, CheckCircle, Star, Globe, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const navLinks = [
  { href: "/admin", label: "Overview", icon: Home },
  { href: "/admin#briefs", label: "Briefs", icon: Briefcase },
  { href: "/admin#analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin#payments", label: "Payments", icon: DollarSign },
  { href: "/admin#messages", label: "Messages", icon: MessageSquare },
  { href: "/admin#reports", label: "Reports", icon: FileText },
];

const userSubLinks = [
  { href: "/admin/users", label: "All Users", icon: Users },
  { href: "/admin/users/create", label: "Create User", icon: UserPlus },
  { href: "/admin/users/approve", label: "Approve Creators", icon: CheckCircle },
  { href: "/admin/users/featured", label: "Featured Creators", icon: Star },
];

const siteSettingsSubLinks = [
  { href: "/admin/frontend", label: "Basic Settings", icon: Globe },
  { href: "/admin/pages", label: "Manage Pages", icon: BookOpen },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [usersOpen, setUsersOpen] = useState(false);
  const [siteSettingsOpen, setSiteSettingsOpen] = useState(false);

  const isUsersActive = pathname.startsWith('/admin/users');
  const isSiteSettingsActive = pathname.startsWith('/admin/frontend') || pathname.startsWith('/admin/pages') || pathname.startsWith('/admin/settings');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Admin Panel
        </h2>
        <nav className="space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-accent text-accent-foreground"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}

          {/* Users Dropdown */}
          <Collapsible open={usersOpen} onOpenChange={setUsersOpen}>
            <CollapsibleTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground w-full text-left",
                  isUsersActive && "bg-accent text-accent-foreground"
                )}
              >
                <Users className="h-4 w-4" />
                Users
                <ChevronDown className={cn("h-4 w-4 ml-auto transition-transform", usersOpen && "rotate-180")} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pl-6">
              {userSubLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                      isActive && "bg-accent text-accent-foreground"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </CollapsibleContent>
          </Collapsible>

          {/* Site Settings Dropdown */}
          <Collapsible open={siteSettingsOpen} onOpenChange={setSiteSettingsOpen}>
            <CollapsibleTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground w-full text-left",
                  isSiteSettingsActive && "bg-accent text-accent-foreground"
                )}
              >
                <Settings className="h-4 w-4" />
                Site Settings
                <ChevronDown className={cn("h-4 w-4 ml-auto transition-transform", siteSettingsOpen && "rotate-180")} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pl-6">
              {siteSettingsSubLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                      isActive && "bg-accent text-accent-foreground"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </CollapsibleContent>
          </Collapsible>

          {/* Settings */}
          <Link
            href="/admin/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
              pathname === "/admin/settings" && "bg-accent text-accent-foreground"
            )}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>

        </nav>
      </div>

      <div className="px-3">
        <div className="rounded-lg bg-muted p-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Admin Access</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Full platform oversight and management capabilities.
          </p>
        </div>
      </div>
    </div>
  );
}

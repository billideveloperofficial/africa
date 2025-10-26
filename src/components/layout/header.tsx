"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { logOut } from "@/services/auth";
import { useRouter } from "next/navigation";

const defaultNavLinks = [
  { href: "/", label: "UGC & Brand Deals" },
  { href: "/communities", label: "Communities" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resources", label: "Resources" },
  { href: "/connect", label: "Connect" },
];

export function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [navLinks, setNavLinks] = useState(defaultNavLinks);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchNavLinks = async () => {
      try {
        const response = await fetch('/api/frontend?section=header');
        if (response.ok) {
          const data = await response.json();
          if (data.contents.header && data.contents.header.nav_links) {
            setNavLinks(data.contents.header.nav_links);
          }
        }
      } catch (error) {
        console.error('Error fetching header content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNavLinks();
  }, []);

  const handleLogout = async () => {
    await logOut();
    router.push('/');
  }

  const renderNavLinks = (isMobile = false) => {
    const commonLinks = navLinks.map((link: any) => (
        <Link
          key={link.label}
          href={link.href}
          onClick={() => isMobile && setMenuOpen(false)}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          {link.label}
        </Link>
      ));

    if (user) {
        commonLinks.push(
            <Link
                key="dashboard"
                href="/dashboard"
                onClick={() => isMobile && setMenuOpen(false)}
                className="text-muted-foreground transition-colors hover:text-foreground"
            >
                Dashboard
            </Link>
        );
        if ((user as any).role === 'ADMIN') {
            commonLinks.push(
                <Link
                    key="admin"
                    href="/admin"
                    onClick={() => isMobile && setMenuOpen(false)}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                >
                    Admin
                </Link>
            );
        }
    }
    return commonLinks;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {renderNavLinks()}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Button variant="ghost" onClick={handleLogout}>Log Out</Button>
          ) : (
            <>
              <Link href="/login" passHref>
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link href="/become-a-creator" passHref>
                <Button>Become a Creator</Button>
              </Link>
            </>
          )}
          <ModeToggle />
        </div>

        <div className="md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle className="sr-only">Menu</SheetTitle>
                    <SheetDescription className="sr-only">Main navigation menu</SheetDescription>
                </SheetHeader>
              <div className="p-4">
                <div className="flex justify-between items-center mb-8">
                  <Logo />
                  <ModeToggle />
                </div>
                <nav className="flex flex-col items-center gap-6 text-lg font-medium">
                    {renderNavLinks(true)}
                </nav>
                <div className="mt-8 flex flex-col gap-4">
                  {user ? (
                     <Button variant="ghost" className="w-full" onClick={() => { handleLogout(); setMenuOpen(false); }}>
                       Log Out
                     </Button>
                  ) : (
                    <>
                        <Link href="/login" className="w-full" passHref>
                            <Button variant="ghost" className="w-full" onClick={() => setMenuOpen(false)}>
                                Log In
                            </Button>
                        </Link>
                        <Link href="/become-a-creator" className="w-full" passHref>
                            <Button className="w-full" onClick={() => setMenuOpen(false)}>
                                Become a Creator
                            </Button>
                        </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

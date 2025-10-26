
"use client";

import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface SiteSettings {
  site_name: string;
  meta_title?: string;
  meta_description?: string;
  favicon_url?: string;
}

// This is a temporary fix for the metadata.
// In a real app, you'd want to handle this more dynamically.
// export const metadata: Metadata = {
//   title: "Avibe UGC - Influencers & User Generated Content Creators",
//   description:
//     "Put your brand where your audience is - hire influencers, creators, streamers, and podcasters. Access brand deals and sponsorships as a creator.",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  const isSignUpPage = false; // Simplified for now

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceCheckComplete, setMaintenanceCheckComplete] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data.settings);
          setIsMaintenanceMode(data.settings.maintenance_mode);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setMaintenanceCheckComplete(true);
      }
    };

    fetchSettings();
  }, []);

  // Handle maintenance mode redirect - only redirect if not already on maintenance page and check is complete
  useEffect(() => {
    if (maintenanceCheckComplete && isMaintenanceMode && !isAdminPage && settings && pathname !== '/maintenance') {
      // Check if user is admin by checking session
      const checkAdminStatus = async () => {
        try {
          const sessionResponse = await fetch('/api/auth/session');
          if (sessionResponse.ok) {
            const sessionData = await sessionResponse.json();
            if (!sessionData?.user || (sessionData.user as any)?.role !== 'ADMIN') {
              window.location.href = '/maintenance';
            }
          } else {
            window.location.href = '/maintenance';
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          window.location.href = '/maintenance';
        }
      };

      // Add a small delay to prevent rapid redirects
      const timeoutId = setTimeout(checkAdminStatus, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [maintenanceCheckComplete, isMaintenanceMode, isAdminPage, settings, pathname]);

  const title = settings?.meta_title || "Content Africa - Connect Brands with Creators";
  const description = settings?.meta_description || "AI-powered creator marketplace connecting brands with influencers. Discover, collaborate, and grow your creative career.";
  const favicon = settings?.favicon_url || "/favicon.ico";

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Content Africa" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <link rel="icon" href={favicon} />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-background text-foreground antialiased">
        <Providers>
          {maintenanceCheckComplete && !isSignUpPage && !isAdminPage && !isMaintenanceMode && <Header />}
          <main>{children}</main>
          {maintenanceCheckComplete && !isSignUpPage && !isAdminPage && !isMaintenanceMode && <Footer />}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

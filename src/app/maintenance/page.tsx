"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Clock, RefreshCw } from "lucide-react";

interface SiteSettings {
  maintenance_mode: boolean;
  site_name: string;
}

export default function MaintenancePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data.settings);

          // If maintenance mode is disabled, redirect to home
          if (!data.settings.maintenance_mode) {
            router.push('/');
            return;
          }

          // If user is admin, redirect to admin panel
          if (session?.user && (session.user as any)?.role === 'ADMIN') {
            router.push('/admin');
            return;
          }
        }
      } catch (error) {
        console.error('Error checking maintenance mode:', error);
      } finally {
        setLoading(false);
      }
    };

    // Only check if we haven't already determined the status
    if (status !== 'loading' && !settings) {
      checkMaintenanceMode();
    }
  }, [session, status, router, settings]);

  const handleRefresh = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  // If user is admin, they should be redirected, but show loading if still checking
  if (session?.user && (session.user as any)?.role === 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Redirecting to admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 p-4 bg-orange-500/20 rounded-full w-fit">
              <Settings className="h-12 w-12 text-orange-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              {settings?.site_name || 'Content Africa'} is Under Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-slate-300">
                <Clock className="h-5 w-5" />
                <span className="text-sm">Scheduled Maintenance</span>
              </div>

              <p className="text-slate-300 leading-relaxed">
                We're currently performing some important updates to improve your experience.
                The site will be back online shortly.
              </p>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h3 className="text-white font-semibold mb-2">What to expect:</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Enhanced performance</li>
                  <li>• New features and improvements</li>
                  <li>• Better user experience</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Check Status
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-slate-400">
                For urgent inquiries, please contact our support team.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
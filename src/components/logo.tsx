"use client";

import { useEffect, useState } from "react";

interface SiteSettings {
  site_name: string;
  logo_url?: string;
}

export function Logo() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data.settings);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const siteName = settings?.site_name || 'Content Africa';
  const logoUrl = settings?.logo_url;

  return (
    <a href="/" className="flex items-center gap-2" aria-label={`${siteName} Home`}>
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={`${siteName} Logo`}
          className="h-8 w-auto"
          onError={(e) => {
            console.error('Logo failed to load:', logoUrl);
            // Hide the broken image
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <div className="bg-primary text-primary-foreground p-2 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        </div>
      )}
      <span className="text-xl font-bold tracking-tight text-foreground">
        {siteName}
      </span>
    </a>
  );
}

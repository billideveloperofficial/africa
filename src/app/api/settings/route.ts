import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/settings - Get public site settings (no auth required)
export async function GET(request: NextRequest) {
  try {
    // Get the first (and only) settings record
    let settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      // Return default settings if none exist
      settings = {
        id: 'default',
        site_name: 'Content Africa',
        site_description: 'Connecting African content creators with global brands',
        favicon_url: '/favicon.ico',
        logo_url: '/logo.png',
        copyright: '© 2024 Content Africa. All rights reserved.',
        contact_email: 'hello@contentafrica.com',
        support_email: 'support@contentafrica.com',
        social_links: JSON.stringify({
          facebook: 'https://facebook.com/contentafrica',
          twitter: 'https://twitter.com/contentafrica',
          instagram: 'https://instagram.com/contentafrica',
          linkedin: 'https://linkedin.com/company/contentafrica'
        }),
        meta_title: 'Content Africa - Connecting Creators with Brands',
        meta_description: 'The premier platform connecting African content creators with global brands. Discover, collaborate, and grow your creative career.',
        google_analytics_id: 'GA_MEASUREMENT_ID',
        maintenance_mode: false,
        updated_at: new Date(),
        updated_by: null,
      };
    }

    // Parse JSON fields for frontend use
    const parsedSettings = {
      ...settings,
      social_links: settings.social_links || {},
    };

    return NextResponse.json({ settings: parsedSettings });
  } catch (error) {
    console.error('Error fetching public settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
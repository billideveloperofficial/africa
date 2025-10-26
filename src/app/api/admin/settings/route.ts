import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/admin/settings - Get site settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the first (and only) settings record, or create default if none exists
    let settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          site_name: 'Content Africa',
          copyright: '© 2024 Content Africa. All rights reserved.',
          contact_email: 'hello@contentafrica.com',
          support_email: 'support@contentafrica.com',
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    console.error('Error details:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/settings - Update site settings
export async function PUT(request: NextRequest) {
  try {
    console.log('PUT /api/admin/settings called');

    // Temporarily disable auth for debugging
    // const session = await getServerSession(authOptions);
    // if (!session || (session.user as any)?.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    console.log('Request body:', body);

    const {
      site_name,
      site_description,
      favicon_url,
      logo_url,
      copyright,
      contact_email,
      support_email,
      social_links,
      meta_title,
      meta_description,
      google_analytics_id,
      maintenance_mode,
    } = body;


    // Get existing settings or create new
    let settings = await prisma.siteSettings.findFirst();
    console.log('Existing settings:', settings);

    if (settings) {
      // Update existing
      console.log('Updating existing settings');
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          site_name: site_name || settings.site_name,
          site_description: site_description || settings.site_description,
          favicon_url: favicon_url || settings.favicon_url,
          logo_url: logo_url || settings.logo_url,
          copyright: copyright || settings.copyright,
          contact_email: contact_email || settings.contact_email,
          support_email: support_email || settings.support_email,
          social_links: social_links || settings.social_links,
          meta_title: meta_title || settings.meta_title,
          meta_description: meta_description || settings.meta_description,
          google_analytics_id: google_analytics_id || settings.google_analytics_id,
          maintenance_mode: maintenance_mode !== undefined ? maintenance_mode : settings.maintenance_mode,
          updated_at: new Date(),
        },
      });
    } else {
      // Create new
      console.log('Creating new settings');
      settings = await prisma.siteSettings.create({
        data: {
          site_name: site_name || 'Content Africa',
          site_description,
          favicon_url,
          logo_url,
          copyright: copyright || '© 2024 Content Africa. All rights reserved.',
          contact_email: contact_email || 'hello@contentafrica.com',
          support_email: support_email || 'support@contentafrica.com',
          social_links,
          meta_title,
          meta_description,
          google_analytics_id,
          maintenance_mode: maintenance_mode || false,
        },
      });
    }

    console.log('Settings saved successfully:', settings);
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    console.error('Error details:', error instanceof Error ? error.message : error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
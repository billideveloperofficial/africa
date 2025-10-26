import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pages = await prisma.page.findMany({
      orderBy: { updated_at: 'desc' },
    });

    return NextResponse.json({ pages });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { slug, title, content, meta_title, meta_description, featured_image, is_active } = body;

    if (!slug || !title || !content) {
      return NextResponse.json({ error: 'Slug, title, and content are required' }, { status: 400 });
    }

    // Check if slug already exists
    const existingPage = await prisma.page.findUnique({
      where: { slug },
    });

    if (existingPage) {
      return NextResponse.json({ error: 'Page with this slug already exists' }, { status: 400 });
    }

    const page = await prisma.page.create({
      data: {
        slug,
        title,
        content,
        meta_title,
        meta_description,
        featured_image,
        is_active: is_active ?? true,
        updated_by: (session.user as any)?.id,
      },
    });

    return NextResponse.json({ page }, { status: 201 });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contents = await prisma.frontendContent.findMany({
      where: { is_active: true },
      orderBy: [
        { section: 'asc' },
        { sort_order: 'asc' }
      ]
    });

    return NextResponse.json({ contents });
  } catch (error) {
    console.error('Error fetching frontend content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { section, key, content, sort_order = 0 } = body;

    if (!section || !key) {
      return NextResponse.json({ error: 'Section and key are required' }, { status: 400 });
    }

    const frontendContent = await prisma.frontendContent.upsert({
      where: {
        section_key: {
          section,
          key
        }
      },
      update: {
        content,
        sort_order,
        updated_at: new Date(),
        updated_by: session.user.id
      },
      create: {
        section,
        key,
        content,
        sort_order,
        updated_by: session.user.id
      }
    });

    return NextResponse.json({ content: frontendContent });
  } catch (error) {
    console.error('Error creating/updating frontend content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, section, key, content, is_active, sort_order } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const frontendContent = await prisma.frontendContent.update({
      where: { id },
      data: {
        section,
        key,
        content,
        is_active,
        sort_order,
        updated_at: new Date(),
        updated_by: session.user.id
      }
    });

    return NextResponse.json({ content: frontendContent });
  } catch (error) {
    console.error('Error updating frontend content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.frontendContent.update({
      where: { id },
      data: { is_active: false }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting frontend content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
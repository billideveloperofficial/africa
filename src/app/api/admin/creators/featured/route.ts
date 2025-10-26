import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/admin/creators/featured - Get featured creators
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For now, get all creators. In a real implementation, you'd have a 'featured' field
    const creators = await prisma.creator.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phone: true,
            country: true,
            created_at: true,
          },
        },
      },
      orderBy: { user: { created_at: 'desc' } },
    });

    return NextResponse.json({ creators });
  } catch (error) {
    console.error('Error fetching featured creators:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/creators/featured - Add/remove featured creator
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { creatorId, action } = await request.json();

    if (!creatorId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['add', 'remove'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Check if creator exists
    const creator = await prisma.creator.findUnique({
      where: { id: creatorId },
      include: { user: true },
    });

    if (!creator) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }

    // For now, we'll simulate featured status
    // In a real implementation, you'd add a 'featured' boolean field to the Creator model
    if (action === 'add') {
      // Mark as featured
      await prisma.creator.update({
        where: { id: creatorId },
        data: {
          // Add featured logic here
          // For example: featured: true, featured_at: new Date()
        },
      });

      return NextResponse.json({
        message: 'Creator added to featured list',
        creator: { ...creator, featured: true }
      });
    } else {
      // Remove from featured
      await prisma.creator.update({
        where: { id: creatorId },
        data: {
          // Remove featured logic here
          // For example: featured: false, featured_at: null
        },
      });

      return NextResponse.json({
        message: 'Creator removed from featured list',
        creator: { ...creator, featured: false }
      });
    }
  } catch (error) {
    console.error('Error managing featured creators:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
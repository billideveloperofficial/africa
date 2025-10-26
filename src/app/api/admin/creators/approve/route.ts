import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/admin/creators/approve - Get creators pending approval
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
    console.error('Error fetching creators for approval:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/creators/approve - Approve or reject creator
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { creatorId, action, reason } = await request.json();

    if (!creatorId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(action)) {
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

    // For now, we'll just update a field to mark approval status
    // In a real implementation, you might add an approval status field to the Creator model
    if (action === 'approve') {
      // Mark as approved - you could add an 'approved_at' timestamp or status field
      await prisma.creator.update({
        where: { id: creatorId },
        data: {
          // Add approval logic here
          // For example: approved_at: new Date()
        },
      });

      return NextResponse.json({
        message: 'Creator approved successfully',
        creator: { ...creator, approved: true }
      });
    } else {
      // For rejection, you might want to mark the creator as rejected
      // or send a notification email with the reason
      await prisma.creator.update({
        where: { id: creatorId },
        data: {
          // Add rejection logic here
          // For example: rejected_at: new Date(), rejection_reason: reason
        },
      });

      return NextResponse.json({
        message: 'Creator rejected',
        creator: { ...creator, rejected: true, rejection_reason: reason }
      });
    }
  } catch (error) {
    console.error('Error processing creator approval:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
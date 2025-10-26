import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    let whereClause: any = { is_active: true };

    if (section) {
      whereClause = { ...whereClause, section };
    }

    const contents = await prisma.frontendContent.findMany({
      where: whereClause,
      orderBy: [
        { section: 'asc' },
        { sort_order: 'asc' }
      ]
    });

    // Group by section for easier frontend consumption
    const groupedContents: Record<string, any> = {};
    contents.forEach(content => {
      if (!groupedContents[content.section]) {
        groupedContents[content.section] = {};
      }
      groupedContents[content.section][content.key] = content.content;
    });

    return NextResponse.json({ contents: groupedContents });
  } catch (error) {
    console.error('Error fetching frontend content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
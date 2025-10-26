import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const userRole = (session.user as any).role

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    const skip = (page - 1) * limit

    let where: any = {}

    if (userRole === 'BRAND') {
      // Brands can only see their own briefs
      where.brand_id = userId
    } else if (userRole === 'CREATOR') {
      // Creators can see briefs they have offers for
      const creator = await prisma.creator.findUnique({
        where: { user_id: userId },
        select: { id: true }
      })
      if (creator) {
        const offerBriefIds = await prisma.offer.findMany({
          where: { creator_id: creator.id },
          select: { brief_id: true }
        })
        where.id = { in: offerBriefIds.map(o => o.brief_id) }
      }
    } else if (userRole === 'ADMIN') {
      // Admins can see all briefs
    } else {
      return NextResponse.json({ error: 'Invalid user role' }, { status: 403 })
    }

    if (status) {
      where.status = status
    }

    const [briefs, total] = await Promise.all([
      prisma.brief.findMany({
        where,
        include: {
          brand: {
            include: {
              user: {
                select: { username: true, email: true }
              }
            }
          },
          offers: {
            include: {
              creator: {
                include: {
                  user: {
                    select: { username: true, email: true }
                  }
                }
              }
            }
          },
          campaigns: true
        },
        skip,
        take: limit,
        orderBy: { id: 'desc' }
      }),
      prisma.brief.count({ where })
    ])

    return NextResponse.json({
      briefs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching briefs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || (session.user as any).role !== 'BRAND') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const { title, description, budget, deliverables, deadline } = await request.json()

    // Get brand profile
    const brand = await prisma.brand.findUnique({
      where: { user_id: userId }
    })

    if (!brand) {
      return NextResponse.json({ error: 'Brand profile not found' }, { status: 404 })
    }

    // Create brief
    const brief = await prisma.brief.create({
      data: {
        brand_id: brand.id,
        title,
        description,
        budget: budget ? parseFloat(budget) : null,
        deliverables: Array.isArray(deliverables) ? deliverables : [],
        deadline: deadline ? new Date(deadline) : null,
        status: 'OPEN'
      },
      include: {
        brand: {
          include: {
            user: {
              select: { username: true, email: true }
            }
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Brief created successfully',
      brief
    })

  } catch (error) {
    console.error('Error creating brief:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
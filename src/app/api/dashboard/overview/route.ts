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

    const userId = session.user.id
    const userRole = session.user.role

    if (userRole === 'CREATOR') {
      // Get creator-specific metrics
      const creator = await prisma.creator.findUnique({
        where: { user_id: userId },
        include: {
          content: true,
          audience: true,
        }
      })

      if (!creator) {
        return NextResponse.json({ error: 'Creator profile not found' }, { status: 404 })
      }

      // Calculate metrics
      const totalFollowers = creator.metrics ? (creator.metrics as any).followers || 0 : 0
      const totalFollowing = creator.metrics ? (creator.metrics as any).following || 0 : 0
      const engagementRate = creator.content.length > 0
        ? creator.content.reduce((acc, post) => acc + (post.engagement_rate || 0), 0) / creator.content.length
        : 0

      const earnedMediaValue = creator.content.reduce((acc, post) =>
        acc + ((post.impressions || 0) * 0.005), 0) // Rough CPM calculation

      const avgInteractions = creator.content.length > 0
        ? creator.content.reduce((acc, post) => acc + (post.likes || 0) + (post.comments || 0), 0) / creator.content.length
        : 0

      const notableFollowers = creator.audience?.fake_follower_score
        ? Math.max(0, 100 - (creator.audience.fake_follower_score * 100))
        : 0

      return NextResponse.json({
        followers: totalFollowers,
        following: totalFollowing,
        engagementRate: Math.round(engagementRate * 100) / 100,
        earnedMediaValue: Math.round(earnedMediaValue),
        avgInteractions: Math.round(avgInteractions),
        notableFollowers: Math.round(notableFollowers),
        recentActivity: creator.content.slice(0, 5).map(post => ({
          date: post.date_collected,
          impressions: post.impressions,
          engagement: (post.likes || 0) + (post.comments || 0)
        }))
      })

    } else if (userRole === 'BRAND') {
      // Get brand-specific metrics
      const brand = await prisma.brand.findUnique({
        where: { user_id: userId },
        include: {
          briefs: {
            include: {
              offers: true,
              campaigns: true
            }
          }
        }
      })

      if (!brand) {
        return NextResponse.json({ error: 'Brand profile not found' }, { status: 404 })
      }

      // Calculate brand metrics
      const totalCampaigns = brand.briefs.length
      const activeCampaigns = brand.briefs.filter(b => b.status === 'OPEN').length
      const totalSpent = brand.briefs.reduce((acc, brief) =>
        acc + brief.offers.reduce((offerAcc, offer) => offerAcc + offer.amount, 0), 0
      )
      const totalImpressions = brand.briefs.reduce((acc, brief) =>
        acc + brief.campaigns.reduce((campAcc, camp) => campAcc + (camp.impressions || 0), 0), 0
      )

      return NextResponse.json({
        totalCampaigns,
        activeCampaigns,
        totalSpent,
        totalImpressions,
        avgCampaignROI: totalSpent > 0 ? Math.round((totalImpressions / totalSpent) * 100) / 100 : 0,
        recentActivity: brand.briefs.slice(0, 5).map(brief => ({
          title: brief.title,
          status: brief.status,
          offers: brief.offers.length,
          budget: brief.budget
        }))
      })

    } else if (userRole === 'ADMIN') {
      // Get admin metrics
      const totalUsers = await prisma.user.count()
      const totalCreators = await prisma.creator.count()
      const totalBrands = await prisma.brand.count()
      const totalTransactions = await prisma.transaction.count()
      const totalRevenue = await prisma.transaction.aggregate({
        _sum: { amount: true }
      })

      return NextResponse.json({
        totalUsers,
        totalCreators,
        totalBrands,
        totalTransactions,
        totalRevenue: totalRevenue._sum.amount || 0,
        platformFee: Math.round((totalRevenue._sum.amount || 0) * 0.04), // 4% platform fee
        recentActivity: [] // Could add recent admin actions
      })
    }

    return NextResponse.json({ error: 'Invalid user role' }, { status: 400 })

  } catch (error) {
    console.error('Error fetching dashboard overview:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
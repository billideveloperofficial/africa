import { NextRequest, NextResponse } from 'next/server';
import { prisma, testDatabaseConnection } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Test database connection first
    const isConnected = await testDatabaseConnection();
    if (!isConnected) {
      console.error('Database connection failed, returning dummy data');
      return NextResponse.json({
        contents: {
          hero: {
            badge_text: 'UGC & Brand Deals',
            title: 'Influencers & User Generated Content Creators',
            subtitle: 'Put your brand where your audience is - hire influencers, creators, streamers, and podcasters. Access brand deals and sponsorships as a creator.',
            primary_button_text: 'Hire Creators',
            primary_button_link: '/hire-creators',
            secondary_button_text: 'Become a Creator',
            secondary_button_link: '/become-a-creator',
            creators: [
              { name: 'Podcasters', image: '/49439.jpg', hint: 'man podcasting' },
              { name: 'YouTubers', image: '/26745.jpg', hint: 'man youtube content' },
              { name: 'UGC Creators', image: '/7918.jpg', hint: 'woman content creator' },
              { name: 'Streamers', image: '/12709.jpg', hint: 'woman streaming' },
              { name: 'Bloggers', image: '/2151914220.jpg', hint: 'woman blogging' },
              { name: 'Influencers', image: '/2149194126.jpg', hint: 'woman influencer' },
              { name: 'TikTok Creators', image: '/2149416508.jpg', hint: 'woman tiktok' },
              { name: 'Photographers', image: '/2151609206.jpg', hint: 'photographer taking picture' },
              { name: 'Musicians', image: '/2148847041.jpg', hint: 'musician playing guitar' },
            ]
          },
          features: {
            title: 'Everything you need to succeed',
            subtitle: 'Powerful AI tools and features designed specifically for UGC creators and brands.',
            features_list: [
              {
                icon: 'Sparkles',
                title: "AI Content Generator",
                description: "Generate engaging content ideas and scripts with our advanced AI technology.",
              },
              {
                icon: 'Target',
                title: "Brand Deal Matching",
                description: "Get matched with relevant brands and sponsorship opportunities.",
              },
              {
                icon: 'BarChart3',
                title: "Analytics Dashboard",
                description: "Track your performance and growth with detailed analytics.",
              },
              {
                icon: 'Users',
                title: "Creator Community",
                description: "Connect with other creators and share experiences.",
              },
              {
                icon: 'DollarSign',
                title: "Monetization Tools",
                description: "Multiple ways to monetize your content and creator skills.",
              },
              {
                icon: 'HeadphonesIcon',
                title: "Professional Support",
                description: "Get help from our team of experts whenever you need it.",
              }
            ]
          },
          how_it_works: {
            title: 'How it works',
            subtitle: 'Get started in just three simple steps',
            steps: [
              {
                step: "1",
                title: "Create Your Profile",
                description: "Set up your creator profile with your skills, portfolio, and audience insights."
              },
              {
                step: "2",
                title: "Get Matched",
                description: "Our AI matches you with relevant brands and sponsorship opportunities."
              },
              {
                step: "3",
                title: "Start Creating",
                description: "Begin creating content and earning from brand partnerships."
              }
            ]
          },
          social_proof: {
            title: 'Trusted by creators worldwide',
            testimonials: [
              {
                name: 'Sarah Johnson',
                role: 'Lifestyle Influencer',
                content: 'Content Africa helped me land my first brand deal. The platform is incredibly user-friendly and the AI tools are game-changing.',
                avatar: '/avatars/sarah.jpg'
              },
              {
                name: 'Mike Chen',
                role: 'Tech Reviewer',
                content: 'The analytics dashboard gives me insights I never had before. My engagement rates have increased by 40% since joining.',
                avatar: '/avatars/mike.jpg'
              },
              {
                name: 'Emma Davis',
                role: 'Food Blogger',
                content: 'Finally, a platform that understands creators! The brand matching is spot-on and the community is amazing.',
                avatar: '/avatars/emma.jpg'
              }
            ],
            stats: [
              { number: '10,000+', label: 'Active Creators' },
              { number: '500+', label: 'Partner Brands' },
              { number: '$2M+', label: 'Creator Earnings' },
              { number: '95%', label: 'Satisfaction Rate' }
            ]
          },
          cta: {
            title: 'Ready to take your creator career to the next level?',
            subtitle: 'Join thousands of creators who are already earning more with Content Africa.',
            primary_button_text: 'Get Started Today',
            primary_button_link: '/become-a-creator',
            secondary_button_text: 'Learn More',
            secondary_button_link: '/pricing'
          }
        }
      });
    }

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
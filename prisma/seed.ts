import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@contentafrica.com' },
    update: {},
    create: {
      email: 'admin@contentafrica.com',
      username: 'admin',
      password_hash: adminPassword,
      role: 'ADMIN',
      phone: '+1234567890',
      country: 'United States',
    },
  })

  // Create demo brand user
  const brandPassword = await bcrypt.hash('brand123', 12)
  const brandUser = await prisma.user.upsert({
    where: { email: 'brand@contentafrica.com' },
    update: {},
    create: {
      email: 'brand@contentafrica.com',
      username: 'brand_demo',
      password_hash: brandPassword,
      role: 'BRAND',
      phone: '+1987654321',
      country: 'United Kingdom',
    },
  })

  // Create brand profile
  const brand = await prisma.brand.upsert({
    where: { user_id: brandUser.id },
    update: {},
    create: {
      user_id: brandUser.id,
      company_name: 'TechCorp Solutions',
      company_website: 'https://techcorp.com',
      billing_info: JSON.stringify({
        address: '123 Business St, London, UK',
        taxId: 'GB123456789'
      }),
    },
  })

  // Create demo creator user
  const creatorPassword = await bcrypt.hash('creator123', 12)
  const creatorUser = await prisma.user.upsert({
    where: { email: 'creator@contentafrica.com' },
    update: {},
    create: {
      email: 'creator@contentafrica.com',
      username: 'creator_demo',
      password_hash: creatorPassword,
      role: 'CREATOR',
      phone: '+1555123456',
      country: 'Canada',
    },
  })

  // Create creator profile
  const creator = await prisma.creator.upsert({
    where: { user_id: creatorUser.id },
    update: {},
    create: {
      user_id: creatorUser.id,
      display_name: 'Sarah Johnson',
      bio: 'Lifestyle and fashion content creator with 500K+ followers across Instagram and TikTok. Specializing in authentic storytelling and brand partnerships.',
      skills: JSON.stringify(['Lifestyle', 'Fashion', 'Beauty', 'Travel', 'Food']),
      social_links: JSON.stringify({
        instagram: 'https://instagram.com/sarahjohnson',
        tiktok: 'https://tiktok.com/@sarahjohnson',
        youtube: 'https://youtube.com/sarahjohnson'
      }),
      portfolio_urls: JSON.stringify([
        'https://instagram.com/sarahjohnson',
        'https://tiktok.com/@sarahjohnson'
      ]),
      sample_media: JSON.stringify([
        { url: 'https://example.com/image1.jpg', type: 'image' },
        { url: 'https://example.com/video1.mp4', type: 'video' }
      ]),
      rates: JSON.stringify({
        instagram_post: 1500,
        instagram_story: 800,
        tiktok_video: 2000,
        youtube_video: 5000
      }),
      metrics: JSON.stringify({
        instagram_followers: 250000,
        tiktok_followers: 180000,
        youtube_subscribers: 75000,
        engagement_rate: 4.2
      }),
    },
  })

  // Create audience profile for creator
  await prisma.audienceProfile.upsert({
    where: { creator_id: creator.id },
    update: {},
    create: {
      creator_id: creator.id,
      country_breakdown: JSON.stringify({
        'United States': 35,
        'Canada': 25,
        'United Kingdom': 20,
        'Australia': 10,
        'Other': 10
      }),
      age_breakdown: JSON.stringify({
        '18-24': 40,
        '25-34': 35,
        '35-44': 20,
        '45+': 5
      }),
      gender_breakdown: JSON.stringify({
        'Female': 75,
        'Male': 20,
        'Other': 5
      }),
      languages: JSON.stringify({
        'English': 85,
        'French': 10,
        'Spanish': 5
      }),
      fake_follower_score: 0.05, // 5% fake followers
    },
  })

  // Create sample content metrics
  await prisma.contentMetrics.createMany({
    data: [
      {
        creator_id: creator.id,
        post_id: 'instagram_post_1',
        impressions: 45000,
        views: 45000,
        likes: 3200,
        comments: 180,
        engagement_rate: 7.5,
        date_collected: new Date('2024-01-15'),
      },
      {
        creator_id: creator.id,
        post_id: 'instagram_post_2',
        impressions: 52000,
        views: 52000,
        likes: 4100,
        comments: 220,
        engagement_rate: 8.2,
        date_collected: new Date('2024-01-20'),
      },
      {
        creator_id: creator.id,
        post_id: 'tiktok_video_1',
        impressions: 125000,
        views: 125000,
        likes: 15800,
        comments: 890,
        engagement_rate: 13.2,
        date_collected: new Date('2024-01-25'),
      },
    ],
  })

  // Create sample brief
  const brief = await prisma.brief.create({
    data: {
      brand_id: brand.id,
      title: 'Winter Fashion Collection Launch',
      description: 'We need authentic content creators to showcase our new winter fashion collection. Looking for lifestyle and fashion influencers who can create engaging content that resonates with our target audience of young professionals aged 25-35.',
      budget: 5000,
      deliverables: JSON.stringify([
        '3 Instagram posts',
        '2 Instagram Stories',
        '1 TikTok video',
        'Usage rights for 6 months'
      ]),
      deadline: new Date('2024-02-15'),
      status: 'OPEN',
    },
  })

  // Create sample offer
  await prisma.offer.create({
    data: {
      brief_id: brief.id,
      creator_id: creator.id,
      brand_id: brand.id,
      amount: 3500,
      platform_fee: 140, // 4% of 3500
      status: 'PENDING',
    },
  })

  // Create sample transaction
  await prisma.transaction.create({
    data: {
      offer_id: (await prisma.offer.findFirst({ where: { brief_id: brief.id } }))!.id,
      stripe_payment_id: 'demo_payment_123',
      amount: 3500,
      platform_fee: 140,
      payout_status: 'PENDING',
    },
  })

  // Create sample community
  const community = await prisma.community.upsert({
    where: { slug: 'content-creator-hub' },
    update: {},
    create: {
      title: 'Content Creator Hub',
      slug: 'content-creator-hub',
      content: 'A community for content creators to share tips, collaborate on projects, and network with brands.',
      author_id: admin.id,
    },
  })

  // Add community member
  await prisma.communityMember.upsert({
    where: {
      user_id_community_id: {
        user_id: creatorUser.id,
        community_id: community.id,
      },
    },
    update: {},
    create: {
      user_id: creatorUser.id,
      community_id: community.id,
    },
  })

  // Create sample post in community
  await prisma.post.create({
    data: {
      community_id: community.id,
      title: 'Tips for Growing Your Instagram Following',
      content: 'Here are some proven strategies for growing your Instagram following organically...',
      author_id: creatorUser.id,
    },
  })

  // Create site settings
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      site_name: 'Content Africa',
      site_description: 'Connecting African content creators with global brands',
      favicon_url: '/favicon.ico',
      logo_url: '/logo.png',
      copyright: '© 2024 Content Africa. All rights reserved.',
      contact_email: 'hello@contentafrica.com',
      phone: '+1 (555) 123-4567',
      address: '123 Content Street\nCreative District\nNew York, NY 10001\nUnited States',
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
      footer_description: 'AI-powered tools for UGC creators to land more brand deals.',
      updated_by: admin.id,
    },
  })

  // Seed footer data
  const footer = await prisma.footer.upsert({
    where: { id: 'main-footer' },
    update: {},
    create: {
      id: 'main-footer',
      title: 'Main Footer',
      description: 'AI-powered tools for UGC creators to land more brand deals.',
      sort_order: 0,
      is_active: true,
    },
  });

  // Seed footer links based on frontend content
  const footerLinks = [
    // Product Links
    {
      footer_id: footer.id,
      label: 'Hire Creators',
      href: '/hire-creators',
      type: 'PAGE' as const,
      sort_order: 0,
    },
    {
      footer_id: footer.id,
      label: 'Pricing',
      href: '/pricing',
      type: 'PAGE' as const,
      sort_order: 1,
    },
    {
      footer_id: footer.id,
      label: 'Features',
      href: '/#features',
      type: 'URL' as const,
      sort_order: 2,
    },

    // Company Links
    {
      footer_id: footer.id,
      label: 'About',
      href: '/about-us',
      type: 'PAGE' as const,
      sort_order: 3,
    },
    {
      footer_id: footer.id,
      label: 'Careers',
      href: '/careers',
      type: 'PAGE' as const,
      sort_order: 4,
    },
    {
      footer_id: footer.id,
      label: 'Contact',
      href: '/contact',
      type: 'PAGE' as const,
      sort_order: 5,
    },

    // Legal Links
    {
      footer_id: footer.id,
      label: 'Privacy Policy',
      href: '/privacy-policy',
      type: 'PAGE' as const,
      sort_order: 6,
    },
    {
      footer_id: footer.id,
      label: 'Terms of Service',
      href: '/terms-of-service',
      type: 'PAGE' as const,
      sort_order: 7,
    },
  ];

  for (const link of footerLinks) {
    await prisma.footerLink.upsert({
      where: {
        id: `${link.footer_id}-${link.label.replace(/\s+/g, '-').toLowerCase()}`,
      },
      update: {
        href: link.href,
        type: link.type,
        sort_order: link.sort_order,
        is_active: true,
      },
      create: {
        id: `${link.footer_id}-${link.label.replace(/\s+/g, '-').toLowerCase()}`,
        ...link,
        is_active: true,
      },
    });
  }

  // Seed frontend content
  const frontendContent = [
    // Hero Section
    {
      section: 'hero',
      key: 'badge_text',
      content: 'UGC & Brand Deals',
      sort_order: 1
    },
    {
      section: 'hero',
      key: 'title',
      content: 'Influencers & User Generated Content Creators',
      sort_order: 2
    },
    {
      section: 'hero',
      key: 'subtitle',
      content: 'Put your brand where your audience is - hire influencers, creators, streamers, and podcasters. Access brand deals and sponsorships as a creator.',
      sort_order: 3
    },
    {
      section: 'hero',
      key: 'primary_button_text',
      content: 'Hire Creators',
      sort_order: 4
    },
    {
      section: 'hero',
      key: 'primary_button_link',
      content: '/hire-creators',
      sort_order: 5
    },
    {
      section: 'hero',
      key: 'secondary_button_text',
      content: 'Become a Creator',
      sort_order: 6
    },
    {
      section: 'hero',
      key: 'secondary_button_link',
      content: '/become-a-creator',
      sort_order: 7
    },
    {
      section: 'hero',
      key: 'creators',
      content: [
        { name: 'Podcasters', image: '/49439.jpg', hint: 'man podcasting' },
        { name: 'YouTubers', image: '/26745.jpg', hint: 'man youtube content' },
        { name: 'UGC Creators', image: '/7918.jpg', hint: 'woman content creator' },
        { name: 'Streamers', image: '/12709.jpg', hint: 'woman streaming' },
        { name: 'Bloggers', image: '/2151914220.jpg', hint: 'woman blogging' },
        { name: 'Influencers', image: '/2149194126.jpg', hint: 'woman influencer' },
        { name: 'TikTok Creators', image: '/2149416508.jpg', hint: 'woman tiktok' },
        { name: 'Photographers', image: '/2151609206.jpg', hint: 'photographer taking picture' },
        { name: 'Musicians', image: '/2148847041.jpg', hint: 'musician playing guitar' },
      ],
      sort_order: 8
    },

    // Features Section
    {
      section: 'features',
      key: 'title',
      content: 'Everything you need to succeed',
      sort_order: 1
    },
    {
      section: 'features',
      key: 'subtitle',
      content: 'Powerful AI tools and features designed specifically for UGC creators and brands.',
      sort_order: 2
    },
    {
      section: 'features',
      key: 'features_list',
      content: [
        {
          title: 'AI Content Generator',
          description: 'Generate engaging content ideas and scripts with our advanced AI technology.',
          icon: 'Sparkles'
        },
        {
          title: 'Brand Deal Matching',
          description: 'Get matched with relevant brands and sponsorship opportunities.',
          icon: 'Target'
        },
        {
          title: 'Analytics Dashboard',
          description: 'Track your performance and growth with detailed analytics.',
          icon: 'BarChart3'
        },
        {
          title: 'Creator Community',
          description: 'Connect with other creators and share experiences.',
          icon: 'Users'
        },
        {
          title: 'Monetization Tools',
          description: 'Multiple ways to monetize your content and creator skills.',
          icon: 'DollarSign'
        },
        {
          title: 'Professional Support',
          description: 'Get help from our team of experts whenever you need it.',
          icon: 'HeadphonesIcon'
        }
      ],
      sort_order: 3
    },

    // How It Works Section
    {
      section: 'how_it_works',
      key: 'title',
      content: 'How it works',
      sort_order: 1
    },
    {
      section: 'how_it_works',
      key: 'subtitle',
      content: 'Get started in just three simple steps',
      sort_order: 2
    },
    {
      section: 'how_it_works',
      key: 'steps',
      content: [
        {
          step: '1',
          title: 'Create Your Profile',
          description: 'Set up your creator profile with your skills, portfolio, and audience insights.'
        },
        {
          step: '2',
          title: 'Get Matched',
          description: 'Our AI matches you with relevant brands and sponsorship opportunities.'
        },
        {
          step: '3',
          title: 'Start Creating',
          description: 'Begin creating content and earning from brand partnerships.'
        }
      ],
      sort_order: 3
    },

    // Social Proof Section
    {
      section: 'social_proof',
      key: 'title',
      content: 'Trusted by creators worldwide',
      sort_order: 1
    },
    {
      section: 'social_proof',
      key: 'testimonials',
      content: [
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
      sort_order: 2
    },
    {
      section: 'social_proof',
      key: 'stats',
      content: [
        { number: '10,000+', label: 'Active Creators' },
        { number: '500+', label: 'Partner Brands' },
        { number: '$2M+', label: 'Creator Earnings' },
        { number: '95%', label: 'Satisfaction Rate' }
      ],
      sort_order: 3
    },

    // CTA Section
    {
      section: 'cta',
      key: 'title',
      content: 'Ready to take your creator career to the next level?',
      sort_order: 1
    },
    {
      section: 'cta',
      key: 'subtitle',
      content: 'Join thousands of creators who are already earning more with Content Africa.',
      sort_order: 2
    },
    {
      section: 'cta',
      key: 'primary_button_text',
      content: 'Get Started Today',
      sort_order: 3
    },
    {
      section: 'cta',
      key: 'primary_button_link',
      content: '/become-a-creator',
      sort_order: 4
    },
    {
      section: 'cta',
      key: 'secondary_button_text',
      content: 'Learn More',
      sort_order: 5
    },
    {
      section: 'cta',
      key: 'secondary_button_link',
      content: '/pricing',
      sort_order: 6
    },

    // Footer
    {
      section: 'footer',
      key: 'description',
      content: 'AI-powered tools for UGC creators to land more brand deals.',
      sort_order: 1
    },
    {
      section: 'footer',
      key: 'product_links',
      content: [
        { label: 'Hire Creators', href: '/hire-creators' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Features', href: '/#features' }
      ],
      sort_order: 2
    },
    {
      section: 'footer',
      key: 'company_links',
      content: [
        { label: 'About', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Contact', href: '#' }
      ],
      sort_order: 3
    },
    {
      section: 'footer',
      key: 'legal_links',
      content: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' }
      ],
      sort_order: 4
    },

    // Header/Navigation
    {
      section: 'header',
      key: 'nav_links',
      content: [
        { href: '/', label: 'UGC & Brand Deals' },
        { href: '/communities', label: 'Communities' },
        { href: '/pricing', label: 'Pricing' },
        { href: '/resources', label: 'Resources' },
        { href: '/connect', label: 'Connect' }
      ],
      sort_order: 1
    }
  ];

  for (const content of frontendContent) {
    await prisma.frontendContent.upsert({
      where: {
        section_key: {
          section: content.section,
          key: content.key
        }
      },
      update: {
        content: content.content,
        sort_order: content.sort_order,
        is_active: true
      },
      create: {
        section: content.section,
        key: content.key,
        content: content.content,
        sort_order: content.sort_order,
        is_active: true
      }
    });
  }

  // Seed sample pages
  const samplePages = [
    {
      slug: 'about-us',
      title: 'About Us',
      content: `# About Content Africa

Welcome to Content Africa, the premier platform connecting talented content creators with forward-thinking brands across Africa and beyond.

## Our Mission

We believe in the power of authentic storytelling and genuine connections between creators and brands. Our mission is to democratize access to brand partnerships, making it easier for creators to monetize their skills while helping brands reach their target audiences through authentic voices.

## What We Do

- **Creator Discovery**: We help brands find the perfect creators for their campaigns
- **Brand Partnerships**: We facilitate meaningful collaborations between creators and brands
- **Community Building**: We foster a supportive community of content creators
- **Education & Growth**: We provide resources and tools to help creators succeed

## Our Story

Founded in 2024, Content Africa was born from the recognition that Africa's creative talent was underrepresented in global brand partnerships. We saw an opportunity to bridge this gap and create a platform that serves both creators and brands equally.

## Join Our Community

Whether you're a content creator looking to monetize your skills or a brand seeking authentic partnerships, Content Africa is your gateway to success in the creator economy.`,
      meta_title: 'About Us - Content Africa',
      meta_description: 'Learn about Content Africa\'s mission to connect African content creators with global brands. Discover our story and join our growing community.',
      is_active: true,
    },
    {
      slug: 'contact',
      title: 'Contact Us',
      content: `# Get In Touch

We're here to help! Whether you have questions about our platform, need support, or want to explore partnership opportunities, our team is ready to assist you.

## Contact Information

**Email:** hello@contentafrica.com
**Support:** support@contentafrica.com
**Phone:** +1 (555) 123-4567

## Office Hours

- Monday - Friday: 9:00 AM - 6:00 PM GMT
- Saturday: 10:00 AM - 4:00 PM GMT
- Sunday: Closed

## Connect With Us

Follow us on social media for the latest updates, creator spotlights, and platform news:

- **Twitter:** [@ContentAfrica](https://twitter.com/contentafrica)
- **Instagram:** [@ContentAfrica](https://instagram.com/contentafrica)
- **LinkedIn:** [Content Africa](https://linkedin.com/company/contentafrica)

## Partnership Inquiries

For brand partnerships, sponsorship opportunities, or creator collaborations, please email our partnerships team at partnerships@contentafrica.com.

## Technical Support

If you're experiencing technical issues or need help with your account, our support team is available 24/7 through our help center or by emailing support@contentafrica.com.

We typically respond to all inquiries within 24 hours during business days.`,
      meta_title: 'Contact Us - Content Africa',
      meta_description: 'Get in touch with the Content Africa team. Find our contact information, office hours, and ways to connect with us.',
      is_active: true,
    },
    {
      slug: 'privacy-policy',
      title: 'Privacy Policy',
      content: `# Privacy Policy

**Last Updated:** October 20, 2024

## Introduction

At Content Africa, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.

## Information We Collect

### Personal Information
- Name, email address, and contact details
- Profile information and social media handles
- Payment and billing information
- Content and media you upload

### Usage Information
- How you interact with our platform
- Device and browser information
- IP address and location data
- Cookies and tracking technologies

## How We Use Your Information

We use the information we collect to:
- Provide and maintain our services
- Process payments and transactions
- Communicate with you about our services
- Improve our platform and develop new features
- Ensure platform security and prevent fraud
- Comply with legal obligations

## Information Sharing

We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy:

- **Service Providers:** We may share information with trusted third-party service providers who assist us in operating our platform
- **Legal Requirements:** We may disclose information if required by law or to protect our rights
- **Business Transfers:** In the event of a merger or acquisition, your information may be transferred

## Data Security

We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

## Your Rights

You have the right to:
- Access the personal information we hold about you
- Correct inaccurate or incomplete information
- Request deletion of your personal information
- Object to or restrict certain processing of your information
- Data portability

## Cookies

We use cookies and similar technologies to enhance your experience on our platform. You can control cookie settings through your browser preferences.

## Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.

## Contact Us

If you have any questions about this Privacy Policy, please contact us at privacy@contentafrica.com.`,
      meta_title: 'Privacy Policy - Content Africa',
      meta_description: 'Read our privacy policy to understand how Content Africa collects, uses, and protects your personal information.',
      is_active: true,
    },
    {
      slug: 'terms-of-service',
      title: 'Terms of Service',
      content: `# Terms of Service

**Last Updated:** October 20, 2024

## Agreement to Terms

By accessing and using Content Africa, you accept and agree to be bound by the terms and provision of this agreement.

## Use License

Permission is granted to temporarily access the materials (information or software) on Content Africa's platform for personal, non-commercial transitory viewing only.

## User Responsibilities

As a user of our platform, you agree to:
- Provide accurate and complete information
- Maintain the security of your account
- Respect other users and their content
- Comply with all applicable laws and regulations
- Not engage in fraudulent or harmful activities

## Creator Terms

### Content Ownership
- You retain ownership of the content you create
- You grant us a license to display and distribute your content on our platform
- You are responsible for ensuring you have rights to use any third-party content

### Brand Partnerships
- All brand deals and sponsorships are agreements between creators and brands
- Content Africa facilitates connections but is not a party to these agreements
- Creators are responsible for fulfilling their contractual obligations

## Brand Terms

### Creator Discovery
- Brands can search and connect with creators through our platform
- All communications and agreements are between brands and creators
- Content Africa provides tools but does not guarantee specific outcomes

### Payment Terms
- Brands are responsible for payments to creators as agreed
- Content Africa may charge platform fees for successful partnerships
- Payment disputes should be resolved directly between parties

## Platform Fees

Content Africa charges fees for certain services:
- Platform fee of 4% on successful brand deals
- Premium features and tools may have additional costs
- Fees are clearly disclosed before any transactions

## Prohibited Activities

You may not:
- Violate any applicable laws or regulations
- Infringe on intellectual property rights
- Engage in fraudulent or deceptive practices
- Harass or harm other users
- Attempt to gain unauthorized access to our systems

## Termination

We reserve the right to terminate or suspend your account at our discretion, with or without cause, and with or without notice.

## Disclaimer

The information on this platform is provided on an 'as is' basis. Content Africa makes no warranties, expressed or implied, and hereby disclaims all warranties.

## Limitation of Liability

In no event shall Content Africa be liable for any damages arising out of the use or inability to use our platform.

## Governing Law

These terms shall be interpreted and governed by the laws of applicable jurisdiction.

## Changes to Terms

We reserve the right to modify these terms at any time. Continued use of our platform constitutes acceptance of the modified terms.

## Contact Information

For questions about these Terms of Service, please contact us at legal@contentafrica.com.`,
      meta_title: 'Terms of Service - Content Africa',
      meta_description: 'Read our terms of service to understand the rules and guidelines for using the Content Africa platform.',
      is_active: true,
    },
    {
      slug: 'careers',
      title: 'Careers',
      content: `# Join Our Team

## Why Content Africa?

We're building the future of creator-brand relationships in Africa and beyond. If you're passionate about technology, creativity, and entrepreneurship, we want you on our team.

## Current Openings

### Senior Full-Stack Developer
**Location:** Remote / Nairobi, Kenya

**About the Role:**
We're looking for a senior developer to help build and scale our platform. You'll work on both frontend and backend systems, collaborating closely with our product and design teams.

**Requirements:**
- 5+ years of experience with React/Next.js and Node.js
- Experience with TypeScript and modern web technologies
- Familiarity with cloud platforms (AWS/GCP)
- Strong problem-solving skills and attention to detail

**What We Offer:**
- Competitive salary and equity package
- Flexible remote work arrangements
- Professional development opportunities
- Opportunity to shape the future of creator economy in Africa

### Community Manager
**Location:** Remote / Lagos, Nigeria

**About the Role:**
Help build and nurture our creator community. You'll engage with creators, organize events, and ensure our platform serves the needs of our users.

**Requirements:**
- Experience in community management or creator relations
- Strong communication and interpersonal skills
- Knowledge of social media and content creation
- Passion for the creator economy

### Growth Marketing Manager
**Location:** Remote / Cape Town, South Africa

**About the Role:**
Drive user acquisition and engagement for both creators and brands. You'll develop and execute marketing strategies to grow our platform.

**Requirements:**
- 3+ years of experience in growth marketing
- Experience with SaaS or marketplace products
- Strong analytical skills and data-driven mindset
- Experience with various marketing channels

## Our Culture

- **Innovation:** We encourage creative problem-solving and new ideas
- **Collaboration:** We believe in the power of teamwork and diverse perspectives
- **Impact:** We're building something meaningful that will change lives
- **Growth:** We invest in our team's professional development

## How to Apply

Ready to join us? Send your resume and a cover letter to careers@contentafrica.com. Include "Position Name" in the subject line.

We look forward to hearing from you!`,
      meta_title: 'Careers - Content Africa',
      meta_description: 'Join the Content Africa team and help build the future of creator-brand relationships. Explore current job openings and career opportunities.',
      is_active: true,
    }
  ];

  for (const pageData of samplePages) {
    await prisma.page.upsert({
      where: { slug: pageData.slug },
      update: pageData,
      create: pageData,
    });
  }

  console.log('✅ Database seeded successfully!')
  console.log('\n📋 Demo Login Credentials:')
  console.log('Admin: admin@contentafrica.com / admin123')
  console.log('Brand: brand@contentafrica.com / brand123')
  console.log('Creator: creator@contentafrica.com / creator123')
  console.log('\n📄 Sample Pages Created:')
  console.log('- About Us: /about-us')
  console.log('- Contact: /contact')
  console.log('- Privacy Policy: /privacy-policy')
  console.log('- Terms of Service: /terms-of-service')
  console.log('- Careers: /careers')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
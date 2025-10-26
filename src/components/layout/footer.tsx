"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Instagram, Linkedin, Twitter, Facebook } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterContent {
  description?: string;
  sections?: FooterSection[];
  socialLinks?: SocialLinks;
}

export function Footer() {
  const [content, setContent] = useState<FooterContent>({});
  const [loading, setLoading] = useState(true);
  const [copyright, setCopyright] = useState('© 2024 Content Africa. All rights reserved.');

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        // Fetch footer content from frontend API
        const footerResponse = await fetch('/api/frontend?section=footer');
        let footerContent = null;
        if (footerResponse.ok) {
          const footerData = await footerResponse.json();
          footerContent = footerData.contents.footer;
        }

        // Fetch site settings for copyright
        const settingsResponse = await fetch('/api/settings');
        let settings = null;
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          settings = settingsData.settings;
        }

        // Transform footer content into sections format
        let sections = defaultSections;
        let description = 'AI-powered tools for UGC creators to land more brand deals.';
        if (footerContent && typeof footerContent === 'object') {
          description = footerContent.description || description;
          sections = Object.keys(footerContent).filter(key => key !== 'description').map(key => {
            let title = key.replace('_links', '').replace(/_/g, ' ');
            title = title.charAt(0).toUpperCase() + title.slice(1); // Capitalize first letter
            return {
              title,
              links: footerContent[key] || []
            };
          });
        }

        setContent({
          sections,
          description,
          socialLinks: settings?.social_links || {}
        });

        if (settings && settings.copyright) {
          setCopyright(settings.copyright);
        }
      } catch (error) {
        console.error('Error fetching footer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  const defaultSections: FooterSection[] = [
    {
      title: 'Product',
      links: [
        { label: 'Hire Creators', href: '/hire-creators' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Features', href: '/#features' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Contact', href: '#' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' }
      ]
    }
  ];

  if (loading) {
    return (
      <footer className="bg-card border-t">
        <div className="container py-12 px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-14"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-12"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-28"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  const sectionsToRender = content.sections || defaultSections;

  // Group sections into rows of 3
  const groupedSections = sectionsToRender.reduce((rows: FooterSection[][], section, index) => {
    if (index % 3 === 0) {
      rows.push([section]);
    } else {
      rows[rows.length - 1].push(section);
    }
    return rows;
  }, []);

  return (
    <footer className="bg-card border-t">
      <div className="container py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              {content.description || 'AI-powered tools for UGC creators to land more brand deals.'}
            </p>
            <div className="flex gap-2 mt-4">
              {content.socialLinks?.facebook && (
                <Link href={content.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Facebook className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              {content.socialLinks?.twitter && (
                <Link href={content.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Twitter className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              {content.socialLinks?.instagram && (
                <Link href={content.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Instagram className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              {content.socialLinks?.linkedin && (
                <Link href={content.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
          {groupedSections.map((row: FooterSection[], rowIndex: number) => (
            <div key={rowIndex} className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
              {row.map((section: FooterSection, sectionIndex: number) => (
                <div key={sectionIndex}>
                  <h4 className="font-semibold mb-4">{section.title}</h4>
                  <ul className="space-y-2">
                    {section.links.map((link: FooterLink, linkIndex: number) => (
                      <li key={linkIndex}>
                        <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}

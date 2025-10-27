import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const page = await prisma.page.findFirst({
      where: {
        slug: slug,
        is_active: true,
      },
    });

    if (!page) {
      return {
        title: 'Page Not Found',
      };
    }

    return {
      title: page.meta_title || page.title,
      description: page.meta_description || page.content.replace(/<[^>]*>/g, '').substring(0, 160),
      openGraph: {
        title: page.meta_title || page.title,
        description: page.meta_description || page.content.replace(/<[^>]*>/g, '').substring(0, 160),
        images: page.featured_image ? [{ url: page.featured_image }] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Page Not Found',
    };
  }
}

export default async function Page({ params }: PageProps) {
  try {
    const { slug } = await params;
    const page = await prisma.page.findFirst({
      where: {
        slug: slug,
        is_active: true,
      },
    });

    if (!page) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                {page.title}
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="container mx-auto px-4 py-8">
          <article className="max-w-4xl mx-auto">
            <div
              className="prose prose-base md:prose-lg prose-slate max-w-none
                         prose-headings:text-foreground prose-headings:font-bold prose-headings:leading-tight
                         prose-h1:text-2xl prose-h1:md:text-3xl
                         prose-h2:text-xl prose-h2:md:text-2xl
                         prose-h3:text-lg prose-h3:md:text-xl
                         prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-base md:prose-p:text-lg
                         prose-strong:text-foreground prose-strong:font-semibold
                         prose-em:text-muted-foreground prose-em:italic
                         prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                         prose-li:text-muted-foreground prose-li:leading-relaxed prose-li:text-base md:prose-li:text-lg
                         prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                         prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:p-4 prose-blockquote:rounded-r-lg
                         prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
                         prose-pre:bg-muted prose-pre:border prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
                         prose-img:rounded-lg prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </article>
        </main>

        {/* Featured Image - At Bottom */}
        {page.featured_image && (
          <section className="container mx-auto px-4 py-6">
            <div className="max-w-4xl mx-auto">
              <img
                src={page.featured_image}
                alt={page.title}
                className="w-full h-48 md:h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
          </section>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error fetching page:', error);
    notFound();
  }
}
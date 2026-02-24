import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getLandingPageBySlug, getVisibleSections } from '@/lib/landing-pages'
import { SectionRenderer } from '@/components/landing-pages/sections'

interface LandingPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: LandingPageProps): Promise<Metadata> {
  const { slug } = await params
  const landingPage = await getLandingPageBySlug(slug)

  if (!landingPage) {
    return {
      title: 'Página não encontrada',
    }
  }

  return {
    title: landingPage.seoTitle || landingPage.name,
    description: landingPage.seoDescription || undefined,
    openGraph: {
      title: landingPage.seoTitle || landingPage.name,
      description: landingPage.seoDescription || undefined,
      images: landingPage.ogImageUrl ? [landingPage.ogImageUrl] : undefined,
    },
  }
}

export default async function LandingPage({ params }: LandingPageProps) {
  const { slug } = await params
  const landingPage = await getLandingPageBySlug(slug)

  if (!landingPage) {
    notFound()
  }

  // Get visible sections sorted by order
  const visibleSections = getVisibleSections(landingPage.sections)

  return (
    <>
      {/* Custom CSS */}
      {landingPage.cssCustom && (
        <style
          dangerouslySetInnerHTML={{ __html: landingPage.cssCustom }}
        />
      )}

      {/* Render sections */}
      {visibleSections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          landingPageId={landingPage.id}
        />
      ))}
    </>
  )
}

// Enable static generation for published landing pages
export async function generateStaticParams() {
  // In production, you might want to fetch all published slugs
  // For now, we'll use dynamic rendering
  return []
}

// Revalidate every hour
export const revalidate = 3600

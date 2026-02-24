// src/lib/seo/metadata.ts
// Helpers para geração de metadata no Next.js
// Comprehensive SEO metadata system with Open Graph, Twitter Cards, and more

import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

interface GenerateMetadataOptions {
    /** Page title (will be appended with site name) */
    title: string
    /** Page description (150-160 characters recommended) */
    description: string
    /** OG image URL (defaults to siteConfig.ogImage) */
    image?: string
    /** Canonical URL (defaults to siteConfig.url) */
    canonical?: string
    /** Whether to noindex this page */
    noindex?: boolean
    /** OG type: 'website' or 'article' */
    type?: 'website' | 'article'
    /** Article published time (for article type) */
    publishedTime?: string
    /** Article modified time (for article type) */
    modifiedTime?: string
    /** Article author name */
    author?: string
    /** Article tags/keywords */
    tags?: string[]
    /** Article section/category */
    section?: string
}

/**
 * Generate comprehensive metadata for any page
 * Includes: title, description, canonical, Open Graph, Twitter Cards
 */
export function generateMetadata({
    title,
    description,
    image,
    canonical,
    noindex = false,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    tags,
    section,
}: GenerateMetadataOptions): Metadata {
    const ogImage = image || siteConfig.ogImage
    const url = canonical || siteConfig.url
    const fullTitle = `${title} | ${siteConfig.name}`

    return {
        title: fullTitle,
        description,
        metadataBase: new URL(siteConfig.url),
        alternates: {
            canonical: url,
        },
        robots: noindex
            ? { index: false, follow: false }
            : { index: true, follow: true },
        openGraph: {
            title: fullTitle,
            description,
            url,
            siteName: siteConfig.name,
            images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
            type,
            ...(type === 'article' && {
                publishedTime,
                modifiedTime,
                authors: author ? [author] : undefined,
                tags,
                section,
            }),
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [ogImage],
        },
    }
}

/**
 * Generate metadata for homepage (no title suffix)
 */
export function generateHomeMetadata(options: Omit<GenerateMetadataOptions, 'title'>): Metadata {
    return generateMetadata({
        ...options,
        title: siteConfig.name,
    })
}

/**
 * Generate metadata for blog listing page
 */
export function generateBlogMetadata(page: number = 1): Metadata {
    const title = page > 1 ? `Blog — Página ${page}` : 'Blog'
    const description = 'Artigos sobre estratégia, crescimento e negócios de alto impacto. Aprenda com especialistas e impulsione seus resultados.'

    return generateMetadata({
        title,
        description,
        canonical: page > 1 ? `${siteConfig.url}/blog?page=${page}` : `${siteConfig.url}/blog`,
    })
}

/**
 * Generate metadata for category page
 */
export function generateCategoryMetadata(categoryName: string, categorySlug: string, page: number = 1): Metadata {
    const title = page > 1 ? `${categoryName} — Página ${page}` : categoryName
    const description = `Artigos sobre ${categoryName}. Estratégias, insights e dicas práticas para seu negócio.`

    return generateMetadata({
        title,
        description,
        canonical: page > 1
            ? `${siteConfig.url}/blog/categoria/${categorySlug}?page=${page}`
            : `${siteConfig.url}/blog/categoria/${categorySlug}`,
    })
}

/**
 * Generate metadata for static pages (sobre, contato, etc.)
 */
export function generatePageMetadata(
    title: string,
    description: string,
    path: string
): Metadata {
    return generateMetadata({
        title,
        description,
        canonical: `${siteConfig.url}${path}`,
    })
}

// src/lib/seo/jsonld.ts
// Structured data helpers for JSON-LD
// Generates schema.org compliant structured data for SEO

import { siteConfig } from '@/config/site'

interface BlogPost {
    title: string
    excerpt?: string | null
    slug: string
    cover_image_url?: string | null
    published_at: string
    updated_at?: string
    author?: { full_name: string }
}

interface BreadcrumbItem {
    name: string
    url: string
}

/**
 * Organization schema for the website
 * Used on homepage and throughout the site
 */
export function organizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/images/logo.png`,
        description: siteConfig.description,
        sameAs: [
            siteConfig.links.instagram,
            siteConfig.links.linkedin,
            siteConfig.links.youtube,
        ].filter(Boolean),
    }
}

/**
 * WebSite schema with search action
 * Used on homepage for site search
 */
export function websiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${siteConfig.url}/blog?search={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    }
}

/**
 * BlogPosting schema for individual blog posts
 */
export function blogPostingSchema(post: BlogPost) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt || '',
        image: post.cover_image_url || '',
        datePublished: post.published_at,
        dateModified: post.updated_at || post.published_at,
        author: {
            '@type': 'Person',
            name: post.author?.full_name || 'Autor',
        },
        publisher: {
            '@type': 'Organization',
            name: siteConfig.name,
            logo: {
                '@type': 'ImageObject',
                url: `${siteConfig.url}/images/logo.png`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${siteConfig.url}/blog/${post.slug}`,
        },
    }
}

/**
 * BreadcrumbList schema for navigation
 */
export function breadcrumbSchema(items: BreadcrumbItem[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${siteConfig.url}${item.url}`,
        })),
    }
}

/**
 * WebPage schema for static pages
 */
export function webPageSchema(title: string, description: string, path: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: title,
        description,
        url: `${siteConfig.url}${path}`,
        isPartOf: {
            '@type': 'WebSite',
            name: siteConfig.name,
            url: siteConfig.url,
        },
    }
}

/**
 * FAQ schema for FAQ sections
 */
export function faqSchema(items: Array<{ question: string; answer: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    }
}

/**
 * Article schema for blog posts (alternative to BlogPosting)
 */
export function articleSchema(post: BlogPost & { category?: string }) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt || '',
        image: post.cover_image_url || '',
        datePublished: post.published_at,
        dateModified: post.updated_at || post.published_at,
        author: {
            '@type': 'Person',
            name: post.author?.full_name || 'Autor',
        },
        publisher: {
            '@type': 'Organization',
            name: siteConfig.name,
            logo: {
                '@type': 'ImageObject',
                url: `${siteConfig.url}/images/logo.png`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${siteConfig.url}/blog/${post.slug}`,
        },
        ...(post.category && { articleSection: post.category }),
    }
}

/**
 * Collection of all schemas for easy import
 */
export const schemas = {
    organization: organizationSchema,
    website: websiteSchema,
    blogPosting: blogPostingSchema,
    breadcrumb: breadcrumbSchema,
    webPage: webPageSchema,
    faq: faqSchema,
    article: articleSchema,
}

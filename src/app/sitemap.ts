import { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'
import { createClient } from '@/lib/supabase/server'

interface PostForSitemap {
    slug: string
    updated_at: string
}

interface CategoryForSitemap {
    slug: string
    updated_at: string | null
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient()

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: siteConfig.url,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${siteConfig.url}/sobre`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${siteConfig.url}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${siteConfig.url}/contato`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ]

    // Fetch published blog posts
    const { data: posts } = await supabase
        .from('posts')
        .select('slug, updated_at')
        .eq('status', 'published')
        .is('deleted_at', null)
        .order('updated_at', { ascending: false }) as { data: PostForSitemap[] | null }

    const postPages: MetadataRoute.Sitemap = (posts || []).map((post) => ({
        url: `${siteConfig.url}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    // Fetch categories
    const { data: categories } = await supabase
        .from('post_categories')
        .select('slug, updated_at')
        .order('updated_at', { ascending: false }) as { data: CategoryForSitemap[] | null }

    const categoryPages: MetadataRoute.Sitemap = (categories || []).map((cat) => ({
        url: `${siteConfig.url}/blog/categoria/${cat.slug}`,
        lastModified: new Date(cat.updated_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }))

    return [...staticPages, ...postPages, ...categoryPages]
}

// src/app/(public)/blog/[slug]/page.tsx
// Individual blog post page — Design System Empire Gold

import { getPostBySlug, getRelatedPosts } from '@/lib/blog/posts'
import { generateMetadata as generateSeoMetadata } from '@/lib/seo/metadata'
import { blogPostingSchema, breadcrumbSchema } from '@/lib/seo/jsonld'
import { notFound } from 'next/navigation'
import { PostHero } from '@/components/public/blog/PostHero'
import { PostContent } from '@/components/public/blog/PostContent'
import { PostShare } from '@/components/public/blog/PostShare'
import { PostTags } from '@/components/public/blog/PostTags'
import { RelatedPosts } from '@/components/public/blog/RelatedPosts'
import { Breadcrumb } from '@/components/public/layout/Breadcrumb'
import { Separator } from '@/components/ui/separator'
import { JsonLd } from '@/components/shared/JsonLd'

// Note: generateStaticParams removed to avoid Supabase call at build time
// Pages will be dynamically rendered on first request

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post não encontrado',
    }
  }

  return generateSeoMetadata({
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || '',
    image: post.og_image_url || post.cover_image_url || undefined,
    canonical: post.canonical_url || undefined,
    noindex: post.noindex,
    type: 'article',
    publishedTime: post.published_at || undefined,
    modifiedTime: post.updated_at,
    author: post.profiles?.full_name || undefined,
    tags: post.posts_tags?.map((pt) => pt.post_tags.name),
    section: post.posts_categories?.[0]?.post_categories.name || undefined,
  })
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // Get related posts
  const categoryIds = post.posts_categories?.map((pc) => pc.post_categories.id) || []
  const relatedPosts = await getRelatedPosts(post.id, categoryIds, 3)

  // Get primary category for breadcrumb
  const primaryCategory = post.posts_categories?.[0]?.post_categories

  // Generate JSON-LD structured data
  const blogPostingJsonLd = blogPostingSchema({
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    cover_image_url: post.cover_image_url,
    published_at: post.published_at || '',
    updated_at: post.updated_at,
    author: { full_name: post.profiles?.full_name || 'Autor' },
  })

  // Generate breadcrumb JSON-LD
  const breadcrumbItems = [
    { name: 'Blog', url: '/blog' },
    ...(primaryCategory ? [{ name: primaryCategory.name, url: `/blog/categoria/${primaryCategory.slug}` }] : []),
    { name: post.title, url: '' },
  ]
  const breadcrumbJsonLd = breadcrumbSchema(breadcrumbItems)

  return (
    <>
      {/* JSON-LD Structured Data */}
      <JsonLd data={[blogPostingJsonLd, breadcrumbJsonLd]} />

      <div className="min-h-screen bg-[var(--color-empire-bg)]">
        {/* Breadcrumb */}
        <section className="pt-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb
              items={[
                { label: 'Blog', href: '/blog' },
                ...(primaryCategory
                  ? [{ label: primaryCategory.name, href: `/blog/categoria/${primaryCategory.slug}` }]
                  : []),
                { label: post.title },
              ]}
            />
          </div>
        </section>

        {/* Post Hero */}
        <PostHero post={post} />

        <Separator />

        {/* Post Content */}
        <article className="py-12">
          <PostContent content={post.content} contentHtml={post.content_html} />
          <PostShare url={`/blog/${post.slug}`} title={post.title} />
          <PostTags tags={post.posts_tags?.map((pt) => pt.post_tags) || []} />
        </article>

        <Separator />

        {/* Related Posts */}
        <RelatedPosts posts={relatedPosts} />
      </div>
    </>
  )
}

// src/app/(public)/blog/page.tsx
// Blog listing page — Design System Empire Gold

import { getPublishedPosts, getCategories } from '@/lib/blog/posts'
import { generateBlogMetadata } from '@/lib/seo/metadata'
import { breadcrumbSchema } from '@/lib/seo/jsonld'
import { PostGrid } from '@/components/public/blog/PostGrid'
import { CategoryFilter } from '@/components/public/blog/CategoryFilter'
import { BlogSearch } from '@/components/public/blog/BlogSearch'
import { Breadcrumb } from '@/components/public/layout/Breadcrumb'
import { Separator } from '@/components/ui/separator'
import { JsonLd } from '@/components/shared/JsonLd'
import { blogContent } from '@/content/blog'

export const metadata = generateBlogMetadata()

export default async function BlogPage() {
  const { posts } = await getPublishedPosts({ limit: 12 })
  const categories = await getCategories()
  const { listing } = blogContent

  const breadcrumbJsonLd = breadcrumbSchema([
    { name: 'Blog', url: '/blog' },
  ])

  return (
    <>
      {/* JSON-LD Structured Data */}
      <JsonLd data={breadcrumbJsonLd} />

      <div className="min-h-screen bg-[var(--color-empire-bg)]">
        {/* Hero Section */}
        <section className="pt-12 pb-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb items={[{ label: 'Blog', href: '/blog' }]} />

            <div className="max-w-4xl mx-auto text-center mt-8">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-empire-text)] mb-6">
                {listing.title}
              </h1>
              <p className="text-lg sm:text-xl text-[var(--color-empire-muted)] max-w-2xl mx-auto">
                {listing.subtitle}
              </p>
            </div>
          </div>
        </section>

        <Separator />

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
              {/* Search */}
              <BlogSearch />

              {/* Category Filter */}
              <div className="md:ml-auto">
                <CategoryFilter categories={categories} />
              </div>
            </div>

            {/* Post Grid */}
            <PostGrid posts={posts} />
          </div>
        </section>
      </div>
    </>
  )
}

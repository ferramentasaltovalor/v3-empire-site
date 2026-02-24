// src/app/(public)/blog/categoria/[slug]/page.tsx
// Blog category page — Design System Empire Gold

import { getPublishedPosts, getCategories, getCategoryBySlug } from '@/lib/blog/posts'
import { generateCategoryMetadata } from '@/lib/seo/metadata'
import { breadcrumbSchema } from '@/lib/seo/jsonld'
import { notFound } from 'next/navigation'
import { PostGrid } from '@/components/public/blog/PostGrid'
import { CategoryFilter } from '@/components/public/blog/CategoryFilter'
import { Breadcrumb } from '@/components/public/layout/Breadcrumb'
import { Separator } from '@/components/ui/separator'
import { JsonLd } from '@/components/shared/JsonLd'
import { blogContent } from '@/content/blog'

// Note: generateStaticParams removed to avoid Supabase call at build time
// Pages will be dynamically rendered on first request

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const categories = await getCategories()
  const category = categories.find((c) => c.slug === slug)

  if (!category) {
    return {
      title: 'Categoria não encontrada',
    }
  }

  return generateCategoryMetadata(category.name, category.slug)
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const { posts } = await getPublishedPosts({ categorySlug: slug })
  const categories = await getCategories()
  const { listing, category: categoryContent } = blogContent

  const breadcrumbJsonLd = breadcrumbSchema([
    { name: 'Blog', url: '/blog' },
    { name: category.name, url: `/blog/categoria/${category.slug}` },
  ])

  return (
    <>
      {/* JSON-LD Structured Data */}
      <JsonLd data={breadcrumbJsonLd} />

      <div className="min-h-screen bg-[var(--color-empire-bg)]">
        {/* Hero Section */}
        <section className="pt-12 pb-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb
              items={[
                { label: 'Blog', href: '/blog' },
                { label: category.name },
              ]}
            />

            <div className="max-w-4xl mx-auto text-center mt-8">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-empire-text)] mb-6">
                {categoryContent.postsIn} <span className="text-[var(--color-empire-gold)]">{category.name}</span>
              </h1>
              {category.description && (
                <p className="text-lg sm:text-xl text-[var(--color-empire-muted)] max-w-2xl mx-auto">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        </section>

        <Separator />

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Filter */}
            <div className="mb-12">
              <CategoryFilter categories={categories} activeCategory={slug} />
            </div>

            {/* Post Grid */}
            {posts.length > 0 ? (
              <PostGrid posts={posts} />
            ) : (
              <div className="text-center py-16">
                <p className="text-[var(--color-empire-muted)] text-lg">{categoryContent.noPosts}</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

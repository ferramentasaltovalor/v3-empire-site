// src/lib/blog/posts.ts
// Data access layer for blog posts — Server-side only

import { createClient } from '@/lib/supabase/server'
import type { PostCategory, PostTag } from '@/types/database'

// ============================================================================
// Types
// ============================================================================

export interface PostWithAuthor {
    id: string
    title: string
    slug: string
    excerpt: string | null
    cover_image_url: string | null
    published_at: string | null
    reading_time_minutes: number
    profiles: {
        id: string
        full_name: string | null
        avatar_url: string | null
    } | null
    posts_categories: Array<{
        post_categories: {
            id: string
            name: string
            slug: string
        }
    }>
}

export interface PostWithDetails {
    id: string
    title: string
    slug: string
    content: Record<string, unknown>
    content_html: string | null
    excerpt: string | null
    cover_image_url: string | null
    status: string
    author_id: string
    published_at: string | null
    scheduled_at: string | null
    seo_title: string | null
    seo_description: string | null
    seo_keywords: string[]
    og_image_url: string | null
    canonical_url: string | null
    noindex: boolean
    reading_time_minutes: number
    word_count: number
    ai_seo_score: number | null
    ai_seo_suggestions: Record<string, unknown> | null
    created_at: string
    updated_at: string
    deleted_at: string | null
    profiles: {
        id: string
        full_name: string | null
        avatar_url: string | null
        bio: string | null
    } | null
    posts_categories: Array<{
        post_categories: {
            id: string
            name: string
            slug: string
        }
    }>
    posts_tags: Array<{
        post_tags: {
            id: string
            name: string
            slug: string
        }
    }>
}

export interface GetPostsOptions {
    categorySlug?: string
    tagSlug?: string
    limit?: number
    offset?: number
}

// Category query result type
interface CategoryResult {
    id: string
}

// Post category link result type
interface PostCategoryLink {
    post_id: string
}

// Post tag link result type
interface PostTagLink {
    post_id: string
}

// Tag result type
interface TagResult {
    id: string
}

// ============================================================================
// Data Access Functions
// ============================================================================

/**
 * Get all published posts with optional filtering
 */
export async function getPublishedPosts(options?: GetPostsOptions): Promise<{
    posts: PostWithAuthor[]
    total: number
}> {
    const supabase = await createClient()

    // If filtering by category, we need to get the category ID first
    if (options?.categorySlug) {
        const { data: category, error: categoryError } = await supabase
            .from('post_categories')
            .select('id')
            .eq('slug', options.categorySlug)
            .single()

        if (categoryError || !category) {
            return { posts: [], total: 0 }
        }

        const categoryData = category as CategoryResult

        // Get post IDs for this category
        const { data: postCategoryLinks, error: linksError } = await supabase
            .from('posts_categories')
            .select('post_id')
            .eq('category_id', categoryData.id)

        if (linksError || !postCategoryLinks || postCategoryLinks.length === 0) {
            return { posts: [], total: 0 }
        }

        const postIds = (postCategoryLinks as PostCategoryLink[]).map((link) => link.post_id)

        // Now get the posts with these IDs
        let query = supabase
            .from('posts')
            .select(
                `
        id,
        title,
        slug,
        excerpt,
        cover_image_url,
        published_at,
        reading_time_minutes,
        profiles!posts_author_id_fkey (
          id,
          full_name,
          avatar_url
        ),
        posts_categories (
          post_categories (
            id,
            name,
            slug
          )
        )
      `,
                { count: 'exact' }
            )
            .in('id', postIds)
            .eq('status', 'published')
            .is('deleted_at', null)
            .order('published_at', { ascending: false })

        if (options?.limit) {
            query = query.limit(options.limit)
        }

        if (options?.offset !== undefined && options.limit) {
            query = query.range(options.offset, options.offset + options.limit - 1)
        }

        const { data, error, count } = await query

        if (error) {
            console.error('Error fetching posts:', error)
            return { posts: [], total: 0 }
        }

        return { posts: (data as PostWithAuthor[]) || [], total: count || 0 }
    }

    // No category filter - simple query
    let query = supabase
        .from('posts')
        .select(
            `
      id,
      title,
      slug,
      excerpt,
      cover_image_url,
      published_at,
      reading_time_minutes,
      profiles!posts_author_id_fkey (
        id,
        full_name,
        avatar_url
      ),
      posts_categories (
        post_categories (
          id,
          name,
          slug
        )
      )
    `,
            { count: 'exact' }
        )
        .eq('status', 'published')
        .is('deleted_at', null)
        .order('published_at', { ascending: false })

    if (options?.limit) {
        query = query.limit(options.limit)
    }

    if (options?.offset !== undefined && options.limit) {
        query = query.range(options.offset, options.offset + options.limit - 1)
    }

    const { data, error, count } = await query

    if (error) {
        console.error('Error fetching posts:', error)
        return { posts: [], total: 0 }
    }

    return { posts: (data as PostWithAuthor[]) || [], total: count || 0 }
}

/**
 * Get a single post by slug with all details
 */
export async function getPostBySlug(slug: string): Promise<PostWithDetails | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('posts')
        .select(
            `
      *,
      profiles!posts_author_id_fkey (
        id,
        full_name,
        avatar_url,
        bio
      ),
      posts_categories (
        post_categories (
          id,
          name,
          slug
        )
      ),
      posts_tags (
        post_tags (
          id,
          name,
          slug
        )
      )
    `
        )
        .eq('slug', slug)
        .eq('status', 'published')
        .is('deleted_at', null)
        .single()

    if (error) {
        console.error('Error fetching post:', error)
        return null
    }

    return data as PostWithDetails
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<PostCategory[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('post_categories')
        .select('id, name, slug, description, color')
        .order('name')

    if (error) {
        console.error('Error fetching categories:', error)
        return []
    }

    return data || []
}

/**
 * Get a single category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<PostCategory | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('post_categories')
        .select('id, name, slug, description, color')
        .eq('slug', slug)
        .single()

    if (error) {
        console.error('Error fetching category:', error)
        return null
    }

    return data
}

/**
 * Get related posts based on categories
 */
export async function getRelatedPosts(
    postId: string,
    _categoryIds: string[],
    limit = 3
): Promise<PostWithAuthor[]> {
    const supabase = await createClient()

    // Simplified: just get recent posts excluding the current one
    // In the future, we can implement more sophisticated related post logic
    const { data, error } = await supabase
        .from('posts')
        .select(
            `
      id,
      title,
      slug,
      excerpt,
      cover_image_url,
      published_at,
      reading_time_minutes,
      profiles!posts_author_id_fkey (
        id,
        full_name,
        avatar_url
      ),
      posts_categories (
        post_categories (
          id,
          name,
          slug
        )
      )
    `
        )
        .neq('id', postId)
        .eq('status', 'published')
        .is('deleted_at', null)
        .order('published_at', { ascending: false })
        .limit(limit)

    if (error) {
        console.error('Error fetching related posts:', error)
        return []
    }

    return (data as PostWithAuthor[]) || []
}

/**
 * Get all tags
 */
export async function getTags(): Promise<PostTag[]> {
    const supabase = await createClient()

    const { data, error } = await supabase.from('post_tags').select('id, name, slug').order('name')

    if (error) {
        console.error('Error fetching tags:', error)
        return []
    }

    return data || []
}

/**
 * Get posts by tag slug
 */
export async function getPostsByTag(tagSlug: string, limit = 10): Promise<PostWithAuthor[]> {
    const supabase = await createClient()

    // Get tag ID first
    const { data: tag, error: tagError } = await supabase
        .from('post_tags')
        .select('id')
        .eq('slug', tagSlug)
        .single()

    if (tagError || !tag) return []

    const tagData = tag as TagResult

    // Get post IDs for this tag
    const { data: postTagLinks, error: linksError } = await supabase
        .from('posts_tags')
        .select('post_id')
        .eq('tag_id', tagData.id)

    if (linksError || !postTagLinks || postTagLinks.length === 0) return []

    const ids = (postTagLinks as PostTagLink[]).map((p) => p.post_id)

    // Get posts
    const { data, error } = await supabase
        .from('posts')
        .select(
            `
      id,
      title,
      slug,
      excerpt,
      cover_image_url,
      published_at,
      reading_time_minutes,
      profiles!posts_author_id_fkey (
        id,
        full_name,
        avatar_url
      ),
      posts_categories (
        post_categories (
          id,
          name,
          slug
        )
      )
    `
        )
        .in('id', ids)
        .eq('status', 'published')
        .is('deleted_at', null)
        .order('published_at', { ascending: false })
        .limit(limit)

    if (error) {
        console.error('Error fetching posts by tag:', error)
        return []
    }

    return (data as PostWithAuthor[]) || []
}

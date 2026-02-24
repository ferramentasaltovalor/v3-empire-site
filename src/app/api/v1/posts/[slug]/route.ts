// src/app/api/v1/posts/[slug]/route.ts
// Public API: Get single post by slug

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
    apiMiddleware,
    errorResponse,
    notFoundResponse,
    handleOptionsRequest,
    withCorsHeaders,
    successResponse,
} from '@/lib/api'
import type { PostAttributes } from '@/lib/api/types'

// ============================================================================
// Types
// ============================================================================

interface PostQueryResult {
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
    seo_title: string | null
    seo_description: string | null
    seo_keywords: string[]
    og_image_url: string | null
    canonical_url: string | null
    reading_time_minutes: number
    word_count: number
    created_at: string
    updated_at: string
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
            color: string | null
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

// ============================================================================
// Query Functions
// ============================================================================

/**
 * Get a single post by slug with all details
 */
async function getPostBySlug(slug: string): Promise<PostQueryResult | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('posts')
        .select(`
            id,
            title,
            slug,
            content,
            content_html,
            excerpt,
            cover_image_url,
            status,
            author_id,
            published_at,
            seo_title,
            seo_description,
            seo_keywords,
            og_image_url,
            canonical_url,
            reading_time_minutes,
            word_count,
            created_at,
            updated_at,
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
                    slug,
                    color
                )
            ),
            posts_tags (
                post_tags (
                    id,
                    name,
                    slug
                )
            )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .is('deleted_at', null)
        .single()

    if (error) {
        console.error('Error fetching post:', error)
        return null
    }

    return data as PostQueryResult
}

/**
 * Transform database result to API attributes
 */
function transformToAttributes(post: PostQueryResult): PostAttributes {
    return {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        contentHtml: post.content_html,
        coverImageUrl: post.cover_image_url,
        publishedAt: post.published_at,
        readingTimeMinutes: post.reading_time_minutes,
        wordCount: post.word_count,
        seoTitle: post.seo_title,
        seoDescription: post.seo_description,
        seoKeywords: post.seo_keywords,
        ogImageUrl: post.og_image_url,
        canonicalUrl: post.canonical_url,
        author: post.profiles ? {
            id: post.profiles.id,
            name: post.profiles.full_name,
            avatarUrl: post.profiles.avatar_url,
            bio: post.profiles.bio,
        } : null,
        categories: post.posts_categories.map((pc) => ({
            id: pc.post_categories.id,
            name: pc.post_categories.name,
            slug: pc.post_categories.slug,
            color: pc.post_categories.color,
        })),
        tags: post.posts_tags.map((pt) => ({
            id: pt.post_tags.id,
            name: pt.post_tags.name,
            slug: pt.post_tags.slug,
        })),
        createdAt: post.created_at,
        updatedAt: post.updated_at,
    }
}

// ============================================================================
// API Handler
// ============================================================================

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params
    
    // Handle rate limiting and middleware
    const middlewareResult = await apiMiddleware(request)
    
    if (!middlewareResult.allowed) {
        const response = errorResponse([{
            status: middlewareResult.error!.status,
            code: middlewareResult.error!.code,
            title: middlewareResult.error!.title,
            detail: middlewareResult.error!.detail,
        }])
        return withCorsHeaders(response)
    }

    // Get post by slug
    const post = await getPostBySlug(slug)
    
    if (!post) {
        const response = notFoundResponse('posts', slug)
        return withCorsHeaders(response)
    }

    // Transform to API format
    const attributes = transformToAttributes(post)

    // Build response with success helper
    const response = successResponse('posts', post.id, attributes, {
        cacheControl: 'public, max-age=300, stale-while-revalidate=900',
    })

    // Add CORS and rate limit headers
    withCorsHeaders(response)
    
    if (middlewareResult.rateLimitInfo) {
        response.headers.set('X-RateLimit-Limit', String(middlewareResult.rateLimitInfo.limit))
        response.headers.set('X-RateLimit-Remaining', String(middlewareResult.rateLimitInfo.remaining))
        response.headers.set('X-RateLimit-Reset', String(middlewareResult.rateLimitInfo.reset))
    }

    return response
}

// Handle OPTIONS preflight request
export async function OPTIONS() {
    return handleOptionsRequest()
}

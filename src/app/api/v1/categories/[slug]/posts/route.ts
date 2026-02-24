// src/app/api/v1/categories/[slug]/posts/route.ts
// Public API: List posts by category

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
    apiMiddleware,
    errorResponse,
    notFoundResponse,
    handleOptionsRequest,
    parsePaginationParams,
    parseSortParams,
    createResource,
    createBaseMeta,
    createPaginationMeta,
    createPaginationLinks,
} from '@/lib/api'
import type { PostListItemAttributes, APICollectionResponse } from '@/lib/api/types'

// ============================================================================
// Configuration
// ============================================================================

const ALLOWED_SORT_FIELDS = ['published_at', 'title', 'created_at', 'reading_time_minutes']
const RESOURCE_TYPE = 'posts'
const BASE_PATH = '/api/v1/categories'

// ============================================================================
// Types
// ============================================================================

interface PostQueryResult {
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
            color: string | null
        }
    }>
    created_at: string
    updated_at: string
}

// ============================================================================
// Query Functions
// ============================================================================

/**
 * Get category by slug
 */
async function getCategoryBySlug(slug: string): Promise<{ id: string; name: string; slug: string } | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('post_categories')
        .select('id, name, slug')
        .eq('slug', slug)
        .single()

    if (error || !data) {
        return null
    }

    return data as { id: string; name: string; slug: string }
}

/**
 * Get posts by category
 */
async function getPostsByCategory(options: {
    categoryId: string
    page: number
    perPage: number
    sort: string
    order: 'asc' | 'desc'
}): Promise<{ posts: PostQueryResult[]; total: number }> {
    const supabase = await createClient()
    const { categoryId, page, perPage, sort, order } = options
    const offset = (page - 1) * perPage

    // Map sort field to database column
    const sortColumn = sort === 'published_at' ? 'published_at' :
                       sort === 'title' ? 'title' :
                       sort === 'reading_time_minutes' ? 'reading_time_minutes' : 'created_at'

    // Get post IDs for this category
    const { data: postCategoryLinks } = await supabase
        .from('posts_categories')
        .select('post_id')
        .eq('category_id', categoryId) as { data: { post_id: string }[] | null; error: unknown }

    if (!postCategoryLinks || postCategoryLinks.length === 0) {
        return { posts: [], total: 0 }
    }

    const postIds = postCategoryLinks.map((link) => link.post_id)

    // Query posts
    const { data, error, count } = await supabase
        .from('posts')
        .select(`
            id,
            title,
            slug,
            excerpt,
            cover_image_url,
            published_at,
            reading_time_minutes,
            created_at,
            updated_at,
            profiles!posts_author_id_fkey (
                id,
                full_name,
                avatar_url
            ),
            posts_categories (
                post_categories (
                    id,
                    name,
                    slug,
                    color
                )
            )
        `, { count: 'exact' })
        .in('id', postIds)
        .eq('status', 'published')
        .is('deleted_at', null)
        .order(sortColumn, { ascending: order === 'asc' })
        .range(offset, offset + perPage - 1)

    if (error) {
        console.error('Error fetching posts by category:', error)
        return { posts: [], total: 0 }
    }

    return { posts: (data as PostQueryResult[]) || [], total: count || 0 }
}

/**
 * Transform database result to API attributes
 */
function transformToAttributes(post: PostQueryResult): PostListItemAttributes {
    return {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        coverImageUrl: post.cover_image_url,
        publishedAt: post.published_at,
        readingTimeMinutes: post.reading_time_minutes,
        author: post.profiles ? {
            id: post.profiles.id,
            name: post.profiles.full_name,
            avatarUrl: post.profiles.avatar_url,
        } : null,
        categories: post.posts_categories.map((pc) => ({
            id: pc.post_categories.id,
            name: pc.post_categories.name,
            slug: pc.post_categories.slug,
            color: pc.post_categories.color,
        })),
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
        return withCorsHeadersResponse(response)
    }

    // Get category by slug
    const category = await getCategoryBySlug(slug)
    
    if (!category) {
        const response = notFoundResponse('categories', slug)
        return withCorsHeadersResponse(response)
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const { page, perPage } = parsePaginationParams(searchParams, { page: 1, perPage: 20 })
    const { sort, order } = parseSortParams(searchParams, ALLOWED_SORT_FIELDS, { sort: 'published_at', order: 'desc' })

    // Query posts
    const { posts, total } = await getPostsByCategory({
        categoryId: category.id,
        page,
        perPage,
        sort,
        order,
    })

    // Transform to API format
    const items = posts.map((post) => ({
        id: post.id,
        attributes: transformToAttributes(post),
    }))

    // Build query params for pagination links
    const linkParams = new URLSearchParams()
    if (sort !== 'published_at') linkParams.set('sort', sort)
    if (order !== 'desc') linkParams.set('order', order)

    // Build pagination meta
    const paginationMeta = createPaginationMeta(page, perPage, total)
    const totalPages = paginationMeta.pagination.totalPages

    // Build response
    const response: APICollectionResponse<PostListItemAttributes> = {
        jsonapi: { version: '1.0' },
        data: items.map((item) => createResource(RESOURCE_TYPE, item.id, item.attributes)),
        links: createPaginationLinks(`${BASE_PATH}/${slug}/posts`, page, perPage, totalPages, linkParams),
        meta: {
            ...createBaseMeta(),
            ...paginationMeta,
            category: {
                id: category.id,
                name: category.name,
                slug: category.slug,
            },
        },
    }

    // Create NextResponse
    const nextResponse = NextResponse.json(response, { status: 200 })

    // Add headers
    nextResponse.headers.set('Content-Type', 'application/vnd.api+json')
    nextResponse.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
    nextResponse.headers.set('Access-Control-Allow-Origin', '*')
    nextResponse.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    nextResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key')
    
    if (middlewareResult.rateLimitInfo) {
        nextResponse.headers.set('X-RateLimit-Limit', String(middlewareResult.rateLimitInfo.limit))
        nextResponse.headers.set('X-RateLimit-Remaining', String(middlewareResult.rateLimitInfo.remaining))
        nextResponse.headers.set('X-RateLimit-Reset', String(middlewareResult.rateLimitInfo.reset))
    }

    return nextResponse
}

// Handle OPTIONS preflight request
export async function OPTIONS() {
    return handleOptionsRequest()
}

/**
 * Helper to add CORS headers to response
 */
function withCorsHeadersResponse(response: NextResponse): NextResponse {
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key')
    return response
}

// src/app/api/v1/posts/route.ts
// Public API: List published posts with pagination, filtering, and sorting

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
    apiMiddleware,
    errorResponse,
    handleOptionsRequest,
    parsePaginationParams,
    parseSortParams,
    parseFieldsParams,
    withRateLimitHeaders,
    withCorsHeaders,
    withCacheHeaders,
    generateETag,
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
const BASE_PATH = '/api/v1/posts'

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

interface CategoryResult {
    id: string
}

interface PostCategoryLink {
    post_id: string
}

// ============================================================================
// Query Builders
// ============================================================================

/**
 * Build Supabase query with filters
 */
async function queryPosts(options: {
    page: number
    perPage: number
    sort: string
    order: 'asc' | 'desc'
    category?: string
    tag?: string
    search?: string
    dateFrom?: string
    dateTo?: string
}): Promise<{ posts: PostQueryResult[]; total: number }> {
    const supabase = await createClient()
    const { page, perPage, sort, order, category, tag, search, dateFrom, dateTo } = options
    const offset = (page - 1) * perPage

    // Map sort field to database column
    const sortColumn = sort === 'published_at' ? 'published_at' :
                       sort === 'title' ? 'title' :
                       sort === 'reading_time_minutes' ? 'reading_time_minutes' : 'created_at'

    // Start building the query
    let query = supabase
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
        .eq('status', 'published')
        .is('deleted_at', null)

    // Apply category filter
    if (category) {
        // Get category ID first
        const { data: categoryData } = await supabase
            .from('post_categories')
            .select('id')
            .eq('slug', category)
            .single() as { data: CategoryResult | null }

        if (categoryData && categoryData.id) {
            // Get post IDs for this category
            const { data: postCategoryLinks } = await supabase
                .from('posts_categories')
                .select('post_id')
                .eq('category_id', categoryData.id) as { data: PostCategoryLink[] | null }

            if (postCategoryLinks && postCategoryLinks.length > 0) {
                const postIds = postCategoryLinks.map((link) => link.post_id)
                query = query.in('id', postIds)
            } else {
                return { posts: [], total: 0 }
            }
        } else {
            return { posts: [], total: 0 }
        }
    }

    // Apply tag filter
    if (tag) {
        const { data: tagData } = await supabase
            .from('post_tags')
            .select('id')
            .eq('slug', tag)
            .single() as { data: CategoryResult | null }

        if (tagData && tagData.id) {
            const { data: postTagLinks } = await supabase
                .from('posts_tags')
                .select('post_id')
                .eq('tag_id', tagData.id) as { data: PostCategoryLink[] | null }

            if (postTagLinks && postTagLinks.length > 0) {
                const postIds = postTagLinks.map((link) => link.post_id)
                query = query.in('id', postIds)
            } else {
                return { posts: [], total: 0 }
            }
        } else {
            return { posts: [], total: 0 }
        }
    }

    // Apply search filter
    if (search) {
        query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)
    }

    // Apply date range filter
    if (dateFrom) {
        query = query.gte('published_at', dateFrom)
    }
    if (dateTo) {
        query = query.lte('published_at', dateTo)
    }

    // Apply sorting
    query = query.order(sortColumn, { ascending: order === 'asc' })

    // Apply pagination
    query = query.range(offset, offset + perPage - 1)

    const { data, error, count } = await query

    if (error) {
        console.error('Error fetching posts:', error)
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

export async function GET(request: NextRequest) {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const { page, perPage } = parsePaginationParams(searchParams, { page: 1, perPage: 20 })
    const { sort, order } = parseSortParams(searchParams, ALLOWED_SORT_FIELDS, { sort: 'published_at', order: 'desc' })
    
    // Filter parameters
    const category = searchParams.get('category') || undefined
    const tag = searchParams.get('tag') || undefined
    const search = searchParams.get('search') || undefined
    const dateFrom = searchParams.get('date_from') || undefined
    const dateTo = searchParams.get('date_to') || undefined
    
    // Sparse fieldsets
    const fields = parseFieldsParams(searchParams, RESOURCE_TYPE)

    // Query posts
    const { posts, total } = await queryPosts({
        page,
        perPage,
        sort,
        order,
        category,
        tag,
        search,
        dateFrom,
        dateTo,
    })

    // Transform to API format
    let items: Array<{ id: string; attributes: PostListItemAttributes }> = posts.map((post) => ({
        id: post.id,
        attributes: transformToAttributes(post),
    }))

    // Apply sparse fieldsets if specified
    if (fields && fields.length > 0) {
        items = items.map((item) => {
            const filteredAttrs: Partial<PostListItemAttributes> = {}
            for (const field of fields) {
                if (field in item.attributes) {
                    (filteredAttrs as Record<string, unknown>)[field] = item.attributes[field as keyof PostListItemAttributes]
                }
            }
            return { id: item.id, attributes: filteredAttrs as unknown as PostListItemAttributes }
        })
    }

    // Build query params for pagination links (excluding page/per_page)
    const linkParams = new URLSearchParams()
    if (category) linkParams.set('category', category)
    if (tag) linkParams.set('tag', tag)
    if (search) linkParams.set('search', search)
    if (dateFrom) linkParams.set('date_from', dateFrom)
    if (dateTo) linkParams.set('date_to', dateTo)
    if (sort !== 'published_at') linkParams.set('sort', sort)
    if (order !== 'desc') linkParams.set('order', order)
    if (fields) linkParams.set(`fields[${RESOURCE_TYPE}]`, fields.join(','))

    // Generate ETag for caching
    const etag = generateETag({ items: items.map(i => i.id), total, page, perPage })
    
    // Check if client has cached version
    const ifNoneMatch = request.headers.get('if-none-match')
    if (ifNoneMatch && (ifNoneMatch === etag || ifNoneMatch === `W/${etag}` || ifNoneMatch === '*')) {
        return new NextResponse(null, { status: 304 })
    }

    // Build pagination meta
    const paginationMeta = createPaginationMeta(page, perPage, total)
    const totalPages = paginationMeta.pagination.totalPages

    // Build response
    const response: APICollectionResponse<PostListItemAttributes> = {
        jsonapi: { version: '1.0' },
        data: items.map((item) => createResource(RESOURCE_TYPE, item.id, item.attributes)),
        links: createPaginationLinks(BASE_PATH, page, perPage, totalPages, linkParams),
        meta: {
            ...createBaseMeta(),
            ...paginationMeta,
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
    nextResponse.headers.set('ETag', etag)
    
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

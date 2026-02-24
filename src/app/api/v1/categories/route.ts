// src/app/api/v1/categories/route.ts
// Public API: List categories

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
    apiMiddleware,
    errorResponse,
    handleOptionsRequest,
    parsePaginationParams,
    parseSortParams,
    createResource,
    createBaseMeta,
    createPaginationMeta,
    createPaginationLinks,
} from '@/lib/api'
import type { CategoryAttributes, APICollectionResponse } from '@/lib/api/types'

// ============================================================================
// Configuration
// ============================================================================

const ALLOWED_SORT_FIELDS = ['name', 'created_at', 'post_count']
const RESOURCE_TYPE = 'categories'
const BASE_PATH = '/api/v1/categories'

// ============================================================================
// Types
// ============================================================================

interface CategoryQueryResult {
    id: string
    name: string
    slug: string
    description: string | null
    color: string | null
    parent_id: string | null
    created_at: string
    post_count?: number
}

// ============================================================================
// Query Functions
// ============================================================================

/**
 * Get all categories with post counts
 */
async function getCategories(options: {
    page: number
    perPage: number
    sort: string
    order: 'asc' | 'desc'
    search?: string
}): Promise<{ categories: CategoryQueryResult[]; total: number }> {
    const supabase = await createClient()
    const { page, perPage, sort, order, search } = options
    const offset = (page - 1) * perPage

    // Start building the query
    let query = supabase
        .from('post_categories')
        .select('id, name, slug, description, color, parent_id, created_at', { count: 'exact' })

    // Apply search filter
    if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply sorting
    const sortColumn = sort === 'post_count' ? 'name' : sort // post_count sorted separately
    query = query.order(sortColumn, { ascending: order === 'asc' })

    // Apply pagination
    query = query.range(offset, offset + perPage - 1)

    const { data, error, count } = await query

    if (error) {
        console.error('Error fetching categories:', error)
        return { categories: [], total: 0 }
    }

    // Get post counts for each category
    const categories = await Promise.all(
        (data || []).map(async (category) => {
            const categoryData = category as { id: string; name: string; slug: string; description: string | null; color: string | null; parent_id: string | null; created_at: string }
            const { count: postCount } = await supabase
                .from('posts_categories')
                .select('post_id', { count: 'exact', head: true })
                .eq('category_id', categoryData.id)

            return {
                ...categoryData,
                post_count: postCount || 0,
            } as CategoryQueryResult
        })
    )

    // Sort by post_count if requested
    if (sort === 'post_count') {
        categories.sort((a, b) => {
            const diff = (b.post_count || 0) - (a.post_count || 0)
            return order === 'asc' ? -diff : diff
        })
    }

    return { categories, total: count || 0 }
}

/**
 * Transform database result to API attributes
 */
function transformToAttributes(category: CategoryQueryResult): CategoryAttributes {
    return {
        name: category.name,
        slug: category.slug,
        description: category.description,
        color: category.color,
        parentId: category.parent_id,
        postCount: category.post_count || 0,
        createdAt: category.created_at,
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
        return withCorsHeadersResponse(response)
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const { page, perPage } = parsePaginationParams(searchParams, { page: 1, perPage: 50 })
    const { sort, order } = parseSortParams(searchParams, ALLOWED_SORT_FIELDS, { sort: 'name', order: 'asc' })
    
    // Filter parameters
    const search = searchParams.get('search') || undefined

    // Query categories
    const { categories, total } = await getCategories({
        page,
        perPage,
        sort,
        order,
        search,
    })

    // Transform to API format
    const items = categories.map((category) => ({
        id: category.id,
        attributes: transformToAttributes(category),
    }))

    // Build query params for pagination links
    const linkParams = new URLSearchParams()
    if (search) linkParams.set('search', search)
    if (sort !== 'name') linkParams.set('sort', sort)
    if (order !== 'asc') linkParams.set('order', order)

    // Build pagination meta
    const paginationMeta = createPaginationMeta(page, perPage, total)
    const totalPages = paginationMeta.pagination.totalPages

    // Build response
    const response: APICollectionResponse<CategoryAttributes> = {
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
    nextResponse.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=900')
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

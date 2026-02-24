// src/app/api/v1/media/route.ts
// Public API: List public media

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
import type { MediaAttributes, APICollectionResponse } from '@/lib/api/types'

// ============================================================================
// Configuration
// ============================================================================

const ALLOWED_SORT_FIELDS = ['created_at', 'name', 'size']
const RESOURCE_TYPE = 'media'
const BASE_PATH = '/api/v1/media'

// ============================================================================
// Types
// ============================================================================

interface MediaQueryResult {
    id: string
    name: string
    alt: string | null
    url: string
    thumbnail_url: string | null
    type: string
    mime_type: string
    size: number
    width: number | null
    height: number | null
    is_public: boolean
    created_at: string
    created_by: string | null
    profiles: {
        id: string
        full_name: string | null
    } | null
}

// ============================================================================
// Query Functions
// ============================================================================

/**
 * Get public media with filtering
 */
async function getPublicMedia(options: {
    page: number
    perPage: number
    sort: string
    order: 'asc' | 'desc'
    type?: 'image' | 'video' | 'document' | 'audio'
    search?: string
}): Promise<{ media: MediaQueryResult[]; total: number }> {
    const supabase = await createClient()
    const { page, perPage, sort, order, type, search } = options
    const offset = (page - 1) * perPage

    // Map sort field to database column
    const sortColumn = sort === 'size' ? 'size' :
                       sort === 'name' ? 'name' : 'created_at'

    // Start building the query
    let query = supabase
        .from('media')
        .select(`
            id,
            name,
            alt,
            url,
            thumbnail_url,
            type,
            mime_type,
            size,
            width,
            height,
            is_public,
            created_at,
            created_by,
            profiles (
                id,
                full_name
            )
        `, { count: 'exact' })
        .eq('is_public', true)

    // Apply type filter
    if (type) {
        query = query.eq('type', type)
    }

    // Apply search filter
    if (search) {
        query = query.or(`name.ilike.%${search}%,alt.ilike.%${search}%`)
    }

    // Apply sorting
    query = query.order(sortColumn, { ascending: order === 'asc' })

    // Apply pagination
    query = query.range(offset, offset + perPage - 1)

    const { data, error, count } = await query

    if (error) {
        console.error('Error fetching media:', error)
        return { media: [], total: 0 }
    }

    return { media: (data as MediaQueryResult[]) || [], total: count || 0 }
}

/**
 * Transform database result to API attributes
 */
function transformToAttributes(media: MediaQueryResult): MediaAttributes {
    return {
        name: media.name,
        alt: media.alt,
        url: media.url,
        thumbnailUrl: media.thumbnail_url,
        type: media.type as 'image' | 'video' | 'document' | 'audio',
        mimeType: media.mime_type,
        size: media.size,
        width: media.width,
        height: media.height,
        createdAt: media.created_at,
        createdBy: media.profiles ? {
            id: media.profiles.id,
            name: media.profiles.full_name,
        } : null,
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
    const { page, perPage } = parsePaginationParams(searchParams, { page: 1, perPage: 20 })
    const { sort, order } = parseSortParams(searchParams, ALLOWED_SORT_FIELDS, { sort: 'created_at', order: 'desc' })
    
    // Filter parameters
    const type = searchParams.get('type') as 'image' | 'video' | 'document' | 'audio' | null
    const search = searchParams.get('search') || undefined

    // Validate type filter
    const validTypes = ['image', 'video', 'document', 'audio']
    const typeFilter = type && validTypes.includes(type) ? type : undefined

    // Query media
    const { media, total } = await getPublicMedia({
        page,
        perPage,
        sort,
        order,
        type: typeFilter,
        search,
    })

    // Transform to API format
    const items = media.map((item) => ({
        id: item.id,
        attributes: transformToAttributes(item),
    }))

    // Build query params for pagination links
    const linkParams = new URLSearchParams()
    if (typeFilter) linkParams.set('type', typeFilter)
    if (search) linkParams.set('search', search)
    if (sort !== 'created_at') linkParams.set('sort', sort)
    if (order !== 'desc') linkParams.set('order', order)

    // Build pagination meta
    const paginationMeta = createPaginationMeta(page, perPage, total)
    const totalPages = paginationMeta.pagination.totalPages

    // Build response
    const response: APICollectionResponse<MediaAttributes> = {
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

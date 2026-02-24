// src/lib/api/responses.ts
// Standard response helpers for public REST API

import { NextResponse } from 'next/server'
import type {
    APIResource,
    APISingleResponse,
    APICollectionResponse,
    APIErrorResponse,
    APIError,
    PaginationLinks,
    APIResponseMeta,
    APIPaginationMeta,
    ResourceLinks,
    RateLimitInfo,
} from './types'

// ============================================================================
// Constants
// ============================================================================

const JSON_API_VERSION = '1.0'
const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || ''

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate a unique request ID
 */
function generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Get current timestamp in ISO format
 */
function getTimestamp(): string {
    return new Date().toISOString()
}

/**
 * Build full URL for a path
 */
function buildUrl(path: string): string {
    return `${API_BASE_URL}${path}`
}

/**
 * Create base meta object
 */
export function createBaseMeta(requestId?: string): APIResponseMeta {
    return {
        timestamp: getTimestamp(),
        requestId: requestId || generateRequestId(),
    }
}

/**
 * Create pagination meta
 */
export function createPaginationMeta(
    page: number,
    perPage: number,
    totalItems: number
): APIPaginationMeta {
    const totalPages = Math.ceil(totalItems / perPage)
    return {
        pagination: {
            page,
            perPage,
            totalPages,
            totalItems,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        },
    }
}

/**
 * Create pagination links
 */
export function createPaginationLinks(
    basePath: string,
    page: number,
    perPage: number,
    totalPages: number,
    queryParams?: URLSearchParams
): PaginationLinks {
    const queryString = queryParams ? `?${queryParams.toString()}` : ''
    const links: PaginationLinks = {
        self: buildUrl(`${basePath}?page=${page}&per_page=${perPage}${queryString.replace(/^\?/, '&')}`),
        first: buildUrl(`${basePath}?page=1&per_page=${perPage}${queryString.replace(/^\?/, '&')}`),
        last: buildUrl(`${basePath}?page=${totalPages}&per_page=${perPage}${queryString.replace(/^\?/, '&')}`),
    }

    if (page > 1) {
        links.prev = buildUrl(`${basePath}?page=${page - 1}&per_page=${perPage}${queryString.replace(/^\?/, '&')}`)
    }
    if (page < totalPages) {
        links.next = buildUrl(`${basePath}?page=${page + 1}&per_page=${perPage}${queryString.replace(/^\?/, '&')}`)
    }

    return links
}

/**
 * Create resource links
 */
function createResourceLinks(type: string, id: string): ResourceLinks {
    return {
        self: buildUrl(`/api/v1/${type}/${id}`),
    }
}

// ============================================================================
// Response Builders
// ============================================================================

/**
 * Create a JSON:API resource object
 */
export function createResource<T>(
    type: string,
    id: string,
    attributes: T,
    includeLinks = true
): APIResource<T> {
    const resource: APIResource<T> = {
        type,
        id,
        attributes,
    }

    if (includeLinks) {
        resource.links = createResourceLinks(type, id)
    }

    return resource
}

/**
 * Build success response for single resource
 */
export function successResponse<T>(
    type: string,
    id: string,
    attributes: T,
    options: {
        status?: number
        requestId?: string
        included?: APIResource[]
        cacheControl?: string
    } = {}
): NextResponse {
    const { status = 200, requestId, included, cacheControl } = options

    const response: APISingleResponse<T> = {
        jsonapi: { version: JSON_API_VERSION },
        data: createResource(type, id, attributes),
        links: createResourceLinks(type, id),
        meta: createBaseMeta(requestId),
    }

    if (included && included.length > 0) {
        response.included = included
    }

    const headers: HeadersInit = {
        'Content-Type': 'application/vnd.api+json',
        'Cache-Control': cacheControl || 'public, max-age=60, stale-while-revalidate=300',
    }

    return NextResponse.json(response, { status, headers })
}

/**
 * Build success response for collection
 */
export function collectionResponse<T>(
    type: string,
    items: Array<{ id: string; attributes: T }>,
    options: {
        page?: number
        perPage?: number
        totalItems?: number
        basePath: string
        requestId?: string
        included?: APIResource[]
        queryParams?: URLSearchParams
        cacheControl?: string
    }
): NextResponse {
    const {
        page = 1,
        perPage = 20,
        totalItems = items.length,
        basePath,
        requestId,
        included,
        queryParams,
        cacheControl,
    } = options

    const paginationMeta = createPaginationMeta(page, perPage, totalItems)
    const totalPages = paginationMeta.pagination.totalPages

    const response: APICollectionResponse<T> = {
        jsonapi: { version: JSON_API_VERSION },
        data: items.map((item) => createResource(type, item.id, item.attributes)),
        links: createPaginationLinks(basePath, page, perPage, totalPages, queryParams),
        meta: {
            ...createBaseMeta(requestId),
            ...paginationMeta,
        },
    }

    if (included && included.length > 0) {
        response.included = included
    }

    const headers: HeadersInit = {
        'Content-Type': 'application/vnd.api+json',
        'Cache-Control': cacheControl || 'public, max-age=60, stale-while-revalidate=300',
    }

    return NextResponse.json(response, { status: 200, headers })
}

/**
 * Build not found response
 */
export function notFoundResponse(
    type: string,
    id: string,
    requestId?: string
): NextResponse {
    const response: APIErrorResponse = {
        jsonapi: { version: JSON_API_VERSION },
        errors: [
            {
                status: '404',
                code: 'NOT_FOUND',
                title: 'Resource not found',
                detail: `${type} with id '${id}' was not found`,
            },
        ],
        meta: createBaseMeta(requestId),
    }

    return NextResponse.json(response, {
        status: 404,
        headers: { 'Content-Type': 'application/vnd.api+json' },
    })
}

/**
 * Build error response
 */
export function errorResponse(
    errors: Array<{
        status: number
        code?: string
        title: string
        detail?: string
        source?: { pointer?: string; parameter?: string }
    }>,
    requestId?: string
): NextResponse {
    const status = errors[0]?.status || 500

    const response: APIErrorResponse = {
        jsonapi: { version: JSON_API_VERSION },
        errors: errors.map((e) => ({
            status: String(e.status),
            code: e.code,
            title: e.title,
            detail: e.detail,
            source: e.source,
        })),
        meta: createBaseMeta(requestId),
    }

    return NextResponse.json(response, {
        status,
        headers: { 'Content-Type': 'application/vnd.api+json' },
    })
}

/**
 * Build validation error response
 */
export function validationErrorResponse(
    errors: Array<{
        field: string
        message: string
    }>,
    requestId?: string
): NextResponse {
    return errorResponse(
        errors.map((e) => ({
            status: 422,
            code: 'VALIDATION_ERROR',
            title: 'Validation failed',
            detail: e.message,
            source: { pointer: `/data/attributes/${e.field}` },
        })),
        requestId
    )
}

/**
 * Build rate limit exceeded response
 */
export function rateLimitExceededResponse(
    retryAfter: number,
    requestId?: string
): NextResponse {
    const response: APIErrorResponse = {
        jsonapi: { version: JSON_API_VERSION },
        errors: [
            {
                status: '429',
                code: 'RATE_LIMIT_EXCEEDED',
                title: 'Rate limit exceeded',
                detail: `Too many requests. Please retry after ${retryAfter} seconds.`,
            },
        ],
        meta: createBaseMeta(requestId),
    }

    return NextResponse.json(response, {
        status: 429,
        headers: {
            'Content-Type': 'application/vnd.api+json',
            'Retry-After': String(retryAfter),
        },
    })
}

/**
 * Build unauthorized response
 */
export function unauthorizedResponse(
    requestId?: string,
    message = 'Authentication required'
): NextResponse {
    const response: APIErrorResponse = {
        jsonapi: { version: JSON_API_VERSION },
        errors: [
            {
                status: '401',
                code: 'UNAUTHORIZED',
                title: 'Unauthorized',
                detail: message,
            },
        ],
        meta: createBaseMeta(requestId),
    }

    return NextResponse.json(response, {
        status: 401,
        headers: {
            'Content-Type': 'application/vnd.api+json',
            'WWW-Authenticate': 'Bearer realm="API"',
        },
    })
}

/**
 * Build server error response
 */
export function serverErrorResponse(
    requestId?: string,
    message = 'An unexpected error occurred'
): NextResponse {
    const response: APIErrorResponse = {
        jsonapi: { version: JSON_API_VERSION },
        errors: [
            {
                status: '500',
                code: 'INTERNAL_ERROR',
                title: 'Internal Server Error',
                detail: message,
            },
        ],
        meta: createBaseMeta(requestId),
    }

    return NextResponse.json(response, {
        status: 500,
        headers: { 'Content-Type': 'application/vnd.api+json' },
    })
}

/**
 * Add rate limit headers to response
 */
export function withRateLimitHeaders(
    response: NextResponse,
    rateLimitInfo: RateLimitInfo
): NextResponse {
    response.headers.set('X-RateLimit-Limit', String(rateLimitInfo.limit))
    response.headers.set('X-RateLimit-Remaining', String(rateLimitInfo.remaining))
    response.headers.set('X-RateLimit-Reset', String(rateLimitInfo.reset))
    return response
}

/**
 * Add CORS headers to response
 */
export function withCorsHeaders(
    response: NextResponse,
    allowedOrigins = '*'
): NextResponse {
    response.headers.set('Access-Control-Allow-Origin', allowedOrigins)
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key')
    response.headers.set('Access-Control-Max-Age', '86400')
    return response
}

/**
 * Handle OPTIONS preflight request
 */
export function handleOptionsRequest(allowedOrigins = '*'): NextResponse {
    const response = new NextResponse(null, { status: 204 })
    response.headers.set('Access-Control-Allow-Origin', allowedOrigins)
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key')
    response.headers.set('Access-Control-Max-Age', '86400')
    return response
}

// ============================================================================
// Query Parameter Parsing
// ============================================================================

/**
 * Parse pagination parameters from URL search params
 */
export function parsePaginationParams(
    searchParams: URLSearchParams,
    defaults: { page?: number; perPage?: number } = {}
): { page: number; perPage: number } {
    const page = Math.max(1, parseInt(searchParams.get('page') || '', 10) || defaults.page || 1)
    const perPage = Math.min(
        100,
        Math.max(1, parseInt(searchParams.get('per_page') || '', 10) || defaults.perPage || 20)
    )
    return { page, perPage }
}

/**
 * Parse sort parameters from URL search params
 */
export function parseSortParams(
    searchParams: URLSearchParams,
    allowedFields: string[],
    defaults: { sort?: string; order?: 'asc' | 'desc' } = {}
): { sort: string; order: 'asc' | 'desc' } {
    const sort = searchParams.get('sort') || defaults.sort || allowedFields[0] || 'created_at'
    const order = (searchParams.get('order') as 'asc' | 'desc') || defaults.order || 'desc'

    // Validate sort field
    const validSort = allowedFields.includes(sort) ? sort : allowedFields[0] || 'created_at'

    return { sort: validSort, order }
}

/**
 * Parse sparse fieldsets from URL search params
 */
export function parseFieldsParams(
    searchParams: URLSearchParams,
    type: string
): string[] | null {
    const fieldsParam = searchParams.get(`fields[${type}]`)
    if (!fieldsParam) return null

    return fieldsParam.split(',').map((f) => f.trim()).filter(Boolean)
}

/**
 * Filter object to include only specified fields
 */
export function filterFields<T extends Record<string, unknown>>(
    obj: T,
    fields: string[] | null
): Partial<T> {
    if (!fields || fields.length === 0) return obj

    const result: Record<string, unknown> = {}
    for (const field of fields) {
        if (field in obj) {
            result[field] = obj[field]
        }
    }
    return result as Partial<T>
}

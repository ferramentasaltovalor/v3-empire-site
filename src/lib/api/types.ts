// src/lib/api/types.ts
// API response types for public REST API

// ============================================================================
// JSON:API Style Types
// ============================================================================

/**
 * Resource identifier object
 */
export interface ResourceIdentifier {
    type: string
    id: string
}

/**
 * Resource links
 */
export interface ResourceLinks {
    self: string
}

/**
 * Pagination links
 */
export interface PaginationLinks {
    self: string
    first: string
    prev?: string
    next?: string
    last: string
}

/**
 * API Error Object
 */
export interface APIError {
    status: string
    code?: string
    title: string
    detail?: string
    source?: {
        pointer?: string
        parameter?: string
    }
    meta?: Record<string, unknown>
}

/**
 * JSON:API Resource Object
 */
export interface APIResource<T = Record<string, unknown>> {
    type: string
    id: string
    attributes: T
    relationships?: Record<string, { data: ResourceIdentifier | ResourceIdentifier[] }>
    links?: ResourceLinks
}

/**
 * JSON:API Response for single resource
 */
export interface APISingleResponse<T = Record<string, unknown>> {
    jsonapi: { version: '1.0' }
    data: APIResource<T> | null
    included?: APIResource[]
    links?: ResourceLinks
    meta?: APIResponseMeta
}

/**
 * JSON:API Response for collection
 */
export interface APICollectionResponse<T = Record<string, unknown>> {
    jsonapi: { version: '1.0' }
    data: APIResource<T>[]
    links: PaginationLinks
    meta: APIResponseMeta & APIPaginationMeta
    included?: APIResource[]
}

/**
 * JSON:API Error Response
 */
export interface APIErrorResponse {
    jsonapi: { version: '1.0' }
    errors: APIError[]
    meta?: APIResponseMeta
}

/**
 * Response metadata
 */
export interface APIResponseMeta {
    timestamp: string
    requestId?: string
    [key: string]: unknown
}

/**
 * Pagination metadata
 */
export interface APIPaginationMeta {
    pagination: {
        page: number
        perPage: number
        totalPages: number
        totalItems: number
        hasNextPage: boolean
        hasPrevPage: boolean
    }
}

// ============================================================================
// Query/Filter Types
// ============================================================================

/**
 * Pagination query parameters
 */
export interface PaginationParams {
    page?: number
    per_page?: number
}

/**
 * Sorting parameters
 */
export interface SortParams {
    sort?: string
    order?: 'asc' | 'desc'
}

/**
 * Post filter parameters
 */
export interface PostFilterParams extends PaginationParams, SortParams {
    category?: string
    tag?: string
    search?: string
    date_from?: string
    date_to?: string
    fields?: string
}

/**
 * Category filter parameters
 */
export interface CategoryFilterParams extends PaginationParams, SortParams {
    search?: string
    fields?: string
}

/**
 * Media filter parameters
 */
export interface MediaFilterParams extends PaginationParams, SortParams {
    type?: 'image' | 'video' | 'document' | 'audio'
    search?: string
    fields?: string
}

// ============================================================================
// API Response Types (Attributes)
// ============================================================================

/**
 * Post attributes for API response
 */
export interface PostAttributes {
    title: string
    slug: string
    excerpt: string | null
    content: Record<string, unknown> | null
    contentHtml: string | null
    coverImageUrl: string | null
    publishedAt: string | null
    readingTimeMinutes: number
    wordCount: number
    seoTitle: string | null
    seoDescription: string | null
    seoKeywords: string[]
    ogImageUrl: string | null
    canonicalUrl: string | null
    author: {
        id: string
        name: string | null
        avatarUrl: string | null
        bio: string | null
    } | null
    categories: Array<{
        id: string
        name: string
        slug: string
        color: string | null
    }>
    tags: Array<{
        id: string
        name: string
        slug: string
    }>
    createdAt: string
    updatedAt: string
}

/**
 * Post list item attributes (lighter version)
 */
export interface PostListItemAttributes {
    title: string
    slug: string
    excerpt: string | null
    coverImageUrl: string | null
    publishedAt: string | null
    readingTimeMinutes: number
    author: {
        id: string
        name: string | null
        avatarUrl: string | null
    } | null
    categories: Array<{
        id: string
        name: string
        slug: string
        color: string | null
    }>
}

/**
 * Category attributes for API response
 */
export interface CategoryAttributes {
    name: string
    slug: string
    description: string | null
    color: string | null
    parentId: string | null
    postCount: number
    createdAt: string
}

/**
 * Media attributes for API response
 */
export interface MediaAttributes {
    name: string
    alt: string | null
    url: string
    thumbnailUrl: string | null
    type: 'image' | 'video' | 'document' | 'audio'
    mimeType: string
    size: number
    width: number | null
    height: number | null
    createdAt: string
    createdBy: {
        id: string
        name: string | null
    } | null
}

/**
 * Site configuration attributes
 */
export interface SiteConfigAttributes {
    siteName: string
    siteDescription: string | null
    siteUrl: string | null
    logoUrl: string | null
    faviconUrl: string | null
    socialLinks: {
        facebook?: string
        instagram?: string
        twitter?: string
        linkedin?: string
        youtube?: string
    }
    contactEmail: string | null
    contactPhone: string | null
    defaultSeoTitle: string | null
    defaultSeoDescription: string | null
    defaultOgImageUrl: string | null
}

// ============================================================================
// API Key Types
// ============================================================================

/**
 * API Key information
 */
export interface APIKeyInfo {
    id: string
    name: string
    prefix: string
    rateLimit: number
    permissions: string[]
}

/**
 * Rate limit info for response headers
 */
export interface RateLimitInfo {
    limit: number
    remaining: number
    reset: number
}

// ============================================================================
// Export Types
// ============================================================================

export type PostResponse = APISingleResponse<PostAttributes>
export type PostListResponse = APICollectionResponse<PostListItemAttributes>
export type CategoryResponse = APISingleResponse<CategoryAttributes>
export type CategoryListResponse = APICollectionResponse<CategoryAttributes>
export type MediaListResponse = APICollectionResponse<MediaAttributes>
export type SiteConfigResponse = APISingleResponse<SiteConfigAttributes>

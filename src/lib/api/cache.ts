// src/lib/api/cache.ts
// Caching strategies for public REST API

import { NextResponse } from 'next/server'

// ============================================================================
// Cache Constants
// ============================================================================

/** Default cache times in seconds */
export const CACHE_TIMES = {
    /** Very short cache for frequently changing content (30 seconds) */
    VERY_SHORT: 30,
    /** Short cache for list pages (1 minute) */
    SHORT: 60,
    /** Medium cache for semi-static content (5 minutes) */
    MEDIUM: 300,
    /** Long cache for static content (1 hour) */
    LONG: 3600,
    /** Very long cache for rarely changing content (1 day) */
    VERY_LONG: 86400,
    /** Static cache for immutable content (1 year) */
    STATIC: 31536000,
} as const

/** Stale-while-revalidate times in seconds */
export const SWR_TIMES = {
    /** Short SWR (5 minutes) */
    SHORT: 300,
    /** Medium SWR (15 minutes) */
    MEDIUM: 900,
    /** Long SWR (1 hour) */
    LONG: 3600,
} as const

// ============================================================================
// Cache Header Builders
// ============================================================================

/**
 * Build Cache-Control header value
 */
export function buildCacheControl(options: {
    maxAge?: number
    sMaxAge?: number
    staleWhileRevalidate?: number
    public?: boolean
    private?: boolean
    noCache?: boolean
    noStore?: boolean
    mustRevalidate?: boolean
    immutable?: boolean
}): string {
    const directives: string[] = []

    if (options.noStore) {
        directives.push('no-store')
        return directives.join(', ')
    }

    if (options.noCache) {
        directives.push('no-cache')
    }

    if (options.public) {
        directives.push('public')
    } else if (options.private) {
        directives.push('private')
    }

    if (options.maxAge !== undefined) {
        directives.push(`max-age=${options.maxAge}`)
    }

    if (options.sMaxAge !== undefined) {
        directives.push(`s-maxage=${options.sMaxAge}`)
    }

    if (options.staleWhileRevalidate !== undefined) {
        directives.push(`stale-while-revalidate=${options.staleWhileRevalidate}`)
    }

    if (options.mustRevalidate) {
        directives.push('must-revalidate')
    }

    if (options.immutable) {
        directives.push('immutable')
    }

    return directives.join(', ') || 'no-cache'
}

/**
 * Get standard cache headers for API responses
 */
export function getApiCacheHeaders(type: 'list' | 'detail' | 'static' | 'dynamic' = 'dynamic'): Record<string, string> {
    switch (type) {
        case 'list':
            return {
                'Cache-Control': buildCacheControl({
                    public: true,
                    maxAge: CACHE_TIMES.SHORT,
                    staleWhileRevalidate: SWR_TIMES.SHORT,
                }),
            }
        case 'detail':
            return {
                'Cache-Control': buildCacheControl({
                    public: true,
                    maxAge: CACHE_TIMES.MEDIUM,
                    staleWhileRevalidate: SWR_TIMES.MEDIUM,
                }),
            }
        case 'static':
            return {
                'Cache-Control': buildCacheControl({
                    public: true,
                    maxAge: CACHE_TIMES.LONG,
                    staleWhileRevalidate: SWR_TIMES.LONG,
                }),
            }
        case 'dynamic':
        default:
            return {
                'Cache-Control': buildCacheControl({
                    public: true,
                    maxAge: CACHE_TIMES.VERY_SHORT,
                    staleWhileRevalidate: SWR_TIMES.SHORT,
                }),
            }
    }
}

// ============================================================================
// ETag Helpers
// ============================================================================

/**
 * Generate ETag from content
 */
export function generateETag(content: string | object): string {
    const str = typeof content === 'string' ? content : JSON.stringify(content)
    
    // Simple hash function for ETag
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32-bit integer
    }
    
    return `"${Math.abs(hash).toString(36)}"`
}

/**
 * Check if ETag matches If-None-Match header
 */
export function isETagMatch(
    etag: string,
    ifNoneMatch: string | null
): boolean {
    if (!ifNoneMatch) return false
    
    // Handle multiple ETags (comma-separated)
    const etags = ifNoneMatch.split(',').map((e) => e.trim())
    
    // Check for wildcard
    if (etags.includes('*')) return true
    
    return etags.includes(etag) || etags.includes(`W/${etag}`)
}

/**
 * Generate ETag from data and last modified timestamp
 */
export function generateETagFromData(
    data: { id: string; updatedAt?: string },
    version = 1
): string {
    const timestamp = data.updatedAt ? new Date(data.updatedAt).getTime() : Date.now()
    return `"${data.id}-${timestamp}-${version}"`
}

// ============================================================================
// Last-Modified Helpers
// ============================================================================

/**
 * Format date for Last-Modified header
 */
export function formatLastModified(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toUTCString()
}

/**
 * Check if Last-Modified matches If-Modified-Since header
 */
export function isNotModified(
    lastModified: Date | string,
    ifModifiedSince: string | null
): boolean {
    if (!ifModifiedSince) return false
    
    const lastModifiedDate = typeof lastModified === 'string' 
        ? new Date(lastModified) 
        : lastModified
    const ifModifiedSinceDate = new Date(ifModifiedSince)
    
    return lastModifiedDate <= ifModifiedSinceDate
}

// ============================================================================
// Response Cache Helpers
// ============================================================================

/**
 * Add cache headers to response
 */
export function withCacheHeaders(
    response: NextResponse,
    type: 'list' | 'detail' | 'static' | 'dynamic' = 'dynamic'
): NextResponse {
    const headers = getApiCacheHeaders(type)
    Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value)
    })
    return response
}

/**
 * Add ETag to response
 */
export function withETag(
    response: NextResponse,
    etag: string
): NextResponse {
    response.headers.set('ETag', etag)
    return response
}

/**
 * Add Last-Modified to response
 */
export function withLastModified(
    response: NextResponse,
    lastModified: Date | string
): NextResponse {
    response.headers.set('Last-Modified', formatLastModified(lastModified))
    return response
}

/**
 * Check if client has cached version and return 304 if so
 */
export function checkNotModified(
    request: Request,
    options: {
        etag?: string
        lastModified?: Date | string
    }
): NextResponse | null {
    const ifNoneMatch = request.headers.get('if-none-match')
    const ifModifiedSince = request.headers.get('if-modified-since')
    
    // Check ETag
    if (options.etag && isETagMatch(options.etag, ifNoneMatch)) {
        return new NextResponse(null, { status: 304 })
    }
    
    // Check Last-Modified
    if (options.lastModified && isNotModified(options.lastModified, ifModifiedSince)) {
        return new NextResponse(null, { status: 304 })
    }
    
    return null
}

// ============================================================================
// Cache Key Generation
// ============================================================================

/**
 * Generate cache key for API request
 */
export function generateCacheKey(
    endpoint: string,
    params: Record<string, string | number | boolean | undefined>
): string {
    const sortedParams = Object.entries(params)
        .filter(([, value]) => value !== undefined)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('&')
    
    return `${endpoint}?${sortedParams}`
}

/**
 * Generate cache key from URL
 */
export function generateCacheKeyFromUrl(url: string): string {
    const parsedUrl = new URL(url)
    const params = Object.fromEntries(parsedUrl.searchParams.entries())
    return generateCacheKey(parsedUrl.pathname, params)
}

// ============================================================================
// Revalidation Tags (for Next.js cache)
// ============================================================================

/**
 * Get revalidation tags for different content types
 */
export function getRevalidationTags(type: string, id?: string): string[] {
    const tags: string[] = [`api:${type}`]
    
    if (id) {
        tags.push(`api:${type}:${id}`)
    }
    
    return tags
}

/**
 * Get revalidation tag for posts
 */
export function getPostRevalidationTag(postId?: string): string[] {
    return getRevalidationTags('posts', postId)
}

/**
 * Get revalidation tag for categories
 */
export function getCategoryRevalidationTag(categoryId?: string): string[] {
    return getRevalidationTags('categories', categoryId)
}

/**
 * Get revalidation tag for media
 */
export function getMediaRevalidationTag(mediaId?: string): string[] {
    return getRevalidationTags('media', mediaId)
}

// ============================================================================
// Cache Statistics (for monitoring)
// ============================================================================

interface CacheStats {
    hits: number
    misses: number
    hitRate: number
}

// Simple in-memory cache stats tracking
const cacheStats: Map<string, { hits: number; misses: number }> = new Map()

/**
 * Record cache hit
 */
export function recordCacheHit(key: string): void {
    const stats = cacheStats.get(key) || { hits: 0, misses: 0 }
    stats.hits++
    cacheStats.set(key, stats)
}

/**
 * Record cache miss
 */
export function recordCacheMiss(key: string): void {
    const stats = cacheStats.get(key) || { hits: 0, misses: 0 }
    stats.misses++
    cacheStats.set(key, stats)
}

/**
 * Get cache statistics
 */
export function getCacheStats(key: string): CacheStats | null {
    const stats = cacheStats.get(key)
    if (!stats) return null
    
    const total = stats.hits + stats.misses
    return {
        hits: stats.hits,
        misses: stats.misses,
        hitRate: total > 0 ? stats.hits / total : 0,
    }
}

/**
 * Get all cache statistics
 */
export function getAllCacheStats(): Map<string, CacheStats> {
    const result = new Map<string, CacheStats>()
    
    cacheStats.forEach((stats, key) => {
        const total = stats.hits + stats.misses
        result.set(key, {
            hits: stats.hits,
            misses: stats.misses,
            hitRate: total > 0 ? stats.hits / total : 0,
        })
    })
    
    return result
}

/**
 * Reset cache statistics
 */
export function resetCacheStats(): void {
    cacheStats.clear()
}

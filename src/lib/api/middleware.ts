// src/lib/api/middleware.ts
// Rate limiting and API key validation for public REST API

import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { APIKeyInfo, RateLimitInfo } from './types'

// ============================================================================
// Constants
// ============================================================================

/** Default rate limit per minute for unauthenticated requests */
const DEFAULT_RATE_LIMIT = 100

/** Rate limit for API key holders (higher limit) */
const API_KEY_RATE_LIMIT = 1000

/** Rate limit window in seconds (1 minute) */
const RATE_LIMIT_WINDOW = 60

/** API key header name */
const API_KEY_HEADER = 'x-api-key'

// ============================================================================
// In-Memory Rate Limiting (for development/simple deployment)
// For production with multiple instances, consider using Redis or similar
// ============================================================================

interface RateLimitEntry {
    count: number
    resetAt: number
}

// Simple in-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries periodically
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now()
        for (const [key, entry] of rateLimitStore.entries()) {
            if (entry.resetAt < now) {
                rateLimitStore.delete(key)
            }
        }
    }, 60000) // Clean up every minute
}

/**
 * Get client identifier for rate limiting
 */
function getClientIdentifier(request: NextRequest): string {
    // Try to get real IP from headers (for reverse proxy setups)
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim()
    }
    
    if (realIp) {
        return realIp
    }
    
    // Fallback to a combination of headers for identification
    const userAgent = request.headers.get('user-agent') || ''
    const acceptLanguage = request.headers.get('accept-language') || ''
    
    // This is a weak identifier but better than nothing
    return `fallback-${hashString(userAgent + acceptLanguage)}`
}

/**
 * Simple string hash for creating identifiers
 */
function hashString(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36)
}

// ============================================================================
// Rate Limiting
// ============================================================================

/**
 * Check rate limit for a client
 */
export function checkRateLimit(
    identifier: string,
    limit: number = DEFAULT_RATE_LIMIT,
    windowSeconds: number = RATE_LIMIT_WINDOW
): RateLimitInfo {
    const now = Date.now()
    const windowMs = windowSeconds * 1000
    
    const entry = rateLimitStore.get(identifier)
    
    if (!entry || entry.resetAt < now) {
        // Create new entry
        const newEntry: RateLimitEntry = {
            count: 1,
            resetAt: now + windowMs,
        }
        rateLimitStore.set(identifier, newEntry)
        
        return {
            limit,
            remaining: limit - 1,
            reset: Math.floor((now + windowMs) / 1000),
        }
    }
    
    // Increment existing entry
    entry.count++
    
    return {
        limit,
        remaining: Math.max(0, limit - entry.count),
        reset: Math.floor(entry.resetAt / 1000),
    }
}

/**
 * Apply rate limiting to a request
 * Returns rate limit info or null if limit exceeded
 */
export function applyRateLimit(
    request: NextRequest,
    customLimit?: number
): { allowed: true; rateLimitInfo: RateLimitInfo } | { allowed: false; retryAfter: number } {
    const identifier = getClientIdentifier(request)
    const limit = customLimit || DEFAULT_RATE_LIMIT
    
    const rateLimitInfo = checkRateLimit(identifier, limit)
    
    if (rateLimitInfo.remaining === 0) {
        const retryAfter = rateLimitInfo.reset - Math.floor(Date.now() / 1000)
        return { allowed: false, retryAfter }
    }
    
    return { allowed: true, rateLimitInfo }
}

// ============================================================================
// API Key Validation
// ============================================================================

/**
 * Extract API key from request
 */
export function extractApiKey(request: NextRequest): string | null {
    // Check header first
    const headerKey = request.headers.get(API_KEY_HEADER)
    if (headerKey) {
        return headerKey
    }
    
    // Check Authorization header (Bearer token style)
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.slice(7)
    }
    
    // Check query parameter (less secure, but useful for some scenarios)
    const url = new URL(request.url)
    const queryKey = url.searchParams.get('api_key')
    if (queryKey) {
        return queryKey
    }
    
    return null
}

/**
 * Validate API key against database
 */
export async function validateApiKey(
    apiKey: string
): Promise<APIKeyInfo | null> {
    try {
        const supabase = await createClient()
        
        // Look up API key by prefix (first 8 characters for identification)
        const prefix = apiKey.slice(0, 8)
        
        // Query the api_keys table (assuming it exists)
        // Note: This requires an api_keys table in Supabase
        // For now, we use a type assertion since the table may not exist yet
        const { data, error } = await supabase
            .from('api_keys')
            .select('id, name, prefix, rate_limit, permissions, is_active')
            .eq('prefix', prefix)
            .eq('is_active', true)
            .single() as { data: ApiKeyRecord | null; error: unknown }
        
        if (error || !data) {
            return null
        }
        
        // In a real implementation, you would verify the full key using a hash comparison
        // For now, we'll assume the key is valid if the prefix matches
        // TODO: Implement proper key verification with hashed keys
        
        return {
            id: data.id,
            name: data.name,
            prefix: data.prefix,
            rateLimit: data.rate_limit || API_KEY_RATE_LIMIT,
            permissions: data.permissions || [],
        }
    } catch {
        // API keys table might not exist yet
        return null
    }
}

/**
 * API key record from database
 * This interface matches the expected api_keys table structure
 */
interface ApiKeyRecord {
    id: string
    name: string
    prefix: string
    rate_limit?: number
    permissions?: string[]
    is_active: boolean
}

/**
 * Get rate limit for a request, considering API key
 */
export async function getRequestRateLimit(
    request: NextRequest
): Promise<{ rateLimitInfo: RateLimitInfo; apiKey?: APIKeyInfo }> {
    const apiKeyValue = extractApiKey(request)
    
    if (apiKeyValue) {
        const apiKeyInfo = await validateApiKey(apiKeyValue)
        
        if (apiKeyInfo) {
            // Use higher rate limit for API key holders
            const identifier = `apikey:${apiKeyInfo.id}`
            const rateLimitInfo = checkRateLimit(identifier, apiKeyInfo.rateLimit)
            
            return { rateLimitInfo, apiKey: apiKeyInfo }
        }
    }
    
    // Fall back to IP-based rate limiting
    const identifier = getClientIdentifier(request)
    const rateLimitInfo = checkRateLimit(identifier, DEFAULT_RATE_LIMIT)
    
    return { rateLimitInfo }
}

// ============================================================================
// Request Validation
// ============================================================================

/**
 * Validate request method
 */
export function validateMethod(
    request: NextRequest,
    allowedMethods: string[] = ['GET', 'OPTIONS']
): { valid: true } | { valid: false; message: string } {
    const method = request.method.toUpperCase()
    
    if (!allowedMethods.includes(method)) {
        return {
            valid: false,
            message: `Method ${method} not allowed. Allowed methods: ${allowedMethods.join(', ')}`,
        }
    }
    
    return { valid: true }
}

/**
 * Validate content type for requests with body
 */
export function validateContentType(
    request: NextRequest,
    allowedTypes: string[] = ['application/json', 'application/vnd.api+json']
): { valid: true } | { valid: false; message: string } {
    const contentType = request.headers.get('content-type')
    
    if (!contentType) {
        return { valid: true } // No content type is acceptable for GET requests
    }
    
    const isAllowed = allowedTypes.some((type) =>
        contentType.toLowerCase().includes(type.toLowerCase())
    )
    
    if (!isAllowed) {
        return {
            valid: false,
            message: `Unsupported content type: ${contentType}. Allowed: ${allowedTypes.join(', ')}`,
        }
    }
    
    return { valid: true }
}

// ============================================================================
// Combined Middleware Function
// ============================================================================

export interface MiddlewareResult {
    allowed: boolean
    rateLimitInfo?: RateLimitInfo
    apiKey?: APIKeyInfo
    error?: {
        status: number
        code: string
        title: string
        detail: string
    }
    retryAfter?: number
}

/**
 * Main API middleware function
 * Handles method validation, rate limiting, and API key extraction
 */
export async function apiMiddleware(
    request: NextRequest,
    options: {
        allowedMethods?: string[]
        requireApiKey?: boolean
        customRateLimit?: number
    } = {}
): Promise<MiddlewareResult> {
    const { allowedMethods = ['GET', 'OPTIONS'], requireApiKey = false, customRateLimit } = options
    
    // Handle OPTIONS preflight
    if (request.method === 'OPTIONS') {
        return { allowed: true }
    }
    
    // Validate method
    const methodResult = validateMethod(request, allowedMethods)
    if (!methodResult.valid) {
        return {
            allowed: false,
            error: {
                status: 405,
                code: 'METHOD_NOT_ALLOWED',
                title: 'Method Not Allowed',
                detail: methodResult.message,
            },
        }
    }
    
    // Get rate limit info (with API key consideration)
    const { rateLimitInfo, apiKey } = await getRequestRateLimit(request)
    
    // Check if API key is required
    if (requireApiKey && !apiKey) {
        return {
            allowed: false,
            error: {
                status: 401,
                code: 'API_KEY_REQUIRED',
                title: 'API Key Required',
                detail: 'An API key is required to access this endpoint',
            },
        }
    }
    
    // Check rate limit
    if (rateLimitInfo.remaining === 0) {
        const retryAfter = rateLimitInfo.reset - Math.floor(Date.now() / 1000)
        return {
            allowed: false,
            retryAfter,
            error: {
                status: 429,
                code: 'RATE_LIMIT_EXCEEDED',
                title: 'Rate Limit Exceeded',
                detail: `Too many requests. Please retry after ${retryAfter} seconds.`,
            },
        }
    }
    
    return {
        allowed: true,
        rateLimitInfo,
        apiKey,
    }
}

// src/app/api/v1/site-config/route.ts
// Public API: Get public site configuration

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
    apiMiddleware,
    errorResponse,
    handleOptionsRequest,
    successResponse,
} from '@/lib/api'
import type { SiteConfigAttributes } from '@/lib/api/types'

// ============================================================================
// Types
// ============================================================================

interface SiteConfigResult {
    id: string
    site_name: string
    site_description: string | null
    site_url: string | null
    logo_url: string | null
    favicon_url: string | null
    social_facebook: string | null
    social_instagram: string | null
    social_twitter: string | null
    social_linkedin: string | null
    social_youtube: string | null
    contact_email: string | null
    contact_phone: string | null
    default_seo_title: string | null
    default_seo_description: string | null
    default_og_image_url: string | null
    updated_at: string
}

// ============================================================================
// Query Functions
// ============================================================================

/**
 * Get site configuration
 */
async function getSiteConfig(): Promise<SiteConfigResult | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .eq('id', '1')
        .single()

    if (error) {
        console.error('Error fetching site config:', error)
        // Return default config if not found
        return {
            id: '1',
            site_name: process.env.NEXT_PUBLIC_SITE_NAME || 'Empire Site',
            site_description: null,
            site_url: process.env.NEXT_PUBLIC_SITE_URL || null,
            logo_url: null,
            favicon_url: null,
            social_facebook: null,
            social_instagram: null,
            social_twitter: null,
            social_linkedin: null,
            social_youtube: null,
            contact_email: null,
            contact_phone: null,
            default_seo_title: null,
            default_seo_description: null,
            default_og_image_url: null,
            updated_at: new Date().toISOString(),
        }
    }

    return data as SiteConfigResult
}

/**
 * Transform database result to API attributes
 */
function transformToAttributes(config: SiteConfigResult): SiteConfigAttributes {
    return {
        siteName: config.site_name,
        siteDescription: config.site_description,
        siteUrl: config.site_url,
        logoUrl: config.logo_url,
        faviconUrl: config.favicon_url,
        socialLinks: {
            facebook: config.social_facebook || undefined,
            instagram: config.social_instagram || undefined,
            twitter: config.social_twitter || undefined,
            linkedin: config.social_linkedin || undefined,
            youtube: config.social_youtube || undefined,
        },
        contactEmail: config.contact_email,
        contactPhone: config.contact_phone,
        defaultSeoTitle: config.default_seo_title,
        defaultSeoDescription: config.default_seo_description,
        defaultOgImageUrl: config.default_og_image_url,
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

    // Get site config
    const config = await getSiteConfig()
    
    if (!config) {
        const response = errorResponse([{
            status: 500,
            code: 'CONFIG_NOT_FOUND',
            title: 'Configuration not found',
            detail: 'Site configuration could not be loaded',
        }])
        return withCorsHeadersResponse(response)
    }

    // Transform to API format
    const attributes = transformToAttributes(config)

    // Build response with success helper
    const response = successResponse('site-config', config.id, attributes, {
        cacheControl: 'public, max-age=3600, stale-while-revalidate=86400',
    })

    // Add CORS and rate limit headers
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key')
    
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

/**
 * Helper to add CORS headers to response
 */
function withCorsHeadersResponse(response: NextResponse): NextResponse {
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key')
    return response
}

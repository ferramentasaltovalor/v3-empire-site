// src/lib/utils/image.ts
// Image optimization helpers for Next.js Image component
// Provides consistent configuration for different image contexts

/**
 * Image configuration presets for different use cases
 * Use these with the Next.js Image component for optimal performance
 */
export const imageConfig = {
    /** Hero images - full viewport width, above the fold */
    hero: {
        sizes: '100vw',
        priority: true,
    },
    /** Blog card images - responsive grid */
    blogCard: {
        sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
        priority: false,
    },
    /** Blog post featured image */
    blogPost: {
        sizes: '(max-width: 768px) 100vw, 896px',
        priority: true,
    },
    /** Thumbnail images */
    thumbnail: {
        sizes: '(max-width: 768px) 100vw, 200px',
        priority: false,
    },
    /** Logo images */
    logo: {
        sizes: '(max-width: 768px) 150px, 200px',
        priority: true,
    },
    /** Full-width content images */
    content: {
        sizes: '(max-width: 768px) 100vw, 1200px',
        priority: false,
    },
    /** Avatar images */
    avatar: {
        sizes: '48px',
        priority: false,
    },
} as const

/**
 * Image quality presets
 */
export const imageQuality = {
    /** High quality for hero/featured images */
    high: 90,
    /** Standard quality for most images */
    standard: 75,
    /** Lower quality for thumbnails */
    low: 60,
} as const

/**
 * Default placeholder for images (blur)
 */
export const defaultPlaceholder = 'blur' as const

/**
 * Blur data URL for placeholder
 * A simple gray blur effect
 */
export const blurDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

/**
 * Get image dimensions based on aspect ratio
 */
export function getImageDimensions(
    width: number,
    aspectRatio: '16:9' | '4:3' | '1:1' | '3:4' | '21:9' = '16:9'
): { width: number; height: number } {
    const ratios: Record<string, number> = {
        '16:9': 9 / 16,
        '4:3': 3 / 4,
        '1:1': 1,
        '3:4': 4 / 3,
        '21:9': 9 / 21,
    }

    return {
        width,
        height: Math.round(width * ratios[aspectRatio]),
    }
}

/**
 * Generate srcSet for custom image implementations
 */
export function generateSrcSet(
    baseUrl: string,
    widths: number[] = [320, 640, 768, 1024, 1280, 1536]
): string {
    return widths
        .map((width) => `${baseUrl}?w=${width} ${width}w`)
        .join(', ')
}

/**
 * Type for image configuration
 */
export type ImageConfigKey = keyof typeof imageConfig
export type ImageConfig = (typeof imageConfig)[ImageConfigKey]

// src/types/posts.ts

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'archived' | 'trashed'

export interface Post {
    id: string
    title: string
    slug: string
    content: Record<string, unknown> // TipTap JSON
    content_html: string
    excerpt: string | null
    cover_image_url: string | null
    status: PostStatus
    author_id: string
    published_at: string | null
    scheduled_at: string | null
    seo_title: string | null
    seo_description: string | null
    seo_keywords: string[]
    og_image_url: string | null
    canonical_url: string | null
    noindex: boolean
    reading_time_minutes: number
    word_count: number
    ai_seo_score: number | null
    ai_seo_suggestions: Record<string, unknown> | null
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface PostCategory {
    id: string
    name: string
    slug: string
    description: string | null
    color: string | null
    parent_id: string | null
    created_at: string
}

export interface PostTag {
    id: string
    name: string
    slug: string
    created_at: string
}

export interface PostRevision {
    id: string
    post_id: string
    content: Record<string, unknown>
    author_id: string
    version_number: number
    created_at: string
}

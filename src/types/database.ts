// src/types/database.ts
// Tipos do banco de dados Supabase
// Este arquivo deve ser regenerado após alterações no schema usando:
// supabase types generate --local --lang=typescript --out-file=src/types/database-generated.ts

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            // Profiles - extends auth.users
            profiles: {
                Row: {
                    id: string
                    full_name: string | null
                    avatar_url: string | null
                    role: 'super_admin' | 'admin' | 'editor' | 'author' | 'viewer'
                    bio: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: 'super_admin' | 'admin' | 'editor' | 'author' | 'viewer'
                    bio?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: 'super_admin' | 'admin' | 'editor' | 'author' | 'viewer'
                    bio?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            // Post Categories
            post_categories: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    color: string | null
                    parent_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    color?: string | null
                    parent_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    color?: string | null
                    parent_id?: string | null
                    created_at?: string
                }
            }
            // Post Tags
            post_tags: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    created_at?: string
                }
            }
            // Posts
            posts: {
                Row: {
                    id: string
                    title: string
                    slug: string
                    content: Json
                    content_html: string | null
                    excerpt: string | null
                    cover_image_url: string | null
                    status: 'draft' | 'scheduled' | 'published' | 'archived' | 'trashed'
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
                    ai_seo_suggestions: Json | null
                    created_at: string
                    updated_at: string
                    deleted_at: string | null
                }
                Insert: {
                    id?: string
                    title: string
                    slug: string
                    content?: Json
                    content_html?: string | null
                    excerpt?: string | null
                    cover_image_url?: string | null
                    status?: 'draft' | 'scheduled' | 'published' | 'archived' | 'trashed'
                    author_id: string
                    published_at?: string | null
                    scheduled_at?: string | null
                    seo_title?: string | null
                    seo_description?: string | null
                    seo_keywords?: string[]
                    og_image_url?: string | null
                    canonical_url?: string | null
                    noindex?: boolean
                    reading_time_minutes?: number
                    word_count?: number
                    ai_seo_score?: number | null
                    ai_seo_suggestions?: Json | null
                    created_at?: string
                    updated_at?: string
                    deleted_at?: string | null
                }
                Update: {
                    id?: string
                    title?: string
                    slug?: string
                    content?: Json
                    content_html?: string | null
                    excerpt?: string | null
                    cover_image_url?: string | null
                    status?: 'draft' | 'scheduled' | 'published' | 'archived' | 'trashed'
                    author_id?: string
                    published_at?: string | null
                    scheduled_at?: string | null
                    seo_title?: string | null
                    seo_description?: string | null
                    seo_keywords?: string[]
                    og_image_url?: string | null
                    canonical_url?: string | null
                    noindex?: boolean
                    reading_time_minutes?: number
                    word_count?: number
                    ai_seo_score?: number | null
                    ai_seo_suggestions?: Json | null
                    created_at?: string
                    updated_at?: string
                    deleted_at?: string | null
                }
            }
            // Posts Categories (pivot)
            posts_categories: {
                Row: {
                    post_id: string
                    category_id: string
                }
                Insert: {
                    post_id: string
                    category_id: string
                }
                Update: {
                    post_id?: string
                    category_id?: string
                }
            }
            // Posts Tags (pivot)
            posts_tags: {
                Row: {
                    post_id: string
                    tag_id: string
                }
                Insert: {
                    post_id: string
                    tag_id: string
                }
                Update: {
                    post_id?: string
                    tag_id?: string
                }
            }
            // Post Revisions
            post_revisions: {
                Row: {
                    id: string
                    post_id: string
                    content: Json
                    author_id: string
                    version_number: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    post_id: string
                    content: Json
                    author_id: string
                    version_number: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    post_id?: string
                    content?: Json
                    author_id?: string
                    version_number?: number
                    created_at?: string
                }
            }
            // Media Folders
            media_folders: {
                Row: {
                    id: string
                    name: string
                    parent_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    parent_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    parent_id?: string | null
                    created_at?: string
                }
            }
            // Media Items
            media_items: {
                Row: {
                    id: string
                    filename: string
                    original_filename: string
                    mime_type: string
                    size_bytes: number
                    width: number | null
                    height: number | null
                    folder_id: string | null
                    storage_path: string
                    public_url: string
                    alt_text: string | null
                    title: string | null
                    description: string | null
                    uploaded_by: string
                    created_at: string
                    deleted_at: string | null
                }
                Insert: {
                    id?: string
                    filename: string
                    original_filename: string
                    mime_type: string
                    size_bytes: number
                    width?: number | null
                    height?: number | null
                    folder_id?: string | null
                    storage_path: string
                    public_url: string
                    alt_text?: string | null
                    title?: string | null
                    description?: string | null
                    uploaded_by: string
                    created_at?: string
                    deleted_at?: string | null
                }
                Update: {
                    id?: string
                    filename?: string
                    original_filename?: string
                    mime_type?: string
                    size_bytes?: number
                    width?: number | null
                    height?: number | null
                    folder_id?: string | null
                    storage_path?: string
                    public_url?: string
                    alt_text?: string | null
                    title?: string | null
                    description?: string | null
                    uploaded_by?: string
                    created_at?: string
                    deleted_at?: string | null
                }
            }
            // Landing Pages
            landing_pages: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    status: 'draft' | 'published'
                    sections: Json
                    seo_title: string | null
                    seo_description: string | null
                    og_image_url: string | null
                    custom_analytics_id: string | null
                    webhook_id: string | null
                    created_by: string
                    published_at: string | null
                    created_at: string
                    updated_at: string
                    deleted_at: string | null
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    status?: 'draft' | 'published'
                    sections?: Json
                    seo_title?: string | null
                    seo_description?: string | null
                    og_image_url?: string | null
                    custom_analytics_id?: string | null
                    webhook_id?: string | null
                    created_by: string
                    published_at?: string | null
                    created_at?: string
                    updated_at?: string
                    deleted_at?: string | null
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    status?: 'draft' | 'published'
                    sections?: Json
                    seo_title?: string | null
                    seo_description?: string | null
                    og_image_url?: string | null
                    custom_analytics_id?: string | null
                    webhook_id?: string | null
                    created_by?: string
                    published_at?: string | null
                    created_at?: string
                    updated_at?: string
                    deleted_at?: string | null
                }
            }
            // Analytics Configs
            analytics_configs: {
                Row: {
                    id: string
                    name: string
                    type: 'ga4' | 'gtm' | 'pixel' | 'hotjar' | 'clarity' | 'custom'
                    tracking_id: string | null
                    custom_html: string | null
                    active: boolean
                    apply_to: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    type: 'ga4' | 'gtm' | 'pixel' | 'hotjar' | 'clarity' | 'custom'
                    tracking_id?: string | null
                    custom_html?: string | null
                    active?: boolean
                    apply_to?: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    type?: 'ga4' | 'gtm' | 'pixel' | 'hotjar' | 'clarity' | 'custom'
                    tracking_id?: string | null
                    custom_html?: string | null
                    active?: boolean
                    apply_to?: Json
                    created_at?: string
                }
            }
            // Webhook Configs
            webhook_configs: {
                Row: {
                    id: string
                    name: string
                    url: string
                    events: string[]
                    headers: Json
                    secret: string | null
                    active: boolean
                    last_triggered_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    url: string
                    events?: string[]
                    headers?: Json
                    secret?: string | null
                    active?: boolean
                    last_triggered_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    url?: string
                    events?: string[]
                    headers?: Json
                    secret?: string | null
                    active?: boolean
                    last_triggered_at?: string | null
                    created_at?: string
                }
            }
            // Webhook Logs
            webhook_logs: {
                Row: {
                    id: string
                    webhook_id: string
                    event: string
                    payload: Json
                    status_code: number | null
                    response_body: string | null
                    attempts: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    webhook_id: string
                    event: string
                    payload: Json
                    status_code?: number | null
                    response_body?: string | null
                    attempts?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    webhook_id?: string
                    event?: string
                    payload?: Json
                    status_code?: number | null
                    response_body?: string | null
                    attempts?: number
                    created_at?: string
                }
            }
            // API Keys
            api_keys: {
                Row: {
                    id: string
                    name: string
                    key_hash: string
                    scopes: string[]
                    last_used_at: string | null
                    expires_at: string | null
                    created_by: string
                    revoked_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    key_hash: string
                    scopes?: string[]
                    last_used_at?: string | null
                    expires_at?: string | null
                    created_by: string
                    revoked_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    key_hash?: string
                    scopes?: string[]
                    last_used_at?: string | null
                    expires_at?: string | null
                    created_by?: string
                    revoked_at?: string | null
                    created_at?: string
                }
            }
            // AI Generation Logs
            ai_generation_logs: {
                Row: {
                    id: string
                    model: string
                    prompt: string
                    input_tokens: number | null
                    output_tokens: number | null
                    source_type: 'manual' | 'instagram' | 'youtube' | null
                    source_url: string | null
                    post_id: string | null
                    created_by: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    model: string
                    prompt: string
                    input_tokens?: number | null
                    output_tokens?: number | null
                    source_type?: 'manual' | 'instagram' | 'youtube' | null
                    source_url?: string | null
                    post_id?: string | null
                    created_by: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    model?: string
                    prompt?: string
                    input_tokens?: number | null
                    output_tokens?: number | null
                    source_type?: 'manual' | 'instagram' | 'youtube' | null
                    source_url?: string | null
                    post_id?: string | null
                    created_by?: string
                    created_at?: string
                }
            }
            // Site Settings
            site_settings: {
                Row: {
                    key: string
                    value: Json
                    updated_by: string | null
                    updated_at: string
                }
                Insert: {
                    key: string
                    value: Json
                    updated_by?: string | null
                    updated_at?: string
                }
                Update: {
                    key?: string
                    value?: Json
                    updated_by?: string | null
                    updated_at?: string
                }
            }
        }
        Views: Record<string, never>
        Functions: {
            handle_updated_at: {
                Args: Record<string, never>
                Returns: void
            }
            handle_new_user: {
                Args: Record<string, never>
                Returns: void
            }
            is_editor: {
                Args: Record<string, never>
                Returns: boolean
            }
            is_author_or_editor: {
                Args: {
                    post_author_id: string
                }
                Returns: boolean
            }
            get_user_role: {
                Args: Record<string, never>
                Returns: string
            }
            has_role: {
                Args: {
                    required_role: string
                }
                Returns: boolean
            }
        }
        Enums: {
            user_role: 'super_admin' | 'admin' | 'editor' | 'author' | 'viewer'
            post_status: 'draft' | 'scheduled' | 'published' | 'archived' | 'trashed'
            landing_page_status: 'draft' | 'published'
            analytics_type: 'ga4' | 'gtm' | 'pixel' | 'hotjar' | 'clarity' | 'custom'
            ai_source_type: 'manual' | 'instagram' | 'youtube'
        }
    }
    storage: {
        Tables: {
            buckets: {
                Row: {
                    id: string
                    name: string
                    owner: string | null
                    created_at: string | null
                    updated_at: string | null
                    public: boolean | null
                    file_size_limit: number | null
                    allowed_mime_types: string[] | null
                    owner_id: string | null
                }
                Insert: {
                    id?: string
                    name: string
                    owner?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                    public?: boolean | null
                    file_size_limit?: number | null
                    allowed_mime_types?: string[] | null
                    owner_id?: string | null
                }
                Update: {
                    id?: string
                    name?: string
                    owner?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                    public?: boolean | null
                    file_size_limit?: number | null
                    allowed_mime_types?: string[] | null
                    owner_id?: string | null
                }
            }
            objects: {
                Row: {
                    id: string
                    bucket_id: string | null
                    name: string | null
                    owner: string | null
                    created_at: string | null
                    updated_at: string | null
                    last_accessed_at: string | null
                    metadata: Json | null
                    owner_id: string | null
                }
                Insert: {
                    id?: string
                    bucket_id?: string | null
                    name?: string | null
                    owner?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                    last_accessed_at?: string | null
                    metadata?: Json | null
                    owner_id?: string | null
                }
                Update: {
                    id?: string
                    bucket_id?: string | null
                    name?: string | null
                    owner?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                    last_accessed_at?: string | null
                    metadata?: Json | null
                    owner_id?: string | null
                }
            }
        }
        Views: Record<string, never>
        Functions: Record<string, never>
        Enums: Record<string, never>
    }
}

// Convenience type exports
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type PostCategory = Database['public']['Tables']['post_categories']['Row']
export type PostTag = Database['public']['Tables']['post_tags']['Row']
export type PostRevision = Database['public']['Tables']['post_revisions']['Row']
export type MediaFolder = Database['public']['Tables']['media_folders']['Row']
export type MediaItem = Database['public']['Tables']['media_items']['Row']
export type LandingPage = Database['public']['Tables']['landing_pages']['Row']
export type AnalyticsConfig = Database['public']['Tables']['analytics_configs']['Row']
export type WebhookConfig = Database['public']['Tables']['webhook_configs']['Row']
export type WebhookLog = Database['public']['Tables']['webhook_logs']['Row']
export type ApiKey = Database['public']['Tables']['api_keys']['Row']
export type AiGenerationLog = Database['public']['Tables']['ai_generation_logs']['Row']
export type SiteSetting = Database['public']['Tables']['site_settings']['Row']

// Enums
export type UserRole = Database['public']['Enums']['user_role']
export type PostStatus = Database['public']['Enums']['post_status']
export type LandingPageStatus = Database['public']['Enums']['landing_page_status']
export type AnalyticsType = Database['public']['Enums']['analytics_type']
export type AiSourceType = Database['public']['Enums']['ai_source_type']

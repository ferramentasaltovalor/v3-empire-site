// Post data access layer
// Server-side data functions for post management

import { createClient } from '@/lib/supabase/server'
import type { PostStatus, Post, PostCategory, PostTag } from '@/types/database'

export interface PostWithAuthor extends Post {
    profiles?: {
        id: string
        full_name: string | null
        avatar_url: string | null
    } | null
    posts_categories?: {
        post_categories: {
            id: string
            name: string
            slug: string
        }
    }[]
}

export interface PostWithDetails extends Post {
    profiles?: {
        id: string
        full_name: string | null
        avatar_url: string | null
    } | null
    posts_categories?: {
        post_categories: {
            id: string
            name: string
            slug: string
        }
    }[]
    posts_tags?: {
        post_tags: {
            id: string
            name: string
            slug: string
        }
    }[]
}

export interface GetPostsOptions {
    status?: PostStatus
    search?: string
    limit?: number
    offset?: number
    orderBy?: string
    orderDirection?: 'asc' | 'desc'
}

export interface GetPostsResult {
    posts: PostWithAuthor[]
    total: number
}

/**
 * Get posts with optional filtering and pagination
 */
export async function getPosts(options?: GetPostsOptions): Promise<GetPostsResult> {
    const supabase = await createClient()

    let query = supabase
        .from('posts')
        .select(`
            id,
            title,
            slug,
            excerpt,
            status,
            cover_image_url,
            published_at,
            scheduled_at,
            created_at,
            updated_at,
            profiles!posts_author_id_fkey (
                id,
                full_name,
                avatar_url
            ),
            posts_categories (
                post_categories (
                    id,
                    name,
                    slug
                )
            )
        `, { count: 'exact' })
        .is('deleted_at', null)

    if (options?.status) {
        query = query.eq('status', options.status)
    }

    if (options?.search) {
        query = query.or(`title.ilike.%${options.search}%,excerpt.ilike.%${options.search}%`)
    }

    if (options?.orderBy) {
        query = query.order(options.orderBy, { ascending: options.orderDirection !== 'desc' })
    } else {
        query = query.order('updated_at', { ascending: false })
    }

    if (options?.limit) {
        query = query.limit(options.limit)
    }

    if (options?.offset && options?.limit) {
        query = query.range(options.offset, options.offset + options.limit - 1)
    }

    const { data, error, count } = await query

    if (error) {
        console.error('Error fetching posts:', error)
        return { posts: [], total: 0 }
    }

    return { posts: (data || []) as PostWithAuthor[], total: count || 0 }
}

/**
 * Get a single post by ID with all related data
 */
export async function getPostById(id: string): Promise<PostWithDetails | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            profiles!posts_author_id_fkey (
                id,
                full_name,
                avatar_url
            ),
            posts_categories (
                post_categories (
                    id,
                    name,
                    slug
                )
            ),
            posts_tags (
                post_tags (
                    id,
                    name,
                    slug
                )
            )
        `)
        .eq('id', id)
        .is('deleted_at', null)
        .single()

    if (error) {
        console.error('Error fetching post:', error)
        return null
    }

    return data as PostWithDetails
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<PostWithDetails | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            profiles!posts_author_id_fkey (
                id,
                full_name,
                avatar_url
            ),
            posts_categories (
                post_categories (
                    id,
                    name,
                    slug
                )
            ),
            posts_tags (
                post_tags (
                    id,
                    name,
                    slug
                )
            )
        `)
        .eq('slug', slug)
        .is('deleted_at', null)
        .single()

    if (error) {
        console.error('Error fetching post by slug:', error)
        return null
    }

    return data as PostWithDetails
}

/**
 * Create a new post
 */
export async function createPost(data: {
    title: string
    slug: string
    author_id: string
    status?: PostStatus
}): Promise<Post | null> {
    const supabase = await createClient()

    const { data: post, error } = await supabase
        .from('posts')
        .insert({
            title: data.title,
            slug: data.slug,
            author_id: data.author_id,
            status: data.status || 'draft',
            content: {},
        } as never)
        .select()
        .single()

    if (error) {
        console.error('Error creating post:', error)
        return null
    }

    return post as Post
}

/**
 * Update an existing post
 */
export async function updatePost(id: string, data: Partial<Post>): Promise<Post | null> {
    const supabase = await createClient()

    const { data: post, error } = await supabase
        .from('posts')
        .update({
            ...data,
            updated_at: new Date().toISOString(),
        } as never)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating post:', error)
        return null
    }

    return post as Post
}

/**
 * Soft delete a post (move to trash)
 */
export async function deletePost(id: string): Promise<boolean> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('posts')
        .update({ deleted_at: new Date().toISOString() } as never)
        .eq('id', id)

    if (error) {
        console.error('Error deleting post:', error)
        return false
    }

    return true
}

/**
 * Permanently delete a post (hard delete)
 */
export async function permanentlyDeletePost(id: string): Promise<boolean> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error permanently deleting post:', error)
        return false
    }

    return true
}

/**
 * Restore a soft-deleted post
 */
export async function restorePost(id: string): Promise<boolean> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('posts')
        .update({ deleted_at: null } as never)
        .eq('id', id)

    if (error) {
        console.error('Error restoring post:', error)
        return false
    }

    return true
}

/**
 * Get all post categories
 */
export async function getCategories(): Promise<PostCategory[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('post_categories')
        .select('id, name, slug, description, color, parent_id, created_at')
        .order('name')

    if (error) {
        console.error('Error fetching categories:', error)
        return []
    }

    return data || []
}

/**
 * Get all post tags
 */
export async function getTags(): Promise<PostTag[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('post_tags')
        .select('id, name, slug, created_at')
        .order('name')

    if (error) {
        console.error('Error fetching tags:', error)
        return []
    }

    return data || []
}

/**
 * Update post categories
 */
export async function updatePostCategories(postId: string, categoryIds: string[]): Promise<boolean> {
    const supabase = await createClient()

    // First, delete existing categories
    const { error: deleteError } = await supabase
        .from('posts_categories')
        .delete()
        .eq('post_id', postId)

    if (deleteError) {
        console.error('Error deleting post categories:', deleteError)
        return false
    }

    // Then, insert new categories
    if (categoryIds.length > 0) {
        const { error: insertError } = await supabase
            .from('posts_categories')
            .insert(
                categoryIds.map(categoryId => ({
                    post_id: postId,
                    category_id: categoryId,
                })) as never[]
            )

        if (insertError) {
            console.error('Error inserting post categories:', insertError)
            return false
        }
    }

    return true
}

/**
 * Update post tags
 */
export async function updatePostTags(postId: string, tagIds: string[]): Promise<boolean> {
    const supabase = await createClient()

    // First, delete existing tags
    const { error: deleteError } = await supabase
        .from('posts_tags')
        .delete()
        .eq('post_id', postId)

    if (deleteError) {
        console.error('Error deleting post tags:', deleteError)
        return false
    }

    // Then, insert new tags
    if (tagIds.length > 0) {
        const { error: insertError } = await supabase
            .from('posts_tags')
            .insert(
                tagIds.map(tagId => ({
                    post_id: postId,
                    tag_id: tagId,
                })) as never[]
            )

        if (insertError) {
            console.error('Error inserting post tags:', insertError)
            return false
        }
    }

    return true
}

/**
 * Publish a post
 */
export async function publishPost(id: string): Promise<Post | null> {
    return updatePost(id, {
        status: 'published',
        published_at: new Date().toISOString(),
    })
}

/**
 * Schedule a post for future publishing
 */
export async function schedulePost(id: string, scheduledAt: Date): Promise<Post | null> {
    return updatePost(id, {
        status: 'scheduled',
        scheduled_at: scheduledAt.toISOString(),
    })
}

/**
 * Unpublish a post (return to draft)
 */
export async function unpublishPost(id: string): Promise<Post | null> {
    return updatePost(id, {
        status: 'draft',
    })
}

/**
 * Archive a post
 */
export async function archivePost(id: string): Promise<Post | null> {
    return updatePost(id, {
        status: 'archived',
    })
}

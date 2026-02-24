'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
    createPost,
    updatePost,
    deletePost,
    updatePostCategories,
    updatePostTags,
    publishPost,
    schedulePost,
    unpublishPost,
    archivePost,
    getPostById,
} from '@/lib/admin/posts'
import { getUserProfile } from '@/lib/auth'
import { slugify } from '@/lib/utils/slugify'
import { postEvents } from '@/lib/webhooks'
import type { PostStatus } from '@/types/database'

export interface ActionResult {
    success?: boolean
    error?: string
    post?: {
        id: string
        title: string
        slug: string
    }
}

/**
 * Create a new post - used with form action
 * Note: redirect() throws NEXT_REDIRECT which is handled by Next.js
 */
export async function createPostAction(formData: FormData): Promise<void> {
    const profile = await getUserProfile()
    if (!profile) {
        redirect('/admin/login')
    }

    const title = formData.get('title') as string

    if (!title || title.trim().length === 0) {
        // In a real app, you'd handle this with form state
        throw new Error('Título é obrigatório')
    }

    const baseSlug = slugify(title)
    const slug = await generateUniqueSlug(baseSlug)

    const post = await createPost({
        title: title.trim(),
        slug,
        author_id: profile.id,
        status: 'draft',
    })

    if (post) {
        revalidatePath('/admin/posts')
        redirect(`/admin/posts/${post.id}`)
    }

    throw new Error('Erro ao criar post')
}

/**
 * Update an existing post
 */
export async function updatePostAction(id: string, formData: FormData): Promise<ActionResult> {
    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const excerpt = formData.get('excerpt') as string
    const status = formData.get('status') as PostStatus | null
    const seoTitle = formData.get('seo_title') as string | null
    const seoDescription = formData.get('seo_description') as string | null
    const canonicalUrl = formData.get('canonical_url') as string | null
    const noindex = formData.get('noindex') === 'true'
    const contentString = formData.get('content') as string | null

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {}

    if (title !== null && title !== undefined) {
        updateData.title = title.trim()
    }

    if (slug !== null && slug !== undefined) {
        updateData.slug = slug.trim()
    }

    if (excerpt !== null && excerpt !== undefined) {
        updateData.excerpt = excerpt.trim() || null
    }

    // Handle TipTap content as JSONB
    if (contentString) {
        try {
            updateData.content = JSON.parse(contentString)
        } catch {
            // Invalid JSON, skip content update
        }
    }

    if (status) {
        updateData.status = status

        // If publishing, set published_at
        if (status === 'published') {
            updateData.published_at = new Date().toISOString()
        }
    }

    if (seoTitle !== null) {
        updateData.seo_title = seoTitle?.trim() || null
    }

    if (seoDescription !== null) {
        updateData.seo_description = seoDescription?.trim() || null
    }

    if (canonicalUrl !== null) {
        updateData.canonical_url = canonicalUrl?.trim() || null
    }

    updateData.noindex = noindex

    const post = await updatePost(id, updateData)

    // Update categories if provided (from checkboxes)
    const categoriesEntry = formData.getAll('categories')
    if (categoriesEntry.length > 0) {
        await updatePostCategories(id, categoriesEntry as string[])
    }

    // Update tags if provided (from checkboxes)
    const tagsEntry = formData.getAll('tags')
    if (tagsEntry.length > 0) {
        await updatePostTags(id, tagsEntry as string[])
    }

    if (post) {
        revalidatePath('/admin/posts')
        revalidatePath(`/admin/posts/${id}`)
        revalidatePath('/blog')
        revalidatePath(`/blog/${post.slug}`)
        return { success: true, post: { id: post.id, title: post.title, slug: post.slug } }
    }

    return { error: 'Erro ao atualizar post' }
}

/**
 * Delete a post (soft delete)
 */
export async function deletePostAction(id: string): Promise<ActionResult> {
    // Get post data before deletion for webhook
    const postBeforeDelete = await getPostById(id)
    
    const success = await deletePost(id)

    if (success) {
        // Trigger webhook
        if (postBeforeDelete) {
            await postEvents.deleted({
                id: postBeforeDelete.id,
                title: postBeforeDelete.title,
                slug: postBeforeDelete.slug,
            })
        }
        
        revalidatePath('/admin/posts')
        revalidatePath('/blog')
        return { success: true }
    }

    return { error: 'Erro ao excluir post' }
}

/**
 * Publish a post immediately
 */
export async function publishPostAction(id: string): Promise<ActionResult> {
    const post = await publishPost(id)

    if (post) {
        // Trigger webhook
        await postEvents.published({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || undefined,
            author_id: post.author_id || undefined,
            published_at: post.published_at || new Date().toISOString(),
        })
        
        revalidatePath('/admin/posts')
        revalidatePath(`/admin/posts/${id}`)
        revalidatePath('/blog')
        revalidatePath(`/blog/${post.slug}`)
        return { success: true, post: { id: post.id, title: post.title, slug: post.slug } }
    }

    return { error: 'Erro ao publicar post' }
}

/**
 * Schedule a post for future publishing
 */
export async function schedulePostAction(id: string, scheduledAt: Date): Promise<ActionResult> {
    const post = await schedulePost(id, scheduledAt)

    if (post) {
        revalidatePath('/admin/posts')
        revalidatePath(`/admin/posts/${id}`)
        return { success: true, post: { id: post.id, title: post.title, slug: post.slug } }
    }

    return { error: 'Erro ao agendar post' }
}

/**
 * Unpublish a post (return to draft)
 */
export async function unpublishPostAction(id: string): Promise<ActionResult> {
    const post = await unpublishPost(id)

    if (post) {
        revalidatePath('/admin/posts')
        revalidatePath(`/admin/posts/${id}`)
        revalidatePath('/blog')
        return { success: true, post: { id: post.id, title: post.title, slug: post.slug } }
    }

    return { error: 'Erro ao despublicar post' }
}

/**
 * Archive a post
 */
export async function archivePostAction(id: string): Promise<ActionResult> {
    const post = await archivePost(id)

    if (post) {
        revalidatePath('/admin/posts')
        revalidatePath(`/admin/posts/${id}`)
        revalidatePath('/blog')
        return { success: true, post: { id: post.id, title: post.title, slug: post.slug } }
    }

    return { error: 'Erro ao arquivar post' }
}

/**
 * Update post content (for TipTap editor)
 */
export async function updatePostContentAction(
    id: string,
    content: Record<string, unknown>,
    contentHtml?: string
): Promise<ActionResult> {
    const updateData: Record<string, unknown> = {
        content,
    }

    if (contentHtml) {
        updateData.content_html = contentHtml
    }

    const post = await updatePost(id, updateData)

    if (post) {
        // Don't revalidate on every content save - too frequent
        return { success: true, post: { id: post.id, title: post.title, slug: post.slug } }
    }

    return { error: 'Erro ao salvar conteúdo' }
}

/**
 * Generate a unique slug
 */
async function generateUniqueSlug(baseSlug: string): Promise<string> {
    const { getPosts } = await import('@/lib/admin/posts')
    const { posts } = await getPosts({ limit: 1000 })

    const existingSlugs = posts.map(p => p.slug)

    if (!existingSlugs.includes(baseSlug)) {
        return baseSlug
    }

    let counter = 1
    while (existingSlugs.includes(`${baseSlug}-${counter}`)) {
        counter++
    }

    return `${baseSlug}-${counter}`
}

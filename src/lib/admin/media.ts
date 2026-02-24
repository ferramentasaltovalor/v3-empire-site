// src/lib/admin/media.ts
// Media data access layer for Supabase Storage and database operations

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

type MediaItem = Database['public']['Tables']['media_items']['Row']
type MediaFolder = Database['public']['Tables']['media_folders']['Row']

export async function getMediaItems(options?: {
    folderId?: string | null
    search?: string
    mimeType?: string
    limit?: number
    offset?: number
}) {
    const supabase = await createClient()

    let query = supabase
        .from('media_items')
        .select('*', { count: 'exact' })
        .is('deleted_at', null)

    if (options?.folderId) {
        query = query.eq('folder_id', options.folderId)
    } else if (options?.folderId === null) {
        query = query.is('folder_id', null)
    }

    if (options?.search) {
        query = query.or(`filename.ilike.%${options.search}%,alt_text.ilike.%${options.search}%`)
    }

    if (options?.mimeType) {
        query = query.like('mime_type', `${options.mimeType}%`)
    }

    if (options?.limit) {
        query = query.limit(options.limit)
    }

    if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 50) - 1)
    }

    query = query.order('created_at', { ascending: false })

    const { data, error, count } = await query

    if (error) {
        console.error('Error fetching media items:', error)
        return { items: [], total: 0 }
    }

    return { items: data || [], total: count || 0 }
}

export async function getMediaItem(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .single()

    if (error) {
        console.error('Error fetching media item:', error)
        return null
    }

    return data
}

export async function getMediaFolders(parentId?: string | null) {
    const supabase = await createClient()

    let query = supabase
        .from('media_folders')
        .select('*')

    if (parentId) {
        query = query.eq('parent_id', parentId)
    } else {
        query = query.is('parent_id', null)
    }

    const { data, error } = await query.order('name')

    if (error) {
        console.error('Error fetching media folders:', error)
        return []
    }

    return data || []
}

export async function getAllMediaFolders() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('media_folders')
        .select('*')
        .order('name')

    if (error) {
        console.error('Error fetching all media folders:', error)
        return []
    }

    return data || []
}

export async function createMediaFolder(name: string, parentId?: string) {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
        .from('media_folders')
        .insert({
            name,
            parent_id: parentId || null,
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating folder:', error)
        return null
    }

    return data as MediaFolder
}

export async function updateMediaItem(id: string, updateData: Partial<MediaItem>) {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: item, error } = await (supabase as any)
        .from('media_items')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating media item:', error)
        return null
    }

    return item as MediaItem
}

export async function deleteMediaItem(id: string) {
    const supabase = await createClient()

    // Soft delete in database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: dbError } = await (supabase as any)
        .from('media_items')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

    if (dbError) {
        console.error('Error deleting media item:', dbError)
        return false
    }

    return true
}

export async function uploadFile(
    file: File,
    folderId?: string,
    onProgress?: (progress: number) => void
): Promise<MediaItem | null> {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // Generate unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(7)
    const ext = file.name.split('.').pop()
    const filename = `${timestamp}-${randomStr}.${ext}`

    // Build storage path
    let storagePath = filename
    if (folderId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: folder } = await (supabase as any)
            .from('media_folders')
            .select('name')
            .eq('id', folderId)
            .single()
        if (folder && folder.name) {
            storagePath = `${folder.name}/${filename}`
        }
    }

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('media')
        .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: false,
        })

    if (uploadError) {
        console.error('Error uploading file:', uploadError)
        return null
    }

    // Get public URL
    const { data: { publicUrl } } = supabase
        .storage
        .from('media')
        .getPublicUrl(uploadData.path)

    // Create database record
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: item, error: dbError } = await (supabase as any)
        .from('media_items')
        .insert({
            filename,
            original_filename: file.name,
            mime_type: file.type,
            size_bytes: file.size,
            width: null,
            height: null,
            folder_id: folderId || null,
            storage_path: uploadData.path,
            public_url: publicUrl,
            uploaded_by: user.id,
        })
        .select()
        .single()

    if (dbError) {
        console.error('Error creating media item:', dbError)
        // Try to clean up uploaded file
        await supabase.storage.from('media').remove([uploadData.path])
        return null
    }

    return item as MediaItem
}

export async function deleteFromStorage(storagePath: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .storage
        .from('media')
        .remove([storagePath])

    if (error) {
        console.error('Error deleting from storage:', error)
        return false
    }

    return true
}

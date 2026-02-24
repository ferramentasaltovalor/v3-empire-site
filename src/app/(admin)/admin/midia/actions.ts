'use server'

// src/app/(admin)/admin/midia/actions.ts
// Server actions for media management

import { revalidatePath } from 'next/cache'
import {
    uploadFile,
    updateMediaItem,
    deleteMediaItem,
    createMediaFolder
} from '@/lib/admin/media'
import type { Database } from '@/types/database'

type MediaItem = Database['public']['Tables']['media_items']['Row']

export async function uploadMediaAction(formData: FormData): Promise<{
    success?: boolean
    error?: string
    item?: MediaItem
}> {
    const file = formData.get('file') as File | null
    const folderId = formData.get('folderId') as string | null

    if (!file || file.size === 0) {
        return { error: 'Nenhum arquivo selecionado' }
    }

    const item = await uploadFile(file, folderId || undefined)

    if (item) {
        revalidatePath('/admin/midia')
        return { success: true, item }
    }

    return { error: 'Erro ao fazer upload do arquivo' }
}

export async function updateMediaAction(id: string, data: {
    alt_text?: string
    title?: string
    description?: string
}): Promise<{
    success?: boolean
    error?: string
    item?: MediaItem
}> {
    const item = await updateMediaItem(id, data)

    if (item) {
        revalidatePath('/admin/midia')
        return { success: true, item }
    }

    return { error: 'Erro ao atualizar arquivo' }
}

export async function deleteMediaAction(id: string): Promise<{
    success?: boolean
    error?: string
}> {
    const success = await deleteMediaItem(id)

    if (success) {
        revalidatePath('/admin/midia')
        return { success: true }
    }

    return { error: 'Erro ao excluir arquivo' }
}

export async function createFolderAction(name: string, parentId?: string): Promise<{
    success?: boolean
    error?: string
    folder?: Database['public']['Tables']['media_folders']['Row']
}> {
    if (!name || name.trim() === '') {
        return { error: 'Nome da pasta é obrigatório' }
    }

    const folder = await createMediaFolder(name.trim(), parentId)

    if (folder) {
        revalidatePath('/admin/midia')
        return { success: true, folder }
    }

    return { error: 'Erro ao criar pasta' }
}

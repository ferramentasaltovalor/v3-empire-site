'use client'

// src/components/admin/media/MediaSidebar.tsx
// Sidebar panel showing selected media item details

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDate, formatBytes } from '@/lib/utils/format'
import { updateMediaAction } from '@/app/(admin)/admin/midia/actions'
import { adminContent } from '@/content/admin'
import { X, ExternalLink, Trash2, Save, Image as ImageIcon, File, FileText, FileVideo, FileAudio } from 'lucide-react'
import type { Database } from '@/types/database'

type MediaItem = Database['public']['Tables']['media_items']['Row']

interface MediaSidebarProps {
    item: MediaItem
    onClose: () => void
    onDelete: () => void
}

export function MediaSidebar({ item, onClose, onDelete }: MediaSidebarProps) {
    const [altText, setAltText] = useState(item.alt_text || '')
    const [title, setTitle] = useState(item.title || '')
    const [description, setDescription] = useState(item.description || '')
    const [isSaving, setIsSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        const result = await updateMediaAction(item.id, {
            alt_text: altText || undefined,
            title: title || undefined,
            description: description || undefined,
        })
        setIsSaving(false)
        if (result.success) {
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
        }
    }

    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith('image/')) return ImageIcon
        if (mimeType.startsWith('video/')) return FileVideo
        if (mimeType.startsWith('audio/')) return FileAudio
        if (mimeType.includes('pdf') || mimeType.includes('document')) return FileText
        return File
    }

    const Icon = getFileIcon(item.mime_type)

    return (
        <div className="w-80 flex-shrink-0 bg-admin-surface rounded-lg border border-admin-border overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-admin-border">
                <h3 className="font-medium text-admin-text">Detalhes</h3>
                <button
                    onClick={onClose}
                    className="p-1 text-admin-muted hover:text-admin-text transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Preview */}
            <div className="p-4 border-b border-admin-border">
                <div className="aspect-video bg-white rounded border border-admin-border overflow-hidden flex items-center justify-center">
                    {item.mime_type.startsWith('image/') ? (
                        <img
                            src={item.public_url}
                            alt={item.alt_text || ''}
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <Icon className="w-12 h-12 text-admin-muted" />
                    )}
                </div>
            </div>

            {/* Form */}
            <div className="p-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-admin-text mb-1">
                        Texto Alternativo
                    </label>
                    <Input
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                        placeholder="Descrição da imagem para SEO"
                        className="bg-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-admin-text mb-1">
                        Título
                    </label>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Título do arquivo"
                        className="bg-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-admin-text mb-1">
                        Descrição
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descrição detalhada"
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-admin-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent"
                    />
                </div>

                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full bg-admin-accent hover:bg-admin-accent/90 text-white"
                >
                    {isSaving ? (
                        'Salvando...'
                    ) : saved ? (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Salvo!
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Salvar alterações
                        </>
                    )}
                </Button>
            </div>

            {/* Meta Info */}
            <div className="p-4 border-t border-admin-border space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-admin-muted">Nome original</span>
                    <span className="text-admin-text truncate max-w-[160px]" title={item.original_filename}>
                        {item.original_filename}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-admin-muted">Tipo</span>
                    <span className="text-admin-text">{item.mime_type}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-admin-muted">Tamanho</span>
                    <span className="text-admin-text">{formatBytes(item.size_bytes)}</span>
                </div>
                {item.width && item.height && (
                    <div className="flex justify-between">
                        <span className="text-admin-muted">Dimensões</span>
                        <span className="text-admin-text">{item.width} × {item.height}</span>
                    </div>
                )}
                <div className="flex justify-between">
                    <span className="text-admin-muted">Enviado em</span>
                    <span className="text-admin-text">{formatDate(item.created_at)}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-admin-border flex gap-2">
                <a
                    href={item.public_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                >
                    <Button variant="secondary" className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Abrir
                    </Button>
                </a>
                <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={onDelete}
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                </Button>
            </div>
        </div>
    )
}

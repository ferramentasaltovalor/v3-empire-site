'use client'

// src/components/admin/media/MediaGrid.tsx
// Grid/List view component for media items

import { formatDate, formatBytes } from '@/lib/utils/format'
import { Image, File, FileText, FileVideo, FileAudio, Trash2, ExternalLink } from 'lucide-react'
import type { Database } from '@/types/database'

type MediaItem = Database['public']['Tables']['media_items']['Row']
type MediaFolder = Database['public']['Tables']['media_folders']['Row']

interface MediaGridProps {
    items: MediaItem[]
    folders: MediaFolder[]
    viewMode: 'grid' | 'list'
    selectedId?: string
    onSelect: (item: MediaItem | null) => void
    onDelete: (id: string) => void
    isUploading: boolean
    currentFolderId: string | null
}

export function MediaGrid({
    items,
    folders,
    viewMode,
    selectedId,
    onSelect,
    onDelete,
    isUploading,
    currentFolderId,
}: MediaGridProps) {
    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith('image/')) return Image
        if (mimeType.startsWith('video/')) return FileVideo
        if (mimeType.startsWith('audio/')) return FileAudio
        if (mimeType.includes('pdf') || mimeType.includes('document')) return FileText
        return File
    }

    if (items.length === 0 && folders.length === 0) {
        return (
            <div className="border-2 border-dashed border-admin-border rounded-lg p-12 text-center">
                <div className="text-admin-muted">
                    <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Nenhum arquivo encontrado</p>
                    <p className="text-sm">Faça upload de arquivos para começar</p>
                </div>
            </div>
        )
    }

    if (viewMode === 'list') {
        return (
            <div className="border border-admin-border rounded-lg overflow-hidden bg-white">
                <table className="w-full">
                    <thead className="bg-admin-surface">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-admin-muted">Arquivo</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-admin-muted">Tipo</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-admin-muted">Tamanho</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-admin-muted">Data</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-admin-muted">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-admin-border">
                        {items.map((item) => {
                            const Icon = getFileIcon(item.mime_type)
                            return (
                                <tr
                                    key={item.id}
                                    className={`hover:bg-admin-surface cursor-pointer transition-colors ${selectedId === item.id ? 'bg-admin-accent/5' : ''
                                        }`}
                                    onClick={() => onSelect(item)}
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {item.mime_type.startsWith('image/') ? (
                                                <img
                                                    src={item.public_url}
                                                    alt={item.alt_text || ''}
                                                    className="w-10 h-10 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 bg-admin-surface rounded flex items-center justify-center">
                                                    <Icon className="w-5 h-5 text-admin-muted" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-admin-text truncate max-w-xs">
                                                    {item.original_filename}
                                                </p>
                                                {item.alt_text && (
                                                    <p className="text-xs text-admin-muted truncate">{item.alt_text}</p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-admin-muted">{item.mime_type}</td>
                                    <td className="px-4 py-3 text-sm text-admin-muted">{formatBytes(item.size_bytes)}</td>
                                    <td className="px-4 py-3 text-sm text-admin-muted">{formatDate(item.created_at)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <a
                                                href={item.public_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1 text-admin-muted hover:text-admin-accent transition-colors"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                            <button
                                                className="p-1 text-admin-muted hover:text-red-500 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onDelete(item.id)
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item) => {
                const Icon = getFileIcon(item.mime_type)
                return (
                    <div
                        key={item.id}
                        className={`group relative border rounded-lg overflow-hidden cursor-pointer transition-all bg-white ${selectedId === item.id
                                ? 'border-admin-accent ring-2 ring-admin-accent/20'
                                : 'border-admin-border hover:border-admin-accent/50'
                            }`}
                        onClick={() => onSelect(item)}
                    >
                        <div className="aspect-square bg-admin-surface">
                            {item.mime_type.startsWith('image/') ? (
                                <img
                                    src={item.public_url}
                                    alt={item.alt_text || ''}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Icon className="w-12 h-12 text-admin-muted" />
                                </div>
                            )}
                        </div>
                        <div className="p-2">
                            <p className="text-sm text-admin-text truncate">{item.original_filename}</p>
                            <p className="text-xs text-admin-muted">{formatBytes(item.size_bytes)}</p>
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <a
                                href={item.public_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 bg-white rounded shadow hover:bg-gray-50 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ExternalLink className="w-4 h-4 text-gray-600" />
                            </a>
                            <button
                                className="p-1 bg-white rounded shadow hover:bg-red-50 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onDelete(item.id)
                                }}
                            >
                                <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

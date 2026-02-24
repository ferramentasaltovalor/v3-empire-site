'use client'

// src/components/admin/media/MediaLibrary.tsx
// Main media library component with grid/list view

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MediaGrid } from './MediaGrid'
import { MediaSidebar } from './MediaSidebar'
import { MediaUploader } from './MediaUploader'
import { CreateFolderDialog } from './CreateFolderDialog'
import { uploadMediaAction, deleteMediaAction, createFolderAction } from '@/app/(admin)/admin/midia/actions'
import { adminContent } from '@/content/admin'
import { Upload, FolderPlus, Search, Grid, List } from 'lucide-react'
import type { Database } from '@/types/database'

type MediaItem = Database['public']['Tables']['media_items']['Row']
type MediaFolder = Database['public']['Tables']['media_folders']['Row']

interface MediaLibraryProps {
    initialItems: MediaItem[]
    initialFolders: MediaFolder[]
    total: number
    currentFolderId: string | null
    searchQuery?: string
    mimeType?: string
}

export function MediaLibrary({
    initialItems,
    initialFolders,
    total,
    currentFolderId,
    searchQuery,
    mimeType,
}: MediaLibraryProps) {
    const [items, setItems] = useState(initialItems)
    const [folders, setFolders] = useState(initialFolders)
    const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [search, setSearch] = useState(searchQuery || '')
    const [isUploading, setIsUploading] = useState(false)
    const [showUploader, setShowUploader] = useState(false)
    const [showNewFolder, setShowNewFolder] = useState(false)

    const handleUpload = async (files: FileList) => {
        setIsUploading(true)

        for (const file of Array.from(files)) {
            const formData = new FormData()
            formData.append('file', file)
            if (currentFolderId && currentFolderId !== 'root') {
                formData.append('folderId', currentFolderId)
            }

            const result = await uploadMediaAction(formData)
            if (result.success && result.item) {
                setItems(prev => [result.item!, ...prev])
            }
        }

        setIsUploading(false)
        setShowUploader(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este arquivo?')) return

        const result = await deleteMediaAction(id)
        if (result.success) {
            setItems(prev => prev.filter(item => item.id !== id))
            setSelectedItem(null)
        }
    }

    const handleCreateFolder = async (name: string) => {
        const result = await createFolderAction(
            name,
            currentFolderId && currentFolderId !== 'root' ? currentFolderId : undefined
        )
        if (result.success && result.folder) {
            setFolders(prev => [...prev, result.folder!])
        }
        setShowNewFolder(false)
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        // Navigate with search params
        const params = new URLSearchParams()
        if (search) params.set('search', search)
        if (currentFolderId && currentFolderId !== 'root') params.set('folder', currentFolderId)
        window.location.href = `/admin/midia?${params.toString()}`
    }

    return (
        <div className="flex gap-6">
            {/* Sidebar - Folders */}
            <div className="w-64 flex-shrink-0">
                <div className="bg-admin-surface rounded-lg p-4 space-y-4">
                    <h3 className="font-medium text-admin-text">Pastas</h3>
                    <div className="space-y-1">
                        <a
                            href="/admin/midia"
                            className={`block px-3 py-2 rounded-md text-sm transition-colors ${!currentFolderId || currentFolderId === 'root'
                                ? 'bg-admin-accent/10 text-admin-accent'
                                : 'text-admin-muted hover:bg-admin-border'
                                }`}
                        >
                            Todos os arquivos
                        </a>
                        {folders.map(folder => (
                            <a
                                key={folder.id}
                                href={`/admin/midia?folder=${folder.id}`}
                                className={`block px-3 py-2 rounded-md text-sm transition-colors ${currentFolderId === folder.id
                                    ? 'bg-admin-accent/10 text-admin-accent'
                                    : 'text-admin-muted hover:bg-admin-border'
                                    }`}
                            >
                                {folder.name}
                            </a>
                        ))}
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-admin-muted hover:text-admin-text"
                        onClick={() => setShowNewFolder(true)}
                    >
                        <FolderPlus className="w-4 h-4 mr-2" />
                        Nova pasta
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-4">
                {/* Toolbar */}
                <div className="flex items-center gap-4">
                    <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted" />
                        <Input
                            placeholder={adminContent.generic.search}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </form>

                    <div className="flex gap-2">
                        <Button
                            variant={viewMode === 'grid' ? 'premium' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('grid')}
                        >
                            <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'premium' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>

                    <Button
                        className="bg-admin-accent hover:bg-admin-accent/90 text-white"
                        onClick={() => setShowUploader(true)}
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                    </Button>
                </div>

                {/* Stats */}
                <div className="text-sm text-admin-muted">
                    {total} {total === 1 ? 'arquivo' : 'arquivos'}
                </div>

                {/* Media Grid */}
                <MediaGrid
                    items={items}
                    folders={folders}
                    viewMode={viewMode}
                    selectedId={selectedItem?.id}
                    onSelect={setSelectedItem}
                    onDelete={handleDelete}
                    isUploading={isUploading}
                    currentFolderId={currentFolderId}
                />
            </div>

            {/* Selected Item Sidebar */}
            {selectedItem && (
                <MediaSidebar
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    onDelete={() => handleDelete(selectedItem.id)}
                />
            )}

            {/* Upload Dialog */}
            {showUploader && (
                <MediaUploader
                    onUpload={handleUpload}
                    onClose={() => setShowUploader(false)}
                    isUploading={isUploading}
                />
            )}

            {/* New Folder Dialog */}
            {showNewFolder && (
                <CreateFolderDialog
                    onCreate={handleCreateFolder}
                    onClose={() => setShowNewFolder(false)}
                />
            )}
        </div>
    )
}

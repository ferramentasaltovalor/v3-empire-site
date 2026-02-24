'use client'

// src/components/admin/media/MediaUploader.tsx
// Upload dialog with drag-and-drop support

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, File, Loader2 } from 'lucide-react'

interface MediaUploaderProps {
    onUpload: (files: FileList) => void
    onClose: () => void
    isUploading: boolean
}

export function MediaUploader({ onUpload, onClose, isUploading }: MediaUploaderProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const files = Array.from(e.dataTransfer.files)
        setSelectedFiles(prev => [...prev, ...files])
    }, [])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files)
            setSelectedFiles(prev => [...prev, ...files])
        }
    }

    const handleRemoveFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleUpload = () => {
        if (selectedFiles.length > 0) {
            const dataTransfer = new DataTransfer()
            selectedFiles.forEach(file => dataTransfer.items.add(file))
            onUpload(dataTransfer.files)
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-admin-border">
                    <h3 className="font-medium text-admin-text">Upload de arquivos</h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-admin-muted hover:text-admin-text transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Drop Zone */}
                <div className="p-4">
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                            ? 'border-admin-accent bg-admin-accent/5'
                            : 'border-admin-border hover:border-admin-accent/50'
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className={`w-10 h-10 mx-auto mb-4 ${isDragging ? 'text-admin-accent' : 'text-admin-muted'}`} />
                        <p className="text-admin-text mb-2">
                            Arraste arquivos aqui ou clique para selecionar
                        </p>
                        <p className="text-sm text-admin-muted">
                            Imagens, vídeos, documentos até 50MB
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileSelect}
                            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                        />
                    </div>
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                    <div className="px-4 pb-4">
                        <h4 className="text-sm font-medium text-admin-text mb-2">
                            Arquivos selecionados ({selectedFiles.length})
                        </h4>
                        <div className="max-h-40 overflow-y-auto space-y-2">
                            {selectedFiles.map((file, index) => (
                                <div
                                    key={`${file.name}-${index}`}
                                    className="flex items-center gap-3 p-2 bg-admin-surface rounded border border-admin-border"
                                >
                                    <File className="w-4 h-4 text-admin-muted flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-admin-text truncate">{file.name}</p>
                                        <p className="text-xs text-admin-muted">{formatFileSize(file.size)}</p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleRemoveFile(index)
                                        }}
                                        className="p-1 text-admin-muted hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-end gap-3 p-4 border-t border-admin-border bg-admin-surface">
                    <Button variant="secondary" onClick={onClose} disabled={isUploading}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={selectedFiles.length === 0 || isUploading}
                        className="bg-admin-accent hover:bg-admin-accent/90 text-white"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                Enviar {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}

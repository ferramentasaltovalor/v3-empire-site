'use client'

// src/components/admin/media/CreateFolderDialog.tsx
// Dialog for creating new media folders

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, FolderPlus, Loader2 } from 'lucide-react'

interface CreateFolderDialogProps {
    onCreate: (name: string) => void
    onClose: () => void
}

export function CreateFolderDialog({ onCreate, onClose }: CreateFolderDialogProps) {
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const [isCreating, setIsCreating] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim()) {
            setError('Nome da pasta é obrigatório')
            return
        }

        if (name.trim().length < 2) {
            setError('Nome deve ter pelo menos 2 caracteres')
            return
        }

        // Check for invalid characters
        const invalidChars = /[<>:"/\\|?*]/
        if (invalidChars.test(name)) {
            setError('Nome contém caracteres inválidos')
            return
        }

        setIsCreating(true)
        onCreate(name.trim())
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-admin-border">
                    <h3 className="font-medium text-admin-text">Nova pasta</h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-admin-muted hover:text-admin-text transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-admin-text mb-1">
                            Nome da pasta
                        </label>
                        <Input
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                                setError('')
                            }}
                            placeholder="Ex: Imagens do blog"
                            autoFocus
                            className={error ? 'border-red-500 focus:border-red-500' : ''}
                        />
                        {error && (
                            <p className="mt-1 text-sm text-red-500">{error}</p>
                        )}
                    </div>

                    <p className="text-sm text-admin-muted">
                        A pasta será criada no local atual.
                    </p>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={isCreating}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isCreating}
                            className="bg-admin-accent hover:bg-admin-accent/90 text-white"
                        >
                            {isCreating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Criando...
                                </>
                            ) : (
                                <>
                                    <FolderPlus className="w-4 h-4 mr-2" />
                                    Criar pasta
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

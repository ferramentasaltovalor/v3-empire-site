'use client'

// src/components/admin/landing-pages/LandingPagesList.tsx
// Landing pages list component for admin

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Copy, 
  Trash2, 
  Globe,
  FileText,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  deleteLandingPageFormAction,
  duplicateLandingPageFormAction,
  togglePublishFormAction,
} from '@/app/(admin)/admin/landing-pages/actions'
import type { LandingPageListItem } from '@/lib/landing-pages'

interface LandingPagesListProps {
  landingPages: LandingPageListItem[]
  total: number
}

// Simple date formatting function
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'agora mesmo'
  if (diffMins < 60) return `há ${diffMins} min`
  if (diffHours < 24) return `há ${diffHours}h`
  if (diffDays < 7) return `há ${diffDays} dias`
  
  return date.toLocaleDateString('pt-BR')
}

export function LandingPagesList({ landingPages, total }: LandingPagesListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [menuOpen, setMenuOpen] = useState<string | null>(null)

  const handleDelete = () => {
    if (!deleteId) return
    
    const formData = new FormData()
    formData.set('id', deleteId)
    
    startTransition(() => {
      deleteLandingPageFormAction(formData)
      setDeleteId(null)
    })
  }

  const handleDuplicate = (id: string) => {
    const formData = new FormData()
    formData.set('id', id)
    
    startTransition(() => {
      duplicateLandingPageFormAction(formData)
    })
    setMenuOpen(null)
  }

  const handleTogglePublish = (id: string, currentStatus: 'draft' | 'published') => {
    const formData = new FormData()
    formData.set('id', id)
    formData.set('status', currentStatus)
    
    startTransition(() => {
      togglePublishFormAction(formData)
    })
    setMenuOpen(null)
  }

  const getStatusBadge = (status: 'draft' | 'published') => {
    if (status === 'published') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          Publicado
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
        Rascunho
      </span>
    )
  }

  return (
    <>
      <div className="rounded-lg border border-[var(--color-admin-border)] bg-white overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-[var(--color-admin-surface)] border-b border-[var(--color-admin-border)] text-sm font-medium text-[var(--color-admin-muted)]">
          <div className="col-span-4">Nome</div>
          <div className="col-span-3">Slug</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Atualização</div>
          <div className="col-span-1 text-right">Ações</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-[var(--color-admin-border)]">
          {landingPages.length === 0 ? (
            <div className="py-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <FileText className="w-12 h-12 text-[var(--color-admin-muted)]" />
                <p className="text-[var(--color-admin-muted)]">
                  Nenhuma landing page encontrada
                </p>
                <Link href="/admin/landing-pages/nova">
                  <Button variant="ghost" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar primeira landing page
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            landingPages.map((lp) => (
              <div 
                key={lp.id}
                className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-[var(--color-admin-surface-hover)] transition-colors"
              >
                <div className="col-span-4">
                  <Link 
                    href={`/admin/landing-pages/${lp.id}`}
                    className="font-medium text-[var(--color-admin-text)] hover:text-[var(--color-empire-gold)]"
                  >
                    {lp.name}
                  </Link>
                  {lp.profiles?.full_name && (
                    <p className="text-xs text-[var(--color-admin-muted)]">
                      por {lp.profiles.full_name}
                    </p>
                  )}
                </div>
                <div className="col-span-3">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">
                    /lp/{lp.slug}
                  </code>
                </div>
                <div className="col-span-2">
                  {getStatusBadge(lp.status)}
                </div>
                <div className="col-span-2 text-sm text-[var(--color-admin-muted)]">
                  {formatDate(lp.updatedAt)}
                </div>
                <div className="col-span-1 flex items-center justify-end gap-2">
                  {lp.status === 'published' && (
                    <Link 
                      href={`/lp/${lp.slug}`}
                      target="_blank"
                      className="text-[var(--color-admin-muted)] hover:text-[var(--color-admin-text)] p-1"
                      title="Ver página pública"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  )}
                  
                  {/* Simple dropdown menu */}
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === lp.id ? null : lp.id)}
                      disabled={isPending}
                      className="p-1 rounded hover:bg-gray-100 text-[var(--color-admin-muted)]"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    
                    {menuOpen === lp.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-10"
                          onClick={() => setMenuOpen(null)}
                        />
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                          <Link
                            href={`/admin/landing-pages/${lp.id}`}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Edit className="w-4 h-4" />
                            Editar
                          </Link>
                          {lp.status === 'published' && (
                            <Link
                              href={`/lp/${lp.slug}`}
                              target="_blank"
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Globe className="w-4 h-4" />
                              Ver pública
                            </Link>
                          )}
                          <div className="border-t border-gray-100 my-1" />
                          <button
                            onClick={() => handleTogglePublish(lp.id, lp.status)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                          >
                            {lp.status === 'published' ? (
                              <>
                                <ToggleLeft className="w-4 h-4" />
                                Despublicar
                              </>
                            ) : (
                              <>
                                <ToggleRight className="w-4 h-4" />
                                Publicar
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleDuplicate(lp.id)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                          >
                            <Copy className="w-4 h-4" />
                            Duplicar
                          </button>
                          <div className="border-t border-gray-100 my-1" />
                          <button
                            onClick={() => {
                              setDeleteId(lp.id)
                              setMenuOpen(null)
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                          >
                            <Trash2 className="w-4 h-4" />
                            Excluir
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setDeleteId(null)}
          />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Excluir landing page?
            </h3>
            <p className="text-gray-600 mb-4">
              Esta ação não pode ser desfeita. A landing page será movida para a lixeira.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={isPending}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
              >
                {isPending ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

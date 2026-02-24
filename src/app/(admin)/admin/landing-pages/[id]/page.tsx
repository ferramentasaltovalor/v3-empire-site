import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Eye, Settings, Layers } from 'lucide-react'
import { getLandingPage, updateLandingPageData, publishLandingPageAction, unpublishLandingPageAction } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateLandingPageFormAction, togglePublishFormAction } from './actions'
import type { LandingPageStatus } from '@/lib/landing-pages'

interface EditLandingPageProps {
  params: Promise<{ id: string }>
}

export default async function EditLandingPagePage({ params }: EditLandingPageProps) {
  const { id } = await params
  const landingPage = await getLandingPage(id)
  
  if (!landingPage) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/landing-pages"
            className="text-[var(--color-admin-muted)] hover:text-[var(--color-admin-text)]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--color-admin-text)]">
              {landingPage.name}
            </h1>
            <p className="text-[var(--color-admin-muted)]">
              /lp/{landingPage.slug}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {landingPage.status === 'published' && (
            <Link href={`/lp/${landingPage.slug}`} target="_blank">
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Ver pública
              </Button>
            </Link>
          )}
          
          <form action={togglePublishFormAction}>
            <input type="hidden" name="id" value={landingPage.id} />
            <input type="hidden" name="status" value={landingPage.status} />
            <Button 
              type="submit" 
              variant={landingPage.status === 'published' ? 'ghost' : 'premium'}
              size="sm"
            >
              {landingPage.status === 'published' ? 'Despublicar' : 'Publicar'}
            </Button>
          </form>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-[var(--color-admin-border)]">
        <nav className="flex gap-4">
          <Link
            href={`/admin/landing-pages/${id}`}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 border-[var(--color-empire-gold)] text-[var(--color-empire-gold)]"
          >
            <Settings className="w-4 h-4" />
            Configurações
          </Link>
          <Link
            href={`/admin/landing-pages/${id}/secoes`}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-admin-muted)] hover:text-[var(--color-admin-text)]"
          >
            <Layers className="w-4 h-4" />
            Seções
          </Link>
        </nav>
      </div>

      {/* Settings Form */}
      <form action={updateLandingPageFormAction} className="space-y-6">
        <input type="hidden" name="id" value={landingPage.id} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Settings */}
          <div className="bg-white rounded-lg border border-[var(--color-admin-border)] p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[var(--color-admin-text)]">
              Configurações Básicas
            </h2>
            
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                defaultValue={landingPage.name}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <div className="flex items-center">
                <span className="text-sm text-[var(--color-admin-muted)] mr-2">/lp/</span>
                <Input
                  id="slug"
                  name="slug"
                  defaultValue={landingPage.slug}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <div>
                {landingPage.status === 'published' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    Publicado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                    Rascunho
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white rounded-lg border border-[var(--color-admin-border)] p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[var(--color-admin-text)]">
              SEO
            </h2>
            
            <div className="space-y-2">
              <Label htmlFor="seoTitle">Título SEO</Label>
              <Input
                id="seoTitle"
                name="seoTitle"
                defaultValue={landingPage.seoTitle || ''}
                placeholder={landingPage.name}
              />
              <p className="text-xs text-[var(--color-admin-muted)]">
                {landingPage.seoTitle?.length || 0}/60 caracteres
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="seoDescription">Meta Description</Label>
              <Textarea
                id="seoDescription"
                name="seoDescription"
                defaultValue={landingPage.seoDescription || ''}
                placeholder="Descrição atrativa para mecanismos de busca..."
                rows={3}
              />
              <p className="text-xs text-[var(--color-admin-muted)]">
                {landingPage.seoDescription?.length || 0}/160 caracteres
              </p>
            </div>
          </div>
        </div>

        {/* Custom CSS */}
        <div className="bg-white rounded-lg border border-[var(--color-admin-border)] p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[var(--color-admin-text)]">
            CSS Personalizado
          </h2>
          
          <div className="space-y-2">
            <Label htmlFor="cssCustom">CSS Custom</Label>
            <Textarea
              id="cssCustom"
              name="cssCustom"
              defaultValue={landingPage.cssCustom || ''}
              placeholder="/* Adicione CSS personalizado aqui */"
              rows={6}
              className="font-mono text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/landing-pages">
            <Button type="button" variant="ghost">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" variant="premium">
            Salvar Alterações
          </Button>
        </div>
      </form>
    </div>
  )
}

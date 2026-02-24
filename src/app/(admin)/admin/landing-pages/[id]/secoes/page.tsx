import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Eye, Settings, Layers } from 'lucide-react'
import { getLandingPage } from '../../actions'
import { SectionEditorClient } from './SectionEditorClient'

interface EditSectionsPageProps {
  params: Promise<{ id: string }>
}

export default async function EditSectionsPage({ params }: EditSectionsPageProps) {
  const { id } = await params
  const landingPage = await getLandingPage(id)
  
  if (!landingPage) {
    notFound()
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/landing-pages"
            className="text-[var(--color-admin-muted)] hover:text-[var(--color-admin-text)]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--color-admin-text)]">
              Editor de Seções
            </h1>
            <p className="text-[var(--color-admin-muted)]">
              {landingPage.name} • /lp/{landingPage.slug}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Tabs Navigation */}
          <div className="flex border border-[var(--color-admin-border)] rounded-lg overflow-hidden">
            <Link
              href={`/admin/landing-pages/${id}`}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-admin-muted)] hover:text-[var(--color-admin-text)] hover:bg-gray-50"
            >
              <Settings className="w-4 h-4" />
              Configurações
            </Link>
            <Link
              href={`/admin/landing-pages/${id}/secoes`}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[var(--color-empire-gold)] text-[var(--color-empire-bg)]"
            >
              <Layers className="w-4 h-4" />
              Seções
            </Link>
          </div>
        </div>
      </div>

      {/* Section Editor */}
      <div className="flex-1 bg-white rounded-lg border border-[var(--color-admin-border)] overflow-hidden">
        <SectionEditorClient
          landingPageId={landingPage.id}
          initialSections={landingPage.sections || []}
        />
      </div>
    </div>
  )
}

import { Suspense } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { listLandingPages } from './actions'
import { LandingPagesList } from '@/components/admin/landing-pages/LandingPagesList'
import { Button } from '@/components/ui/button'

interface LandingPagesPageProps {
  searchParams: Promise<{ status?: string }>
}

async function LandingPagesContent({ searchParams }: LandingPagesPageProps) {
  const params = await searchParams
  const status = params.status as 'draft' | 'published' | undefined
  
  const { data: landingPages, total } = await listLandingPages({ status })

  return (
    <LandingPagesList 
      landingPages={landingPages} 
      total={total} 
    />
  )
}

export default async function LandingPagesPage({ searchParams }: LandingPagesPageProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-admin-text)]">
            Landing Pages
          </h1>
          <p className="text-[var(--color-admin-muted)]">
            Gerencie suas landing pages e capture leads
          </p>
        </div>
        <Link href="/admin/landing-pages/nova">
          <Button variant="premium">
            <Plus className="w-4 h-4 mr-2" />
            Nova Landing Page
          </Button>
        </Link>
      </div>

      {/* Landing Pages List */}
      <Suspense fallback={<div className="text-[var(--color-admin-muted)]">Carregando...</div>}>
        <LandingPagesContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

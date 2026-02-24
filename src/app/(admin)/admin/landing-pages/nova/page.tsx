import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createLandingPageFormAction } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface NewLandingPageProps {
  searchParams: Promise<{ name?: string }>
}

export default async function NewLandingPagePage({ searchParams }: NewLandingPageProps) {
  const params = await searchParams
  const defaultName = params.name || ''

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/landing-pages"
          className="text-[var(--color-admin-muted)] hover:text-[var(--color-admin-text)]"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-admin-text)]">
            Nova Landing Page
          </h1>
          <p className="text-[var(--color-admin-muted)]">
            Crie uma nova landing page para capturar leads
          </p>
        </div>
      </div>

      {/* Form */}
      <form action={createLandingPageFormAction} className="space-y-6">
        <div className="bg-white rounded-lg border border-[var(--color-admin-border)] p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Landing Page</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex: Promoção de Verão, Black Friday, etc."
              defaultValue={defaultName}
              required
            />
            <p className="text-sm text-[var(--color-admin-muted)]">
              Este nome é apenas para identificação interna.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/landing-pages">
            <Button type="button" variant="ghost">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" variant="premium">
            Criar Landing Page
          </Button>
        </div>
      </form>
    </div>
  )
}

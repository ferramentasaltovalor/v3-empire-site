'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface AdminErrorProps {
    error: Error & { digest?: string }
    reset: () => void
}

export default function AdminError({ error, reset }: AdminErrorProps) {
    useEffect(() => {
        console.error('Admin Error:', error)
    }, [error])

    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8 bg-[var(--color-admin-bg)]">
            <h2 className="text-xl font-semibold text-[var(--color-admin-text)]">Algo deu errado</h2>
            <p className="text-[var(--color-admin-muted)]">{error.message || 'Ocorreu um erro inesperado'}</p>
            <Button onClick={reset} variant="secondary">
                Tentar novamente
            </Button>
        </div>
    )
}

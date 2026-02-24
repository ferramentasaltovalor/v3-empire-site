'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
    error: Error & { digest?: string }
    reset: () => void
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
    useEffect(() => {
        console.error('Error:', error)
    }, [error])

    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8">
            <h2 className="text-xl font-semibold">Algo deu errado</h2>
            <p className="text-[var(--color-empire-muted)]">{error.message || 'Ocorreu um erro inesperado'}</p>
            <Button onClick={reset} variant="secondary">
                Tentar novamente
            </Button>
        </div>
    )
}

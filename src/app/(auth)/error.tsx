'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface AuthErrorProps {
    error: Error & { digest?: string }
    reset: () => void
}

export default function AuthError({ error, reset }: AuthErrorProps) {
    useEffect(() => {
        console.error('Auth Error:', error)
    }, [error])

    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8 bg-[var(--color-admin-bg)]">
            <h2 className="text-xl font-semibold text-[var(--color-admin-text)]">Erro na autenticação</h2>
            <p className="text-[var(--color-admin-muted)]">{error.message || 'Ocorreu um erro inesperado'}</p>
            <Button onClick={reset} variant="secondary">
                Tentar novamente
            </Button>
        </div>
    )
}

'use client'

import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

export default function PublicError({ error, reset }: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <ErrorBoundary error={error} reset={reset} />
        </div>
    )
}

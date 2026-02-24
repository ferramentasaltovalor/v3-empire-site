import { SkeletonText, SkeletonTableRow } from '@/components/ui/skeleton'

export default function AdminLoading() {
    return (
        <div className="min-h-screen bg-[var(--color-admin-bg)] p-6">
            <div className="space-y-6">
                {/* Header skeleton */}
                <div className="flex items-center justify-between">
                    <SkeletonText variant="light" width="200px" className="h-8" />
                    <div className="h-10 w-32 bg-[var(--color-admin-surface)] rounded animate-pulse" />
                </div>

                {/* Stats cards skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-[var(--color-admin-surface)] border border-[var(--color-admin-border)] rounded-lg p-4 space-y-2">
                            <SkeletonText variant="light" width="60%" className="h-4" />
                            <SkeletonText variant="light" width="40%" className="h-6" />
                        </div>
                    ))}
                </div>

                {/* Table skeleton */}
                <div className="bg-[var(--color-admin-surface)] border border-[var(--color-admin-border)] rounded-lg overflow-hidden">
                    <div className="border-b border-[var(--color-admin-border)] px-4 py-3">
                        <SkeletonText variant="light" width="150px" className="h-5" />
                    </div>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <SkeletonTableRow key={i} variant="light" />
                    ))}
                </div>
            </div>
        </div>
    )
}

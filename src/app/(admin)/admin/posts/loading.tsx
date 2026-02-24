import { SkeletonText, SkeletonTableRow } from '@/components/ui/skeleton'

export default function PostsLoading() {
    return (
        <div className="space-y-6">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
                <SkeletonText variant="light" width="150px" className="h-8" />
                <div className="h-10 w-32 bg-[var(--color-admin-surface)] rounded animate-pulse" />
            </div>

            {/* Filters skeleton */}
            <div className="flex gap-4">
                <div className="h-10 w-48 bg-[var(--color-admin-surface)] rounded animate-pulse" />
                <div className="h-10 w-32 bg-[var(--color-admin-surface)] rounded animate-pulse" />
            </div>

            {/* Table skeleton */}
            <div className="bg-[var(--color-admin-surface)] border border-[var(--color-admin-border)] rounded-lg overflow-hidden">
                {/* Table header */}
                <div className="flex items-center gap-4 px-4 py-3 border-b border-[var(--color-admin-border)] bg-[var(--color-admin-bg)]">
                    <div className="h-4 w-4 bg-[var(--color-admin-border)] rounded" />
                    <SkeletonText variant="light" width="30%" className="h-4" />
                    <SkeletonText variant="light" width="20%" className="h-4" />
                    <SkeletonText variant="light" width="15%" className="h-4" />
                    <div className="h-4 w-20 bg-[var(--color-admin-border)] rounded ml-auto" />
                </div>

                {/* Table rows */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonTableRow key={i} variant="light" />
                ))}
            </div>

            {/* Pagination skeleton */}
            <div className="flex items-center justify-between">
                <SkeletonText variant="light" width="150px" className="h-4" />
                <div className="flex gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-8 w-8 bg-[var(--color-admin-surface)] rounded" />
                    ))}
                </div>
            </div>
        </div>
    )
}

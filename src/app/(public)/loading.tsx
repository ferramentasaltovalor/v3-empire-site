import { SkeletonCard, SkeletonText } from '@/components/ui/skeleton'

export default function PublicLoading() {
    return (
        <div className="min-h-screen bg-[var(--color-empire-bg)] p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Hero skeleton */}
                <div className="text-center space-y-4 py-16">
                    <SkeletonText variant="dark" width="60%" className="h-12 mx-auto" />
                    <SkeletonText variant="dark" width="40%" className="h-6 mx-auto" />
                    <div className="flex justify-center gap-4 pt-4">
                        <div className="h-12 w-32 bg-[var(--color-empire-card)] rounded animate-pulse" />
                        <div className="h-12 w-32 bg-[var(--color-empire-card)] rounded animate-pulse" />
                    </div>
                </div>

                {/* Cards grid skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonCard key={i} variant="dark" />
                    ))}
                </div>
            </div>
        </div>
    )
}

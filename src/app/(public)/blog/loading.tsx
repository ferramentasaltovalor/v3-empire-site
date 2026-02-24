import { SkeletonPostCard } from '@/components/ui/skeleton'

export default function BlogLoading() {
    return (
        <div className="min-h-screen bg-[var(--color-empire-bg)] p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header skeleton */}
                <div className="text-center space-y-4 py-8">
                    <div className="h-12 w-48 bg-[var(--color-empire-card)] rounded animate-pulse mx-auto" />
                    <div className="h-6 w-96 bg-[var(--color-empire-card)] rounded animate-pulse mx-auto" />
                </div>

                {/* Blog posts grid skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonPostCard key={i} variant="dark" />
                    ))}
                </div>
            </div>
        </div>
    )
}

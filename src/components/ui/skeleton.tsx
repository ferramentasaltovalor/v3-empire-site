// src/components/ui/skeleton.tsx
// Componente Skeleton — Design System Empire Gold
// Variantes: dark (site público), light (admin)
// Shapes: SkeletonText, SkeletonImage, SkeletonCard, SkeletonPostCard, SkeletonTableRow

import React from 'react'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'dark' | 'light'
}

// Base skeleton with shimmer animation
function SkeletonBase({ variant = 'dark', className = '', ...props }: SkeletonProps) {
    const baseColor = variant === 'dark'
        ? 'bg-[var(--color-empire-card)]'
        : 'bg-[var(--color-admin-surface)]'

    const shimmerColor = variant === 'dark'
        ? 'after:bg-[linear-gradient(90deg,transparent,rgba(39,39,42,0.8),transparent)]'
        : 'after:bg-[linear-gradient(90deg,transparent,rgba(229,231,235,0.8),transparent)]'

    return (
        <div
            className={[
                'relative overflow-hidden rounded',
                baseColor,
                'after:absolute after:inset-0',
                shimmerColor,
                'after:translate-x-[-100%] after:animate-[shine_1.5s_ease-in-out_infinite]',
                className,
            ].join(' ')}
            aria-hidden="true"
            {...props}
        />
    )
}

// SkeletonText — text line with configurable width
export interface SkeletonTextProps extends SkeletonProps {
    width?: string
}

export function SkeletonText({ width = '100%', variant = 'dark', className = '', ...props }: SkeletonTextProps) {
    return (
        <SkeletonBase
            variant={variant}
            className={['h-4 rounded', className].join(' ')}
            style={{ width }}
            {...props}
        />
    )
}

// SkeletonImage — rectangular block
export interface SkeletonImageProps extends SkeletonProps {
    aspectRatio?: string
}

export function SkeletonImage({ aspectRatio = '16/9', variant = 'dark', className = '', ...props }: SkeletonImageProps) {
    return (
        <SkeletonBase
            variant={variant}
            className={['w-full rounded-lg', className].join(' ')}
            style={{ aspectRatio }}
            {...props}
        />
    )
}

// SkeletonCard — full card skeleton (image + text lines)
export function SkeletonCard({ variant = 'dark', className = '' }: SkeletonProps) {
    const borderColor = variant === 'dark'
        ? 'border-[var(--color-empire-border)]'
        : 'border-[var(--color-admin-border)]'

    return (
        <div
            className={[
                'rounded-lg border p-4 space-y-4',
                borderColor,
                className,
            ].join(' ')}
            aria-hidden="true"
        >
            <SkeletonImage variant={variant} />
            <div className="space-y-2">
                <SkeletonText variant={variant} width="75%" />
                <SkeletonText variant={variant} width="90%" />
                <SkeletonText variant={variant} width="60%" />
            </div>
        </div>
    )
}

// SkeletonPostCard — blog post card skeleton
export function SkeletonPostCard({ variant = 'dark', className = '' }: SkeletonProps) {
    const borderColor = variant === 'dark'
        ? 'border-[var(--color-empire-border)]'
        : 'border-[var(--color-admin-border)]'

    return (
        <div
            className={[
                'rounded-lg border overflow-hidden',
                borderColor,
                className,
            ].join(' ')}
            aria-hidden="true"
        >
            <SkeletonImage variant={variant} aspectRatio="16/9" className="rounded-none" />
            <div className="p-5 space-y-3">
                {/* Category badge */}
                <SkeletonBase variant={variant} className="h-5 w-20 rounded-full" />
                {/* Title */}
                <div className="space-y-2">
                    <SkeletonText variant={variant} width="90%" />
                    <SkeletonText variant={variant} width="70%" />
                </div>
                {/* Excerpt */}
                <div className="space-y-1.5">
                    <SkeletonText variant={variant} width="100%" />
                    <SkeletonText variant={variant} width="85%" />
                </div>
                {/* Meta */}
                <div className="flex items-center gap-3 pt-1">
                    <SkeletonBase variant={variant} className="h-8 w-8 rounded-full" />
                    <SkeletonText variant={variant} width="40%" />
                </div>
            </div>
        </div>
    )
}

// SkeletonTableRow — admin table row skeleton
export function SkeletonTableRow({ variant = 'light', className = '' }: SkeletonProps) {
    return (
        <div
            className={[
                'flex items-center gap-4 px-4 py-3',
                className,
            ].join(' ')}
            aria-hidden="true"
        >
            <SkeletonBase variant={variant} className="h-4 w-4 rounded" />
            <SkeletonText variant={variant} width="30%" />
            <SkeletonText variant={variant} width="20%" />
            <SkeletonText variant={variant} width="15%" />
            <SkeletonBase variant={variant} className="h-5 w-16 rounded-full ml-auto" />
        </div>
    )
}

// Default export for generic use
export function Skeleton({ variant = 'dark', className = '', ...props }: SkeletonProps) {
    return <SkeletonBase variant={variant} className={className} {...props} />
}

// src/components/ui/badge.tsx
// Componente Badge — Design System Empire Gold
// Variantes: default, pulse

import React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'pulse'
}

const baseClasses = [
    'inline-flex items-center gap-1.5',
    'px-3 py-1',
    'rounded-full',
    'border border-[rgba(201,169,98,0.3)]',
    'bg-[rgba(201,169,98,0.05)]',
    'text-[var(--color-empire-gold)]',
    'text-xs font-medium uppercase tracking-[0.1em]',
].join(' ')

export function Badge({
    variant = 'default',
    className = '',
    children,
    ...props
}: BadgeProps) {
    return (
        <span
            className={[baseClasses, className].join(' ')}
            {...props}
        >
            {variant === 'pulse' && (
                <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-empire-gold)] opacity-75 animate-[pulse-ring_1.5s_ease-out_infinite]" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-empire-gold)]" />
                </span>
            )}
            {children}
        </span>
    )
}

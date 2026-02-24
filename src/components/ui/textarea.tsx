// src/components/ui/textarea.tsx
// Componente Textarea — Design System Empire Gold
// Variantes: dark (site público), light (admin)

import React from 'react'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    variant?: 'dark' | 'light'
}

const variantClasses: Record<NonNullable<TextareaProps['variant']>, string> = {
    dark: [
        'bg-[var(--color-empire-card)]',
        'border border-[var(--color-empire-border)]',
        'text-[var(--color-empire-text)]',
        'placeholder:text-[var(--color-empire-muted)]',
        'focus:border-[var(--color-empire-gold)]',
        'focus:ring-1 focus:ring-[var(--color-empire-gold)]',
        'focus:outline-none',
    ].join(' '),

    light: [
        'bg-white',
        'border border-[var(--color-admin-border)]',
        'text-[var(--color-admin-text)]',
        'placeholder:text-[var(--color-admin-muted)]',
        'focus:border-[var(--color-admin-accent)]',
        'focus:ring-1 focus:ring-[var(--color-admin-accent)]',
        'focus:outline-none',
    ].join(' '),
}

export function Textarea({
    variant = 'dark',
    className = '',
    ...props
}: TextareaProps) {
    return (
        <textarea
            className={[
                'w-full px-4 py-3 rounded-md',
                'text-sm',
                'transition-colors duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'resize-y min-h-[100px]',
                variantClasses[variant],
                className,
            ].join(' ')}
            {...props}
        />
    )
}

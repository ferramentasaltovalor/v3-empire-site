// src/components/ui/card.tsx
// Componente Card — Design System Empire Gold
// Variantes: base, gold, admin

import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'base' | 'gold' | 'admin'
    hover?: boolean
}

const variantClasses: Record<NonNullable<CardProps['variant']>, string> = {
    base: [
        'bg-[var(--color-empire-card)]',
        'border border-[var(--color-empire-border)]',
        'rounded-lg',
    ].join(' '),

    gold: [
        'border-gold-gradient',
        'rounded-lg',
    ].join(' '),

    admin: [
        'bg-[var(--color-admin-bg)]',
        'border border-[var(--color-admin-border)]',
        'rounded-lg',
    ].join(' '),
}

const hoverClasses: Record<NonNullable<CardProps['variant']>, string> = {
    base: 'hover:-translate-y-2 hover:shadow-[var(--shadow-card)] transition-all duration-300',
    gold: 'hover:-translate-y-2 hover:shadow-[var(--shadow-gold)] transition-all duration-300',
    admin: 'hover:-translate-y-1 hover:shadow-[var(--shadow-subtle)] transition-all duration-300',
}

export function Card({
    variant = 'base',
    hover = true,
    className = '',
    children,
    ...props
}: CardProps) {
    return (
        <div
            className={[
                variantClasses[variant],
                hover ? hoverClasses[variant] : '',
                className,
            ].join(' ')}
            {...props}
        >
            {children}
        </div>
    )
}

// Sub-components
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> { }

export function CardHeader({ className = '', children, ...props }: CardHeaderProps) {
    return (
        <div
            className={['p-6 pb-0', className].join(' ')}
            {...props}
        >
            {children}
        </div>
    )
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> { }

export function CardContent({ className = '', children, ...props }: CardContentProps) {
    return (
        <div
            className={['p-6', className].join(' ')}
            {...props}
        >
            {children}
        </div>
    )
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> { }

export function CardFooter({ className = '', children, ...props }: CardFooterProps) {
    return (
        <div
            className={[
                'p-6 pt-0 flex items-center',
                className,
            ].join(' ')}
            {...props}
        >
            {children}
        </div>
    )
}

// src/components/ui/button.tsx
// Componente Button — Design System Empire Gold
// Variantes: premium, secondary, ghost, destructive

import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'premium' | 'secondary' | 'ghost' | 'destructive'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    pulseRing?: boolean
    asChild?: boolean
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
    premium: [
        'relative overflow-hidden',
        'bg-[linear-gradient(135deg,var(--color-empire-gold)_0%,var(--color-empire-gold-light)_50%,var(--color-empire-gold)_100%)]',
        'text-[var(--color-empire-bg)] font-semibold',
        'border-0 rounded-sm',
        'shadow-[var(--shadow-gold)]',
        'hover:-translate-y-0.5 hover:shadow-[0_12px_48px_rgba(201,169,98,0.45)]',
        'active:translate-y-0',
        'transition-all duration-300',
        // Shine overlay
        'after:absolute after:inset-0 after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)]',
        'after:translate-x-[-100%] after:hover:translate-x-[100%] after:transition-transform after:duration-700',
    ].join(' '),

    secondary: [
        'relative overflow-hidden',
        'bg-transparent',
        'text-[var(--color-empire-gold)] font-medium',
        'border border-[var(--color-empire-gold)]',
        'hover:bg-[rgba(201,169,98,0.1)] hover:-translate-y-0.5',
        'active:translate-y-0',
        'transition-all duration-300',
    ].join(' '),

    ghost: [
        'relative overflow-hidden',
        'bg-transparent',
        'text-[var(--color-empire-muted)] font-medium',
        'border-0',
        'hover:bg-[rgba(255,255,255,0.05)] hover:text-[var(--color-empire-text)]',
        'transition-all duration-300',
    ].join(' '),

    destructive: [
        'relative overflow-hidden',
        'bg-[var(--color-semantic-error)]',
        'text-white font-medium',
        'border-0',
        'hover:bg-[#dc2626] hover:-translate-y-0.5',
        'active:translate-y-0',
        'transition-all duration-300',
    ].join(' '),
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
}

export function Button({
    variant = 'premium',
    size = 'md',
    loading = false,
    pulseRing = false,
    asChild = false,
    className = '',
    children,
    disabled,
    ...props
}: ButtonProps) {
    const isDisabled = disabled || loading

    const baseClasses = [
        'inline-flex items-center justify-center gap-2 cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-empire-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-empire-bg)]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        variantClasses[variant],
        sizeClasses[size],
        className,
    ].join(' ')

    if (asChild && React.isValidElement(children)) {
        return (
            <div className="relative inline-flex items-center justify-center">
                {pulseRing && !isDisabled && (
                    <span
                        className="absolute inset-0 rounded-sm bg-[var(--color-empire-gold)] opacity-30 animate-[pulse-ring_1.5s_ease-out_infinite]"
                        aria-hidden="true"
                    />
                )}
                {React.cloneElement(children as React.ReactElement<{ className?: string }>, {
                    className: baseClasses,
                })}
            </div>
        )
    }

    return (
        <div className="relative inline-flex items-center justify-center">
            {/* Pulse ring for primary CTAs */}
            {pulseRing && !isDisabled && (
                <span
                    className="absolute inset-0 rounded-sm bg-[var(--color-empire-gold)] opacity-30 animate-[pulse-ring_1.5s_ease-out_infinite]"
                    aria-hidden="true"
                />
            )}

            <button
                className={baseClasses}
                disabled={isDisabled}
                aria-busy={loading}
                {...props}
            >
                {loading && (
                    <svg
                        className="animate-spin h-4 w-4 shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                )}
                {children}
            </button>
        </div>
    )
}

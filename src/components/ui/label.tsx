// src/components/ui/label.tsx
// Componente Label — Design System Empire Gold

import React from 'react'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    uppercase?: boolean
}

export function Label({
    uppercase = false,
    className = '',
    children,
    ...props
}: LabelProps) {
    return (
        <label
            className={[
                'block text-sm font-medium',
                'text-[var(--color-empire-text)]',
                uppercase ? 'uppercase tracking-[0.1em]' : '',
                className,
            ].join(' ')}
            {...props}
        >
            {children}
        </label>
    )
}

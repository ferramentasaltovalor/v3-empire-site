// src/components/ui/separator.tsx
// Componente Separator — Design System Empire Gold
// Separador com gradiente dourado entre seções

import React from 'react'

export interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> { }

export function Separator({ className = '', ...props }: SeparatorProps) {
    return (
        <hr
            className={[
                'border-0 h-px',
                'bg-[linear-gradient(90deg,transparent,rgba(201,169,98,0.3),transparent)]',
                className,
            ].join(' ')}
            aria-hidden="true"
            {...props}
        />
    )
}

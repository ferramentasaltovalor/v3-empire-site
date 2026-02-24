// src/components/ui/accordion.tsx
// Componente Accordion — Design System Empire Gold
// Usado para FAQ e conteúdo expansível

'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionContextValue {
    openItems: string[]
    toggleItem: (value: string) => void
    type: 'single' | 'multiple'
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null)

interface AccordionProps {
    type?: 'single' | 'multiple'
    defaultValue?: string | string[]
    className?: string
    children: React.ReactNode
}

export function Accordion({
    type = 'single',
    defaultValue,
    className,
    children
}: AccordionProps) {
    const [openItems, setOpenItems] = React.useState<string[]>(() => {
        if (defaultValue) {
            return Array.isArray(defaultValue) ? defaultValue : [defaultValue]
        }
        return []
    })

    const toggleItem = React.useCallback((value: string) => {
        setOpenItems(prev => {
            if (type === 'single') {
                return prev.includes(value) ? [] : [value]
            }
            return prev.includes(value)
                ? prev.filter(item => item !== value)
                : [...prev, value]
        })
    }, [type])

    return (
        <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
            <div className={cn('space-y-2', className)}>
                {children}
            </div>
        </AccordionContext.Provider>
    )
}

interface AccordionItemProps {
    value: string
    className?: string
    children: React.ReactNode
}

export function AccordionItem({ value, className, children }: AccordionItemProps) {
    const context = React.useContext(AccordionContext)
    if (!context) throw new Error('AccordionItem must be used within Accordion')

    const isOpen = context.openItems.includes(value)

    return (
        <div
            className={cn(
                'border-b border-[rgba(201,169,98,0.1)]',
                className
            )}
            data-state={isOpen ? 'open' : 'closed'}
        >
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<{
                        value?: string;
                        isOpen?: boolean
                    }>, { value, isOpen })
                }
                return child
            })}
        </div>
    )
}

interface AccordionTriggerProps {
    children: React.ReactNode
    className?: string
    value?: string
    isOpen?: boolean
}

export function AccordionTrigger({
    children,
    className,
    value = '',
    isOpen = false
}: AccordionTriggerProps) {
    const context = React.useContext(AccordionContext)
    if (!context) throw new Error('AccordionTrigger must be used within Accordion')

    return (
        <button
            type="button"
            onClick={() => context.toggleItem(value)}
            className={cn(
                'flex w-full items-center justify-between',
                'py-5 text-left font-medium',
                'text-[var(--color-empire-text)]',
                'hover:text-[var(--color-empire-gold)]',
                'transition-colors duration-300',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-empire-gold)]',
                className
            )}
            aria-expanded={isOpen}
        >
            <span className="pr-4 font-display text-lg">{children}</span>
            <ChevronDown
                className={cn(
                    'h-5 w-5 shrink-0 text-[var(--color-empire-gold)]',
                    'transition-transform duration-300',
                    isOpen && 'rotate-180'
                )}
            />
        </button>
    )
}

interface AccordionContentProps {
    children: React.ReactNode
    className?: string
    value?: string
    isOpen?: boolean
}

export function AccordionContent({
    children,
    className,
    isOpen = false
}: AccordionContentProps) {
    return (
        <div
            className={cn(
                'overflow-hidden',
                'transition-all duration-300 ease-in-out',
                isOpen ? 'max-h-96 pb-5' : 'max-h-0',
                className
            )}
            aria-hidden={!isOpen}
        >
            <div className="text-[var(--color-empire-muted)] leading-relaxed">
                {children}
            </div>
        </div>
    )
}

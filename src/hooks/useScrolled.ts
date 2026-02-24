// src/hooks/useScrolled.ts
// Hook to detect if page has been scrolled past a threshold
// Used by Navbar for background opacity change

'use client'

import { useState, useEffect } from 'react'

export function useScrolled(threshold: number = 0): boolean {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > threshold)
        }

        // Check on mount
        handleScroll()

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [threshold])

    return scrolled
}

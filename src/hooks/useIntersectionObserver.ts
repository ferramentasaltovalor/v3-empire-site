// src/hooks/useIntersectionObserver.ts
// Hook for fade-in-up animations using IntersectionObserver
// threshold: 0.1 (triggers when 10% of element is visible)

'use client'

import { useState, useEffect, useRef, type RefObject } from 'react'

interface UseIntersectionObserverOptions {
    threshold?: number
    rootMargin?: string
    freezeOnceVisible?: boolean
}

export function useIntersectionObserver<T extends Element>(
    options: UseIntersectionObserverOptions = {}
): [RefObject<T | null>, boolean] {
    const { threshold = 0.1, rootMargin = '0px', freezeOnceVisible = true } = options

    const elementRef = useRef<T | null>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const element = elementRef.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    if (freezeOnceVisible) {
                        observer.unobserve(element)
                    }
                } else if (!freezeOnceVisible) {
                    setIsVisible(false)
                }
            },
            { threshold, rootMargin }
        )

        observer.observe(element)

        return () => observer.disconnect()
    }, [threshold, rootMargin, freezeOnceVisible])

    return [elementRef, isVisible]
}

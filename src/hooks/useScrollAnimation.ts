// src/hooks/useScrollAnimation.ts
// ============================================================================
// HOOK PARA ANIMAÇÕES BASEADAS EM SCROLL
// ============================================================================
// Detecta quando um elemento entra na viewport e dispara animações.
// Usa IntersectionObserver para performance otimizada.
//
// USAGE:
// ```tsx
// const { ref, isVisible } = useScrollAnimation()
// 
// return (
//   <div ref={ref} className={isVisible ? 'animate-fade-in-up' : 'opacity-0'}>
//     Content
//   </div>
// )
// ```
// ============================================================================

'use client'

import { useEffect, useRef, useState } from 'react'

export function useScrollAnimation(threshold = 0.1) {
    const ref = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { threshold }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [threshold])

    return { ref, isVisible }
}

/**
 * Hook para animação staggered de múltiplos filhos
 * Aplica delay progressivo a cada filho
 */
export function useStaggeredAnimation(itemCount: number, baseDelay = 100) {
    const { ref, isVisible } = useScrollAnimation(0.1)

    const getDelay = (index: number) => {
        return isVisible ? index * baseDelay : 0
    }

    return { ref, isVisible, getDelay }
}

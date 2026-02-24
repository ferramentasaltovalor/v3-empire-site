// src/hooks/useContent.ts
// ============================================================================
// HOOKS PARA ACESSAR CONTEÚDO COM TYPE SAFETY
// ============================================================================
// Este arquivo exporta hooks para acessar o conteúdo dos arquivos em src/content/
// Use estes hooks nos componentes para garantir type safety.
//
// USAGE:
// ```tsx
// import { useHomeContent } from '@/hooks/useContent'
// 
// export function HeroSection() {
//   const { hero } = useHomeContent()
//   return <h1>{hero.title}</h1>
// }
// ```
// ============================================================================

import { siteContent } from '@/content/site'
import { navigationContent } from '@/content/navigation'
import { homeContent } from '@/content/home'
import { sobreContent } from '@/content/sobre'
import { contatoContent } from '@/content/contato'
import { footerContent } from '@/content/footer'

import type { SiteContent } from '@/types/content'
import type { NavigationContent } from '@/types/content'
import type { HomeContent } from '@/types/content'
import type { SobreContent } from '@/types/content'
import type { ContatoContent } from '@/types/content'
import type { FooterContent } from '@/types/content'

/**
 * Hook para acessar conteúdo global do site
 * @returns SiteContent - Nome da empresa, contato, redes sociais
 */
export function useSiteContent(): SiteContent {
    return siteContent
}

/**
 * Hook para acessar links de navegação
 * @returns NavigationContent - Links do menu e CTA
 */
export function useNavigationContent(): NavigationContent {
    return navigationContent
}

/**
 * Hook para acessar conteúdo da homepage
 * @returns HomeContent - Todas as seções da homepage
 */
export function useHomeContent(): HomeContent {
    return homeContent
}

/**
 * Hook para acessar conteúdo da página Sobre
 * @returns SobreContent - Missão, valores, equipe, timeline
 */
export function useSobreContent(): SobreContent {
    return sobreContent
}

/**
 * Hook para acessar conteúdo da página de Contato
 * @returns ContatoContent - Formulário, informações de contato, FAQ
 */
export function useContatoContent(): ContatoContent {
    return contatoContent
}

/**
 * Hook para acessar conteúdo do footer
 * @returns FooterContent - Brand, links, redes sociais, legal
 */
export function useFooterContent(): FooterContent {
    return footerContent
}

// Re-export dos tipos para conveniência
export type {
    SiteContent,
    NavigationContent,
    HomeContent,
    SobreContent,
    ContatoContent,
    FooterContent,
} from '@/types/content'

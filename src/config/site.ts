// src/config/site.ts
// Configurações globais do site Empire

export const siteConfig = {
    name: 'Empire',
    description: 'Empire — Consultoria e estratégia de alto impacto',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    ogImage: '/images/og-default.jpg',
    links: {
        instagram: 'https://instagram.com/empire',
        youtube: 'https://youtube.com/@empire',
        linkedin: 'https://linkedin.com/company/empire',
    },
} as const

export type SiteConfig = typeof siteConfig

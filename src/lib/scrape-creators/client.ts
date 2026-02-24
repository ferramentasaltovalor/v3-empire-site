// src/lib/scrape-creators/client.ts
// Cliente Scrape Creators API — APENAS para uso no servidor
// NUNCA importar em Client Components

// ATENÇÃO: Implementar SOMENTE após pesquisa completa da documentação
// Ver: docs/integracoes.md seção Scrape Creators
// Ver: G04-T02 em docs/roadmap/grupo-04-ia-e-conteudo/

export const SCRAPE_CREATORS_CONFIG = {
    apiKey: process.env.SCRAPE_CREATORS_API_KEY || '',
    // TODO: Verificar URL base atual na documentação oficial
    baseUrl: 'https://api.scrapecreators.com',
} as const

// TODO: Implementar após G04-T02 (pesquisa Scrape Creators)
// export async function scrapeInstagram(url: string) {}
// export async function scrapeYoutube(url: string) {}

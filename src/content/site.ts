// src/content/site.ts
// ============================================================================
// CONTEÚDO GLOBAL DO SITE EMPIRE
// ============================================================================
// Este arquivo contém informações que aparecem em múltiplas páginas do site.
// Edite os valores abaixo para atualizar nome, contato e redes sociais.
//
// REGRAS:
// - NÃO apague os nomes das propriedades (ex: companyName, contact, etc.)
// - Mantenha o texto entre 'aspas simples'
// - Cada propriedade deve ter vírgula no final
// ============================================================================

export const siteContent = {
    // ==========================================================================
    // IDENTIDADE DA EMPRESA
    // ==========================================================================

    // Nome da empresa — aparece no logo, título das páginas (browser tab), footer
    companyName: 'Empire',

    // Tagline — frase curta que aparece abaixo do logo e em meta descriptions
    tagline: 'Estratégia de alto impacto para negócios que querem crescer',

    // Descrição curta — usada em meta descriptions para SEO (máx. 160 caracteres)
    shortDescription: 'A Empire é uma consultoria especializada em estratégia e crescimento de negócios.',

    // ==========================================================================
    // INFORMAÇÕES DE CONTATO
    // ==========================================================================
    // Aparecem no footer, página de contato, e em CTAs de WhatsApp
    // Deixe vazio ('') se não quiser exibir algum campo

    contact: {
        // E-mail principal de contato
        email: 'contato@empire.com.br',

        // Telefone fixo (opcional) — formato: (11) 3333-3333
        phone: '(11) 3333-3333',

        // WhatsApp — apenas números, sem espaços ou traços
        // Ex: '5511999999999' (código do país + DDD + número)
        whatsapp: '5511999999999',

        // Endereço físico (opcional) — aparece no footer e página de contato
        address: 'São Paulo, SP - Brasil',
    },

    // ==========================================================================
    // REDES SOCIAIS
    // ==========================================================================
    // Links para ícones de redes sociais no footer e outras áreas
    // Deixe vazio ('') para não exibir o ícone

    social: {
        // Instagram — URL completa do perfil
        instagram: 'https://instagram.com/empire',

        // YouTube — URL completa do canal
        youtube: 'https://youtube.com/@empire',

        // LinkedIn — URL completa da página da empresa
        linkedin: 'https://linkedin.com/company/empire',
    },
} as const

// Tipo exportado para uso em componentes com TypeScript
export type SiteContent = typeof siteContent

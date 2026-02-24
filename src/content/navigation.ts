// src/content/navigation.ts
// ============================================================================
// LINKS DE NAVEGAÇÃO DO SITE PÚBLICO
// ============================================================================
// Este arquivo controla o menu principal (navbar) do site.
// Edite os valores abaixo para adicionar, remover ou renomear links.
//
// COMO EDITAR:
// - Para adicionar um link: copie uma linha e altere label e href
// - Para remover um link: apague a linha inteira (incluindo a vírgula)
// - Para mudar a ordem: recorte e cole a linha na posição desejada
//
// REGRAS:
// - label: texto que aparece no botão/link
// - href: URL de destino (comece com / para páginas internas)
// - Mantenha as aspas simples e vírgulas
// ============================================================================

export const navigationContent = {
    // ==========================================================================
    // LINKS PRINCIPAIS DO MENU
    // ==========================================================================
    // Aparecem no centro da navbar em desktop, e no menu mobile

    mainLinks: [
        { label: 'Início', href: '/' },
        { label: 'Sobre', href: '/sobre' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contato', href: '/contato' },
        // Para adicionar mais links, copie o formato acima:
        // { label: 'Nome do Link', href: '/pagina' },
    ],

    // ==========================================================================
    // BOTÃO CTA (CALL-TO-ACTION)
    // ==========================================================================
    // Botão de destaque no canto direito da navbar
    // Use para a ação principal que você quer que o visitante faça

    cta: {
        // Texto do botão — mantenha curto (2-4 palavras)
        label: 'Falar com especialista',

        // URL de destino — geralmente /contato ou uma landing page
        href: '/contato',
    },

    // ==========================================================================
    // TEXTOS DO MENU MOBILE
    // ==========================================================================
    // Textos de acessibilidade para o botão do menu em dispositivos móveis

    // Texto para leitores de tela quando o menu está fechado
    mobileMenuOpen: 'Abrir menu',

    // Texto para leitores de tela quando o menu está aberto
    mobileMenuClose: 'Fechar menu',
} as const

// Tipo exportado para uso em componentes com TypeScript
export type NavigationContent = typeof navigationContent

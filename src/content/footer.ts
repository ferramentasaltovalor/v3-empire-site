// src/content/footer.ts
// ============================================================================
// CONTEÚDO DO FOOTER (RODAPÉ)
// ============================================================================
// Este arquivo controla todo o conteúdo do rodapé do site.
// O footer aparece em todas as páginas do site público.
//
// ============================================================================
// COMO EDITAR:
// ============================================================================
// - Encontre a seção desejada e altere o valor do campo
// - NÃO altere os nomes das propriedades
// - O ano do copyright é atualizado automaticamente
// ============================================================================

export const footerContent = {
    // ==========================================================================
    // SEÇÃO 1: BRAND
    // ==========================================================================
    // Descrição da empresa que aparece ao lado do logo

    brand: {
        // Nome da empresa (geralmente puxado de siteContent, mas pode ser diferente aqui)
        name: 'Empire',

        // Descrição curta que aparece abaixo do logo
        description: 'Consultoria de estratégia e crescimento para negócios de alto impacto.',

        // Slogan/tagline (opcional)
        tagline: 'Transformando negócios com método.',
    },

    // ==========================================================================
    // SEÇÃO 2: LINKS DE NAVEGAÇÃO
    // ==========================================================================
    // Organizados em colunas para facilitar a navegação

    navigation: {
        // Coluna 1: Links principais
        main: {
            title: 'Navegação',
            links: [
                { label: 'Início', href: '/' },
                { label: 'Sobre', href: '/sobre' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contato', href: '/contato' },
            ],
        },

        // Coluna 2: Links de conteúdo (opcional)
        content: {
            title: 'Conteúdo',
            links: [
                { label: 'Artigos', href: '/blog' },
                { label: 'Categorias', href: '/blog/categoria' },
                // Adicione mais links conforme necessário
            ],
        },
    },

    // ==========================================================================
    // SEÇÃO 3: LINKS LEGAIS
    // ==========================================================================
    // Links para páginas legais e copyright

    legal: {
        // Texto de copyright — o ano é atualizado automaticamente
        copyright: `© ${new Date().getFullYear()} Empire. Todos os direitos reservados.`,

        // Links para páginas legais
        links: [
            { label: 'Política de Privacidade', href: '/privacidade' },
            { label: 'Termos de Uso', href: '/termos' },
        ],
    },

    // ==========================================================================
    // SEÇÃO 4: REDES SOCIAIS
    // ==========================================================================
    // Ícones de redes sociais com links
    // As URLs são geralmente puxadas de siteContent.social

    social: {
        title: 'Siga-nos',
        links: [
            {
                platform: 'instagram',
                label: 'Instagram',
                href: 'https://instagram.com/empire',
                icon: 'instagram', // Nome do ícone Lucide
            },
            {
                platform: 'youtube',
                label: 'YouTube',
                href: 'https://youtube.com/@empire',
                icon: 'youtube',
            },
            {
                platform: 'linkedin',
                label: 'LinkedIn',
                href: 'https://linkedin.com/company/empire',
                icon: 'linkedin',
            },
        ],
    },

    // ==========================================================================
    // SEÇÃO 5: CONTATO (OPCIONAL)
    // ==========================================================================
    // Informações de contato resumidas no footer

    contact: {
        title: 'Contato',
        email: 'contato@empire.com.br',
        phone: '(11) 3333-3333',
        whatsapp: 'https://wa.me/5511999999999',
    },

    // ==========================================================================
    // SEÇÃO 6: NEWSLETTER (OPCIONAL)
    // ==========================================================================
    // Formulário de inscrição para newsletter
    // Deixe enabled: false se não quiser exibir

    newsletter: {
        enabled: false,
        title: 'Newsletter',
        description: 'Receba insights e estratégias toda semana.',
        placeholder: 'Seu e-mail',
        buttonLabel: 'Inscrever',
        successMessage: 'Inscrição realizada com sucesso!',
        errorMessage: 'Erro ao inscrever. Tente novamente.',
    },

    // ==========================================================================
    // SEÇÃO 7: BADGES/SELOS (OPCIONAL)
    // ==========================================================================
    // Selos de segurança ou certificações
    // Deixe vazio [] se não tiver badges

    badges: [] as Array<{
        name: string
        image: string
        href?: string
    }>,
    // Exemplo:
    // badges: [
    //   { name: 'Reclame Aqui', image: '/images/badges/reclame-aqui.png', href: 'https://reclameaqui.com/empire' },
    // ],
} as const

// Tipo exportado para uso em componentes com TypeScript
export type FooterContent = typeof footerContent

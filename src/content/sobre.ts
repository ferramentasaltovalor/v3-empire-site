// src/content/sobre.ts
// ============================================================================
// CONTEÚDO DA PÁGINA SOBRE
// ============================================================================
// Este arquivo contém todo o texto da página "Sobre a Empire".
// Use para contar a história da empresa, missão, valores e equipe.
//
// ============================================================================
// COMO EDITAR:
// ============================================================================
// - Encontre a seção desejada e altere o valor do campo
// - NÃO altere os nomes das propriedades
// - Use [palavra] para destaque dourado em títulos
// ============================================================================

export const sobreContent = {
    // ==========================================================================
    // SEÇÃO 1: HERO
    // ==========================================================================
    // Primeira impressão da página Sobre

    hero: {
        // Label pequeno acima do título
        label: 'Sobre a Empire',

        // Título principal — pode usar [destaque] dourado
        title: 'Quem somos e o que nos move',

        // Subtítulo explicativo
        subtitle: 'A Empire nasceu da convicção de que toda empresa tem potencial para crescer mais — com a estratégia certa.',
    },

    // ==========================================================================
    // SEÇÃO 2: MISSÃO
    // ==========================================================================
    // Declaração clara do propósito da empresa

    mission: {
        title: 'Nossa missão',
        description: 'Transformar negócios através de estratégia, método e execução de alto impacto.',
    },

    // ==========================================================================
    // SEÇÃO 3: VISÃO
    // ==========================================================================
    // Onde queremos chegar

    vision: {
        title: 'Nossa visão',
        description: 'Ser a consultoria de referência para empresas que buscam crescimento sustentável e mensurável.',
    },

    // ==========================================================================
    // SEÇÃO 4: VALORES
    // ==========================================================================
    // Princípios que guiam nossas decisões
    // Adicione ou remova valores conforme necessário

    values: [
        {
            title: 'Excelência',
            description: 'Entregamos o melhor em tudo que fazemos, sem atalhos.'
        },
        {
            title: 'Transparência',
            description: 'Comunicação clara e honesta em todas as etapas.'
        },
        {
            title: 'Resultado',
            description: 'Focados em impacto real e mensurável para nossos clientes.'
        },
        {
            title: 'Parceria',
            description: 'Tratamos cada cliente como um parceiro de longo prazo.'
        },
    ],

    // ==========================================================================
    // SEÇÃO 5: EQUIPE (OPCIONAL)
    // ==========================================================================
    // Cards com foto, nome e cargo dos principais colaboradores
    // Deixe vazio [] se não quiser exibir

    team: {
        title: 'Nossa equipe',
        subtitle: 'Profissionais experientes comprometidos com seu sucesso.',
        members: [] as Array<{
            name: string
            role: string
            bio: string
            image: string
            linkedin?: string
        }>,
        // Exemplo de como adicionar membros:
        // members: [
        //   {
        //     name: 'João Silva',
        //     role: 'CEO & Fundador',
        //     bio: '20 anos de experiência em estratégia corporativa.',
        //     image: '/images/team/joao.jpg',
        //     linkedin: 'https://linkedin.com/in/joao',
        //   },
        // ],
    },

    // ==========================================================================
    // SEÇÃO 6: TIMELINE/HISTÓRIA (OPCIONAL)
    // ==========================================================================
    // Marcos importantes da história da empresa
    // Deixe vazio [] se não quiser exibir

    timeline: {
        title: 'Nossa trajetória',
        events: [] as Array<{
            year: string
            title: string
            description: string
        }>,
        // Exemplo de como adicionar eventos:
        // events: [
        //   {
        //     year: '2020',
        //     title: 'Fundação',
        //     description: 'A Empire nasce com a missão de transformar negócios.',
        //   },
        //   {
        //     year: '2022',
        //     title: 'Expansão',
        //     description: 'Conquistamos nosso primeiro cliente de grande porte.',
        //   },
        // ],
    },

    // ==========================================================================
    // SEÇÃO 7: CTA FINAL
    // ==========================================================================
    // Chamada para ação no final da página

    cta: {
        title: 'Vamos [conversar]?',
        subtitle: 'Descubra como a Empire pode ajudar sua empresa a crescer.',
        button: {
            label: 'Entrar em contato',
            href: '/contato',
        },
    },
} as const

// Tipo exportado para uso em componentes com TypeScript
export type SobreContent = typeof sobreContent

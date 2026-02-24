// src/content/home.ts
// ============================================================================
// CONTEÚDO DA PÁGINA INICIAL (HOMEPAGE)
// ============================================================================
// Este arquivo contém TODO o texto da homepage, organizado por seções.
// As seções aparecem na ordem definida aqui de cima para baixo na página.
//
// ============================================================================
// COMO EDITAR TEXTO:
// ============================================================================
// - Encontre a seção desejada (hero, socialProof, problem, etc.)
// - Altere o valor do campo (texto entre aspas)
// - NÃO altere os nomes das propriedades (ex: badge, title, subtitle)
//
// ============================================================================
// COMO USAR DESTAQUE DOURADO EM TÍTULOS:
// ============================================================================
// Coloque a palavra entre [colchetes] para destacá-la em dourado:
//   title: 'Estratégia que [transforma] negócios'
// Resultado: "transforma" aparecerá em cor dourada
//
// ============================================================================
// COMO ADICIONAR/REMOVER ITENS DE LISTAS:
// ============================================================================
// Para adicionar um item em uma lista (benefits, painPoints, etc.):
//   1. Copie uma linha existente
//   2. Altere o conteúdo
//   3. Certifique-se de que há vírgula no final
//
// Para remover:
//   1. Apague a linha inteira
//   2. Ajuste as vírgulas (o item anterior não deve ter vírgula se for o último)
//
// ============================================================================
// ÍCONES (campos 'icon'):
// ============================================================================
// Os campos 'icon' usam nomes de ícones da biblioteca Lucide.
// Nomes disponíveis: target, chart, team, lightbulb, rocket, check, etc.
// Lista completa: https://lucide.dev/icons/
// ============================================================================

export const homeContent = {
    // ==========================================================================
    // SEÇÃO 1: HERO
    // ==========================================================================
    // Primeira seção da página, aparece logo abaixo da navbar.
    // É a impressão inicial do visitante — invista em um título forte.

    hero: {
        // Badge: pequeno texto acima do título (opcional)
        badge: 'Consultoria Premium',

        // Título principal — use [palavra] para destaque dourado
        // Exemplo: 'Estratégia que [transforma] negócios'
        title: 'Estratégia que [transforma] negócios',

        // Subtítulo: complementa o título, explique o que você faz
        subtitle: 'Ajudamos empresas a crescer com estratégia, método e execução de alto impacto.',

        // Benefícios: lista com checkmarks dourados
        // Adicione até 4 benefícios curtos
        benefits: [
            'Metodologia comprovada',
            'Resultados mensuráveis',
            'Equipe especializada',
        ],

        // Botões de ação (CTAs)
        cta: {
            // Botão principal (dourado, mais visível)
            primary: {
                label: 'Começar agora',
                href: '/contato',
            },
            // Botão secundário (outline, menos destacado)
            secondary: {
                label: 'Conhecer a Empire',
                href: '/sobre',
            },
        },
    },

    // ==========================================================================
    // SEÇÃO 2: SOCIAL PROOF (PROVA SOCIAL)
    // ==========================================================================
    // Números de impacto e logos de empresas clientes.
    // Gera credibilidade e confiança.

    socialProof: {
        // Números de destaque — até 4 stats recomendados
        stats: [
            { number: '500+', label: 'Empresas atendidas' },
            { number: 'R$ 2B+', label: 'Em receita gerada' },
            { number: '98%', label: 'Taxa de satisfação' },
        ],

        // Texto introdutório para a área de logos
        logosTitle: 'Empresas que confiam na Empire',

        // Logos de clientes (opcional)
        // Cada logo precisa de: name (nome da empresa), src (caminho da imagem), alt (texto alternativo)
        // Deixe vazio [] se não tiver logos ainda
        logos: [] as Array<{ name: string; src: string; alt: string }>,
    },

    // ==========================================================================
    // SEÇÃO 3: PROBLEMA (DORES DO CLIENTE)
    // ==========================================================================
    // Seção que identifica as dores do público-alvo.
    // Ajuda o visitante a se identificar com o problema.

    problem: {
        // Label pequeno acima do título
        label: 'O problema',

        // Título da seção — pode usar [destaque] dourado
        title: 'Por que a maioria das empresas não cresce como deveria?',

        // Subtítulo explicativo
        subtitle: 'Identificamos os principais obstáculos que impedem o crescimento sustentável.',

        // Cards de pontos de dor
        // Cada card tem: icon (nome Lucide), title, description, quote (depoimento opcional)
        painPoints: [
            {
                icon: 'target', // Nome do ícone Lucide
                title: 'Falta de estratégia clara',
                description: 'Sem um plano definido, as ações se tornam reativas e os recursos são desperdiçados.',
                quote: '"Trabalhamos muito, mas não avançamos."',
            },
            {
                icon: 'chart',
                title: 'Métricas sem significado',
                description: 'Dados sem contexto não geram decisões. A maioria mede o que é fácil, não o que importa.',
                quote: '"Temos dados, mas não sabemos o que fazer com eles."',
            },
            {
                icon: 'team',
                title: 'Execução inconsistente',
                description: 'Boas ideias morrem na implementação. A distância entre planejar e executar é onde os negócios falham.',
                quote: '"Planejamos muito e entregamos pouco."',
            },
        ],
    },

    // ==========================================================================
    // SEÇÃO 4: SOLUÇÃO
    // ==========================================================================
    // Como a Empire resolve os problemas identificados na seção anterior.
    // Conecta as dores com a metodologia/serviços.

    solution: {
        // Label pequeno acima do título
        label: 'A solução',

        // Título — use [palavra] para destaque dourado
        title: 'Uma abordagem [diferente] para crescimento real',

        // Subtítulo explicativo
        subtitle: 'Combinamos estratégia, dados e execução em um método que gera resultados consistentes.',

        // Features: diferenciais da Empire
        features: [
            { title: 'Diagnóstico profundo', description: 'Entendemos seu negócio antes de propor qualquer solução.' },
            { title: 'Estratégia personalizada', description: 'Nada de templates. Cada plano é construído para sua realidade.' },
            { title: 'Execução acompanhada', description: 'Estamos ao lado da sua equipe durante toda a implementação.' },
            { title: 'Resultados mensuráveis', description: 'Definimos métricas claras e acompanhamos cada indicador.' },
        ],

        // CTA da seção
        cta: {
            label: 'Ver como funciona',
            href: '/sobre',
        },
    },

    // ==========================================================================
    // SEÇÃO 5: METODOLOGIA
    // ==========================================================================
    // Explica o processo de trabalho em fases.
    // Ajuda o cliente a entender o que esperar.

    methodology: {
        // Label pequeno acima do título
        label: 'Metodologia',

        // Título da seção
        title: 'Como transformamos seu negócio',

        // Fases do processo
        // Cada fase tem: number, badge (tempo), title, description, cards (lista de atividades)
        phases: [
            {
                number: '01',
                badge: 'Semana 1-2',
                title: 'Diagnóstico',
                description: 'Análise profunda do negócio, mercado e oportunidades.',
                cards: ['Análise de dados', 'Entrevistas com stakeholders', 'Mapeamento de processos'],
            },
            {
                number: '02',
                badge: 'Semana 3-4',
                title: 'Estratégia',
                description: 'Desenvolvimento do plano de crescimento personalizado.',
                cards: ['Definição de objetivos', 'Priorização de iniciativas', 'Roadmap de execução'],
            },
            {
                number: '03',
                badge: 'Mês 2-6',
                title: 'Execução',
                description: 'Implementação acompanhada com ajustes contínuos.',
                cards: ['Sprints de implementação', 'Monitoramento de KPIs', 'Ajustes estratégicos'],
            },
        ],
    },

    // ==========================================================================
    // SEÇÃO 6: BLOG PREVIEW
    // ==========================================================================
    // Preview dos últimos artigos do blog.
    // Gera autoridade e atrai tráfego orgânico.

    blogPreview: {
        // Label pequeno acima do título
        label: 'Conteúdo',

        // Título da seção
        title: 'Insights para crescer',

        // Subtítulo explicativo
        subtitle: 'Artigos, análises e estratégias para líderes que querem resultados.',

        // CTA para ver todos os artigos
        cta: {
            label: 'Ver todos os artigos',
            href: '/blog',
        },
    },

    // ==========================================================================
    // SEÇÃO 7: FAQ (PERGUNTAS FREQUENTES)
    // ==========================================================================
    // Seção opcional para quebrar objeções.
    // Use accordion (expandir/contrair) para manter a página limpa.

    faq: {
        // Label pequeno acima do título
        label: 'Dúvidas',

        // Título da seção
        title: 'Perguntas frequentes',

        // Subtítulo explicativo
        subtitle: 'Encontre respostas para as dúvidas mais comuns.',

        // Lista de perguntas e respostas
        items: [
            {
                question: 'Como funciona o processo de consultoria?',
                answer: 'Iniciamos com um diagnóstico gratuito para entender sua necessidade. A partir disso, apresentamos uma proposta personalizada com cronograma e entregáveis claros.',
            },
            {
                question: 'Qual o investimento mínimo para trabalhar com a Empire?',
                answer: 'Trabalhamos com projetos a partir de R$ 10.000/mês para consultorias contínuas. Projetos pontuais são orçados individualmente.',
            },
            {
                question: 'Quanto tempo leva para ver resultados?',
                answer: 'Os primeiros resultados geralmente aparecem entre 30 e 90 dias, dependendo da complexidade do projeto e engajamento da equipe.',
            },
            {
                question: 'Vocês atendem empresas de qual porte?',
                answer: 'Atendemos desde startups em estágio inicial até empresas de médio e grande porte. Nossa metodologia se adapta a diferentes realidades.',
            },
        ],
    },

    // ==========================================================================
    // SEÇÃO 8: CTA FINAL
    // ==========================================================================
    // Última seção antes do footer.
    // Chamada forte para ação — converta visitantes em leads.

    finalCta: {
        // Título — use [palavra] para destaque dourado
        title: 'Pronto para [transformar] seu negócio?',

        // Subtítulo persuasivo
        subtitle: 'Fale com um especialista e descubra como a Empire pode acelerar seu crescimento.',

        // Botão de ação principal
        cta: {
            primary: {
                label: 'Agendar conversa',
                href: '/contato',
            },
        },
    },
} as const

// Tipo exportado para uso em componentes com TypeScript
export type HomeContent = typeof homeContent

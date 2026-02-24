// src/content/contato.ts
// ============================================================================
// CONTEÚDO DA PÁGINA DE CONTATO
// ============================================================================
// Este arquivo contém todo o texto da página de contato.
// Inclui: hero, campos do formulário, mensagens de sucesso/erro, e info de contato.
//
// ============================================================================
// COMO EDITAR:
// ============================================================================
// - Encontre a seção desejada e altere o valor do campo
// - NÃO altere os nomes das propriedades
// - Use [palavra] para destaque dourado em títulos
// ============================================================================

export const contatoContent = {
    // ==========================================================================
    // SEÇÃO 1: HERO
    // ==========================================================================
    // Primeira impressão da página de contato

    hero: {
        // Label pequeno acima do título
        label: 'Contato',

        // Título principal — pode usar [destaque] dourado
        title: 'Vamos conversar sobre seu negócio',

        // Subtítulo explicativo
        subtitle: 'Preencha o formulário e um especialista entrará em contato em até 24 horas.',
    },

    // ==========================================================================
    // SEÇÃO 2: FORMULÁRIO
    // ==========================================================================
    // Configuração dos campos do formulário de contato

    form: {
        // Labels e placeholders de cada campo
        fields: {
            name: {
                label: 'Nome completo',
                placeholder: 'Seu nome'
            },
            email: {
                label: 'E-mail',
                placeholder: 'seu@email.com'
            },
            company: {
                label: 'Empresa',
                placeholder: 'Nome da sua empresa'
            },
            phone: {
                label: 'Telefone',
                placeholder: '(11) 99999-9999'
            },
            message: {
                label: 'Mensagem',
                placeholder: 'Conte um pouco sobre seu negócio e o que você precisa...'
            },
        },

        // Texto do botão de envio
        submitLabel: 'Enviar mensagem',

        // Texto de carregamento (quando o formulário está sendo enviado)
        submittingLabel: 'Enviando...',

        // Mensagem de sucesso (após envio)
        successMessage: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',

        // Mensagem de erro (se falhar o envio)
        errorMessage: 'Erro ao enviar mensagem. Por favor, tente novamente ou entre em contato por WhatsApp.',
    },

    // ==========================================================================
    // SEÇÃO 3: INFORMAÇÕES DE CONTATO
    // ==========================================================================
    // Exibidas ao lado do formulário ou abaixo dele

    info: {
        title: 'Outras formas de contato',

        // Cards de informação de contato
        cards: [
            {
                icon: 'mail', // Nome do ícone Lucide
                title: 'E-mail',
                description: 'contato@empire.com.br',
                link: 'mailto:contato@empire.com.br',
            },
            {
                icon: 'phone',
                title: 'Telefone',
                description: '(11) 3333-3333',
                link: 'tel:+551133333333',
            },
            {
                icon: 'message-circle',
                title: 'WhatsApp',
                description: 'Atendimento rápido',
                link: 'https://wa.me/5511999999999',
            },
            {
                icon: 'map-pin',
                title: 'Endereço',
                description: 'São Paulo, SP - Brasil',
                link: null, // Sem link
            },
        ],
    },

    // ==========================================================================
    // SEÇÃO 4: HORÁRIO DE ATENDIMENTO (OPCIONAL)
    // ==========================================================================

    businessHours: {
        title: 'Horário de atendimento',
        description: 'Segunda a Sexta: 9h às 18h',
    },

    // ==========================================================================
    // SEÇÃO 5: FAQ RÁPIDO (OPCIONAL)
    // ==========================================================================
    // Perguntas comuns sobre o processo de contato

    quickFaq: {
        title: 'Dúvidas frequentes',
        items: [
            {
                question: 'Quanto tempo para responder?',
                answer: 'Respondemos todas as mensagens em até 24 horas úteis.',
            },
            {
                question: 'A consultoria é presencial ou remota?',
                answer: 'Atendemos de forma híbrida. Reuniões podem ser presenciais em São Paulo ou por videoconferência.',
            },
            {
                question: 'Vocês fazem diagnóstico gratuito?',
                answer: 'Sim! Oferecemos uma primeira conversa sem compromisso para entender sua necessidade.',
            },
        ],
    },
} as const

// Tipo exportado para uso em componentes com TypeScript
export type ContatoContent = typeof contatoContent

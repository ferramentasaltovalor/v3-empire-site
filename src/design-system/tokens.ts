// src/design-system/tokens.ts
// FONTE ÚNICA DA VERDADE — Design System Empire Gold
// Para mudar o visual do site inteiro, altere apenas este arquivo.
// NUNCA escreva cores, fontes ou espaçamentos diretamente em componentes.

export const colors = {
    empire: {
        // Fundos
        bg: '#0a0a0b',   // Fundo principal — quase preto
        surface: '#111113',   // Seções alternadas
        card: '#18181b',   // Cards e containers
        border: '#27272a',   // Bordas sutis

        // Texto
        text: '#fafafa',   // Texto principal
        muted: '#71717a',   // Texto secundário

        // Gold — Acento premium
        gold: '#c9a962',  // CTAs, destaques, elementos ativos
        goldLight: '#e4d4a5',  // Hover, highlights
        goldDark: '#9a7b3c',  // Sombras, profundidade

        // Variações opcionais (documentadas, não obrigatórias)
        silver: '#a8a8a8',
        silverLight: '#d4d4d4',
        silverDark: '#737373',
        bronze: '#b08d57',
        bronzeLight: '#d4b896',
        bronzeDark: '#8b6914',
    },

    // Admin — painel interno (fundo claro)
    admin: {
        bg: '#FFFFFF',
        surface: '#F9FAFB',
        sidebar: '#FFFFFF',
        border: '#E5E7EB',
        text: '#111827',
        muted: '#6B7280',
        accent: '#c9a962',  // mesmo gold da marca
        accentHover: '#9a7b3c',
    },

    // Semânticas
    semantic: {
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
    },
} as const

export const typography = {
    fonts: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['DM Sans', 'sans-serif'],
    },
    sizes: {
        // Usando clamp para responsividade fluida
        h1: 'clamp(2.5rem, 8vw, 5rem)',    // 40px → 80px
        h2: 'clamp(1.75rem, 5vw, 3rem)',   // 28px → 48px
        h3: 'clamp(1.25rem, 3vw, 1.5rem)', // 20px → 24px
        body: 'clamp(1rem, 2vw, 1.125rem)',  // 16px → 18px
        small: '0.875rem',                    // 14px
        label: '0.75rem',                     // 12px
    },
    weights: {
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
    lineHeights: {
        tight: 1.1,
        snug: 1.2,
        normal: 1.3,
        relaxed: 1.6,
    },
    letterSpacing: {
        label: '0.1em',  // para tags e labels uppercase
    },
} as const

export const spacing = {
    // Sistema de 8px
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',     // 48px
    '3xl': '4rem',     // 64px
    '4xl': '6rem',     // 96px
    '5xl': '8rem',     // 128px
} as const

export const containers = {
    narrow: '56rem',   // 896px  — max-w-4xl
    default: '72rem',   // 1152px — max-w-6xl
    wide: '80rem',   // 1280px — max-w-7xl
} as const

export const effects = {
    transitions: {
        fast: 'all 0.3s ease',
        medium: 'all 0.4s ease',
        slow: 'all 0.8s ease',
    },
    shadows: {
        card: '0 20px 60px rgba(0,0,0,0.4)',
        gold: '0 10px 40px rgba(201, 169, 98, 0.3)',
        subtle: '0 4px 16px rgba(0,0,0,0.2)',
    },
    gradients: {
        gold: 'linear-gradient(135deg, #c9a962 0%, #e4d4a5 50%, #c9a962 100%)',
        goldSubtle: 'linear-gradient(90deg, transparent, rgba(201, 169, 98, 0.3), transparent)',
        goldOverlay: 'rgba(201, 169, 98, 0.05)',
        shine: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
    },
    borders: {
        goldGradient: `
      background: linear-gradient(#18181b, #18181b) padding-box,
                  linear-gradient(135deg, #c9a962, #e4d4a5, #c9a962) border-box;
      border: 1px solid transparent;
    `,
    },
} as const

export const patterns = {
    grid: `
    background-image:
      linear-gradient(rgba(201, 169, 98, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201, 169, 98, 0.03) 1px, transparent 1px);
    background-size: 60px 60px;
  `,
} as const

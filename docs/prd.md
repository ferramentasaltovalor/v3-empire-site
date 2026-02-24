# PRD Técnico Completo — Empire Site (Revisão 1.1)

**Versão:** 1.1
**Data:** 2025-07-15
**Ambiente:** Claude Code (Terminal da Anthropic)
**Arquivo de instrução da IA:** `claude.md`
**Mudança em relação à v1.0:** Remoção do mockup como referência. Adoção do Design System Empire Gold (dark mode, tipografia Cormorant Garamond + DM Sans, paleta dourada tokenizada). Referência de estrutura/layout: g4business.com (investigação obrigatória antes da implementação).

---

# 📖 ÍNDICE

1. [Visão Geral em Linguagem Simples](#visao-geral)
2. [Objetivos e Escopo](#objetivos)
3. [Design System Empire Gold](#design-system)
4. [Referência Visual — G4 Business](#referencia-visual)
5. [Stack Tecnológica](#stack)
6. [Arquitetura do Sistema](#arquitetura)
7. [Módulos e Funcionalidades](#modulos)
8. [Integrações Externas](#integracoes)
9. [Segurança](#seguranca)
10. [SEO e Performance](#seo-performance)
11. [Estrutura de Documentação Viva](#documentacao)
12. [Roadmap de Execução](#roadmap)
13. [Variáveis de Ambiente](#env)
14. [Protocolo de Mudanças](#mudancas)
15. [Regras da IA — claude.md](#claudemd)

---

<a name="visao-geral"></a>
# 🟢 SEÇÃO 1 — VISÃO GERAL EM LINGUAGEM SIMPLES

## O que é o Empire Site?

O Empire Site é o site completo da empresa Empire. Ele tem duas partes principais: **o que o público vê** (o site e o blog) e **o painel de controle interno** (só para a equipe da empresa).

---

## Como o site vai parecer visualmente?

O site terá uma estética **premium e sofisticada**: fundo escuro (quase preto), textos em branco e detalhes dourados. É um visual elegante, moderno e de alto impacto — como sites de empresas de consultoria e negócios de alto valor.

A estrutura de seções, navegação e organização de conteúdo será inspirada no site **g4business.com**, que será investigado profundamente antes de qualquer implementação. O objetivo não é copiar — é entender o que faz aquele site funcionar bem e aplicar os mesmos princípios ao Empire.

---

## A parte pública (o que qualquer pessoa vê)

- **Páginas institucionais** — quem é a Empire, o que faz, como entrar em contato
- **Blog** — artigos publicados pela equipe, com categorias, tags e busca
- **Landing pages** — páginas criadas para campanhas específicas, completamente isoladas do layout principal

---

## A parte interna (painel de controle)

O painel tem visual limpo com fundo claro — diferente do site público. Dentro dele, a equipe pode:

- Escrever e publicar artigos com editor completo
- Usar IA para gerar conteúdo
- Transformar posts de Instagram ou YouTube em artigos de blog
- Preencher SEO automaticamente com IA
- Agendar publicações, fazer preview antes de publicar
- Gerenciar imagens em pastas
- Criar landing pages com ajuda de IA
- Conectar Google Analytics e outras ferramentas
- Configurar integrações com sistemas externos
- Gerenciar quem acessa o painel e com quais permissões

---

## Quem pode acessar o quê?

| Perfil | Permissões |
|---|---|
| **Super Admin** | Tudo, incluindo configurações do sistema |
| **Admin** | Tudo exceto configurações críticas |
| **Editor** | Criar, editar e publicar qualquer conteúdo |
| **Autor** | Criar e editar os próprios posts (não publica) |
| **Visualizador** | Apenas leitura no painel |

---

<a name="objetivos"></a>
# 🎯 SEÇÃO 2 — OBJETIVOS E ESCOPO

## Objetivo Principal

Construir o site completo da Empire: presença pública premium com estética dark gold + painel administrativo completo com geração de conteúdo por IA.

## Dentro do Escopo

- Site público com design Empire Gold (dark mode + dourado)
- Blog completo com CMS próprio
- Painel admin com editor rico de texto
- Geração de conteúdo com IA via OpenRouter
- Reescrita de conteúdo de Instagram/YouTube (Scrape Creators API)
- SEO automatizado por IA com nota de qualidade
- Sistema de landing pages com IA
- Gerenciamento de imagens (biblioteca de mídia)
- Usuários com permissões granulares (5 níveis)
- Webhooks e API REST para integrações externas
- Google Analytics e múltiplas ferramentas de métricas
- Design System Empire Gold completamente tokenizado
- Documentação viva completa

## Fora do Escopo (por ora)

- E-commerce / loja virtual
- Módulo de afiliados
- Editor visual drag-and-drop tipo Elementor com IA *(futuro — prioridade baixa)*
- App mobile

## Entregável Futuro Documentado

> **[FUTURO — PRIORIDADE BAIXA]** Simulador de Elementor com IA: editor visual de páginas, drag-and-drop assistido por IA. Criar épico G08 separado quando priorizado. Não deve interferir na estrutura existente.

---

<a name="design-system"></a>
# 🎨 SEÇÃO 3 — DESIGN SYSTEM EMPIRE GOLD

> ⚠️ **Regra absoluta:** Nenhuma cor, tipografia, espaçamento ou efeito visual pode ser escrito diretamente em componentes. **Tudo deve vir dos tokens definidos aqui.** Para mudar o visual do site inteiro, basta alterar os tokens.

## 3.1 Filosofia do Design

- **Dark first:** Fundos escuros criam profundidade e destaque para o conteúdo
- **Gold como acento:** Dourado exclusivamente para CTAs, destaques e elementos premium
- **Hierarquia forte:** Tipografia contrastante (serif para títulos, sans para corpo) guia o olhar
- **Whitespace generoso:** Respiração entre seções — evitar sensação de acúmulo
- **Animações com propósito:** Revelação de conteúdo e feedback visual, nunca decorativas
- **Admin como contraste intencional:** O painel admin usa fundo claro (branco/cinza muito claro) para separar claramente a área interna da área pública

## 3.2 Paleta de Cores (Tokens)

```typescript
// src/design-system/tokens.ts

export const colors = {
  empire: {
    // Fundos
    bg:       '#0a0a0b',   // Fundo principal — quase preto
    surface:  '#111113',   // Seções alternadas
    card:     '#18181b',   // Cards e containers
    border:   '#27272a',   // Bordas sutis

    // Texto
    text:     '#fafafa',   // Texto principal
    muted:    '#71717a',   // Texto secundário

    // Gold — Acento premium
    gold:      '#c9a962',  // CTAs, destaques, elementos ativos
    goldLight: '#e4d4a5',  // Hover, highlights
    goldDark:  '#9a7b3c',  // Sombras, profundidade

    // Variações opcionais (documentadas, não obrigatórias)
    silver:      '#a8a8a8',
    silverLight: '#d4d4d4',
    silverDark:  '#737373',
    bronze:      '#b08d57',
    bronzeLight: '#d4b896',
    bronzeDark:  '#8b6914',
  },

  // Admin — painel interno (fundo claro)
  admin: {
    bg:         '#FFFFFF',
    surface:    '#F9FAFB',
    sidebar:    '#FFFFFF',
    border:     '#E5E7EB',
    text:       '#111827',
    muted:      '#6B7280',
    accent:     '#c9a962',  // mesmo gold da marca
    accentHover:'#9a7b3c',
  },

  // Semânticas
  semantic: {
    success: '#22C55E',
    warning: '#F59E0B',
    error:   '#EF4444',
    info:    '#3B82F6',
  },
}

export const typography = {
  fonts: {
    display: ['Cormorant Garamond', 'serif'],
    body:    ['DM Sans', 'sans-serif'],
  },
  sizes: {
    // Usando clamp para responsividade fluida
    h1:    'clamp(2.5rem, 8vw, 5rem)',    // 40px → 80px
    h2:    'clamp(1.75rem, 5vw, 3rem)',   // 28px → 48px
    h3:    'clamp(1.25rem, 3vw, 1.5rem)', // 20px → 24px
    body:  'clamp(1rem, 2vw, 1.125rem)',  // 16px → 18px
    small: '0.875rem',                    // 14px
    label: '0.75rem',                     // 12px
  },
  weights: {
    light:    300,
    regular:  400,
    medium:   500,
    semibold: 600,
    bold:     700,
  },
  lineHeights: {
    tight:  1.1,
    snug:   1.2,
    normal: 1.3,
    relaxed:1.6,
  },
  letterSpacing: {
    label: '0.1em',  // para tags e labels uppercase
  },
}

export const spacing = {
  // Sistema de 8px
  xs:  '0.5rem',   // 8px
  sm:  '0.75rem',  // 12px
  md:  '1rem',     // 16px
  lg:  '1.5rem',   // 24px
  xl:  '2rem',     // 32px
  '2xl':'3rem',    // 48px
  '3xl':'4rem',    // 64px
  '4xl':'6rem',    // 96px
  '5xl':'8rem',    // 128px
}

export const containers = {
  narrow: '56rem',   // 896px  — max-w-4xl
  default:'72rem',   // 1152px — max-w-6xl
  wide:   '80rem',   // 1280px — max-w-7xl
}

export const effects = {
  transitions: {
    fast:   'all 0.3s ease',
    medium: 'all 0.4s ease',
    slow:   'all 0.8s ease',
  },
  shadows: {
    card:   '0 20px 60px rgba(0,0,0,0.4)',
    gold:   '0 10px 40px rgba(201, 169, 98, 0.3)',
    subtle: '0 4px 16px rgba(0,0,0,0.2)',
  },
  gradients: {
    gold:        'linear-gradient(135deg, #c9a962 0%, #e4d4a5 50%, #c9a962 100%)',
    goldSubtle:  'linear-gradient(90deg, transparent, rgba(201, 169, 98, 0.3), transparent)',
    goldOverlay: 'rgba(201, 169, 98, 0.05)',
    shine:       'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
  },
  borders: {
    goldGradient: `
      background: linear-gradient(#18181b, #18181b) padding-box,
                  linear-gradient(135deg, #c9a962, #e4d4a5, #c9a962) border-box;
      border: 1px solid transparent;
    `,
  },
}

export const patterns = {
  grid: `
    background-image:
      linear-gradient(rgba(201, 169, 98, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201, 169, 98, 0.03) 1px, transparent 1px);
    background-size: 60px 60px;
  `,
}
```

## 3.3 Integração com Tailwind

```typescript
// tailwind.config.ts
// Este arquivo IMPORTA os tokens — não define valores diretamente

import { colors, typography, spacing, containers } from './src/design-system/tokens'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        empire: colors.empire,
        admin: colors.admin,
        semantic: colors.semantic,
      },
      fontFamily: {
        display: typography.fonts.display,
        body:    typography.fonts.body,
      },
      maxWidth: {
        narrow:  containers.narrow,
        default: containers.default,
        wide:    containers.wide,
      },
      boxShadow: {
        card:   effects.shadows.card,
        gold:   effects.shadows.gold,
        subtle: effects.shadows.subtle,
      },
    },
  },
  plugins: [],
}
```

## 3.4 Componentes do Design System

### Botão Premium (CTA Principal)
```
Visual: gradiente dourado, texto preto, borda-radius 2px
Hover: eleva 2px, sombra dourada, efeito shine
Animação: pulse ring ao redor para CTAs principais de seção
Uso: apenas para ações primárias de conversão
```

### Botão Secundário
```
Visual: transparente, borda dourada, texto dourado
Hover: fundo gold/10, eleva 2px
Uso: ações secundárias, CTAs de menor peso
```

### Cards
```
Base: bg empire-card, border empire-border, padding 2rem
Hover: eleva 8px, sombra forte, border gold/30
Variante gold: borda com gradiente dourado (border-gradient)
Efeito shine: animação sutil de brilho passando
```

### Badges / Tags
```
Visual: pill shape, border gold/30, bg gold/5, texto dourado
Variante pulse: ponto animado antes do texto
Texto: uppercase, letter-spacing 0.1em, 12px
```

### Stats / Números
```
Número: Cormorant Garamond, gradiente dourado no texto
Label: DM Sans, uppercase, letter-spacing, text-muted
```

### Skeletons (carregamento)
```
Cor base: empire-card (#18181b)
Animação: pulse com empire-border como cor de shimmer
Admin: cinza claro (admin-surface com shimmer mais claro)
```

### FAQ Accordion
```
Border bottom: gold/10 entre itens
Pergunta hover: gold
Ícone: rotaciona 45° quando aberto
Resposta: max-height transition para animação suave
```

### Divisores de Seção
```
Height 1px, gradiente: transparente → gold/30 → transparente
Uso: entre seções principais
```

## 3.5 Animações

```
fade-in-up: opacity 0→1, translateY 30px→0, threshold 0.1 (IntersectionObserver)
stagger-children: delay sequencial 0.1s por filho (máx 6)
text-gold-gradient: clip-path no gradiente dourado para texto
shine: animação de brilho passando em cards (4s loop)
pulse-ring: anel pulsante ao redor de CTAs
grid-pattern: background SVG de grade com gold/3 de opacidade
```

## 3.6 Navegação (Navbar)

```
Posição: fixed top, z-50
Background: empire-bg/80, backdrop-blur-md
Border bottom: empire-border
Height: 80px (h-20)
Scroll: aumenta opacidade do bg para empire-bg/95
Logo: esquerda
Links desktop: centro, text-muted hover:text-gold
CTA: direita, botão secundário
Mobile: hamburger → drawer lateral (w-72) desliza da direita
```

## 3.7 Footer

```
Background: empire-bg, border-top empire-border
Layout: 3 colunas flex — logo | links | copyright
Links: text-muted hover:text-gold
```

## 3.8 Scrollbar Customizado

```
Width: 8px
Track: empire-bg
Thumb: empire-border padrão → empire-gold no hover
Border-radius: 4px
```

## 3.9 Estrutura de Pastas do Design System

```
design-system/
├── README.md                         → Visão geral e como usar
├── tokens/
│   ├── colors.md                     → Documentação de cada cor e uso
│   ├── typography.md                 → Fontes, tamanhos, pesos
│   ├── spacing.md                    → Sistema de 8px
│   └── effects.md                    → Sombras, gradientes, transições
├── components/
│   ├── buttons.md                    → Variantes, uso correto, exemplos
│   ├── cards.md                      → Variantes, hover, gold border
│   ├── badges.md                     → Tags e indicadores
│   ├── stats.md                      → Números e métricas
│   ├── navigation.md                 → Navbar, footer, breadcrumb
│   ├── skeletons.md                  → Lista de todos os skeletons
│   ├── editor.md                     → Componentes do editor rico
│   └── forms.md                      → Inputs, selects, checkboxes
├── animations/
│   └── index.md                      → Todas as animações documentadas
└── guidelines/
    ├── como-mudar-cores.md           → Passo a passo: só alterar tokens.ts
    ├── como-mudar-tipografia.md      → Trocar fontes sem quebrar layout
    ├── como-adicionar-componente.md  → Padrão para novos componentes
    └── admin-vs-publico.md           → Por que o admin é claro e o site é escuro
```

---

<a name="referencia-visual"></a>
# 🔍 SEÇÃO 4 — REFERÊNCIA VISUAL: G4 BUSINESS

> ⚠️ **Instrução obrigatória de execução:** Antes de implementar qualquer tela do site público, realizar investigação profunda do site https://g4business.com/. Esta é uma etapa de pesquisa que deve gerar documentação antes de qualquer código.

## O que investigar no G4 Business

### Estrutura e Layout
```
INVESTIGAR:
- Estrutura da homepage: quais seções existem, em que ordem
- Como o blog é organizado: listagem, categorias, post individual
- Navegação: comportamento da navbar ao rolar, links, dropdowns
- Footer: colunas, conteúdo, links
- Como as páginas institucionais são estruturadas
- Uso de espaço negativo e whitespace entre seções
- Hierarquia visual: o que chama atenção primeiro em cada seção
- Seções de social proof: como apresentam números e logos de clientes
- Seções de metodologia / como funciona
```

### Padrões de UI
```
INVESTIGAR:
- Tipografia: combinações de fontes, pesos, tamanhos usados
- Cards: como apresentam conteúdo (blog posts, serviços, cases)
- CTAs: onde ficam, tamanho, cor, texto
- Grids: quantas colunas, gaps, como quebram no mobile
- Imagens: proporções, tratamentos visuais (overlay, crop)
- Ícones: estilo (outline, filled, tamanho)
- Animações: o que aparece ao rolar, velocidade, tipo
- Breadcrumbs: presentes? onde?
- Buscas: como funciona no blog
```

### Blog Especificamente
```
INVESTIGAR:
- Layout da listagem: grid ou lista, quantos posts por linha
- Card de post: o que aparece (imagem, título, resumo, data, autor, categoria, tempo de leitura)
- Filtros: por categoria, tag, data — como funcionam visualmente
- Post individual: header, imagem de capa, largura do conteúdo, sidebar
- Posts relacionados: como aparecem
- Compartilhamento social: onde e quais redes
- Comentários: usam algum sistema?
- Autores: tem página de autor? como aparece no post?
- Paginação: números, "próxima página", infinite scroll?
```

### Performance e SEO (como referência)
```
INVESTIGAR:
- Rodar no Google PageSpeed Insights: https://pagespeed.web.dev/
- Analisar Core Web Vitals reportados
- Ver source HTML: como fazem meta tags, JSON-LD
- Sitemap: verificar em g4business.com/sitemap.xml
- Robots: verificar em g4business.com/robots.txt
- Schema markup: verificar com Google Rich Results Test
```

### Mobile
```
INVESTIGAR:
- Comportamento da navbar no mobile
- Como as seções quebram em telas menores
- Tamanho de fonte no mobile
- Botões: tamanho de toque mínimo
- Imagens: como se adaptam
```

## Documento de Referência a Criar

```
CRIAR: docs/referencia-g4.md

Estrutura obrigatória:
1. Seções identificadas (lista e ordem)
2. Padrões de tipografia documentados
3. Padrões de grid e layout
4. Padrões de card (blog e outros)
5. Comportamento da navegação
6. Padrões do blog (listagem + post individual)
7. Insights de UX/UI (o que funciona bem e por quê)
8. O que adaptar para o Empire (dark mode vs light do G4)
9. Métricas de performance do G4 como benchmark
10. Decisões de adaptação documentadas
```

> **Nota:** O G4 Business provavelmente usa design claro (light mode). O Empire usará dark mode com paleta gold. A investigação deve focar na **estrutura, hierarquia e padrões de UX** — não nas cores. A identidade visual é 100% Empire Gold.

---

<a name="stack"></a>
# 🛠️ SEÇÃO 5 — STACK TECNOLÓGICA

> ⚠️ **Instrução de execução:** Pesquisar documentação oficial mais recente de cada tecnologia antes de implementar. Registrar versões utilizadas em `docs/arquitetura.md`.

## Stack Principal

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Framework | **Next.js 14+ (App Router)** | SSR/SSG nativo, ideal para SEO, Server Components reduzem JS |
| Linguagem | **TypeScript strict** | Sem `any`, segurança de tipos em todo o projeto |
| Banco de dados | **Supabase (PostgreSQL)** | Disponível, Auth nativo, RLS, Edge Functions, Storage |
| Autenticação | **Supabase Auth** | Integrado, cookies httpOnly, OAuth preparado |
| Estilo | **Tailwind CSS** | Utilitário + purge automático + integração com tokens |
| Fontes | **next/font (Google Fonts)** | Cormorant Garamond + DM Sans, sem layout shift |
| Editor Rico | **TipTap** | Pesquisar extensibilidade para todos os requisitos |
| IA / LLM | **OpenRouter API** | Multi-modelo, flexível, model padrão: claude-sonnet-4-6 |
| Scraping social | **Scrape Creators API** | Instagram e YouTube → conteúdo para blog |
| Imagens | **Supabase Storage + next/image** | Upload, organização e otimização automática |
| Deploy | **Vercel** | Integração nativa Next.js, edge network, preview deployments |
| Analytics | **GA4 + múltiplos** | Configuração dinâmica pelo painel admin |

## Pesquisas Obrigatórias Antes de Implementar

> Cada pesquisa abaixo deve ser uma **task no roadmap** e concluída antes da feature correspondente.

### Supabase
```
PESQUISAR ANTES DE IMPLEMENTAR:
- Documentação: https://supabase.com/docs
- Auth com Next.js App Router: cookies de sessão, middleware
- Storage: buckets, políticas, transformações de imagem (resize, WebP)
- Edge Functions: runtime Deno, variáveis de ambiente, deploy local
- Migrations: supabase CLI, supabase migration new, db push
- RLS: policies por role, JWT custom claims
- Realtime: se necessário para notificações
- Projeto: "Empire site 3"
- Documentar tudo em docs/integracoes.md
```

### OpenRouter
```
PESQUISAR ANTES DE IMPLEMENTAR:
- Documentação: https://openrouter.ai/docs
- Headers obrigatórios (HTTP-Referer, X-Title, Authorization)
- Formato request/response (compatibilidade OpenAI SDK)
- Streaming SSE: como implementar em Edge Function
- IDs exatos dos modelos disponíveis (especialmente claude-sonnet-4-6)
- Rate limits e custos por modelo
- Tratamento de erros
- Documentar em docs/integracoes.md
```

### Scrape Creators API
```
PESQUISAR ANTES DE IMPLEMENTAR:
- Documentação oficial (verificar URL atual)
- Endpoint Instagram: campos retornados (legenda, hashtags, etc.)
- Endpoint YouTube: campos retornados (transcrição, descrição, etc.)
- Autenticação e rate limits
- Campos mais úteis para reescrita de conteúdo
- Documentar em docs/integracoes.md
```

### TipTap
```
PESQUISAR ANTES DE IMPLEMENTAR:
- Extensões oficiais disponíveis
- Upload de imagem inline com Supabase Storage
- Extensões necessárias: heading, lists, bold, italic, underline,
  strike, link, image, table, code, blockquote, align, undo/redo
- Extensões de terceiros para funcionalidades extras
- Como importar/exportar HTML e JSON
- Compatibilidade com Next.js App Router
- Listar todas as funcionalidades do WordPress Gutenberg e mapear
  extensões TipTap equivalentes
- Documentar em docs/arquitetura.md
```

### Next.js SEO
```
PESQUISAR ANTES DE IMPLEMENTAR:
- generateMetadata() para rotas dinâmicas
- app/sitemap.ts e app/robots.ts
- next/image: WebP/AVIF, lazy loading, priority
- next/font: Cormorant Garamond + DM Sans sem layout shift
- JSON-LD: BlogPosting, Organization, BreadcrumbList
- ISR (Incremental Static Regeneration) para posts do blog
- Core Web Vitals: o que afeta LCP, CLS, INP
- Documentar checklist em docs/seo.md
```

---

<a name="arquitetura"></a>
# 🏗️ SEÇÃO 6 — ARQUITETURA DO SISTEMA

> ⚠️ **Instrução de execução:** O arquivo `docs/arquitetura.md` deve ser criado durante o épico de Foundation e **atualizado toda vez que algo estrutural mudar**.

## Estrutura de Pastas do Projeto

```
empire-site/
│
├── public/
│   ├── fonts/          → Fontes locais se necessário
│   ├── images/         → Assets estáticos (logo, og-default, favicon)
│   └── icons/          → Ícones SVG estáticos
│
├── src/
│   ├── app/
│   │   ├── (public)/                    → Grupo: site público
│   │   │   ├── layout.tsx               → Layout público (navbar + footer empire gold)
│   │   │   ├── page.tsx                 → Home
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx             → Listagem de posts
│   │   │   │   ├── [slug]/
│   │   │   │   │   └── page.tsx         → Post individual
│   │   │   │   └── categoria/[slug]/
│   │   │   │       └── page.tsx         → Posts por categoria
│   │   │   ├── sobre/
│   │   │   │   └── page.tsx
│   │   │   ├── contato/
│   │   │   │   └── page.tsx
│   │   │   └── lp/                      → Landing pages (layout próprio)
│   │   │       └── [slug]/
│   │   │           └── page.tsx
│   │   │
│   │   ├── (admin)/                     → Grupo: painel interno
│   │   │   ├── layout.tsx               → Layout admin (sidebar clara)
│   │   │   └── admin/
│   │   │       ├── page.tsx             → Dashboard
│   │   │       ├── posts/
│   │   │       │   ├── page.tsx         → Listagem de posts
│   │   │       │   ├── novo/
│   │   │       │   │   └── page.tsx     → Criar post
│   │   │       │   └── [id]/
│   │   │       │       └── page.tsx     → Editar post (editor + IA + SEO)
│   │   │       ├── midia/
│   │   │       │   └── page.tsx         → Biblioteca de mídia
│   │   │       ├── landing-pages/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── nova/
│   │   │       │   └── [id]/
│   │   │       ├── usuarios/
│   │   │       │   └── page.tsx
│   │   │       └── configuracoes/
│   │   │           ├── geral/
│   │   │           ├── seo/
│   │   │           ├── analytics/
│   │   │           ├── webhooks/
│   │   │           └── integracoes/
│   │   │
│   │   ├── api/
│   │   │   ├── posts/
│   │   │   │   ├── route.ts             → GET lista / POST criar
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts         → GET / PUT / DELETE
│   │   │   ├── webhooks/
│   │   │   │   └── [slug]/
│   │   │   │       └── route.ts         → Receber webhooks
│   │   │   └── analytics/
│   │   │       └── route.ts
│   │   │
│   │   ├── sitemap.ts                   → Sitemap dinâmico
│   │   ├── robots.ts                    → robots.txt dinâmico
│   │   └── layout.tsx                   → Layout raiz (fontes, metadata base)
│   │
│   ├── components/
│   │   ├── public/                      → Componentes do site público
│   │   │   ├── sections/                → Seções da homepage
│   │   │   ├── blog/                    → Componentes do blog
│   │   │   └── layout/                  → Navbar, Footer, Breadcrumb
│   │   ├── admin/                       → Componentes do painel
│   │   │   ├── editor/                  → Editor rico e painel de IA
│   │   │   ├── media/                   → Biblioteca de mídia
│   │   │   ├── layout/                  → Sidebar, Header admin
│   │   │   └── forms/                   → Formulários do admin
│   │   ├── shared/                      → Usado em ambos
│   │   └── ui/                          → Componentes base (Button, Card, Badge...)
│   │
│   ├── design-system/
│   │   ├── tokens.ts                    → FONTE ÚNICA DA VERDADE de cores/tipografia
│   │   └── README.md
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                → Cliente browser
│   │   │   ├── server.ts                → Cliente server
│   │   │   └── middleware.ts            → Auth middleware
│   │   ├── openrouter/
│   │   │   └── client.ts
│   │   ├── scrape-creators/
│   │   │   └── client.ts
│   │   ├── seo/
│   │   │   └── metadata.ts              → Helpers de metadata
│   │   └── utils/
│   │       ├── format.ts
│   │       └── slugify.ts
│   │
│   ├── hooks/
│   ├── types/
│   │   ├── database.ts                  → Tipos gerados do Supabase
│   │   ├── posts.ts
│   │   └── users.ts
│   ├── content/                         → Conteúdo fixo do site
│   │   ├── site.ts
│   │   ├── navigation.ts
│   │   ├── home.ts
│   │   ├── sobre.ts
│   │   ├── contato.ts
│   │   └── footer.ts
│   └── config/
│       └── site.ts                      → URL base, nome, social links
│
├── supabase/
│   ├── migrations/                      → SQL versionado — NUNCA editar manualmente
│   ├── functions/                       → Edge Functions (só após pesquisa de docs)
│   │   ├── gerar-conteudo/
│   │   ├── analisar-seo/
│   │   └── scrape-social/
│   └── config.toml
│
├── design-system/                       → Documentação do design system
├── docs/                                → Documentação viva
│
├── .env.example
├── .env                                 → NUNCA commitar
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Arquitetura de Dados (Supabase)

> ⚠️ **Instrução:** Pesquisar documentação do Supabase antes de criar qualquer migration. Um arquivo SQL por grupo lógico. Sempre incluir RLS na mesma migration.

### Schema das Tabelas

```sql
-- Pesquisar: Supabase Auth + PostgreSQL types + RLS policies

-- profiles
-- Extensão de auth.users com dados adicionais
-- Campos: id (fk auth.users), full_name, avatar_url, role,
--         bio, created_at, updated_at

-- posts
-- Campos: id, title, slug (unique), content (jsonb para TipTap),
--         content_html (text renderizado), excerpt, cover_image_url,
--         status (draft/scheduled/published/archived/trashed),
--         author_id (fk profiles), published_at, scheduled_at,
--         seo_title, seo_description, seo_keywords (text[]),
--         og_image_url, canonical_url, noindex (bool),
--         reading_time_minutes, word_count,
--         ai_seo_score (int), ai_seo_suggestions (jsonb),
--         created_at, updated_at, deleted_at (soft delete)

-- post_categories
-- Campos: id, name, slug, description, color, parent_id (self-ref),
--         created_at

-- post_tags
-- Campos: id, name, slug, created_at

-- posts_categories (pivot)
-- posts_tags (pivot)

-- post_revisions
-- Campos: id, post_id (fk), content (jsonb), author_id,
--         version_number, created_at

-- media_items
-- Campos: id, filename, original_filename, mime_type, size_bytes,
--         width, height, folder_id, storage_path, public_url,
--         alt_text, title, description, uploaded_by,
--         created_at, deleted_at

-- media_folders
-- Campos: id, name, parent_id (self-ref), created_at

-- landing_pages
-- Campos: id, name (interno), slug, status, sections (jsonb),
--         seo_title, seo_description, og_image_url,
--         custom_analytics_id, webhook_id, created_by,
--         published_at, created_at, updated_at, deleted_at

-- analytics_configs
-- Campos: id, name, type (ga4/gtm/pixel/hotjar/clarity/custom),
--         tracking_id, custom_html, active, apply_to (jsonb),
--         created_at

-- webhook_configs
-- Campos: id, name, url, events (text[]), headers (jsonb),
--         secret, active, last_triggered_at, created_at

-- webhook_logs
-- Campos: id, webhook_id, event, payload (jsonb), status_code,
--         response_body, attempts, created_at

-- api_keys
-- Campos: id, name, key_hash, scopes (text[]), last_used_at,
--         expires_at, created_by, revoked_at, created_at

-- ai_generation_logs
-- Campos: id, model, prompt (text), input_tokens, output_tokens,
--         source_type (manual/instagram/youtube), source_url,
--         post_id, created_by, created_at

-- site_settings
-- Campos: key (unique), value (jsonb), updated_by, updated_at

-- user_roles
-- Campos: role (enum: super_admin/admin/editor/author/viewer),
--         permissions (jsonb), description
```

---

<a name="modulos"></a>
# 🧩 SEÇÃO 7 — MÓDULOS E FUNCIONALIDADES

## Módulo 1 — Site Público

### 1.1 Homepage

**Estrutura de seções (baseada na investigação do G4 Business):**

> ⚠️ A ordem e o conteúdo exato das seções devem ser definidos **após** concluir a pesquisa do G4 Business e criar `docs/referencia-g4.md`. O que segue é o esqueleto inicial.

```
Seção 1: Hero
- Full viewport height (min-h-screen)
- Background: empire-bg com grid-pattern sutil
- Badge com pulse dourado (posicionamento/credencial)
- H1 com parte em gradiente dourado (Cormorant Garamond)
- Subtítulo (DM Sans, text-muted)
- Benefícios em linha (checkmarks dourados)
- CTA principal (btn-premium com pulse-ring)
- Scroll indicator animado

Seção 2: Social Proof (números + logos)
- Background: empire-surface, border top/bottom empire-border
- Grid de stats (3 colunas): número grande dourado + label muted
- Grade de logos de clientes/parceiros com efeito grayscale→color

Seção 3: Problema/Agitação
- Background: empire-bg com grid-pattern 50% opacity
- Label em dourado uppercase
- H2 com palavra em gradiente
- Grid de cards de pain points (3 colunas)
- Cada card: ícone dourado, título, descrição, quote de impacto

Seção 4: Solução
- Background: empire-surface
- Gradient decoration direita: gold/5
- Grid assimétrico (7/5 ou 5/7): imagem + texto com feature cards
- Elementos decorativos dourados ao redor da imagem

Seção 5: Metodologia / Como Funciona
- Timeline de fases numeradas (01, 02, 03...)
- Cada fase: número dourado (Cormorant) + badge semana + cards

Seção 6: Conteúdo do Blog (preview)
- Últimos 3 posts
- Grid de cards com imagem, categoria, título, excerpt, leia mais

Seção 7: CTA Final
- Background: empire-surface
- Gradiente decorativo centralizado
- H2 + subtítulo + CTA principal grande

Seções adicionais (definir após pesquisa G4):
- Cases / Resultados
- Depoimentos / Testimonials
- FAQ com accordion
- Comparativo (antes/depois)
```

**Regra de conteúdo fixo:**
```
TODOS os textos das seções devem vir de src/content/home.ts
NUNCA escrever texto diretamente em componentes JSX
O arquivo home.ts deve ser autoexplicativo para que
um não-técnico consiga editar os textos sem programar
```

### 1.2 Blog Público

**Listagem de posts:**
```
- Layout grid (baseado na pesquisa G4)
- Filtros: categoria, tag — URL params para SEO (/blog?categoria=marketing)
- Busca por texto (client-side ou Supabase full-text search)
- Card de post:
  - Imagem de capa (proporção definida após pesquisa G4)
  - Categoria com badge
  - Título (Cormorant Garamond)
  - Excerpt (DM Sans, text-muted)
  - Data + tempo de leitura + nome do autor
  - Link "Ler mais" com arrow dourado
- Paginação (pesquisar padrão do G4)
- Skeleton para todos os estados de carregamento
```

**Post individual:**
```
- Hero do post: imagem de capa full-width ou centralizada
- Breadcrumb: Início > Blog > [Categoria] > [Título]
- Metadados: autor, data, tempo de leitura, categorias, tags
- Conteúdo: largura narrow (max-w-4xl), prose-invert para dark mode
- Compartilhamento social (floating ou inline)
- CTA de newsletter/contato (entre posts relacionados)
- Posts relacionados: grid de 3 cards
- JSON-LD BlogPosting automaticamente
```

### 1.3 Landing Pages

```
Rota: /lp/[slug]
Layout: completamente independente — sem navbar/footer do site principal
Razão: cada LP tem sua própria proposta de conversão

Implementação:
- app/(public)/lp/layout.tsx — layout próprio, minimal
- Seções vêm do banco (landing_pages.sections JSONB)
- Pode incluir: hero, benefícios, CTA, formulário, prova social
- Analytics específico por LP (campo custom_analytics_id)
- Webhooks de conversão configuráveis

IMPORTANTE: Documentar fartamente em docs/landing-pages.md
```

### 1.4 Conteúdo Fixo e Mutabilidade

```
REGRA CENTRAL:
Todo texto fixo em src/content/
Todo visual em src/design-system/tokens.ts

Para mudar texto: editar src/content/[pagina].ts
Para mudar cores: editar src/design-system/tokens.ts → tailwind.config.ts
Para mudar estrutura de seção: editar o componente correspondente

Cada arquivo de content DEVE ter comentários explicando
o que cada campo representa e onde aparece no site.
```

---

## Módulo 2 — Autenticação e Permissões

### 2.1 Fluxo de Autenticação

```
- Login: /admin/login (fora do grupo admin protegido)
- Sessão: Supabase Auth com cookies httpOnly
- Middleware: protege TODOS os paths /admin/*
- Logout: invalida sessão no servidor
- Recuperação de senha: e-mail com link mágico (Supabase)
- Sem OAuth por ora (pode ser FR futuro)

PESQUISAR: Supabase Auth + Next.js Middleware — documentação oficial
Documentar em docs/integracoes.md antes de implementar
```

### 2.2 Controle de Acesso por Role

```
SUPER ADMIN:
- Tudo, incluindo: gerenciar usuários, configurações de sistema,
  ver logs de IA, revogar API keys, apagar qualquer conteúdo

ADMIN:
- Tudo exceto: apagar super admins, alterar configurações críticas

EDITOR:
- Criar, editar, publicar, arquivar qualquer post
- Gerenciar mídia
- Criar e editar landing pages (não configura webhooks)

AUTHOR:
- Criar e editar apenas seus próprios posts
- Não pode publicar — precisa de Editor/Admin
- Upload de mídia para seus posts

VIEWER:
- Acesso de leitura ao painel
- Ver posts e mídia, sem editar

IMPLEMENTAÇÃO:
- Role verificada no servidor em TODA action
- Server Components verificam antes de renderizar
- API Routes verificam antes de executar
- RLS espelha as permissões da aplicação
- NUNCA confiar apenas em verificação de UI
```

---

## Módulo 3 — Editor de Conteúdo (CMS)

### 3.1 Editor Rico (TipTap)

> ⚠️ **Instrução:** Pesquisar TipTap completamente antes de implementar. Listar equivalentes para CADA funcionalidade do WordPress Gutenberg. Documentar em `docs/arquitetura.md`.

```
EXTENSÕES OBRIGATÓRIAS (pesquisar disponibilidade no TipTap):
Texto:
- StarterKit (base: bold, italic, headings, lists, blockquote, etc.)
- Underline
- Strike
- TextAlign
- Color (cor do texto)
- Highlight (cor de fundo)
- FontFamily
- FontSize
- Subscript / Superscript

Estrutura:
- Heading (H1-H6)
- BulletList / OrderedList / TaskList
- HorizontalRule
- Table (criar, editar, adicionar colunas/linhas)

Links e Mídia:
- Link (com configuração de target e rel)
- Image (com upload para Supabase Storage, caption, resize)
- Youtube embed (colar URL)
- Video embed genérico

Código:
- Code (inline)
- CodeBlock com highlight de sintaxe (lowlight)

Avançado:
- History (Ctrl+Z/Y)
- Focus mode
- CharacterCount (palavras e caracteres)
- Markdown shortcuts (## vira H2, * vira lista, etc.)
- Drag Handle (arrastar blocos)

FUNCIONALIDADES DA BARRA DE FERRAMENTAS:
- Formato flutuante (aparece ao selecionar texto)
- Barra fixa no topo do editor
- Atalhos de teclado visíveis em tooltips
- Modo fullscreen

INSPIRAÇÃO EM PLUGINS WORDPRESS (pesquisar e mapear):
- Yoast SEO → painel de SEO próprio (seção 3.3)
- WP Rocket → não aplicável (é de performance)
- Rank Math → análise de legibilidade (incluir no painel SEO)
- Advanced Custom Fields → campos extras por tipo de post (futuro)
- Classic Editor → referência de simplicidade e completude
```

### 3.2 Gerador de Conteúdo com IA

**Localização:** Drawer/painel lateral colapsável na tela de edição de post

```
CONFIGURAÇÕES (todas editáveis, salvas por sessão):

Modelo de IA:
- Dropdown com lista de modelos do OpenRouter
- Padrão: claude-sonnet-4-6 (verificar ID exato)
- Campo para inserir ID manualmente

Tom de voz:
- Profissional | Informal | Acadêmico | Jornalístico
- Persuasivo | Educativo | Humorístico
- Personalizado (campo de texto livre)

Tipo de escrita:
- Post de blog completo
- Apenas introdução
- Apenas conclusão
- Reescrita (reescrever texto selecionado no editor)
- Resumo executivo
- Roteiro de vídeo

Tamanho:
- Curto (300-500 palavras)
- Médio (700-1000 palavras)
- Longo (1500-2500 palavras)
- Muito longo (3000-5000 palavras)
- Personalizado (campo numérico)

Parâmetros:
- Assunto/Tema (textarea)
- Público-alvo (texto)
- Palavras-chave (campo de tags)
- Idioma (dropdown, padrão: Português BR)
- Instruções adicionais (textarea livre)

Fonte de mídia social (opcional):
- Toggle: "Usar conteúdo de mídia social como base"
- Campo: URL do Instagram ou YouTube
- Tipo detectado automaticamente (ou radio: Instagram / YouTube)
- Campo: "Como adaptar" (ex: "transformar em artigo educativo")

AÇÕES:
- [Gerar conteúdo completo]
- [Gerar introdução]
- [Gerar conclusão]
- [Reescrever seleção] (usa texto selecionado no editor)

FLUXO:
1. Usuário configura parâmetros
2. Clica em "Gerar"
3. Loading state com skeleton no painel
4. [SE URL de mídia social] → Edge Function chama Scrape Creators
5. Edge Function monta prompt com todos os parâmetros
6. Edge Function chama OpenRouter com streaming
7. Texto aparece em prévia no painel (streaming)
8. Botões: [Inserir no editor] [Regenerar] [Cancelar]
9. Ao inserir: conteúdo vai DIRETAMENTE para o editor TipTap
10. Log salvo em ai_generation_logs

IMPORTANTE: Toda a geração passa por Edge Function do Supabase.
NUNCA chamar OpenRouter ou Scrape Creators diretamente do cliente.
Implementar SOMENTE após pesquisa e documentação das APIs.
```

### 3.3 Painel de SEO (Abaixo do Editor)

```
VISUAL: Card separado abaixo do editor, colapsável

CAMPOS:
- Meta title (campo + contador de caracteres + preview)
- Meta description (textarea + contador + preview)
- Slug da URL (gerado do título, editável, validação de unicidade)
- Imagem Open Graph (upload ou selecionar da biblioteca)
- Palavras-chave focais (tags)
- Categoria (dropdown)
- Tags (campo de tags com autocomplete)
- Canônica URL (campo avançado, colapsado por padrão)
- Noindex / Nofollow (toggles avançados)

PREVIEW:
- Snippet de como vai aparecer no Google (desktop + mobile)
- Preview de OG (como vai aparecer no WhatsApp/Facebook)

GERAÇÃO POR IA:
- [Gerar título com IA] → preenche Meta title automaticamente
- [Gerar descrição com IA] → preenche Meta description
- [Gerar palavras-chave com IA] → sugere tags focais
- [Analisar SEO completo] → Edge Function

NOTA DE SEO (após análise):
- Score de 0 a 100 com círculo visual
- Lista de checks:
  ✅ O que está bom
  ⚠️ O que pode melhorar
  ❌ Problemas críticos
- Análise de legibilidade (frases longas, palavras difíceis)
- Densidade de palavras-chave

EDGE FUNCTIONS ENVOLVIDAS:
- gerar-meta-seo: recebe conteúdo, retorna title/description/keywords
- analisar-seo: recebe post completo, retorna score e sugestões
Implementar SOMENTE após pesquisa das docs do Supabase Edge Functions
```

### 3.4 Status e Publicação

```
STATUS DISPONÍVEIS:
- draft (rascunho) — padrão ao criar
- scheduled (agendado) — visível a partir de data/hora
- published (publicado) — visível imediatamente
- archived (arquivado) — URL funciona, oculto do blog
- trashed (lixeira) — soft delete (campo deleted_at)

FUNCIONALIDADES:
- Autosave: a cada 30s se houver mudanças (draft only)
- Prévia: botão abre post em nova aba com ?preview=true
- Agendamento: date-time picker com timezone
- Histórico de revisões: lista com autor + data + diff
- Publicar / Despublicar com confirmação
```

### 3.5 Gerenciador de Mídia

```
ROTA: /admin/midia
COMPORTAMENTO: página própria + modal ao inserir no editor

LAYOUT:
- Toggle: grid de thumbnails | lista detalhada
- Barra lateral: pastas (criar, renomear, excluir)
- Área principal: arquivos da pasta selecionada
- Barra superior: busca + filtro (tipo, data) + upload

UPLOAD:
- Drag-and-drop na área principal
- Botão "Upload" abre file picker
- Múltiplos arquivos simultâneos
- Barra de progresso por arquivo
- Preview antes de confirmar
- Supabase Storage como backend

POR ARQUIVO:
- Thumbnail com overlay de ações
- Nome do arquivo
- Dimensões e tamanho
- Data de upload
- Ao clicar: painel lateral com campos editáveis:
  - Título
  - Texto alternativo (alt) — obrigatório para acessibilidade
  - Descrição
  - URL pública (copiar com 1 clique)
  - [Excluir] com confirmação

INTEGRAÇÃO COM EDITOR:
- Ao inserir imagem no TipTap: abre modal da biblioteca
- Seleção de imagem insere no cursor do editor
- Upload direto no editor também salva na biblioteca

SUPABASE STORAGE:
- Pesquisar: transformações de imagem (resize, WebP automático)
- Pesquisar: signed URLs para imagens privadas se necessário
- Bucket: 'media' (público para imagens do site)
- Políticas: apenas autenticados fazem upload
```

---

## Módulo 4 — Analytics e Métricas

### 4.1 Multi-Analytics

```
ROTA: /admin/configuracoes/analytics

FUNCIONALIDADE:
- Listar todas as propriedades configuradas
- Adicionar nova propriedade (sem limite)
- Por propriedade:
  - Nome descritivo (interno)
  - Tipo: Google Analytics 4 | Google Tag Manager | Facebook Pixel |
           Hotjar | Microsoft Clarity | HTML personalizado
  - ID de rastreamento ou código HTML
  - Status: ativo/inativo
  - Escopo: Todas as páginas | Apenas blog | Apenas landing pages |
             Apenas admin | URLs específicas (campo)
- Editar / Desativar / Excluir

IMPLEMENTAÇÃO:
- Scripts injetados via next/script conforme configurações do banco
- Estratégia: afterInteractive ou lazyOnload (não bloqueante)
- IDs nunca hardcoded — sempre do banco
- Suporte a múltiplas contas do mesmo tipo
- Verificar impacto no PageSpeed (pesquisar melhores práticas)
```

---

## Módulo 5 — Webhooks e APIs

### 5.1 Webhooks de Saída

```
ROTA: /admin/configuracoes/webhooks

POR WEBHOOK:
- Nome descritivo
- URL de destino
- Eventos:
  [ ] Post publicado    [ ] Post atualizado   [ ] Post deletado
  [ ] Usuário criado    [ ] LP publicada      [ ] LP convertida
  [ ] Evento personalizado (nome configurável)
- Headers customizados (pares chave/valor, criptografados no banco)
- Secret HMAC (gerado automaticamente via crypto, editável)
- Status: ativo/inativo

FUNCIONAMENTO:
- Evento ocorre → POST para URL cadastrada
- Payload: { event, timestamp, data: {...} }
- Header X-Signature: HMAC-SHA256 do payload
- Retry: 3 tentativas, backoff exponencial (30s, 5min, 30min)

LOG (tabela webhook_logs):
- Todos os disparos: sucesso e falha
- Payload enviado, resposta recebida, status code
- Visualizável em /admin/configuracoes/webhooks/[id]/logs
```

### 5.2 Webhooks de Entrada

```
ENDPOINT: /api/webhooks/[slug]

- Cada integração tem endpoint único
- Verificação de assinatura no recebimento
- Resposta imediata 200 → processamento assíncrono
- Log de todos os webhooks recebidos
- Configuração de ação por tipo de evento
```

### 5.3 API REST Pública

```
ENDPOINTS PÚBLICOS (com rate limiting):
GET  /api/posts              → lista paginada de posts publicados
GET  /api/posts/[slug]       → post por slug
GET  /api/categories         → categorias
GET  /api/tags               → tags

ENDPOINTS AUTENTICADOS (API key no header):
POST /api/posts              → criar post
PUT  /api/posts/[id]         → atualizar post
DELETE /api/posts/[id]       → mover para lixeira

GESTÃO DE API KEYS:
- Rota: /admin/configuracoes/integracoes/api-keys
- Gerar nova chave (mostrada apenas uma vez)
- Escopos: read | write | admin
- Revogar chave
- Log de uso (última requisição, total de chamadas)
- Rate limiting por chave

DOCUMENTAR em docs/api.md (criar este arquivo)
```

---

## Módulo 6 — Landing Pages com IA

### 6.1 Criador de Landing Pages

```
ROTA: /admin/landing-pages

FLUXO DE CRIAÇÃO:
1. [Nova landing page]
2. Nome interno + slug (URL: /lp/[slug])
3. Objetivo: Captação de leads | Vendas | Evento | Outro
4. Painel de IA:
   - Descrever a landing page em linguagem natural
   - Tom de voz, público-alvo, CTAs desejados
   - [Gerar estrutura] → IA sugere seções com conteúdo
5. Editor de seções:
   - Lista das seções sugeridas
   - Reordenar (drag-and-drop)
   - Editar conteúdo de cada seção
   - Adicionar / remover seções
6. Configurações:
   - SEO próprio
   - Analytics específico (ou herdar global)
   - Webhook de conversão (formulários)
   - Status: rascunho / publicado

VISUAL DA LP:
- Design Empire Gold (dark mode) — mesmo sistema do site
- Cada seção é um componente isolado
- Seções disponíveis: Hero, Benefícios, CTA, Prova Social, FAQ, Formulário

ISOLAMENTO CRÍTICO:
- Layout próprio: app/(public)/lp/layout.tsx
- Sem navbar/footer padrão (a não ser que explicitamente ativado)
- Não afeta nenhuma rota do site principal
- Documentar em docs/landing-pages.md e docs/arquitetura.md
```

---

## Módulo 7 — Painel Admin

### 7.1 Dashboard

```
CARDS DE RESUMO:
- Posts: publicados / rascunhos / agendados
- Visualizações (se analytics integrado)
- Gerações de IA do mês
- Webhooks disparados hoje

AÇÕES RÁPIDAS:
- [+ Novo post]
- [+ Nova landing page]
- [Upload de mídia]
- [Ver site] (link externo, abre nova aba)

ÚLTIMAS ATIVIDADES:
- Feed dos últimos 10 eventos (post criado, imagem enviada, etc.)
```

### 7.2 Visual do Painel Admin

```
DESIGN INTENCIONAL — CONTRASTE COM O SITE:
O site público é dark mode (fundo preto, dourado).
O painel admin é LIGHT mode (fundo branco/cinza claro).
Isso é intencional: diferencia visualmente a área interna da pública.

CORES DO ADMIN (tokens admin.*):
- bg: #FFFFFF
- surface: #F9FAFB
- sidebar: #FFFFFF
- border: #E5E7EB
- text: #111827
- muted: #6B7280
- accent: #c9a962 (mesmo gold da marca)

LAYOUT:
- Sidebar fixa (esquerda, 240px)
- Header fixo (top, 64px) com: título da página, avatar/menu do usuário
- Área de conteúdo: scrollable, padding consistente
- Responsivo: sidebar colapsa em ícones no tablet, drawer no mobile

NAVEGAÇÃO SIDEBAR:
- Dashboard
- Conteúdo:
  ├── Posts (com contador de rascunhos)
  ├── Categorias
  ├── Tags
  └── Mídia
- Landing Pages
- Usuários (Admin+ apenas)
- Configurações:
  ├── Geral
  ├── SEO Global
  ├── Analytics
  ├── Webhooks
  └── API & Integrações
```

### 7.3 Skeletons de Carregamento

```
REGRA: Todo componente com dados assíncronos tem skeleton.
IMPLEMENTAÇÃO: Tailwind animate-pulse com cores do admin ou empire.

LISTA OBRIGATÓRIA:
Admin:
- [ ] Tabela de posts (linhas skeleton com avatar + texto)
- [ ] Editor de post (header + barras de texto)
- [ ] Biblioteca de mídia (grid de quadrados)
- [ ] Dashboard cards (4 retângulos)
- [ ] Lista de usuários
- [ ] Lista de webhooks
- [ ] Painel de SEO
- [ ] Painel lateral de IA
- [ ] Gerenciador de pastas de mídia

Site público:
- [ ] Grid de posts do blog (cards com imagem + texto)
- [ ] Post individual (imagem hero + parágrafos)
- [ ] Seções da home que carregam dados dinâmicos
- [ ] Listagem por categoria
- [ ] Barra de busca com resultados

Documentar cada skeleton em design-system/components/skeletons.md
```

---

## Módulo 8 — Boas Práticas Adicionais

### Acessibilidade
```
- Roles ARIA corretos em todos os componentes interativos
- Contraste mínimo WCAG AA (verificar dark mode com gold)
  Pesquisar: contrast ratio empire-text sobre empire-bg
  Pesquisar: contrast ratio empire-gold sobre empire-bg
- Navegação por teclado funcional (Tab, Enter, Escape)
- Alt text obrigatório no upload de mídia (validação no form)
- Focus visible (outline visível em todos os elementos focáveis)
- Screen reader: aria-label em botões com apenas ícones
```

### Soft Delete
```
Todos os itens deletáveis (posts, landing pages, usuários, mídia):
- Campo deleted_at (timestamp)
- NUNCA DELETE físico pelo usuário
- Queries sempre filtram: WHERE deleted_at IS NULL
- Lixeira com período de retenção (configurável em site_settings)
- Purge automático após período (futuro)
```

### Rate Limiting
```
Aplicar em:
- Endpoint de geração de IA (custo por chamada)
- Login (proteção contra brute force)
- API REST pública
- Webhooks de entrada

Pesquisar: soluções de rate limiting para Next.js
(Upstash Redis, ou middleware próprio com Supabase)
```

### Monitoramento de Erros
```
- Error boundaries em todos os layouts
- Logs de erro sem expor stack trace ao cliente
- Pesquisar: Sentry para Next.js (adicionar como integração opcional)
- Edge Functions: logs visíveis no dashboard Supabase
```

---

<a name="integracoes"></a>
# 🔌 SEÇÃO 8 — INTEGRAÇÕES EXTERNAS

> ⚠️ **Regra:** Nenhuma integração implementada sem documentação oficial pesquisada. O arquivo `docs/integracoes.md` deve ter uma seção completa por integração antes de qualquer código.

## Template para docs/integracoes.md

```markdown
## [Nome da Integração]
- **Documentação oficial:** [URL]
- **Versão da API:** [verificar]
- **Autenticação:** [método]
- **Endpoints utilizados:** [lista]
- **Variáveis de ambiente:** [lista]
- **Edge Function relacionada:** [nome ou N/A]
- **Rate limits:** [documentar]
- **Custos estimados:** [se aplicável]
- **Como testar localmente:** [passo a passo]
- **Última verificação da docs:** [data]
- **Erros conhecidos e soluções:** [documentar ao longo do desenvolvimento]
```

## Integrações Listadas

| Integração | Uso | Quando implementar |
|---|---|---|
| Supabase Auth | Autenticação | G01-T04 |
| Supabase DB | Banco de dados | G01-T03 |
| Supabase Storage | Mídia | G03-T04 |
| Supabase Edge Functions | IA e scraping | G04-T03 |
| OpenRouter | Geração de conteúdo e SEO | G04-T03 (após pesquisa G04-T01) |
| Scrape Creators | Instagram/YouTube → blog | G04-T03 (após pesquisa G04-T02) |
| Google Analytics 4 | Métricas | G05-T01 |
| Google Tag Manager | Gerenciamento de tags | G05-T01 |
| Facebook Pixel | Conversões ads | G05-T01 |
| Hotjar | Heatmaps | G05-T01 |
| Microsoft Clarity | Behavior analytics | G05-T01 |

---

<a name="seguranca"></a>
# 🔒 SEÇÃO 9 — SEGURANÇA

> ⚠️ **Instrução de execução:** Criar `docs/seguranca.md` antes de implementar autenticação. Ler antes de qualquer feature com dados de usuário.

## Regras Absolutas

```
1. ZERO credenciais hardcoded — sempre .env
2. .env nunca no repositório — verificar .gitignore ANTES do primeiro commit
3. Dados sensíveis NUNCA em console.log ou logs
4. Rotas /admin/* protegidas por middleware no servidor
5. Sessão via cookies httpOnly — NUNCA localStorage para tokens de auth
6. RLS ativo em TODAS as tabelas com dados de usuário
7. Inputs validados no servidor antes de qualquer query
8. API keys de terceiros APENAS em Edge Functions ou Server Components
9. Rate limiting em endpoints de IA, login e API pública
10. HMAC-SHA256 para assinaturas de webhooks
11. API keys da aplicação: armazenar apenas o hash (bcrypt), nunca o valor bruto
12. Soft delete para auditoria — sem DELETE físico pelo usuário
```

## RLS por Tabela

```
Pesquisar: Supabase RLS + JWT custom claims para roles

PADRÃO GERAL:
- Leitura pública: posts publicados, categorias, tags
- Escrita: requer autenticação
- Edição do próprio: author pode editar seus posts
- Admin+: acesso total
- Dados sensíveis (users, logs, api_keys): super_admin apenas

IMPLEMENTAÇÃO:
- JWT do Supabase Auth contém o role do usuário
- Policies usam auth.jwt() ->> 'role' para verificar
- Documentar cada policy em docs/seguranca.md
```

## Checklist por Feature

```
Para cada feature nova:
- [ ] Nenhuma credencial hardcoded
- [ ] Variáveis de ambiente corretas
- [ ] Rota verifica autenticação no servidor
- [ ] Role verificada antes de ação sensível
- [ ] RLS configurado para a tabela
- [ ] Input validado (Zod ou similar)
- [ ] Dados sensíveis não na resposta da API
- [ ] Edge Function não expõe stack trace
- [ ] Rate limiting se endpoint público/caro
```

---

<a name="seo-performance"></a>
# ⚡ SEÇÃO 10 — SEO E PERFORMANCE

> ⚠️ **Instrução:** Pesquisar cada item profundamente antes de implementar. Objetivo: nota 90+ no Google PageSpeed Insights (mobile e desktop). Criar `docs/seo.md` com checklist completo.

## SEO Técnico

```
METADATA (Next.js generateMetadata):
- Páginas estáticas: export const metadata = {...}
- Páginas dinâmicas: export async function generateMetadata({ params })
- Campos obrigatórios em TODA página:
  title, description, canonical, robots, openGraph (title, description,
  image, url, type), twitter (card, title, description, image)

SITEMAP (/sitemap.ts):
- Todas as páginas estáticas
- Todos os posts publicados (buscar do banco)
- Todas as landing pages ativas
- Atualização: revalidar a cada publicação de conteúdo
- Registrar em Google Search Console

ROBOTS (/robots.ts):
- Bloquear: /admin/*, /api/*
- Permitir: tudo mais
- Adicionar URL do sitemap

JSON-LD POR TIPO DE PÁGINA:
- Home: WebSite + Organization
- Blog listagem: CollectionPage
- Post individual: BlogPosting (author, datePublished, dateModified,
  image, description, keywords)
- Página institucional: WebPage + Organization
- BreadcrumbList em toda página com breadcrumb

CANONICAL:
- Toda página tem canonical definida
- Posts sempre apontam para si mesmos
- Paginação: canonical na primeira página
```

## Performance

```
IMAGENS (pesquisar next/image):
- Sempre next/image, NUNCA <img>
- Formats: WebP/AVIF automático
- Lazy loading padrão (exceto LCP image)
- priority={true} APENAS na imagem acima da dobra
- width e height sempre definidos (evita CLS)
- Supabase Storage: pesquisar transformações automáticas de imagem

FONTES (next/font):
- Cormorant Garamond: next/font/google
- DM Sans: next/font/google
- font-display: 'swap' automático
- Preload: automático para fontes críticas
- Sem FOUT (Flash of Unstyled Text)

JAVASCRIPT:
- Server Components por padrão
- 'use client' apenas quando absolutamente necessário
- Dynamic import para: editor TipTap, painel de IA, biblioteca de mídia
  (componentes pesados não carregam na primeira visita ao site público)
- Code splitting automático do Next.js

CSS:
- Tailwind: apenas CSS utilizado em produção (purge automático)
- Sem CSS não utilizado

CACHE (pesquisar Next.js App Router caching):
- Home e páginas estáticas: ISR com revalidação longa
- Posts do blog: ISR com revalidação por tag (revalidateTag)
- API Routes: headers de cache apropriados
- Imagens: cache no CDN via Vercel

CORE WEB VITALS:
- LCP: priorizar imagem hero (priority={true} no next/image)
- CLS: definir dimensões de tudo (imagens, fontes, embeds)
- INP: minimizar event handlers pesados, debounce em buscas
- FID: evitar JavaScript longo no main thread

MONITORAMENTO:
- Vercel Analytics para Web Vitals em produção
- Google Search Console: Core Web Vitals por URL
- Google PageSpeed Insights: testar antes de cada deploy major
- Meta no docs/seo.md: benchmark de referência G4 Business
```

---

<a name="documentacao"></a>
# 📁 SEÇÃO 11 — ESTRUTURA DE DOCUMENTAÇÃO VIVA

## Arquivos a Criar Durante a Execução

### `docs/prd.md`
**Quando:** **PRIMEIRO ARQUIVO — antes de qualquer outra coisa.**
**Conteúdo:** Cópia exata e integral deste PRD (v1.1).
**Regra:** Somente leitura. **Jamais editar após criação.**

---

### `docs/claude.md`
**Quando:** Imediatamente após `docs/prd.md`.
**Conteúdo:** Seção 15 deste PRD (regras de comportamento da IA).

---

### `docs/arquitetura.md`
**Quando:** Durante G01-T01.
**Conteúdo:** Stack com versões, estrutura de pastas atual, decisões arquiteturais, schema do banco, Edge Functions ativas, histórico de mudanças.
**Regra:** Atualizar sempre que a arquitetura mudar.

---

### `docs/design-system.md`
**Quando:** Durante G01-T02.
**Conteúdo:** Tokens, componentes, padrões visuais, guia para mudar o tema, distinção admin vs público.

---

### `docs/referencia-g4.md`
**Quando:** Durante G01-T01 (pesquisa inicial, antes de qualquer tela).
**Conteúdo:** Investigação completa do G4 Business — seções, padrões, UX, adaptações para Empire.

---

### `docs/integracoes.md`
**Quando:** Antes de implementar cada integração.
**Conteúdo:** Uma seção por integração com template da Seção 8.

---

### `docs/seguranca.md`
**Quando:** Durante G01 antes de autenticação.
**Conteúdo:** Seção 9 deste PRD adaptada.

---

### `docs/seo.md`
**Quando:** Antes de implementar SEO (G02-T03).
**Conteúdo:** Checklist completo, implementações feitas, resultados do PageSpeed, benchmark vs G4 Business.

---

### `docs/landing-pages.md`
**Quando:** Antes de G06.
**Conteúdo:** Como criar, editar, publicar, integrar com webhooks, medir conversão. Guia acessível para não-técnicos.

---

### `docs/api.md`
**Quando:** Antes de G05-T04.
**Conteúdo:** Documentação completa da API REST (endpoints, autenticação, exemplos).

---

### `.env.example`
**Quando:** G01-T01.
**Conteúdo:** Seção 13 deste PRD.

---

<a name="roadmap"></a>
# 🗺️ SEÇÃO 12 — ROADMAP DE EXECUÇÃO

> ⚠️ **Instrução de execução:** Criar toda a estrutura abaixo em `docs/roadmap/`. Status inicial: `TODO`, progresso: `0%`. Critérios de aceitação já preenchidos em cada arquivo.

## Estrutura de Pastas

```
docs/roadmap/
├── _index.md
│
├── grupo-01-foundation/
│   ├── G01-T01_TODO_0%_setup-projeto.md
│   ├── G01-T02_TODO_0%_design-system-empire-gold.md
│   ├── G01-T03_TODO_0%_configuracao-supabase.md
│   ├── G01-T04_TODO_0%_autenticacao.md
│   ├── G01-T05_TODO_0%_estrutura-de-rotas.md
│   └── G01-T06_TODO_0%_pesquisa-g4-business.md
│
├── grupo-02-site-publico/
│   ├── G02-T01_TODO_0%_homepage-empire-gold.md
│   ├── G02-T02_TODO_0%_blog-listagem-e-post.md
│   ├── G02-T03_TODO_0%_seo-tecnico-e-performance.md
│   ├── G02-T04_TODO_0%_sistema-de-conteudo-fixo.md
│   └── G02-T05_TODO_0%_paginas-institucionais.md
│
├── grupo-03-admin-core/
│   ├── G03-T01_TODO_0%_layout-admin-light.md
│   ├── G03-T02_TODO_0%_gerenciamento-posts.md
│   ├── G03-T03_TODO_0%_editor-rico-tiptap.md
│   ├── G03-T04_TODO_0%_gerenciador-midia.md
│   └── G03-T05_TODO_0%_usuarios-e-permissoes.md
│
├── grupo-04-ia-e-conteudo/
│   ├── G04-T01_TODO_0%_pesquisa-openrouter.md
│   ├── G04-T02_TODO_0%_pesquisa-scrape-creators.md
│   ├── G04-T03_TODO_0%_edge-functions-ia.md
│   ├── G04-T04_TODO_0%_painel-gerador-ia.md
│   └── G04-T05_TODO_0%_seo-automatico-ia.md
│
├── grupo-05-integracoes/
│   ├── G05-T01_TODO_0%_multi-analytics.md
│   ├── G05-T02_TODO_0%_webhooks-outgoing.md
│   ├── G05-T03_TODO_0%_webhooks-incoming.md
│   └── G05-T04_TODO_0%_api-rest-publica.md
│
├── grupo-06-landing-pages/
│   ├── G06-T01_TODO_0%_estrutura-lp.md
│   ├── G06-T02_TODO_0%_editor-secoes-lp.md
│   └── G06-T03_TODO_0%_ia-para-lp.md
│
├── grupo-07-qualidade/
│   ├── G07-T01_TODO_0%_testes-rotas-publicas.md
│   ├── G07-T02_TODO_0%_testes-fluxo-admin.md
│   ├── G07-T03_TODO_0%_otimizacao-pagespeed.md
│   └── G07-T04_TODO_0%_auditoria-seguranca.md
│
└── mudancas/
```

## DAG de Dependências

```
G01-T01 (setup)
    ├──> G01-T02 (design system Empire Gold)   ← paralelo com G01-T03, G01-T06
    ├──> G01-T03 (supabase)                    ← paralelo com G01-T02, G01-T06
    └──> G01-T06 (pesquisa G4 Business)        ← paralelo com G01-T02, G01-T03
             │
             ├── G01-T02 + G01-T03 + G01-T06 concluídos
             │           │
             └──> G01-T04 (autenticação)
                      │
                      └──> G01-T05 (estrutura de rotas)
                                │
                    ┌───────────┼───────────────┐
                    │           │               │
             G02-T04         G02-T01         G03-T01
          (conteúdo fixo)  (homepage)      (layout admin)
                    │           │               │
                 G02-T05    G02-T02          G03-T02
             (institucionais) (blog)        (posts admin)
                              │               │
                           G02-T03         G03-T03
                            (SEO)         (editor TipTap)
                                              │
                                    ┌─────────┴──────────┐
                                    │                    │
                                 G03-T04              G03-T05
                                  (mídia)           (usuários)
                                    │
                          G04-T01 + G04-T02 (pesquisas — paralelo)
                                    │
                                 G04-T03
                               (edge functions)
                                    │
                          G04-T04 + G04-T05 (paralelo)
                        (painel IA)   (SEO automático)

G05-T01, G05-T02, G05-T03, G05-T04 → após G01-T05 (paralelo entre si)

G06-T01 → G06-T02 → G06-T03
(requer G03-T03 concluído)

G07 → após G02, G03, G04, G05, G06 todos concluídos

[PARALELOS DISPONÍVEIS APÓS G01-T01]
- G01-T02, G01-T03, G01-T06 (simultâneos)

[PARALELOS DISPONÍVEIS APÓS G01-T05]
- G02-T01, G02-T02, G02-T04, G02-T05
- G03-T01
- G05-T01, G05-T02, G05-T03, G05-T04
```

## Stories Críticas — Critérios de Aceitação

<details>
<summary>G01-T01 — Setup do Projeto</summary>

```markdown
## Critérios de aceitação
- [ ] Next.js 14+ App Router + TypeScript strict configurados
- [ ] Tailwind CSS configurado (ainda sem tokens — apenas instalado)
- [ ] .env.example criado com todas as variáveis (seção 13)
- [ ] .gitignore configurado (.env, node_modules, .next)
- [ ] docs/prd.md criado — cópia exata e integral deste PRD v1.1
- [ ] docs/claude.md criado com seção 15
- [ ] ESLint sem any configurado
- [ ] Prettier configurado
- [ ] Supabase CLI instalado (verificar documentação)
- [ ] Estrutura de pastas src/ criada conforme Seção 6
- [ ] Projeto roda localmente sem erros (npm run dev)
- [ ] Primeiro commit realizado
```

</details>

<details>
<summary>G01-T02 — Design System Empire Gold</summary>

```markdown
## Critérios de aceitação
- [ ] src/design-system/tokens.ts criado com TODOS os tokens da Seção 3
- [ ] tailwind.config.ts importa tokens (não define valores diretamente)
- [ ] Fontes Cormorant Garamond + DM Sans configuradas via next/font
- [ ] Pasta design-system/ criada com documentação
- [ ] guidelines/como-mudar-cores.md criado e completo
- [ ] guidelines/admin-vs-publico.md criado explicando a distinção
- [ ] Componentes base criados: Button (premium + secondary), Card (base + gold),
      Badge (base + pulse), Skeleton (base admin e dark)
- [ ] NENHUMA cor hardcoded em qualquer arquivo
- [ ] docs/design-system.md criado e documentado
- [ ] Variáveis CSS globais no layout raiz (:root)
```

</details>

<details>
<summary>G01-T06 — Pesquisa G4 Business</summary>

```markdown
## Critérios de aceitação
- [ ] Site g4business.com investigado em profundidade
- [ ] docs/referencia-g4.md criado e completo com:
  - [ ] Todas as seções da homepage mapeadas (nome + ordem + propósito)
  - [ ] Padrões de blog documentados (listagem + post individual)
  - [ ] Padrões de tipografia e grid identificados
  - [ ] Comportamento da navbar documentado
  - [ ] Padrões de cards documentados
  - [ ] Insights de UX/UI (o que funciona e por quê)
  - [ ] Adaptações para Empire Gold documentadas
  - [ ] PageSpeed do G4 medido e registrado como benchmark
  - [ ] Robots.txt e sitemap verificados
- [ ] Estrutura de seções da homepage Empire CONFIRMADA
  (não implementar homepage sem concluir esta task)
```

</details>

<details>
<summary>G04-T01 — Pesquisa OpenRouter (antes de qualquer código de IA)</summary>

```markdown
## Critérios de aceitação
- [ ] Documentação oficial lida integralmente
- [ ] Headers obrigatórios documentados (Authorization, HTTP-Referer, X-Title)
- [ ] Formato de request documentado (mensagens, modelo, temperatura, max_tokens)
- [ ] Streaming SSE documentado (como receber chunks em Edge Function)
- [ ] Lista de modelos disponíveis com IDs exatos
- [ ] ID exato do claude-sonnet-4-6 confirmado no dashboard
- [ ] Rate limits e custos por modelo documentados
- [ ] Tratamento de erros documentado
- [ ] Seção OpenRouter criada em docs/integracoes.md (template completo)
- [ ] Variáveis necessárias adicionadas ao .env.example
- [ ] Nenhum código de IA criado antes desta task estar DONE
```

</details>

---

<a name="env"></a>
# 🔐 SEÇÃO 13 — VARIÁVEIS DE AMBIENTE

```bash
# .env.example
# ================================================
# COPIE PARA .env E PREENCHA OS VALORES REAIS
# NUNCA COMMITE O ARQUIVO .env
# ================================================

# ================================================
# SUPABASE — Projeto: Empire site 3
# Dashboard: https://supabase.com/dashboard
# Encontrar em: Project Settings > API
# ================================================
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_DB_PASSWORD=
SUPABASE_JWT_SECRET=

# ================================================
# OPENROUTER
# Dashboard: https://openrouter.ai/keys
# Modelo padrão: verificar ID exato no dashboard
# Sugerido: claude-sonnet-4-6 ou similar
# ================================================
OPENROUTER_API_KEY=
OPENROUTER_DEFAULT_MODEL=
# Identificação do app para OpenRouter (obrigatório)
OPENROUTER_HTTP_REFERER=
OPENROUTER_X_TITLE=

# ================================================
# SCRAPE CREATORS API
# Verificar URL atual da documentação
# ================================================
SCRAPE_CREATORS_API_KEY=

# ================================================
# URL DO SITE
# Desenvolvimento: http://localhost:3000
# Produção: https://www.empire.com.br (confirmar)
# ================================================
NEXT_PUBLIC_SITE_URL=

# ================================================
# SEGURANÇA
# ================================================
# Secret para HMAC de webhooks enviados (gerar: openssl rand -hex 32)
WEBHOOK_SIGNING_SECRET=
# Secret para jobs internos agendados
CRON_SECRET=

# ================================================
# SUPABASE STORAGE
# Geralmente: {SUPABASE_URL}/storage/v1/object/public
# ================================================
NEXT_PUBLIC_SUPABASE_STORAGE_URL=

# ================================================
# ANALYTICS (IDs adicionais são gerenciados pelo admin)
# Este é o GA4 principal — adicionar mais pelo painel
# ================================================
NEXT_PUBLIC_GA_MEASUREMENT_ID=

# ================================================
# FEATURE FLAGS
# true/false para habilitar/desabilitar módulos
# ================================================
NEXT_PUBLIC_ENABLE_AI_GENERATION=true
NEXT_PUBLIC_ENABLE_LANDING_PAGES=true
NEXT_PUBLIC_ENABLE_API_REST=true
```

---

<a name="mudancas"></a>
# 🔀 SEÇÃO 14 — PROTOCOLO DE MUDANÇAS

> Reproduzido da Parte 2-L do framework. Deve ser seguido integralmente.

**Quando quiser mudar algo, use este formato:**

```
Quero fazer uma mudança no sistema.

O que quero mudar:
[descreva aqui]

Por quê:
[motivo]
```

**A IA então:**
1. Cria `docs/roadmap/mudancas/FR-[NUM]_PENDING_[slug].md`
2. Mapeia impacto completo (cenários A a E)
3. Apresenta impacto em linguagem simples
4. Aguarda confirmação explícita
5. Executa e atualiza toda a documentação

**Cenários de impacto:**
- **A** — Feature pequena em épico existente → nova story
- **B** — Feature grande → novo épico completo
- **C** — Mudança em algo existente → reabrir story (DONE → WIP)
- **D** — Remoção → marcar como SKIP (nunca apagar)
- **E** — Reabertura de épico inteiro → recalcular progresso

---

<a name="claudemd"></a>
# 🤖 SEÇÃO 15 — CONTEÚDO DO `docs/claude.md`

> ⚠️ **Instrução de execução:** Criar `docs/claude.md` literalmente com o conteúdo abaixo durante G01-T01, antes de qualquer código.

```markdown
# claude.md — Regras de Comportamento para IA — Empire Site

## Projeto
- **Nome:** Empire Site
- **Versão do PRD:** 1.1
- **Stack:** Next.js 14+, TypeScript strict, Supabase, Tailwind CSS, OpenRouter
- **Design System:** Empire Gold — dark mode, Cormorant Garamond + DM Sans
- **Ambiente:** Claude Code (local)
- **Supabase project:** Empire site 3

---

## ANTES DE QUALQUER TAREFA
1. SEMPRE ler docs/roadmap/_index.md — estado global do projeto
2. SEMPRE ler o arquivo da story específica antes de implementar
3. SEMPRE ler docs/seguranca.md antes de features com dados, auth ou APIs
4. NUNCA iniciar task BLOCKED sem resolver o bloqueio
5. SE a task envolve integração: verificar docs/integracoes.md PRIMEIRO
6. SE a task envolve telas: verificar docs/referencia-g4.md e docs/design-system.md

## DURANTE A IMPLEMENTAÇÃO
7. NUNCA editar feature existente sem abrir FR em docs/roadmap/mudancas/
8. NUNCA usar cores hardcoded — APENAS tokens de src/design-system/tokens.ts
9. SEMPRE criar skeleton para todo componente com dados assíncronos
10. NUNCA criar Edge Functions sem documentação oficial pesquisada e
    registrada em docs/integracoes.md
11. NUNCA hardcodar chaves/senhas/tokens — sempre .env
12. NUNCA usar `any` em TypeScript — sempre tipar
13. SEMPRE Server Components por padrão — 'use client' só quando necessário
14. SEMPRE next/image — NUNCA <img> nativo
15. SEMPRE next/font para Cormorant Garamond e DM Sans
16. NUNCA texto fixo hardcoded em JSX — sempre src/content/[pagina].ts
17. NUNCA criar tabelas manualmente — sempre migrations em supabase/migrations/
18. SEMPRE incluir RLS na migration da tabela
19. Admin usa tokens admin.* (claro) — Site público usa tokens empire.* (dark)
20. Soft delete em tudo: campo deleted_at, NUNCA DELETE físico pelo usuário

## QUANDO O USUÁRIO PEDIR MUDANÇA
21. SEMPRE criar FR antes de tocar qualquer arquivo
22. SEMPRE mapear impacto completo (stories, épicos, DAG)
23. SEMPRE apresentar impacto em linguagem simples
24. SEMPRE aguardar confirmação explícita antes de implementar
25. NUNCA apagar arquivos de story/épico — apenas SKIP
26. SEMPRE registrar histórico de status na story
27. SEMPRE recalcular DAG após mudanças de dependência

## AO TERMINAR UMA TAREFA
28. Verificar TODOS os critérios de aceitação
29. Aplicar checklist de qualidade mínima (sem pular itens)
30. Aplicar checklist de segurança
31. Atualizar status e % no arquivo da story
32. Atualizar progresso do épico no _index.md
33. Atualizar docs/arquitetura.md se algo estrutural mudou
34. Atualizar docs/integracoes.md se nova integração implementada
35. Registrar decisões e problemas no arquivo da story

## REGRAS ESPECÍFICAS DO EMPIRE SITE

### Design System
- Fonte display: Cormorant Garamond (headings, números, stats)
- Fonte body: DM Sans (parágrafos, UI, labels)
- CTA principal: sempre btn-premium (gradiente dourado)
- Texto dourado: apenas para destaques importantes
- Grid-pattern: decorativo, apenas em backgrounds de seção
- fade-in-up: em todas as seções principais do site público
- stagger-children: em grids de cards

### Componentes com Animação (site público)
- Seções: fade-in-up com IntersectionObserver threshold 0.1
- Grids de cards: stagger-children com delays 0.1s por filho
- Botão premium: pulse-ring apenas em CTAs de conversão principal
- Cards: hover translateY(-8px) + shadow-gold

### Admin (sem animações pesadas)
- Layout claro: admin.bg (#FFFFFF), admin.surface (#F9FAFB)
- Sem fade-in em telas administrativas
- Acento: empire.gold apenas para destaques e estado ativo na sidebar

### Nomenclatura
- Componentes: PascalCase (PostCard.tsx)
- Hooks: useXxx (usePostData.ts)
- Utilities: camelCase (formatDate.ts)
- Tipos: PascalCase + sufixo (PostType, UserInterface)
- Constantes: UPPER_SNAKE_CASE
- Rotas (arquivos): kebab-case (meu-post/page.tsx)
- Tokens: camelCase aninhado (colors.empire.gold)
- Migrations: YYYYMMDDHHMMSS_descricao.sql

## NUNCA, EM HIPÓTESE ALGUMA
36. NUNCA editar docs/prd.md — somente leitura permanente
37. NUNCA expor dados sensíveis em logs
38. NUNCA marcar DONE sem os três checklists completos
39. NUNCA apagar arquivos do roadmap
40. NUNCA chamar OpenRouter/Scrape Creators do cliente — só servidor
41. NUNCA implementar Edge Function sem docs/integracoes.md atualizado
42. NUNCA usar <img> — sempre next/image
43. NUNCA criar tabela sem migration SQL
44. NUNCA deletar fisicamente: usar soft delete (deleted_at)
```

---

# ✅ SEÇÃO 16 — CHECKLIST DE INÍCIO DO PROJETO

Antes de escrever qualquer linha de código, verificar:

- [ ] `docs/prd.md` criado (cópia exata desta v1.1)
- [ ] `docs/claude.md` criado (Seção 15)
- [ ] `.env.example` criado (Seção 13)
- [ ] `.gitignore` configurado (`.env` incluído)
- [ ] Supabase project "Empire site 3" acessível — credenciais coletadas
- [ ] OpenRouter API key disponível
- [ ] Scrape Creators API key disponível
- [ ] Pasta `/mockup` **removida** da referência (não usar mais)
- [ ] Estrutura de pastas `src/` criada
- [ ] `docs/roadmap/` estruturado com todos os épicos
- [ ] `docs/roadmap/_index.md` criado com DAG e tabela de progresso
- [ ] G01-T06 (pesquisa G4 Business) agendada como **primeira task de conteúdo**
- [ ] G04-T01 e G04-T02 (pesquisas de IA) agendadas antes de qualquer Edge Function

---

# 🚀 SEÇÃO 17 — ORDEM DE EXECUÇÃO RECOMENDADA

```
FASE 1 — FOUNDATION (sequencial, crítico)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Criar docs/prd.md (SEMPRE PRIMEIRO)
2. Criar docs/claude.md
3. G01-T01: Setup do projeto + estrutura de pastas
4. Paralelo: G01-T02 (Design System Empire Gold)
             G01-T03 (Supabase config + migrations)
             G01-T06 (Pesquisa G4 Business)
5. G01-T04: Autenticação (após G01-T03)
6. G01-T05: Estrutura de rotas (após G01-T04)

CHECKPOINT FASE 1:
→ Login funciona, banco conectado, design tokens ativos,
  G4 Business investigado e documentado, rotas existem sem erro

FASE 2 — SITE PÚBLICO (após G01 completo)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7. G02-T04: Sistema de conteúdo fixo (src/content/)
8. Paralelo: G02-T01 (Homepage Empire Gold)
             G02-T05 (Páginas institucionais)
9. G02-T02: Blog completo (listagem + post)
10. G02-T03: SEO técnico + performance

CHECKPOINT FASE 2:
→ Site público funcional com design Empire Gold, blog rodando,
  nota PageSpeed medida e documentada

FASE 3 — PAINEL ADMIN CORE (após G01, paralelo com Fase 2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
11. G03-T01: Layout e sidebar admin (light mode)
12. G03-T05: Usuários e permissões
13. Paralelo: G03-T02 (Gerenciamento de posts)
              G03-T04 (Gerenciador de mídia)
14. G03-T03: Editor rico TipTap (após G03-T02)

CHECKPOINT FASE 3:
→ Admin funcional, posts podem ser criados/editados/publicados,
  imagens podem ser enviadas, permissões funcionando

FASE 4 — IA E CONTEÚDO (após G03-T03)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
15. Paralelo: G04-T01 (Pesquisa OpenRouter)
              G04-T02 (Pesquisa Scrape Creators)
16. G04-T03: Edge Functions de IA (após G04-T01 e G04-T02)
17. Paralelo: G04-T04 (Painel gerador de IA no editor)
              G04-T05 (SEO automático por IA)

CHECKPOINT FASE 4:
→ IA gerando conteúdo, SEO preenchido automaticamente,
  scraping de Instagram e YouTube funcionando

FASE 5 — INTEGRAÇÕES (após G01-T05, paralelo quando possível)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
18. G05-T01, G05-T02, G05-T03, G05-T04 (paralelo)

FASE 6 — LANDING PAGES (após G03-T03 e G04-T03)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
19. G06-T01 → G06-T02 → G06-T03

FASE 7 — QUALIDADE E AUDITORIA (ao final de tudo)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
20. G07-T01: Testar todas as rotas públicas
21. G07-T02: Testar todos os fluxos do admin
22. G07-T03: Otimização final PageSpeed (meta: 90+)
23. G07-T04: Auditoria de segurança final

FUTURO (épico G08 — não iniciar sem FR aprovado)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Editor visual drag-and-drop tipo Elementor com IA
```

---

> **Este PRD versão 1.1 é somente leitura após salvo em `docs/prd.md`.**
>
> **Mudanças de escopo:** seguir Protocolo de Mudança de Feature — Seção 14.
>
> **Dúvidas de implementação:** consultar `docs/claude.md` → `docs/arquitetura.md` → `docs/integracoes.md` nesta ordem.
>
> **Identidade visual:** Empire Gold — nunca cores hardcoded, sempre `src/design-system/tokens.ts`.
>
> **Referência de layout:** `docs/referencia-g4.md` (criar na G01-T06 antes de qualquer tela).
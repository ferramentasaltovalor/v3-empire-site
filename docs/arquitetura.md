# docs/arquitetura.md — Arquitetura do Empire Site

**Última atualização:** 2026-02-23
**Versão:** 1.1
**Status:** Foundation completa — G01-T05

---

## Stack com Versões

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| Next.js | 16+ (App Router) | Framework principal |
| TypeScript | 5+ (strict) | Linguagem |
| Tailwind CSS | 4+ | Estilização |
| Supabase | Latest | Banco + Auth + Storage |
| TipTap | 2+ | Editor rico |
| OpenRouter | API v1 | Geração de conteúdo IA |

> Atualizar versões exatas após npm install

---

## Estrutura de Pastas

Ver PRD Seção 6 para estrutura completa.

Pastas principais:
- `src/app/` — Rotas Next.js (App Router)
- `src/components/` — Componentes React
- `src/design-system/` — Tokens de design
- `src/lib/` — Utilitários e clientes de API
- `src/content/` — Conteúdo fixo do site
- `src/types/` — Tipos TypeScript
- `supabase/` — Migrations e Edge Functions
- `docs/` — Documentação viva

---

## Decisões Arquiteturais

### Server Components por padrão
Todos os componentes são Server Components por padrão.
`'use client'` apenas quando necessário (interatividade, hooks de estado).

### Grupos de rotas
- `(public)` — Site público com layout dark mode Empire Gold
- `(admin)` — Painel admin com layout light mode
- `(auth)` — Páginas de autenticação com layout light mode
- `lp/[slug]` — Landing pages com layout isolado

---

## Estrutura de Rotas (G01-T05)

```
src/app/
├── layout.tsx              → Root layout (fontes, metadata base)
├── error.tsx               → Error boundary raiz
├── not-found.tsx           → Página 404 Empire Gold
├── sitemap.ts              → Sitemap dinâmico
├── robots.ts               → Robots.txt (bloqueia /admin/*, /api/*)
│
├── (public)/               → Site público (dark mode Empire Gold)
│   ├── layout.tsx          → Navbar + Footer
│   ├── error.tsx           → Error boundary público
│   ├── loading.tsx         → Loading skeleton público
│   ├── page.tsx            → Homepage
│   ├── blog/
│   │   ├── page.tsx        → Lista de posts
│   │   ├── loading.tsx     → Blog grid skeleton
│   │   └── [slug]/page.tsx → Post individual
│   │   └── categoria/[slug]/page.tsx → Posts por categoria
│   ├── sobre/page.tsx      → Página institucional
│   ├── contato/page.tsx    → Formulário de contato
│   └── lp/
│       ├── layout.tsx      → Layout isolado (sem Navbar/Footer)
│       └── [slug]/page.tsx → Landing pages dinâmicas
│
├── (admin)/                → Painel admin (light mode)
│   ├── layout.tsx          → AdminSidebar + AdminHeader
│   ├── error.tsx           → Error boundary admin
│   ├── loading.tsx         → Admin loading skeleton
│   └── admin/
│       ├── page.tsx        → Dashboard
│       ├── posts/
│       │   ├── page.tsx    → Lista de posts
│       │   ├── loading.tsx → Posts table skeleton
│       │   ├── novo/page.tsx → Novo post
│       │   └── [id]/page.tsx → Editar post
│       ├── midia/page.tsx  → Gerenciador de mídia
│       ├── landing-pages/
│       │   ├── page.tsx    → Lista de LPs
│       │   ├── nova/page.tsx → Nova LP
│       │   └── [id]/page.tsx → Editar LP
│       ├── usuarios/page.tsx → Gerenciar usuários
│       └── configuracoes/
│           ├── geral/page.tsx → Configurações gerais
│           ├── seo/page.tsx   → Configurações de SEO
│           ├── analytics/page.tsx → Analytics
│           ├── integracoes/page.tsx → Integrações
│           └── webhooks/page.tsx → Webhooks
│
├── (auth)/                 → Autenticação (light mode)
│   ├── layout.tsx          → Layout centralizado simples
│   ├── error.tsx           → Error boundary auth
│   └── admin/login/
│       ├── page.tsx        → Página de login
│       └── actions.ts      → Server actions de auth
│
└── api/                    → API routes
    ├── posts/route.ts      → CRUD posts
    ├── analytics/route.ts  → Endpoint de analytics
    └── webhooks/[slug]/route.ts → Webhooks incoming
```

### Componentes de Layout

| Componente | Localização | Uso |
|------------|-------------|-----|
| `Navbar` | `src/components/public/layout/Navbar.tsx` | Navegação do site público |
| `Footer` | `src/components/public/layout/Footer.tsx` | Rodapé do site público |
| `AdminSidebar` | `src/components/admin/layout/AdminSidebar.tsx` | Sidebar do painel admin |
| `AdminHeader` | `src/components/admin/layout/AdminHeader.tsx` | Header do painel admin |
| `ErrorBoundary` | `src/components/shared/ErrorBoundary.tsx` | Error boundary reutilizável |

### Design Tokens por Contexto

| Contexto | Tokens | Classes CSS |
|----------|--------|-------------|
| Público (dark) | `empire.*` | `bg-empire-bg`, `text-empire-text`, `text-empire-gold` |
| Admin (light) | `admin.*` | `bg-admin-bg`, `text-admin-text`, `text-admin-accent` |
| Auth (light) | `admin.*` | Mesmo do admin |

### Design System (Tailwind v4)
Tokens centralizados em `src/design-system/tokens.ts`.
Tailwind v4 usa CSS custom properties via `@theme` em `globals.css`.
Os tokens TypeScript são a fonte de verdade para uso em código.

---

## Schema do Banco (Supabase)

> Implementado em G01-T03. Ver migrations em `supabase/migrations/`.

### Tabelas e Relacionamentos

#### Usuários e Permissões
| Tabela | Descrição | RLS |
|--------|-----------|-----|
| `profiles` | Estende `auth.users` com role e bio | ✅ |
| `api_keys` | Chaves de API para integração | ✅ |

#### Conteúdo (Blog)
| Tabela | Descrição | RLS |
|--------|-----------|-----|
| `posts` | Posts do blog com SEO e status | ✅ |
| `post_categories` | Categorias hierárquicas | ✅ |
| `post_tags` | Tags para posts | ✅ |
| `posts_categories` | Pivot posts ↔ categorias | ✅ |
| `posts_tags` | Pivot posts ↔ tags | ✅ |
| `post_revisions` | Histórico de revisões | ✅ |

#### Mídia
| Tabela | Descrição | RLS |
|--------|-----------|-----|
| `media_folders` | Pastas para organização | ✅ |
| `media_items` | Arquivos enviados | ✅ |

#### Landing Pages
| Tabela | Descrição | RLS |
|--------|-----------|-----|
| `landing_pages` | LPs com seções JSON | ✅ |

#### Integrações
| Tabela | Descrição | RLS |
|--------|-----------|-----|
| `analytics_configs` | Configurações de analytics | ✅ |
| `webhook_configs` | Webhooks outgoing | ✅ |
| `webhook_logs` | Logs de webhooks | ✅ |
| `site_settings` | Configurações do site (KV) | ✅ |

#### IA
| Tabela | Descrição | RLS |
|--------|-----------|-----|
| `ai_generation_logs` | Logs de geração IA | ✅ |

### Storage Buckets

| Bucket | Público | Uso |
|--------|---------|-----|
| `media` | ✅ | Imagens e arquivos do site |

### Roles de Usuário

Hierarquia de permissões:
1. `super_admin` — Acesso total, pode gerenciar API keys
2. `admin` — Gerencia usuários, configurações, webhooks
3. `editor` — Gerencia todo conteúdo
4. `author` — Cria e edita próprios posts
5. `viewer` — Apenas leitura

### Funções PostgreSQL

| Função | Retorno | Descrição |
|--------|---------|-----------|
| `handle_updated_at()` | TRIGGER | Atualiza `updated_at` automaticamente |
| `handle_new_user()` | TRIGGER | Cria profile ao registrar usuário |
| `is_editor()` | BOOLEAN | Verifica se usuário é editor+ |
| `is_author_or_editor(uuid)` | BOOLEAN | Verifica se é autor do post ou editor |
| `get_user_role()` | TEXT | Retorna role do usuário atual |
| `has_role(text)` | BOOLEAN | Verifica se usuário tem role mínimo |

### Índices

- Posts: `slug`, `status`, `author_id`, `published_at`, `scheduled_at`
- Categorias/Tags: `slug`
- Full-text search: `posts_content_search_idx` (GIN)
- Webhook logs: `webhook_id`, `created_at`

### Políticas RLS

Todas as tabelas têm RLS habilitado. Principais políticas:

- **Profiles**: Todos podem ver, apenas dono pode editar próprio perfil
- **Posts**: Publicados são públicos, autores veem próprios rascunhos
- **Categorias/Tags**: Todos podem ver, editores podem gerenciar
- **Mídia**: Autenticados podem ver, dono pode editar uploads próprios
- **Configurações**: Apenas admins podem acessar

---

## Edge Functions (Supabase)

> Implementar em G04-T03. Pesquisar docs antes.

Planejadas:
- `gerar-conteudo` — Geração de texto via OpenRouter
- `analisar-seo` — Análise e score de SEO
- `scrape-social` — Scraping de Instagram/YouTube

---

## Histórico de Mudanças

| Data | Mudança | Autor |
|------|---------|-------|
| 2026-02-23 | Estrutura de rotas completa com error boundaries, loading states e componentes admin | G01-T05 |
| 2025-07-15 | Criação inicial | G01-T01 |

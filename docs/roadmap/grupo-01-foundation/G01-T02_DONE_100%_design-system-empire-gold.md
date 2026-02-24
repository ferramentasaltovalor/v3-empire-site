# G01-T02 — Design System Empire Gold

**Status:** DONE  
**Progresso:** 100%  
**Dependências:** G01-T01  
**Bloqueia:** G02-T01, G02-T02, G03-T01  

---

## Critérios de Aceitação
- [x] src/design-system/tokens.ts criado com TODOS os tokens
- [x] globals.css usa @theme com variáveis CSS (Tailwind v4)
- [x] Fontes Cormorant Garamond + DM Sans via next/font
- [x] Pasta design-system/ criada com documentação
- [x] guidelines/como-mudar-cores.md criado
- [x] guidelines/admin-vs-publico.md criado
- [x] Componentes base: Button (premium + secondary + ghost + destructive), Card (base + gold + admin), Badge (default + pulse), Skeleton (dark + light), Separator, Input, Textarea, Label
- [x] NENHUMA cor hardcoded em qualquer arquivo
- [x] docs/design-system.md criado

## Arquivos Criados

### Componentes UI (`src/components/ui/`)
- `button.tsx` — Botões com variantes premium, secondary, ghost, destructive
- `card.tsx` — Cards com variantes base, gold, admin + subcomponentes
- `badge.tsx` — Badges com variantes default, pulse
- `skeleton.tsx` — Skeletons dark/light + SkeletonText, SkeletonImage, SkeletonCard, SkeletonPostCard, SkeletonTableRow
- `separator.tsx` — Separador com gradiente dourado
- `input.tsx` — Input com variantes dark, light
- `textarea.tsx` — Textarea com variantes dark, light
- `label.tsx` — Label com opção uppercase
- `index.ts` — Exports centralizados

### Layout Components (`src/components/public/layout/`)
- `Navbar.tsx` — Navegação fixa com scroll effect e mobile menu
- `Footer.tsx` — Rodapé com links e copyright
- `Breadcrumb.tsx` — Navegação estrutural + JSON-LD

### Hooks (`src/hooks/`)
- `useIntersectionObserver.ts` — Hook para animações fade-in-up
- `useScrolled.ts` — Hook para detectar scroll

### Documentação (`design-system/`)
- `README.md` — Visão geral do design system
- `guidelines/como-mudar-cores.md` — Guia de alteração de cores
- `guidelines/admin-vs-publico.md` — Diferenciação de temas
- `tokens/colors.md` — Documentação de tokens de cor
- `components/buttons.md` — Documentação de botões
- `components/cards.md` — Documentação de cards
- `components/skeletons.md` — Documentação de skeletons
- `animations/index.md` — Documentação de animações

### Docs (`docs/`)
- `design-system.md` — Documentação principal do design system

## Histórico de Status
| Data | Status | Observação |
|------|--------|------------|
| 2025-07-15 | TODO | Task criada |
| 2026-02-23 | DONE | Design system completo implementado |

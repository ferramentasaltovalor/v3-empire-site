# docs/design-system.md — Design System Empire Gold

## Visão Geral

O Design System Empire Gold é a fonte única da verdade para o visual da aplicação Empire. Ele define tokens, componentes e padrões visuais que garantem consistência em todo o projeto.

## Tokens

**Fonte:** `src/design-system/tokens.ts`

Os tokens são os valores fundamentais do design system: cores, tipografia, espaçamentos, sombras, etc.

### Estrutura

```typescript
export const colors = { empire: {...}, admin: {...}, semantic: {...} }
export const typography = { fonts, sizes, weights, lineHeights, letterSpacing }
export const spacing = { xs, sm, md, lg, xl, '2xl', '3xl', '4xl', '5xl' }
export const containers = { narrow, default, wide }
export const effects = { transitions, shadows, gradients, borders }
export const patterns = { grid }
```

---

## Paleta de Cores

### Site Público (Dark Mode)

| Nome | Hex | Uso |
|------|-----|-----|
| `empire.bg` | `#0a0a0b` | Fundo principal |
| `empire.surface` | `#111113` | Seções alternadas |
| `empire.card` | `#18181b` | Cards e containers |
| `empire.border` | `#27272a` | Bordas sutis |
| `empire.text` | `#fafafa` | Texto principal |
| `empire.muted` | `#71717a` | Texto secundário |
| `empire.gold` | `#c9a962` | CTAs e destaques |
| `empire.goldLight` | `#e4d4a5` | Hover states |
| `empire.goldDark` | `#9a7b3c` | Sombras |

### Painel Admin (Light Mode)

| Nome | Hex | Uso |
|------|-----|-----|
| `admin.bg` | `#FFFFFF` | Fundo principal |
| `admin.surface` | `#F9FAFB` | Cards |
| `admin.border` | `#E5E7EB` | Bordas |
| `admin.text` | `#111827` | Texto principal |
| `admin.muted` | `#6B7280` | Texto secundário |
| `admin.accent` | `#c9a962` | Acento (mesmo gold) |

### Cores Semânticas

| Nome | Hex | Uso |
|------|-----|-----|
| `semantic.success` | `#22C55E` | Sucesso |
| `semantic.warning` | `#F59E0B` | Alerta |
| `semantic.error` | `#EF4444` | Erro |
| `semantic.info` | `#3B82F6` | Informação |

---

## Tipografia

### Fontes

- **Display:** Cormorant Garamond — títulos, números, stats
- **Body:** DM Sans — parágrafos, UI, labels

### Uso

```tsx
<h1 className="font-display text-4xl">Título Elegante</h1>
<p className="font-body text-base">Corpo do texto</p>
```

### Tamanhos Fluidos

```css
h1: clamp(2.5rem, 8vw, 5rem)    /* 40px → 80px */
h2: clamp(1.75rem, 5vw, 3rem)   /* 28px → 48px */
h3: clamp(1.25rem, 3vw, 1.5rem) /* 20px → 24px */
body: clamp(1rem, 2vw, 1.125rem) /* 16px → 18px */
```

---

## Componentes Base

### UI Components (`src/components/ui/`)

| Componente | Variantes | Descrição |
|------------|-----------|-----------|
| `Button` | premium, secondary, ghost, destructive | Botões de ação |
| `Card` | base, gold, admin | Containers visuais |
| `Badge` | default, pulse | Tags e indicadores |
| `Skeleton` | dark, light | Placeholders de loading |
| `Separator` | — | Divisória com gradiente |
| `Input` | dark, light | Campo de texto |
| `Textarea` | dark, light | Área de texto |
| `Label` | — | Label de formulário |

### Layout Components (`src/components/public/layout/`)

| Componente | Descrição |
|------------|-----------|
| `Navbar` | Navegação fixa com scroll effect |
| `Footer` | Rodapé com links e copyright |
| `Breadcrumb` | Navegação estrutural + JSON-LD |

---

## Como Mudar o Tema

Ver [design-system/guidelines/como-mudar-cores.md](../design-system/guidelines/como-mudar-cores.md)

### Passo a Passo

1. Altere o valor em `src/design-system/tokens.ts`
2. Atualize a variável CSS em `src/app/globals.css`
3. O site inteiro reflete a mudança automaticamente

### Exemplo

```typescript
// tokens.ts
empire: {
    gold: '#d4af37',  // Novo tom de dourado
}
```

```css
/* globals.css */
--color-empire-gold: #d4af37;
```

---

## Admin vs Público

Ver [design-system/guidelines/admin-vs-publico.md](../design-system/guidelines/admin-vs-publico.md)

### Regra Principal

- **Site público:** Usar tokens `empire.*`
- **Painel admin:** Usar tokens `admin.*`
- **Componentes UI:** Aceitar `variant` como prop

### Exemplo

```tsx
// Site público
<Input variant="dark" />
<Card variant="gold" />

// Painel admin
<Input variant="light" />
<Card variant="admin" />
```

---

## Animações

Ver [design-system/animations/index.md](../design-system/animations/index.md)

### Animações Disponíveis

| Nome | Uso |
|------|-----|
| `fade-in-up` | Entrada de elementos |
| `pulse-ring` | CTAs principais |
| `shine` | Efeito de luz em botões |
| `stagger-children` | Animação em cascata |

### Hooks

- `useIntersectionObserver` — Detecta entrada na viewport
- `useScrolled` — Detecta scroll da página

---

## Utilitários CSS

### Gradientes

```tsx
<span className="text-gold-gradient">Texto com gradiente</span>
<div className="border-gold-gradient">Card premium</div>
```

### Padrões

```tsx
<div className="bg-grid-pattern">Fundo com grid sutil</div>
```

### Sombras

```tsx
<div className="shadow-[var(--shadow-card)]">Card elevado</div>
<div className="shadow-[var(--shadow-gold)]">Elemento dourado</div>
```

---

## Documentação Detalhada

- [Tokens de Cores](../design-system/tokens/colors.md)
- [Componentes: Buttons](../design-system/components/buttons.md)
- [Componentes: Cards](../design-system/components/cards.md)
- [Componentes: Skeletons](../design-system/components/skeletons.md)
- [Animações](../design-system/animations/index.md)

---

## Checklist de Implementação

- [x] Tokens definidos em `tokens.ts`
- [x] Variáveis CSS em `globals.css`
- [x] Componentes UI base criados
- [x] Layout components criados
- [x] Hooks de animação criados
- [x] Documentação completa
- [ ] Testes visuais (Storybook ou similar)

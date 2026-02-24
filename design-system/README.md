# Design System Empire Gold

## Visão Geral

O Design System Empire Gold é o sistema visual da Empire. Ele define cores, tipografia, espaçamentos e componentes que garantem consistência visual em todo o site.

## Como usar

### Cores
Sempre use cores via classes Tailwind que mapeiam para os tokens:

```tsx
// Fundos
<div className="bg-[var(--color-empire-bg)]">Fundo principal</div>
<div className="bg-[var(--color-empire-card)]">Card</div>

// Texto
<p className="text-[var(--color-empire-text)]">Texto principal</p>
<p className="text-[var(--color-empire-muted)]">Texto secundário</p>

// Acentos
<span className="text-[var(--color-empire-gold)]">Destaque</span>
```

### Fontes
Use as classes de fonte configuradas via next/font:

```tsx
<h1 className="font-display text-4xl">Título elegante</h1>
<p className="font-body text-base">Corpo do texto</p>
```

### Componentes
Importe componentes da pasta `@/components/ui`:

```tsx
import { Button, Card, Badge } from '@/components/ui'

<Button variant="premium">CTA Principal</Button>
<Card variant="gold">Conteúdo premium</Card>
<Badge variant="pulse">Novo</Badge>
```

## Estrutura

```
src/
├── design-system/
│   └── tokens.ts          # Fonte única da verdade para tokens
├── components/
│   ├── ui/                # Componentes base reutilizáveis
│   ├── public/            # Componentes do site público
│   └── admin/             # Componentes do painel admin
└── app/
    └── globals.css        # Variáveis CSS e utilitários
```

## Como mudar o visual

Ver [guidelines/como-mudar-cores.md](./guidelines/como-mudar-cores.md)

## Distinção Admin vs Público

Ver [guidelines/admin-vs-publico.md](./guidelines/admin-vs-publico.md)

## Documentação

- [Tokens de Cores](./tokens/colors.md)
- [Componentes: Buttons](./components/buttons.md)
- [Componentes: Cards](./components/cards.md)
- [Componentes: Skeletons](./components/skeletons.md)
- [Animações](./animations/index.md)

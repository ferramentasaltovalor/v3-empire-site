# Tokens de Cores — Empire Gold

## Visão Geral

Todas as cores do sistema vêm de `src/design-system/tokens.ts` e são expostas via variáveis CSS em `src/app/globals.css`.

## Paleta Empire (Site Público)

### Fundos

| Token | Variável CSS | Hex | Uso |
|-------|--------------|-----|-----|
| `empire.bg` | `--color-empire-bg` | `#0a0a0b` | Fundo principal da página |
| `empire.surface` | `--color-empire-surface` | `#111113` | Seções alternadas, backgrounds secundários |
| `empire.card` | `--color-empire-card` | `#18181b` | Cards, containers, modais |
| `empire.border` | `--color-empire-border` | `#27272a` | Bordas sutis, divisórias |

**Uso no Tailwind:**
```tsx
<div className="bg-[var(--color-empire-bg)]">
<div className="bg-[var(--color-empire-surface)]">
<div className="bg-[var(--color-empire-card)] border border-[var(--color-empire-border)]">
```

### Texto

| Token | Variável CSS | Hex | Uso |
|-------|--------------|-----|-----|
| `empire.text` | `--color-empire-text` | `#fafafa` | Texto principal, títulos |
| `empire.muted` | `--color-empire-muted` | `#71717a` | Texto secundário, labels, placeholders |

**Uso no Tailwind:**
```tsx
<h1 className="text-[var(--color-empire-text)]">
<p className="text-[var(--color-empire-muted)]">
```

### Gold — Acento Principal

| Token | Variável CSS | Hex | Uso |
|-------|--------------|-----|-----|
| `empire.gold` | `--color-empire-gold` | `#c9a962` | CTAs, links, destaques |
| `empire.goldLight` | `--color-empire-gold-light` | `#e4d4a5` | Hover states, highlights |
| `empire.goldDark` | `--color-empire-gold-dark` | `#9a7b3c` | Sombras, profundidade |

**Uso no Tailwind:**
```tsx
<button className="bg-[var(--color-empire-gold)] text-[var(--color-empire-bg)]">
<a className="text-[var(--color-empire-gold)] hover:text-[var(--color-empire-gold-light)]">
```

### Silver — Acento Secundário

| Token | Variável CSS | Hex | Uso |
|-------|--------------|-----|-----|
| `empire.silver` | `--color-empire-silver` | `#a8a8a8` | Elementos secundários |
| `empire.silverLight` | `--color-empire-silver-light` | `#d4d4d4` | Hover states |
| `empire.silverDark` | `--color-empire-silver-dark` | `#737373` | Sombras |

### Bronze — Acento Terciário

| Token | Variável CSS | Hex | Uso |
|-------|--------------|-----|-----|
| `empire.bronze` | `--color-empire-bronze` | `#b08d57` | Elementos terciários |
| `empire.bronzeLight` | `--color-empire-bronze-light` | `#d4b896` | Hover states |
| `empire.bronzeDark` | `--color-empire-bronze-dark` | `#8b6914` | Sombras |

## Paleta Admin (Painel Interno)

### Fundos

| Token | Variável CSS | Hex | Uso |
|-------|--------------|-----|-----|
| `admin.bg` | `--color-admin-bg` | `#FFFFFF` | Fundo principal |
| `admin.surface` | `--color-admin-surface` | `#F9FAFB` | Cards, containers |
| `admin.sidebar` | `--color-admin-sidebar` | `#FFFFFF` | Sidebar |
| `admin.border` | `--color-admin-border` | `#E5E7EB` | Bordas |

### Texto

| Token | Variável CSS | Hex | Uso |
|-------|--------------|-----|-----|
| `admin.text` | `--color-admin-text` | `#111827` | Texto principal |
| `admin.muted` | `--color-admin-muted` | `#6B7280` | Texto secundário |

### Acento

| Token | Variável CSS | Hex | Uso |
|-------|--------------|-----|-----|
| `admin.accent` | `--color-admin-accent` | `#c9a962` | Mesmo gold da marca |
| `admin.accentHover` | `--color-admin-accent-hover` | `#9a7b3c` | Hover do acento |

## Cores Semânticas

| Token | Variável CSS | Hex | Uso |
|-------|--------------|-----|-----|
| `semantic.success` | `--color-semantic-success` | `#22C55E` | Sucesso, confirmação |
| `semantic.warning` | `--color-semantic-warning` | `#F59E0B` | Alerta, aviso |
| `semantic.error` | `--color-semantic-error` | `#EF4444` | Erro, ações destrutivas |
| `semantic.info` | `--color-semantic-info` | `#3B82F6` | Informação |

**Uso no Tailwind:**
```tsx
<div className="bg-[var(--color-semantic-success)] text-white">
<div className="bg-[var(--color-semantic-error)] text-white">
```

## Gradientes Especiais

### Texto com Gradiente Dourado
```tsx
<span className="text-gold-gradient">Texto premium</span>
```

CSS gerado:
```css
background: linear-gradient(135deg, #c9a962 0%, #e4d4a5 50%, #c9a962 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### Borda com Gradiente Dourado
```tsx
<div className="border-gold-gradient">Card premium</div>
```

CSS gerado:
```css
background: linear-gradient(#18181b, #18181b) padding-box,
            linear-gradient(135deg, #c9a962, #e4d4a5, #c9a962) border-box;
border: 1px solid transparent;
```

## Sombras

| Nome | Variável CSS | Valor | Uso |
|------|--------------|-------|-----|
| `card` | `--shadow-card` | `0 20px 60px rgba(0,0,0,0.4)` | Cards elevados |
| `gold` | `--shadow-gold` | `0 10px 40px rgba(201,169,98,0.3)` | Elementos dourados |
| `subtle` | `--shadow-subtle` | `0 4px 16px rgba(0,0,0,0.2)` | Sombras sutis |

**Uso no Tailwind:**
```tsx
<div className="shadow-[var(--shadow-card)]">
<div className="shadow-[var(--shadow-gold)]">
```

## Padrão de Grid

```tsx
<div className="bg-grid-pattern">
  {/* Fundo com grid sutil dourado */}
</div>
```

CSS gerado:
```css
background-image:
  linear-gradient(rgba(201, 169, 98, 0.03) 1px, transparent 1px),
  linear-gradient(90deg, rgba(201, 169, 98, 0.03) 1px, transparent 1px);
background-size: 60px 60px;
```

# Admin vs Público — Por que são diferentes?

## Intenção do design

### Site Público — Dark Mode Premium
O site público usa **dark mode** (fundo preto, acentos dourados) para criar uma experiência premium e sofisticada. Isso transmite:
- Exclusividade
- Elegância
- Alto valor percebido

### Painel Admin — Light Mode
O painel admin usa **light mode** (fundo branco) por razões práticas:
1. **Diferenciação visual** — Clara distinção entre área interna e pública
2. **Legibilidade** — Melhor para leitura de conteúdo longo (editor, tabelas)
3. **Fadiga visual** — Reduz cansaço em uso prolongado

## Tokens do site público

Prefixo: `empire.*`

```tsx
// Fundos escuros
bg-[var(--color-empire-bg)]      // #0a0a0b — Fundo principal
bg-[var(--color-empire-surface)] // #111113 — Seções alternadas
bg-[var(--color-empire-card)]    // #18181b — Cards

// Texto claro
text-[var(--color-empire-text)]  // #fafafa — Texto principal
text-[var(--color-empire-muted)] // #71717a — Texto secundário

// Bordas sutis
border-[var(--color-empire-border)] // #27272a

// Acentos dourados
text-[var(--color-empire-gold)]      // #c9a962
bg-[var(--color-empire-gold)]        // #c9a962
```

## Tokens do admin

Prefixo: `admin.*`

```tsx
// Fundos claros
bg-[var(--color-admin-bg)]      // #FFFFFF — Fundo principal
bg-[var(--color-admin-surface)] // #F9FAFB — Cards
bg-[var(--color-admin-sidebar)] // #FFFFFF — Sidebar

// Texto escuro
text-[var(--color-admin-text)]  // #111827 — Texto principal
text-[var(--color-admin-muted)] // #6B7280 — Texto secundário

// Bordas claras
border-[var(--color-admin-border)] // #E5E7EB

// Acento dourado (mesmo gold)
text-[var(--color-admin-accent)]      // #c9a962
bg-[var(--color-admin-accent)]        // #c9a962
```

## Regra de uso por localização

### Componentes em `src/components/public/`
→ **SEMPRE** usar tokens `empire.*`

```tsx
// ✅ Correto
export function HeroSection() {
  return (
    <section className="bg-[var(--color-empire-bg)]">
      <h1 className="text-[var(--color-empire-text)]">Título</h1>
    </section>
  )
}

// ❌ Errado
export function HeroSection() {
  return (
    <section className="bg-white">
      <h1 className="text-gray-900">Título</h1>
    </section>
  )
}
```

### Componentes em `src/components/admin/`
→ **SEMPRE** usar tokens `admin.*`

```tsx
// ✅ Correto
export function AdminTable() {
  return (
    <div className="bg-[var(--color-admin-bg)] border-[var(--color-admin-border)]">
      {/* ... */}
    </div>
  )
}

// ❌ Errado
export function AdminTable() {
  return (
    <div className="bg-[var(--color-empire-bg)]">
      {/* ... */}
    </div>
  )
}
```

### Componentes em `src/components/ui/`
→ **Aceitam variante como prop**

Componentes base devem suportar ambos os temas via prop `variant`:

```tsx
// Componente Input com suporte a ambos os temas
export function Input({ variant = 'dark', ...props }: InputProps) {
  const classes = variant === 'dark' 
    ? 'bg-[var(--color-empire-card)] border-[var(--color-empire-border)]'
    : 'bg-white border-[var(--color-admin-border)]'
  
  return <input className={classes} {...props} />
}

// Uso no site público
<Input variant="dark" />

// Uso no admin
<Input variant="light" />
```

## Componentes UI e suas variantes

| Componente | Variantes | Default |
|------------|-----------|---------|
| `Button` | `premium`, `secondary`, `ghost`, `destructive` | `premium` |
| `Card` | `base`, `gold`, `admin` | `base` |
| `Input` | `dark`, `light` | `dark` |
| `Textarea` | `dark`, `light` | `dark` |
| `Skeleton` | `dark`, `light` | `dark` |

## Exemplo: Card no admin vs público

### Site Público
```tsx
<Card variant="gold">
  <CardHeader>Título</CardHeader>
  <CardContent>Conteúdo premium</CardContent>
</Card>
```

### Admin
```tsx
<Card variant="admin">
  <CardHeader>Título</CardHeader>
  <CardContent>Conteúdo administrativo</CardContent>
</Card>
```

## Checklist antes do commit

- [ ] Componentes em `public/` usam apenas tokens `empire.*`
- [ ] Componentes em `admin/` usam apenas tokens `admin.*`
- [ ] Componentes em `ui/` aceitam variante como prop
- [ ] Nenhuma cor hardcoded (ex: `#000`, `white`, `gray-500`)
- [ ] Todas as cores vêm de variáveis CSS ou tokens

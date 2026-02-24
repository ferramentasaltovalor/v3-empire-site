# Componentes: Cards

## Visão Geral

O componente `Card` é um container visual para agrupar conteúdo. Suporta múltiplas variantes e sub-componentes.

## Importação

```tsx
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui'
// ou
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
```

## Variantes

### Base (Padrão)

Card escuro padrão para o site público.

```tsx
<Card>
    <CardHeader>Título</CardHeader>
    <CardContent>Conteúdo do card</CardContent>
</Card>
```

**Características:**
- Fundo: `empire.card` (#18181b)
- Borda: `empire.border` (#27272a)
- Border radius: 8px
- Hover: Eleva 8px + sombra forte

### Gold

Card com borda dourada gradiente para conteúdo premium.

```tsx
<Card variant="gold">
    <CardHeader>Conteúdo Premium</CardHeader>
    <CardContent>...</CardContent>
</Card>
```

**Características:**
- Borda: Gradiente dourado
- Hover: Eleva 8px + sombra dourada

### Admin

Card claro para o painel administrativo.

```tsx
<Card variant="admin">
    <CardHeader>Título</CardHeader>
    <CardContent>...</CardContent>
</Card>
```

**Características:**
- Fundo: Branco
- Borda: `admin.border` (#E5E7EB)
- Hover: Eleva 2px + sombra sutil

## Sub-componentes

### CardHeader

Cabeçalho do card com padding.

```tsx
<CardHeader>
    <h3 className="text-lg font-semibold">Título</h3>
    <p className="text-sm text-[var(--color-empire-muted)]">Subtítulo</p>
</CardHeader>
```

**Padding:** `p-6 pb-0`

### CardContent

Área principal de conteúdo.

```tsx
<CardContent>
    <p>Conteúdo do card aqui...</p>
</CardContent>
```

**Padding:** `p-6`

### CardFooter

Rodapé do card, geralmente para ações.

```tsx
<CardFooter>
    <Button variant="ghost" size="sm">Cancelar</Button>
    <Button variant="premium" size="sm">Salvar</Button>
</CardFooter>
```

**Padding:** `p-6 pt-0` + flexbox para itens

## Props

### Card

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `variant` | `'base' \| 'gold' \| 'admin'` | `'base'` | Estilo visual do card |
| `hover` | `boolean` | `true` | Habilita animação de hover |
| `className` | `string` | `''` | Classes adicionais |

### CardHeader, CardContent, CardFooter

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `className` | `string` | `''` | Classes adicionais |

## Exemplos de Uso

### Card Simples

```tsx
<Card>
    <CardContent>
        <p>Conteúdo simples sem header ou footer.</p>
    </CardContent>
</Card>
```

### Card Completo

```tsx
<Card variant="base">
    <CardHeader>
        <h3 className="text-lg font-semibold text-[var(--color-empire-text)]">
            Título do Card
        </h3>
        <p className="text-sm text-[var(--color-empire-muted)]">
            Subtítulo ou descrição
        </p>
    </CardHeader>
    <CardContent>
        <p>Conteúdo principal do card...</p>
    </CardContent>
    <CardFooter>
        <Button variant="ghost" size="sm">Cancelar</Button>
        <Button variant="premium" size="sm">Confirmar</Button>
    </CardFooter>
</Card>
```

### Card Premium

```tsx
<Card variant="gold" className="max-w-md">
    <CardHeader>
        <Badge variant="pulse">Premium</Badge>
    </CardHeader>
    <CardContent>
        <h3 className="text-xl font-display text-gold-gradient">
            Conteúdo Exclusivo
        </h3>
        <p className="text-[var(--color-empire-muted)] mt-2">
            Acesso antecipado a novos recursos.
        </p>
    </CardContent>
</Card>
```

### Card sem Hover

```tsx
<Card hover={false}>
    <CardContent>
        <p>Card estático sem animação de hover.</p>
    </CardContent>
</Card>
```

### Card no Admin

```tsx
<Card variant="admin">
    <CardHeader>
        <h3 className="text-lg font-semibold text-[var(--color-admin-text)]">
            Estatísticas
        </h3>
    </CardHeader>
    <CardContent>
        <div className="grid grid-cols-3 gap-4">
            <div>
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-sm text-[var(--color-admin-muted)]">Visitas</p>
            </div>
            {/* ... */}
        </div>
    </CardContent>
</Card>
```

### Grid de Cards

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {items.map((item) => (
        <Card key={item.id}>
            <CardContent>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
            </CardContent>
        </Card>
    ))}
</div>
```

## Composição com Outros Componentes

### Card com Imagem

```tsx
<Card className="overflow-hidden p-0">
    <img 
        src="/image.jpg" 
        alt="Descrição" 
        className="w-full aspect-video object-cover"
    />
    <CardContent>
        <h3>Título</h3>
        <p>Descrição...</p>
    </CardContent>
</Card>
```

### Card com Badge

```tsx
<Card>
    <CardHeader className="flex flex-row items-center justify-between">
        <h3 className="font-semibold">Título</h3>
        <Badge>Novo</Badge>
    </CardHeader>
    <CardContent>
        <p>Conteúdo...</p>
    </CardContent>
</Card>
```

### Card Clicável

```tsx
<Link href="/detalhe">
    <Card className="cursor-pointer">
        <CardContent>
            <h3>Clique para ver mais</h3>
        </CardContent>
    </Card>
</Link>
```

## Quando Usar Cada Variante

| Variante | Quando Usar |
|----------|-------------|
| `base` | Cards padrão do site público |
| `gold` | Conteúdo premium, destaques especiais |
| `admin` | Qualquer elemento no painel admin |

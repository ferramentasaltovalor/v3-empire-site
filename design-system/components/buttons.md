# Componentes: Buttons

## Visão Geral

O componente `Button` é o elemento de ação principal do design system. Suporta múltiplas variantes visuais e estados.

## Importação

```tsx
import { Button } from '@/components/ui'
// ou
import { Button } from '@/components/ui/button'
```

## Variantes

### Premium (Padrão)

Botão com gradiente dourado, texto escuro. Usado para CTAs principais.

```tsx
<Button variant="premium">Começar Agora</Button>
```

**Características:**
- Fundo: Gradiente dourado (135deg)
- Texto: Cor do fundo empire (escuro)
- Borda: Nenhuma
- Hover: Eleva 2px + sombra dourada + efeito shine
- Border radius: 2px (sutileza)

**Efeito Shine:**
No hover, uma luz sutil passa da esquerda para direita sobre o botão.

### Secondary

Botão transparente com borda dourada. Usado para ações secundárias.

```tsx
<Button variant="secondary">Saiba Mais</Button>
```

**Características:**
- Fundo: Transparente
- Texto: Dourado
- Borda: 1px dourada
- Hover: Fundo dourado 10% + eleva 2px

### Ghost

Botão sem borda, texto suave. Usado para ações sutis.

```tsx
<Button variant="ghost">Cancelar</Button>
```

**Características:**
- Fundo: Transparente
- Texto: Muted (cinza)
- Borda: Nenhuma
- Hover: Fundo branco 5% + texto claro

### Destructive

Botão vermelho para ações destrutivas.

```tsx
<Button variant="destructive">Excluir</Button>
```

**Características:**
- Fundo: Vermelho semântico
- Texto: Branco
- Hover: Vermelho mais escuro + eleva 2px

## Tamanhos

```tsx
<Button size="sm">Pequeno</Button>  // px-4 py-2 text-sm
<Button size="md">Médio</Button>    // px-6 py-3 text-base (padrão)
<Button size="lg">Grande</Button>   // px-8 py-4 text-lg
```

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `variant` | `'premium' \| 'secondary' \| 'ghost' \| 'destructive'` | `'premium'` | Estilo visual do botão |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamanho do botão |
| `loading` | `boolean` | `false` | Exibe spinner e desabilita |
| `pulseRing` | `boolean` | `false` | Animação de pulso para CTAs principais |
| `asChild` | `boolean` | `false` | Permite usar como wrapper para Link |
| `disabled` | `boolean` | `false` | Desabilita o botão |
| `className` | `string` | `''` | Classes adicionais |

## Exemplos de Uso

### CTA Principal com Pulse

```tsx
<Button variant="premium" pulseRing size="lg">
    Fale com Especialista
</Button>
```

### Botão de Link (com Next.js Link)

```tsx
import Link from 'next/link'

<Button variant="secondary" asChild>
    <Link href="/contato">Ver Contato</Link>
</Button>
```

### Estado de Loading

```tsx
function SubmitButton() {
    const [loading, setLoading] = useState(false)
    
    return (
        <Button 
            variant="premium" 
            loading={loading}
            onClick={() => setLoading(true)}
        >
            Enviar
        </Button>
    )
}
```

### Botão Desabilitado

```tsx
<Button variant="premium" disabled>
    Indisponível
</Button>
```

### Botão com Ícone

```tsx
<Button variant="premium">
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
    Novo Post
</Button>
```

### Grupo de Botões

```tsx
<div className="flex gap-4">
    <Button variant="ghost">Cancelar</Button>
    <Button variant="premium">Salvar</Button>
</div>
```

## Acessibilidade

- **Focus visible:** Anel de foco dourado quando navegado por teclado
- **Disabled state:** Opacidade reduzida + cursor not-allowed
- **Loading state:** `aria-busy="true"` para leitores de tela
- **Ícones:** Devem ter `aria-hidden="true"` quando decorativos

## CSS Customizado

Para customizar ainda mais, use `className`:

```tsx
<Button 
    variant="premium" 
    className="w-full uppercase tracking-wider"
>
    Botão Largo
</Button>
```

## Quando Usar Cada Variante

| Variante | Quando Usar |
|----------|-------------|
| `premium` | CTAs principais, ações de conversão |
| `secondary` | Ações secundárias, alternativas ao premium |
| `ghost` | Ações sutis, cancelamentos, links |
| `destructive` | Ações irreversíveis, exclusões |

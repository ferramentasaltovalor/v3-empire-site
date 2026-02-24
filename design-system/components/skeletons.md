# Componentes: Skeletons

## Visão Geral

Skeletons são placeholders visuais que melhoram a percepção de performance durante o carregamento de conteúdo.

## Importação

```tsx
import { 
    Skeleton, 
    SkeletonText, 
    SkeletonImage, 
    SkeletonCard, 
    SkeletonPostCard, 
    SkeletonTableRow 
} from '@/components/ui'
```

## Variantes de Tema

### Dark (Site Público)
```tsx
<Skeleton variant="dark" />
```
- Fundo: `empire.card`
- Shimmer: Tom mais escuro da borda

### Light (Admin)
```tsx
<Skeleton variant="light" />
```
- Fundo: `admin.surface`
- Shimmer: Tom mais claro

## Componentes Disponíveis

### Skeleton (Base)

Skeleton genérico para qualquer uso.

```tsx
<Skeleton variant="dark" className="h-32 w-full" />
```

### SkeletonText

Linha de texto com largura configurável.

```tsx
<SkeletonText width="100%" />
<SkeletonText width="75%" />
<SkeletonText width="200px" />
```

**Props:**
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `width` | `string` | `'100%'` | Largura da linha |
| `variant` | `'dark' \| 'light'` | `'dark'` | Tema do skeleton |

### SkeletonImage

Bloco retangular com aspect ratio configurável.

```tsx
<SkeletonImage aspectRatio="16/9" />
<SkeletonImage aspectRatio="1/1" />
<SkeletonImage aspectRatio="4/3" />
```

**Props:**
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `aspectRatio` | `string` | `'16/9'` | Proporção da imagem |
| `variant` | `'dark' \| 'light'` | `'dark'` | Tema do skeleton |

### SkeletonCard

Card completo com imagem + linhas de texto.

```tsx
<SkeletonCard variant="dark" />
```

**Estrutura:**
- Imagem 16:9
- 3 linhas de texto (75%, 90%, 60%)

### SkeletonPostCard

Card específico para posts do blog.

```tsx
<SkeletonPostCard variant="dark" />
```

**Estrutura:**
- Imagem 16:9
- Badge de categoria
- 2 linhas de título
- 2 linhas de excerpt
- Avatar + nome do autor

### SkeletonTableRow

Linha de tabela para o admin.

```tsx
<SkeletonTableRow variant="light" />
```

**Estrutura:**
- Checkbox
- 3 colunas de texto
- Badge de status

## Skeletons Necessários (Checklist)

### Admin — Painel Interno

- [x] `SkeletonTableRow` — Tabela de posts
- [ ] `SkeletonPostEditor` — Editor de post
- [ ] `SkeletonMediaLibrary` — Biblioteca de mídia
- [ ] `SkeletonDashboardCard` — Dashboard cards
- [ ] `SkeletonUserList` — Lista de usuários
- [ ] `SkeletonWebhookList` — Lista de webhooks
- [ ] `SkeletonSEOPanel` — Painel de SEO
- [ ] `SkeletonAIPanel` — Painel lateral de IA
- [ ] `SkeletonMediaFolders` — Gerenciador de pastas de mídia

### Site Público

- [x] `SkeletonPostCard` — Grid de posts do blog
- [ ] `SkeletonPostSingle` — Post individual
- [ ] `SkeletonHomeSection` — Seções da home com dados dinâmicos
- [ ] `SkeletonCategoryList` — Listagem por categoria
- [ ] `SkeletonSearchResults` — Barra de busca com resultados

## Exemplos de Uso

### Loading de Lista de Posts

```tsx
function PostList({ loading, posts }) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <SkeletonPostCard key={i} variant="dark" />
                ))}
            </div>
        )
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    )
}
```

### Loading de Tabela Admin

```tsx
function PostsTable({ loading, posts }) {
    if (loading) {
        return (
            <div className="divide-y divide-[var(--color-admin-border)]">
                {[...Array(10)].map((_, i) => (
                    <SkeletonTableRow key={i} variant="light" />
                ))}
            </div>
        )
    }
    
    return (
        <table>
            {/* ... */}
        </table>
    )
}
```

### Loading de Card Individual

```tsx
function FeatureCard({ loading, feature }) {
    if (loading) {
        return <SkeletonCard variant="dark" />
    }
    
    return (
        <Card>
            <CardHeader>{feature.title}</CardHeader>
            <CardContent>{feature.description}</CardContent>
        </Card>
    )
}
```

### Skeleton com Delay

```tsx
function useDelayedLoading(loading, delay = 200) {
    const [showSkeleton, setShowSkeleton] = useState(false)
    
    useEffect(() => {
        if (loading) {
            const timer = setTimeout(() => setShowSkeleton(true), delay)
            return () => clearTimeout(timer)
        } else {
            setShowSkeleton(false)
        }
    }, [loading, delay])
    
    return showSkeleton
}

// Uso
function PostList({ loading, posts }) {
    const showSkeleton = useDelayedLoading(loading)
    
    if (!showSkeleton && loading) {
        return null // Evita flash de skeleton em carregamentos rápidos
    }
    
    if (showSkeleton) {
        return <SkeletonPostCard />
    }
    
    return <PostListContent posts={posts} />
}
```

## Criando Novos Skeletons

### Estrutura Base

```tsx
export function SkeletonCustom({ variant = 'dark', className = '' }: SkeletonProps) {
    return (
        <div className={['space-y-4', className].join(' ')} aria-hidden="true">
            <SkeletonImage variant={variant} />
            <div className="space-y-2">
                <SkeletonText variant={variant} width="90%" />
                <SkeletonText variant={variant} width="70%" />
            </div>
        </div>
    )
}
```

### Boas Práticas

1. **Sempre use `aria-hidden="true"`** — Skeletons são decorativos
2. **Use o tema correto** — `dark` para público, `light` para admin
3. **Mantenha proporções realistas** — Imitar o conteúdo real
4. **Evite flash de skeleton** — Use delay para carregamentos rápidos
5. **Agrupe skeletons** — Use containers com `space-y` para múltiplos elementos

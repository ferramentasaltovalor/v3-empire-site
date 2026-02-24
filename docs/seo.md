# SEO — Empire Site

Este documento descreve a estratégia e implementação de SEO técnico para o Empire Site.

## Metas

- **PageSpeed Score:** 90+ (mobile e desktop)
- **Core Web Vitals:**
  - LCP (Largest Contentful Paint) < 2.5s
  - CLS (Cumulative Layout Shift) < 0.1
  - INP (Interaction to Next Paint) < 200ms

---

## Metadados

Todas as páginas devem ter:

- **Title** — único e descritivo (50-60 caracteres)
- **Description** — 150-160 caracteres
- **Canonical URL** — evitar conteúdo duplicado
- **Open Graph** — title, description, image, url
- **Twitter Card** — summary_large_image

### Implementação

Use os helpers em [`src/lib/seo/metadata.ts`](src/lib/seo/metadata.ts):

```tsx
import { generateMetadata, generatePageMetadata } from '@/lib/seo/metadata'

// Página estática
export const metadata = generatePageMetadata(
  'Título da Página',
  'Descrição da página com 150-160 caracteres.',
  '/caminho-da-pagina'
)

// Página dinâmica (blog post)
export async function generateMetadata({ params }) {
  return generateMetadata({
    title: post.title,
    description: post.excerpt,
    image: post.cover_image_url,
    type: 'article',
    publishedTime: post.published_at,
    author: post.author?.full_name,
  })
}
```

---

## Structured Data (JSON-LD)

### Schemas Implementados

| Schema | Páginas | Arquivo |
|--------|---------|---------|
| Organization | Homepage | [`src/lib/seo/jsonld.ts`](src/lib/seo/jsonld.ts) |
| WebSite | Homepage | [`src/lib/seo/jsonld.ts`](src/lib/seo/jsonld.ts) |
| BlogPosting | Blog Post | [`src/lib/seo/jsonld.ts`](src/lib/seo/jsonld.ts) |
| BreadcrumbList | Todas com breadcrumb | [`src/lib/seo/jsonld.ts`](src/lib/seo/jsonld.ts) |
| WebPage | Páginas institucionais | [`src/lib/seo/jsonld.ts`](src/lib/seo/jsonld.ts) |

### Uso

```tsx
import { JsonLd } from '@/components/shared/JsonLd'
import { organizationSchema, websiteSchema, breadcrumbSchema } from '@/lib/seo/jsonld'

export default function Page() {
  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      {/* conteúdo da página */}
    </>
  )
}
```

---

## Sitemap

- **URL:** `/sitemap.xml`
- **Atualização:** Automática (dinâmica)
- **Conteúdo:**
  - Páginas estáticas (homepage, sobre, blog, contato)
  - Posts publicados (com lastModified)
  - Categorias

### Implementação

Ver [`src/app/sitemap.ts`](src/app/sitemap.ts):

```tsx
export default async function sitemap() {
  // Busca posts do Supabase
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at')
    .eq('status', 'published')

  // Retorna sitemap completo
  return [...staticPages, ...postPages, ...categoryPages]
}
```

---

## Robots.txt

- **URL:** `/robots.txt`
- **Permite:** tudo exceto `/admin`, `/api`, `/login`
- **Sitemap:** referenciado automaticamente

### Implementação

Ver [`src/app/robots.ts`](src/app/robots.ts):

```tsx
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/login'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
```

---

## Performance

### Fontes

- Usar `next/font/google` com `display: swap`
- Preload para fontes críticas
- Variable fonts quando disponível

```tsx
const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})
```

### Imagens

- Usar `next/image` sempre
- `priority` para imagens above-the-fold (hero, LCP)
- `loading="lazy"` para imagens below-the-fold (padrão)
- `sizes` attribute para imagens responsivas
- `alt` text obrigatório

Ver [`src/lib/utils/image.ts`](src/lib/utils/image.ts) para presets:

```tsx
import { imageConfig } from '@/lib/utils/image'

<Image
  src="/hero.jpg"
  alt="Descrição"
  sizes={imageConfig.hero.sizes}
  priority={imageConfig.hero.priority}
/>
```

### JavaScript

- Server Components por padrão
- Dynamic imports para componentes pesados
- `next/script` com `strategy="afterInteractive"` para analytics

### CSS

- Tailwind CSS com purge automático
- CSS-in-JS evitado para melhor performance

---

## Checklist por Página

### Homepage
- [x] Title único e descritivo
- [x] Meta description
- [x] Canonical URL
- [x] OG image
- [x] H1 único
- [x] Hierarquia de headings
- [x] JSON-LD (Organization + WebSite)
- [x] Imagens com alt text

### Blog Post
- [x] Title único (SEO title ou título do post)
- [x] Meta description (SEO description ou excerpt)
- [x] Canonical URL
- [x] OG image (cover ou padrão)
- [x] H1 único
- [x] JSON-LD (BlogPosting + BreadcrumbList)
- [x] Imagens com alt text
- [x] Data de publicação visível

### Páginas Institucionais (Sobre, Contato)
- [x] Title único
- [x] Meta description
- [x] Canonical URL
- [x] OG image
- [x] H1 único
- [x] JSON-LD (WebPage + BreadcrumbList)
- [x] Imagens com alt text

### Blog Listing
- [x] Title único
- [x] Meta description
- [x] Canonical URL
- [x] JSON-LD (BreadcrumbList)
- [x] Cards com imagens otimizadas

---

## Ferramentas de Teste

### SEO
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Google Search Console](https://search.google.com/search-console)
- [Schema.org Validator](https://validator.schema.org/)

### Performance
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/)
- [WebPageTest](https://www.webpagetest.org/)

### Core Web Vitals
- [web.dev/measure](https://web.dev/measure/)
- Chrome DevTools > Performance

---

## Manutenção

1. **Semanalmente:** Verificar Google Search Console para erros
2. **Mensalmente:** Rodar Lighthouse e verificar scores
3. **Após mudanças:** Testar structured data com Rich Results Test
4. **Conteúdo novo:** Verificar se posts aparecem no sitemap

---

## Arquivos Relacionados

| Arquivo | Descrição |
|---------|-----------|
| [`src/lib/seo/metadata.ts`](src/lib/seo/metadata.ts) | Helpers de metadata |
| [`src/lib/seo/jsonld.ts`](src/lib/seo/jsonld.ts) | Schemas JSON-LD |
| [`src/components/shared/JsonLd.tsx`](src/components/shared/JsonLd.tsx) | Componente JSON-LD |
| [`src/app/sitemap.ts`](src/app/sitemap.ts) | Sitemap dinâmico |
| [`src/app/robots.ts`](src/app/robots.ts) | Robots.txt |
| [`src/lib/utils/image.ts`](src/lib/utils/image.ts) | Configuração de imagens |
| [`src/config/site.ts`](src/config/site.ts) | Configurações do site |

# Auditoria de Segurança - Empire Site

**Data da Auditoria:** 2026-02-24
**Versão do Projeto:** Next.js 16 com Supabase
**Auditor:** Kilo Code (Automated Security Audit)

---

## Sumário Executivo

Esta auditoria de segurança foi realizada no projeto Empire Site, uma aplicação Next.js 16 com backend Supabase. A auditoria identificou **1 vulnerabilidade Alta**, **6 vulnerabilidades Médias** e **5 vulnerabilidades Baixas**.

### Status Geral

| Severidade | Quantidade | Status |
|------------|------------|--------|
| Crítica | 0 | ✅ Nenhuma encontrada |
| Alta | 1 | ⚠️ Requer atenção |
| Média | 6 | ⚠️ Requer atenção |
| Baixa | 5 | 📝 Recomendado |

### Pontos Fortes Identificados

1. ✅ **Autenticação robusta** - Supabase Auth com cookies httpOnly via SSR
2. ✅ **Row Level Security (RLS)** - Implementado em todas as tabelas
3. ✅ **Sem credenciais hardcoded** - Todas as credenciais em variáveis de ambiente
4. ✅ **Proteção de rotas admin** - Middleware protege rotas `/admin/*`
5. ✅ **API keys com hash** - Tabela `api_keys` armazena apenas hash das chaves
6. ✅ **Soft delete** - Implementado para auditoria de dados excluídos

---

## Hall Findings Detalhados

### 🔴 HIGH - Falta de Headers de Segurança no Next.js

**Severidade:** Alta
**Arquivo:** [`next.config.ts`](next.config.ts)
**CWE:** CWE-693 (Protection Mechanism Failure)

#### Descrição
O arquivo `next.config.ts` não configura headers de segurança HTTP, deixando a aplicação vulnerável a ataques como:
- Clickjacking (falta X-Frame-Options)
- MIME type sniffing (falta X-Content-Type-Options)
- XSS (falta X-XSS-Protection)

#### Código Atual
```typescript
const nextConfig: NextConfig = {
  /* config options here */
};
```

#### Recomendação
Adicionar headers de segurança:

```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}
```

---

### 🟠 MEDIUM - CORS Permissivo em Edge Functions

**Severidade:** Média
**Arquivos:** 
- [`supabase/functions/generate-content/index.ts`](supabase/functions/generate-content/index.ts:19)
- [`supabase/functions/analyze-seo/index.ts`](supabase/functions/analyze-seo/index.ts:14)

#### Descrição
As Edge Functions configuram `Access-Control-Allow-Origin: *`, permitindo requisições de qualquer origem. Isso pode expor as funções a abuso por sites maliciosos.

#### Código Atual
```typescript
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

#### Recomendação
Restringir CORS às origens permitidas:

```typescript
const allowedOrigins = [
    Deno.env.get('NEXT_PUBLIC_SITE_URL'),
    'http://localhost:3000',
].filter(Boolean)

const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigins.includes(req.headers.get('origin')) 
        ? req.headers.get('origin') 
        : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

---

### 🟠 MEDIUM - Falta de Rate Limiting

**Severidade:** Média
**Arquivos:**
- [`src/app/(auth)/admin/login/actions.ts`](src/app/(auth)/admin/login/actions.ts)
- Edge Functions de IA

#### Descrição
Não há implementação de rate limiting nos endpoints de autenticação e IA, permitindo:
- Ataques de força bruta no login
- Abuso das APIs de IA (custo financeiro)

#### Recomendação
Implementar rate limiting usando Supabase Edge Functions ou middleware:

```typescript
// Exemplo usando Upstash Redis ou similar
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
})

export async function login(formData: FormData) {
    const ip = headers().get('x-forwarded-for') ?? '127.0.0.1'
    const { success } = await ratelimit.limit(ip)
    
    if (!success) {
        return { error: 'Muitas tentativas. Tente novamente em 15 minutos.' }
    }
    // ... resto do código
}
```

---

### 🟠 MEDIUM - XSS Potential em PostContent

**Severidade:** Média
**Arquivo:** [`src/components/public/blog/PostContent.tsx`](src/components/public/blog/PostContent.tsx:42)

#### Descrição
O componente usa `dangerouslySetInnerHTML` para renderizar conteúdo HTML de posts. Se o conteúdo não for devidamente sanitizado no momento da criação, pode levar a XSS.

#### Código Atual
```typescript
<div
    className="prose..."
    dangerouslySetInnerHTML={{ __html: contentHtml }}
/>
```

#### Recomendação
1. **Sanitização no servidor** - Usar DOMPurify ou similar antes de salvar:

```typescript
import DOMPurify from 'isomorphic-dompurify'

// Ao salvar o post
const sanitizedHtml = DOMPurify.sanitize(contentHtml, {
    ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'blockquote', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'class'],
})
```

2. **Considerar renderizador TipTap** - Renderizar JSON ao invés de HTML para maior controle.

---

### 🟠 MEDIUM - Falta de Validação de Input com Zod

**Severidade:** Média
**Arquivo:** [`src/app/(auth)/admin/login/actions.ts`](src/app/(auth)/admin/login/actions.ts:6)

#### Descrição
O login não usa validação estruturada (Zod), apenas verificações manuais básicas.

#### Código Atual
```typescript
export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Email e senha são obrigatórios' }
    }
    // ...
}
```

#### Recomendação
Implementar validação com Zod:

```typescript
import { z } from 'zod'

const loginSchema = z.object({
    email: z.string().email('Email inválido').max(255),
    password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres').max(100),
})

export async function login(formData: FormData) {
    const result = loginSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })
    
    if (!result.success) {
        return { error: result.error.errors[0].message }
    }
    // ...
}
```

---

### 🟠 MEDIUM - Console.error em Produção

**Severidade:** Média
**Arquivos:** Múltiplos (39 ocorrências em `src/lib/`)

#### Descrição
O código contém 39 chamadas `console.error` que podem vazar informações sensíveis em produção.

#### Exemplos Encontrados
```typescript
// src/lib/blog/posts.ts:189
console.error('Error fetching posts:', error)

// src/lib/admin/users.ts:44
console.error('Error fetching users:', error)
```

#### Recomendação
1. Usar biblioteca de logging estruturado (Pino, Winston)
2. Remover logs em produção ou usar níveis apropriados:

```typescript
// Criar src/lib/logger.ts
const isDev = process.env.NODE_ENV === 'development'

export const logger = {
    error: (message: string, error?: unknown) => {
        if (isDev) {
            console.error(message, error)
        }
        // Em produção: enviar para serviço de monitoramento
    },
    // ...
}
```

---

### 🟠 MEDIUM - Falta de Content Security Policy (CSP)

**Severidade:** Média
**Arquivo:** [`next.config.ts`](next.config.ts)

#### Descrição
Não há Content Security Policy configurada, permitindo execução de scripts de qualquer origem.

#### Recomendação
Adicionar CSP aos headers:

```typescript
{
    key: 'Content-Security-Policy',
    value: `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com;
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https: blob:;
        font-src 'self' data:;
        connect-src 'self' https://*.supabase.co https://openrouter.ai;
        frame-ancestors 'none';
    `.replace(/\s{2,}/g, ' ').trim(),
}
```

---

### 🟡 LOW - Falta de Verificação de Role em Algumas Actions

**Severidade:** Baixa
**Arquivo:** [`src/app/(admin)/admin/posts/actions.ts`](src/app/(admin)/admin/posts/actions.ts:154)

#### Descrição
`deletePostAction` não verifica se o usuário tem permissão para excluir posts.

#### Código Atual
```typescript
export async function deletePostAction(id: string): Promise<ActionResult> {
    const success = await deletePost(id)
    // ...
}
```

#### Recomendação
Adicionar verificação de role:

```typescript
export async function deletePostAction(id: string): Promise<ActionResult> {
    const profile = await getUserProfile()
    if (!profile) {
        redirect('/admin/login')
    }
    
    // Verificar se é editor ou admin
    if (!['editor', 'admin', 'super_admin'].includes(profile.role)) {
        return { error: 'Sem permissão para excluir posts' }
    }
    
    const success = await deletePost(id)
    // ...
}
```

---

### 🟡 LOW - Falta de HTTPS Redirect

**Severidade:** Baixa
**Arquivo:** [`next.config.ts`](next.config.ts)

#### Recomendação
Adicionar redirect para HTTPS em produção:

```typescript
{
    source: '/:path*',
    has: [{ type: 'header', key: 'x-forwarded-proto', value: 'http' }],
    permanent: true,
    destination: 'https://empire.com.br/:path*',
}
```

---

### 🟡 LOW - Sessão sem Rotação

**Severidade:** Baixa
**Arquivo:** [`src/lib/supabase/middleware.ts`](src/lib/supabase/middleware.ts)

#### Descrição
O middleware atualiza a sessão, mas não há mecanismo de rotação de refresh tokens.

#### Recomendação
Implementar rotação periódica de tokens e invalidação de sessões antigas.

---

### 🟡 LOW - Falta de HSTS

**Severidade:** Baixa
**Arquivo:** [`next.config.ts`](next.config.ts)

#### Recomendação
Adicionar HSTS header:

```typescript
{
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
}
```

---

### 🟡 LOW - Dependências com Vulnerabilidades (Dev Dependencies)

**Severidade:** Baixa
**Contexto:** npm audit

#### Descrição
O `npm audit` identificou 31 vulnerabilidades de severidade alta, porém todas em **dependências de desenvolvimento** (eslint, jest). Isso não afeta a aplicação em produção.

#### Vulnerabilidades Principais
- **minimatch** (ReDoS) - afeta eslint, jest, glob
- **Fix disponível:** Upgrade para eslint@10.0.2 e jest@19.0.2 (breaking changes)

#### Recomendação
Atualizar dependências de desenvolvimento quando possível:

```bash
npm install eslint@10 jest@19 --save-dev
```

---

## Checklist de Correções Prioritárias

### Imediato (Alta Prioridade)
- [ ] Adicionar headers de segurança no `next.config.ts`
- [ ] Implementar CSP

### Curto Prazo (Média Prioridade)
- [ ] Restringir CORS em Edge Functions
- [ ] Implementar rate limiting no login
- [ ] Sanitizar HTML antes de salvar posts
- [ ] Adicionar validação Zod nos formulários
- [ ] Configurar logger estruturado

### Longo Prazo (Baixa Prioridade)
- [ ] Adicionar verificação de role em todas as actions
- [ ] Configurar HSTS
- [ ] Implementar rotação de sessão
- [ ] Atualizar dependências de desenvolvimento

---

## Conclusão

O projeto Empire Site possui uma **base de segurança sólida** com implementação correta de autenticação via Supabase, RLS em todas as tabelas, e boas práticas de proteção de dados sensíveis. 

As principais melhorias necessárias são:
1. **Headers de segurança HTTP** - Configuração essencial para produção
2. **CSP e CORS** - Proteção contra XSS e abuso de API
3. **Rate limiting** - Proteção contra ataques de força bruta

Nenhuma vulnerabilidade crítica foi identificada que impeça o uso da aplicação, mas as correções recomendadas devem ser implementadas antes do deploy em produção.

---

**Auditoria realizada por:** Kilo Code Security Scanner
**Próxima revisão recomendada:** 90 dias

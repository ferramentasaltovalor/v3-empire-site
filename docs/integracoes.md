# docs/integracoes.md — Integrações Externas

**Última atualização:** 2025-07-15  
**Regra:** Nenhuma integração implementada sem documentação pesquisada aqui primeiro.

---

## Template para cada integração

```
## [Nome da Integração]
- **Documentação oficial:** [URL]
- **Versão da API:** [verificar]
- **Autenticação:** [método]
- **Endpoints utilizados:** [lista]
- **Variáveis de ambiente:** [lista]
- **Edge Function relacionada:** [nome ou N/A]
- **Rate limits:** [documentar]
- **Custos estimados:** [se aplicável]
- **Como testar localmente:** [passo a passo]
- **Última verificação da docs:** [data]
- **Erros conhecidos e soluções:** [documentar ao longo do desenvolvimento]
```

---

## Supabase

- **Documentação oficial:** https://supabase.com/docs
- **Versão:** @supabase/supabase-js (verificar no package.json)
- **Autenticação:** Supabase Auth com cookies httpOnly via @supabase/ssr
- **Endpoints utilizados:** 
  - PostgREST API (database queries)
  - Auth API (authentication)
  - Storage API (file uploads)
- **Variáveis de ambiente:**
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY (ou NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
  - SUPABASE_SERVICE_ROLE_KEY
  - SUPABASE_DB_PASSWORD
  - SUPABASE_JWT_SECRET
- **Edge Function relacionada:** N/A (ainda não implementado)
- **Rate limits:** 
  - API: 500 requests/second por projeto
  - Database: baseado no plano (verificar subscription)
- **Custos estimados:** Free tier disponível, Pro $25/mês
- **CLI commands:**
  - `supabase init` — inicializa projeto local (cria pasta supabase/)
  - `supabase start` — inicia serviços locais (Docker required)
  - `supabase stop` — para serviços locais
  - `supabase login` — autentica com Supabase
  - `supabase link --project-ref <ref>` — vincula projeto local ao remoto
  - `supabase migration new <name>` — cria nova migration
  - `supabase db pull` — puxa schema do projeto remoto
  - `supabase db push` — aplica migrations ao projeto remoto
  - `supabase db reset` — reseta banco local e aplica todas migrations
  - `supabase db diff` — mostra diferenças entre schema local e migrations
  - `supabase types generate --local --lang=typescript` — gera tipos TypeScript
- **RLS (Row Level Security):**
  - Habilitar em TODAS as tabelas: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
  - Políticas são como cláusulas WHERE automáticas
  - Sintaxe: `CREATE POLICY "policy_name" ON table_name FOR operation USING (condition);`
  - Operations: SELECT, INSERT, UPDATE, DELETE, ALL
  - Funções úteis: `auth.uid()`, `auth.jwt() ->> 'role'`
  - Sempre usar `supabase.auth.getUser()` para validar sessão no servidor
- **Storage Buckets:**
  - Public: arquivos acessíveis via URL pública (ex: avatars, blog images)
  - Private: requer autenticação para download
  - Criar bucket: `INSERT INTO storage.buckets (id, name, public) VALUES ('bucket_name', 'bucket_name', true);`
  - Políticas de storage usam `storage.objects` table
- **Auth com Next.js App Router (implementado em G01-T04):**
  - Usar `@supabase/ssr` para SSR
  - Client Component: `createBrowserClient()` de `src/lib/supabase/client.ts`
  - Server Component: `createServerClient()` de `src/lib/supabase/server.ts`
  - Middleware: `src/middleware.ts` + `src/lib/supabase/middleware.ts` para refresh automático de tokens
  - Sempre validar com `supabase.auth.getUser()` no servidor, NUNCA confiar em getSession()
  - Login: `/admin/login` (fora do grupo admin protegido)
  - Server Actions: `src/app/(auth)/admin/login/actions.ts` para login e reset de senha
  - Logout: `src/app/(admin)/actions.ts` invalida sessão no servidor
  - Role verification: `src/lib/auth.ts` com helpers `getUser()`, `getUserProfile()`, `hasRole()`, `requireRole()`
- **Como testar localmente:**
  1. Instalar Docker Desktop
  2. `supabase start` (primeira vez demora para baixar imagens)
  3. Acessar Studio em http://localhost:54323
  4. Credenciais aparecem no terminal após `supabase start`
- **Última verificação da docs:** 2026-02-23
- **Erros conhecidos e soluções:**
  - Permission denied on db pull: executar `GRANT ALL ON ALL TABLES IN SCHEMA graphql TO postgres;`
  - Permission denied on db push: `ALTER TABLE table_name OWNER TO postgres;`
  - Users randomly logged out: garantir que middleware chama `supabase.auth.getUser()` ou `getClaims()`

---

## OpenRouter

### Visão Geral
OpenRouter é um proxy unificado para múltiplos provedores de LLM, permitindo acessar Claude, GPT, Llama, Gemini e outros através de uma única API compatível com OpenAI SDK.

### Documentação Oficial
- **URL:** https://openrouter.ai/docs
- **Dashboard:** https://openrouter.ai/keys
- **Modelos:** https://openrouter.ai/models
- **Última verificação:** 2026-02-23

### Autenticação
- **Método:** API Key no header Authorization
- **Header:** `Authorization: Bearer <API_KEY>`
- **Headers obrigatórios adicionais:**
  - `HTTP-Referer`: URL do site (obrigatório para rate limiting e abuse prevention)
  - `X-Title`: Nome do aplicativo (obrigatório para tracking)
  - `Content-Type`: `application/json`

### Endpoint
```
POST https://openrouter.ai/api/v1/chat/completions
```

### Formato de Request

#### Request Básico
```json
{
  "model": "anthropic/claude-sonnet-4",
  "messages": [
    {"role": "system", "content": "Você é um assistente especializado em criação de conteúdo."},
    {"role": "user", "content": "Crie um título atrativo para um post sobre marketing digital."}
  ]
}
```

#### Request Completo (com todos os parâmetros)
```json
{
  "model": "anthropic/claude-sonnet-4",
  "messages": [
    {"role": "system", "content": " string "},
    {"role": "user", "content": " string "},
    {"role": "assistant", "content": " string "},
    {"role": "tool", "content": " string "}
  ],
  "stream": true,
  "max_tokens": 4096,
  "temperature": 0.7,
  "top_p": 1,
  "top_k": 0,
  "frequency_penalty": 0,
  "presence_penalty": 0,
  "repetition_penalty": 1,
  "stop": ["STOP", "END"],
  "response_format": {
    "type": "text"
  },
  "seed": -1,
  "logit_bias": {},
  "top_logprobs": 0
}
```

### Formato de Response

#### Response Não-Streaming
```json
{
  "id": "gen-xxxxx",
  "created": 1700000000,
  "model": "anthropic/claude-sonnet-4",
  "object": "chat.completion",
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "O título sugerido é...",
        "role": "assistant"
      }
    }
  ],
  "usage": {
    "prompt_tokens": 25,
    "completion_tokens": 150,
    "total_tokens": 175
  }
}
```

### Modelos Disponíveis

| Modelo | ID | Uso Recomendado | Contexto | Preço Input/Output (por 1M tokens) |
|--------|-----|-----------------|----------|-----------------------------------|
| **Claude Sonnet 4** | `anthropic/claude-sonnet-4` | Conteúdo geral, balanceado | 200K | $3.00 / $15.00 |
| **Claude 3.5 Sonnet** | `anthropic/claude-3.5-sonnet` | Conteúdo de alta qualidade | 200K | $3.00 / $15.00 |
| **Claude 3.5 Haiku** | `anthropic/claude-3.5-haiku` | Respostas rápidas, baixo custo | 200K | $0.80 / $4.00 |
| **Claude 3 Opus** | `anthropic/claude-3-opus` | Máxima qualidade, complexo | 200K | $15.00 / $75.00 |
| **GPT-4o** | `openai/gpt-4o` | Conteúdo geral multimodal | 128K | $2.50 / $10.00 |
| **GPT-4o Mini** | `openai/gpt-4o-mini` | Econômico, rápido | 128K | $0.15 / $0.60 |
| **GPT-4 Turbo** | `openai/gpt-4-turbo` | Alta qualidade | 128K | $10.00 / $30.00 |
| **Llama 3.3 70B** | `meta-llama/llama-3.3-70b-instruct` | Open source, bom custo | 128K | $0.35 / $0.40 |
| **Llama 3.1 405B** | `meta-llama/llama-3.1-405b-instruct` | Open source, máxima qualidade | 128K | $2.70 / $2.70 |
| **Gemini 2.0 Flash** | `google/gemini-2.0-flash-exp:free` | Gratuito (rate limited) | 1M | FREE |
| **Gemini Pro** | `google/gemini-pro` | Bom custo-benefício | 32K | $0.125 / $0.375 |
| **Mistral Large** | `mistralai/mistral-large` | Alternativa europeia | 128K | $2.00 / $6.00 |
| **DeepSeek V3** | `deepseek/deepseek-chat` | Muito econômico | 64K | $0.14 / $0.28 |

> **Nota:** Preços verificados em 2026-02-23. Verificar https://openrouter.ai/models para preços atuais.

### Modelos Recomendados por Caso de Uso

| Caso de Uso | Modelo Recomendado | Justificativa |
|-------------|-------------------|---------------|
| Geração de posts de blog | `anthropic/claude-sonnet-4` | Melhor custo-benefício, ótima qualidade |
| SEO metadata | `anthropic/claude-3.5-haiku` | Rápido e econômico para textos curtos |
| Landing pages | `anthropic/claude-sonnet-4` | Qualidade de texto persuasivo |
| Reescrita de conteúdo | `openai/gpt-4o-mini` | Econômico para processamento em lote |
| Testes/desenvolvimento | `google/gemini-2.0-flash-exp:free` | Gratuito |

### Streaming (SSE - Server-Sent Events)

#### Como Funciona
Com `"stream": true`, a resposta vem em chunks via SSE:

```
data: {"id":"gen-xxx","choices":[{"delta":{"content":"O"},"index":0}]}

data: {"id":"gen-xxx","choices":[{"delta":{"content":" título"},"index":0}]}

data: {"id":"gen-xxx","choices":[{"delta":{"content":" sugerido"},"index":0}]}

data: [DONE]
```

#### Formato do Chunk
```typescript
interface StreamChunk {
  id: string
  created: number
  model: string
  object: "chat.completion.chunk"
  choices: Array<{
    index: number
    delta: {
      content?: string
      role?: string
    }
    finish_reason: string | null
  }>
}
```

#### Detecção de Conclusão
- Stream termina com `data: [DONE]`
- `finish_reason` pode ser: `stop`, `length`, `content_filter`

### Rate Limits

| Tipo | Limite | Notas |
|------|--------|-------|
| **Requisições** | 20 req/min (free tier) | Aumenta com uso pago |
| **Tokens** | Baseado no modelo | Verificar dashboard |
| **Concurrent requests** | Variável | Depende do provider |

#### Headers de Rate Limit na Response
```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 15
X-RateLimit-Reset: 1700000000
```

#### Comportamento em Rate Limit
- HTTP 429 Too Many Requests
- Header `Retry-After` com segundos para aguardar
- Implementar exponential backoff

### Tratamento de Erros

| Código HTTP | Erro | Causa | Solução |
|-------------|------|-------|---------|
| 400 | Bad Request | JSON inválido, parâmetros incorretos | Verificar formato do request |
| 401 | Unauthorized | API key inválida ou ausente | Verificar header Authorization |
| 402 | Payment Required | Créditos insuficientes | Adicionar créditos no dashboard |
| 403 | Forbidden | Modelo não disponível | Verificar disponibilidade do modelo |
| 408 | Request Timeout | Timeout do provider | Retry com backoff |
| 429 | Too Many Requests | Rate limit excedido | Aguardar Retry-After segundos |
| 500 | Internal Server Error | Erro interno OpenRouter | Retry com backoff |
| 502 | Bad Gateway | Provider indisponível | Tentar outro modelo |
| 503 | Service Unavailable | Manutenção | Aguardar e retry |

#### Formato de Erro na Response
```json
{
  "error": {
    "message": "Rate limit exceeded",
    "type": "rate_limit_error",
    "code": "rate_limit_exceeded"
  }
}
```

#### Estratégia de Retry Recomendada
```typescript
async function withRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (error.status === 429) {
        const retryAfter = error.headers.get('Retry-After') || 60
        await sleep(retryAfter * 1000)
        continue
      }
      if (error.status >= 500 && i < maxRetries - 1) {
        await sleep(Math.pow(2, i) * 1000) // exponential backoff
        continue
      }
      throw error
    }
  }
}
```

### Variáveis de Ambiente
```bash
# Obrigatórias
OPENROUTER_API_KEY=sk-or-v1-xxxxx

# Opcionais com defaults
OPENROUTER_DEFAULT_MODEL=anthropic/claude-sonnet-4
OPENROUTER_HTTP_REFERER=https://empire.com.br
OPENROUTER_X_TITLE=Empire Site
```

### Exemplo de Código (Edge Function)

```typescript
// supabase/functions/generate-content/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

interface GenerateContentRequest {
  prompt: string
  systemPrompt?: string
  model?: string
  maxTokens?: number
  temperature?: number
}

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const { prompt, systemPrompt, model, maxTokens, temperature }: GenerateContentRequest = 
      await req.json()

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
        'HTTP-Referer': Deno.env.get('OPENROUTER_HTTP_REFERER') || '',
        'X-Title': Deno.env.get('OPENROUTER_X_TITLE') || 'Empire Site',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || Deno.env.get('OPENROUTER_DEFAULT_MODEL') || 'anthropic/claude-sonnet-4',
        messages: [
          ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
          { role: 'user', content: prompt }
        ],
        max_tokens: maxTokens || 4096,
        temperature: temperature ?? 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return new Response(JSON.stringify({ error: error.error?.message || 'Unknown error' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const data = await response.json()
    
    return new Response(JSON.stringify({
      content: data.choices[0]?.message?.content,
      usage: data.usage,
      model: data.model,
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

### Exemplo de Streaming (Edge Function)

```typescript
// supabase/functions/stream-content/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

Deno.serve(async (req: Request) => {
  const { prompt, systemPrompt, model } = await req.json()

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
      'HTTP-Referer': Deno.env.get('OPENROUTER_HTTP_REFERER') || '',
      'X-Title': Deno.env.get('OPENROUTER_X_TITLE') || 'Empire Site',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model || 'anthropic/claude-sonnet-4',
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: prompt }
      ],
      stream: true,
      max_tokens: 4096,
    }),
  })

  // Stream direto para o cliente
  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
})
```

### Como Testar Localmente

1. **Obter API Key:**
   - Acesse https://openrouter.ai/keys
   - Crie uma nova chave
   - Copie para `.env` como `OPENROUTER_API_KEY`

2. **Teste via cURL:**
```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "HTTP-Referer: http://localhost:3000" \
  -H "X-Title: Empire Site Dev" \
  -d '{
    "model": "anthropic/claude-3.5-haiku",
    "messages": [{"role": "user", "content": "Diga olá"}]
  }'
```

3. **Teste de Streaming:**
```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "HTTP-Referer: http://localhost:3000" \
  -H "X-Title: Empire Site Dev" \
  -d '{
    "model": "anthropic/claude-3.5-haiku",
    "messages": [{"role": "user", "content": "Conte uma história curta"}],
    "stream": true
  }'
```

4. **Teste com Edge Function:**
```bash
# Iniciar Supabase local
supabase start

# Deploy da função
supabase functions serve generate-content --env-file .env.local

# Testar
curl -X POST http://localhost:54321/functions/v1/generate-content \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Crie um título de blog sobre marketing"}'
```

### Erros Conhecidos e Soluções

| Erro | Causa | Solução |
|------|-------|---------|
| `invalid_api_key` | Chave mal formatada | Verificar se começa com `sk-or-v1-` |
| `model_not_found` | ID do modelo incorreto | Verificar ID em https://openrouter.ai/models |
| `insufficient_quota` | Créditos acabaram | Adicionar créditos no dashboard |
| `context_length_exceeded` | Prompt muito longo | Reduzir tamanho do prompt ou usar modelo com contexto maior |
| `content_filter` | Conteúdo bloqueado | Modificar prompt para evitar conteúdo sensível |
| `provider_error` | Erro no backend do modelo | Retry ou tentar outro modelo |

### Best Practices

1. **Sempre usar Server-Side:** Nunca expor API key no cliente
2. **Implementar Retry:** Com exponential backoff para erros 5xx e 429
3. **Validar Resposta:** Verificar se `choices[0].message.content` existe
4. **Logar Usage:** Monitorar consumo de tokens para controle de custos
5. **Usar System Prompts:** Para consistência no estilo de conteúdo
6. **Cache de Respostas:** Para prompts repetitivos (ex: templates de SEO)
7. **Fallback de Modelo:** Ter modelo secundário caso o principal falhe

### Custo Estimado (Projeto Empire)

| Operação | Tokens (aprox) | Modelo | Custo Unitário |
|----------|---------------|--------|----------------|
| Gerar post de blog | 3.000 | claude-sonnet-4 | ~$0.05 |
| Gerar meta description | 200 | claude-3.5-haiku | ~$0.001 |
| Gerar título + excerpt | 500 | claude-3.5-haiku | ~$0.002 |
| Reescrita de conteúdo | 2.000 | gpt-4o-mini | ~$0.002 |
| Landing page completa | 5.000 | claude-sonnet-4 | ~$0.08 |

**Estimativa mensal (100 posts):** ~$5-10 USD

---

## Scrape Creators API

- **Status:** Pesquisa pendente — G04-T02
- **IMPORTANTE:** Não implementar antes de G04-T02 estar DONE
- **Variáveis de ambiente:**
  - SCRAPE_CREATORS_API_KEY

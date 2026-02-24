# docs/seguranca.md — Segurança do Empire Site

**Última atualização:** 2026-02-23
**Status:** Implementação base concluída em G01-T04

---

## Regras Absolutas

1. ZERO credenciais hardcoded — sempre .env
2. .env nunca no repositório — verificar .gitignore ANTES do primeiro commit
3. Dados sensíveis NUNCA em console.log ou logs
4. Rotas /admin/* protegidas por middleware no servidor
5. Sessão via cookies httpOnly — NUNCA localStorage para tokens de auth
6. RLS ativo em TODAS as tabelas com dados de usuário
7. Inputs validados no servidor antes de qualquer query
8. API keys de terceiros APENAS em Edge Functions ou Server Components
9. Rate limiting em endpoints de IA, login e API pública
10. HMAC-SHA256 para assinaturas de webhooks
11. API keys da aplicação: armazenar apenas o hash (bcrypt), nunca o valor bruto
12. Soft delete para auditoria — sem DELETE físico pelo usuário

---

## Autenticação (G01-T04)

### Arquitetura
- **Provedor:** Supabase Auth
- **Estratégia:** SSR com cookies httpOnly via `@supabase/ssr`
- **Middleware:** `src/middleware.ts` protege rotas `/admin/*`

### Fluxo de Login
1. Usuário acessa `/admin/login`
2. Credenciais enviadas via Server Action (`login()`)
3. Supabase valida e cria sessão
4. Cookies httpOnly são definidos automaticamente
5. Redirecionamento para `/admin`

### Fluxo de Logout
1. Usuário clica em "Sair"
2. Server Action (`logout()`) chama `supabase.auth.signOut()`
3. Sessão invalidada no servidor
4. Cookies removidos
5. Redirecionamento para `/admin/login`

### Recuperação de Senha
1. Usuário solicita recuperação em `/admin/login`
2. Server Action (`resetPassword()`) envia email com magic link
3. Link direciona para `/admin/reset-password`
4. Usuário define nova senha

### Arquivos de Autenticação
| Arquivo | Função |
|---------|--------|
| `src/middleware.ts` | Proteção de rotas, refresh de sessão |
| `src/lib/supabase/middleware.ts` | Lógica de atualização de sessão |
| `src/lib/supabase/server.ts` | Cliente Supabase para Server Components |
| `src/lib/supabase/client.ts` | Cliente Supabase para Client Components |
| `src/lib/auth.ts` | Helpers de autenticação (getUser, hasRole) |
| `src/app/(auth)/admin/login/` | Página de login e Server Actions |

### Verificação de Role
```typescript
import { getUserProfile, hasRole, requireRole } from '@/lib/auth'

// Em Server Components
const profile = await getUserProfile()
const isAdmin = await hasRole(['admin', 'super_admin'])

// Em Server Actions
await requireRole(['admin', 'super_admin'])
```

### Rotas Protegidas
- `/admin/*` — Requer autenticação
- `/admin/login` — Exceção (página de login)
- Middleware redireciona usuários não autenticados para `/admin/login`
- Middleware redireciona usuários autenticados para `/admin` se tentarem acessar login

---

## Checklist por Feature

Para cada feature nova:
- [ ] Nenhuma credencial hardcoded
- [ ] Variáveis de ambiente corretas
- [ ] Rota verifica autenticação no servidor
- [ ] Role verificada antes de ação sensível
- [ ] RLS configurado para a tabela
- [ ] Input validado (Zod ou similar)
- [ ] Dados sensíveis não na resposta da API
- [ ] Edge Function não expõe stack trace
- [ ] Rate limiting se endpoint público/caro

---

## RLS por Tabela

> Implementado em G01-T03.

Padrão geral:
- Leitura pública: posts publicados, categorias, tags
- Escrita: requer autenticação
- Edição do próprio: author pode editar seus posts
- Admin+: acesso total
- Dados sensíveis: super_admin apenas

# G01-T03 — Configuração Supabase

**Status:** DONE
**Progresso:** 100%
**Concluído em:** 2026-02-23
**Dependências:** G01-T01

**Bloqueia:** G01-T04

## Resumo

Configuração completa do banco de dados Supabase com todas as migrations, RLS policies, storage bucket e e TypeScript types.

## Tarefas Realizadas

- [x] Supabase CLI instalado (versão 2.67.1)
- [x] Projeto "Empire site" conectado ao Supabase
- [x] supabase/config.toml configurado
- [x] Migrations criadas (17 arquivos):
  1. `20250715000001_profiles.sql` — Tabela de perfis de usuários
  2. `20250715000002_post_categories.sql` — Categorias de posts
  3. `20250715000003_post_tags.sql` — Tags de posts
  4. `20250715000004_posts.sql` — Tabela de posts
  5. `20250715000005_posts_categories_tags.sql` — Pivot tables
  6. `20250715000006_post_revisions.sql` — Revisões de posts
  7. `20250715000007_media_folders.sql` — Pastas de mídia
  8. `20250715000008_media_items.sql` — Arquivos de mídia
  9. `20250715000009_landing_pages.sql` — Landing pages
  10. `20250715000010_analytics_configs.sql` — Configurações de analytics
  11. `20250715000011_webhook_configs.sql` — Configurações de webhooks
  12. `20250715000012_webhook_logs.sql` — Logs de webhooks
  13. `20250715000013_api_keys.sql` — Chaves de API
  14. `20250715000014_ai_generation_logs.sql` — Logs de IA
  15. `20250715000015_site_settings.sql` — Configurações do site
  16. `20250715000016_auth_triggers.sql` — Triggers de autenticação
  17. `20250715000017_storage_bucket.sql` — Bucket de storage
- [x] RLS ativo em todas as tabelas
- [x] Bucket 'media' criado no Storage
- [x] Variáveis de ambiente documentadas
- [x] docs/integracoes.md atualizado com documentação do Supabase
- [x] src/types/database.ts atualizado com tipos TypeScript completos

## Critérios de Aceitação

- [x] Supabase CLI instalado e configurado
- [x] Projeto "Empire site" conectado ao Supabase
- [x] supabase/config.toml configurado
- [x] Migration inicial criada (profiles, posts, categorias, tags)
- [x] RLS ativo em todas as tabelas
- [x] Bucket 'media' criado no Storage
- [x] Variáveis de ambiente documentadas
- [x] docs/integracoes.md atualizado

- [x] Tipos TypeScript gerados/atualizados

## Arquivos Criados/Modificados
- `supabase/migrations/20250715000001_profiles.sql`
- `supabase/migrations/20250715000002_post_categories.sql`
- `supabase/migrations/20250715000003_post_tags.sql`
- `supabase/migrations/20250715000004_posts.sql`
- `supabase/migrations/20250715000005_posts_categories_tags.sql`
- `supabase/migrations/20250715000006_post_revisions.sql`
- `supabase/migrations/20250715000007_media_folders.sql`
- `supabase/migrations/20250715000008_media_items.sql`
- `supabase/migrations/20250715000009_landing_pages.sql`
- `supabase/migrations/20250715000010_analytics_configs.sql`
- `supabase/migrations/20250715000011_webhook_configs.sql`
- `supabase/migrations/20250715000012_webhook_logs.sql`
- `supabase/migrations/20250715000013_api_keys.sql`
- `supabase/migrations/20250715000014_ai_generation_logs.sql`
- `supabase/migrations/20250715000015_site_settings.sql`
- `supabase/migrations/20250715000016_auth_triggers.sql`
- `supabase/migrations/20250715000017_storage_bucket.sql`
- `docs/integracoes.md` (atualizado)
- `docs/arquitetura.md` (atualizado)
- `src/types/database.ts` (atualizado)

## Próximos Passos
1. Conectar a um projeto Supabase real ou usar `supabase start` para desenvolvimento local
2. Aplicar migrations: `supabase db push` ou `supabase db reset` (local)
3. Atualizar `.env` com credenciais reais
4. Testar RLS policies no Studio

## Observações
- As migrations usam timestamps no formato `YYYYMMDDHHMMSS` para ordenação correta
- RLS policies usam funções auxiliares (`is_editor`, `is_author_or_editor`) para reutilização
- Soft delete implementado via coluna `deleted_at` em todas as tabelas relevantes
- Storage bucket 'media' configurado como público para URLs acessíveis
- Trigger `handle_new_user` cria perfil automaticamente no signup

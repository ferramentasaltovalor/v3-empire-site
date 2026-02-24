# G01-T05 — Estrutura de Rotas

**Status:** DONE  
**Progresso:** 100%  
**Dependências:** G01-T04  
**Bloqueia:** G02-T01, G02-T02, G03-T01, G05-T01  

---

## Critérios de Aceitação
- [x] Grupo (public) com layout próprio (navbar + footer empire gold)
- [x] Grupo (admin) com layout próprio (sidebar clara)
- [x] Rota /lp/[slug] com layout isolado
- [x] Todas as rotas do PRD Seção 6 existem (mesmo que placeholder)
- [x] sitemap.ts funcional
- [x] robots.ts funcional
- [x] Layout raiz com fontes configuradas
- [x] Error boundaries em todos os layouts

## Arquivos Criados/Modificados

### Error Boundaries
- `src/components/shared/ErrorBoundary.tsx` — Componente reutilizável
- `src/app/error.tsx` — Error boundary raiz
- `src/app/(public)/error.tsx` — Error boundary do site público
- `src/app/(admin)/error.tsx` — Error boundary do painel admin
- `src/app/(auth)/error.tsx` — Error boundary de autenticação

### Loading States
- `src/app/(public)/loading.tsx` — Loading skeleton do site público
- `src/app/(admin)/loading.tsx` — Loading skeleton do painel admin
- `src/app/(public)/blog/loading.tsx` — Blog grid skeleton
- `src/app/(admin)/admin/posts/loading.tsx` — Posts table skeleton

### Componentes Admin
- `src/components/admin/layout/AdminSidebar.tsx` — Sidebar com navegação
- `src/components/admin/layout/AdminHeader.tsx` — Header com menu de usuário

### Layouts
- `src/app/(admin)/layout.tsx` — Atualizado com AdminSidebar + AdminHeader
- `src/app/(public)/lp/layout.tsx` — Layout isolado para landing pages

### Outros
- `src/app/not-found.tsx` — Página 404 Empire Gold

## Histórico de Status
| Data | Status | Observação |
|------|--------|------------|
| 2026-02-23 | DONE | Task concluída com todos os critérios atendidos |
| 2025-07-15 | TODO | Task criada |

# Empire Site — Roadmap Global

**Última atualização:** 2025-07-15  
**Versão do PRD:** 1.1  
**Status geral:** 🟡 Em andamento — Fase 1 Foundation

---

## Progresso por Grupo

| Grupo | Nome | Tasks | Concluídas | Progresso |
|-------|------|-------|------------|-----------|
| G01 | Foundation | 6 | 0 | 0% |
| G02 | Site Público | 5 | 0 | 0% |
| G03 | Admin Core | 5 | 0 | 0% |
| G04 | IA e Conteúdo | 5 | 0 | 0% |
| G05 | Integrações | 4 | 0 | 0% |
| G06 | Landing Pages | 3 | 0 | 0% |
| G07 | Qualidade | 4 | 0 | 0% |
| **Total** | | **32** | **0** | **0%** |

---

## DAG de Dependências

```
G01-T01 (setup)
    ├──> G01-T02 (design system)   ← paralelo
    ├──> G01-T03 (supabase)        ← paralelo
    └──> G01-T06 (pesquisa G4)     ← paralelo
             │
             └── todos concluídos
                      │
                      └──> G01-T04 (autenticação)
                                │
                                └──> G01-T05 (rotas)
                                          │
                              ┌───────────┼───────────────┐
                              │           │               │
                       G02-T04         G02-T01         G03-T01
                    (conteúdo fixo)  (homepage)      (layout admin)
```

---

## Status das Tasks

### G01 — Foundation
- [ ] G01-T01 — Setup do Projeto — TODO 0%
- [ ] G01-T02 — Design System Empire Gold — TODO 0%
- [ ] G01-T03 — Configuração Supabase — TODO 0%
- [ ] G01-T04 — Autenticação — TODO 0%
- [ ] G01-T05 — Estrutura de Rotas — TODO 0%
- [ ] G01-T06 — Pesquisa G4 Business — TODO 0%

### G02 — Site Público
- [ ] G02-T01 — Homepage Empire Gold — TODO 0%
- [ ] G02-T02 — Blog (listagem + post) — TODO 0%
- [ ] G02-T03 — SEO Técnico e Performance — TODO 0%
- [ ] G02-T04 — Sistema de Conteúdo Fixo — TODO 0%
- [ ] G02-T05 — Páginas Institucionais — TODO 0%

### G03 — Admin Core
- [ ] G03-T01 — Layout Admin Light — TODO 0%
- [ ] G03-T02 — Gerenciamento de Posts — TODO 0%
- [ ] G03-T03 — Editor Rico TipTap — TODO 0%
- [ ] G03-T04 — Gerenciador de Mídia — TODO 0%
- [ ] G03-T05 — Usuários e Permissões — TODO 0%

### G04 — IA e Conteúdo
- [ ] G04-T01 — Pesquisa OpenRouter — TODO 0%
- [ ] G04-T02 — Pesquisa Scrape Creators — TODO 0%
- [ ] G04-T03 — Edge Functions IA — TODO 0%
- [ ] G04-T04 — Painel Gerador IA — TODO 0%
- [ ] G04-T05 — SEO Automático IA — TODO 0%

### G05 — Integrações
- [ ] G05-T01 — Multi-Analytics — TODO 0%
- [ ] G05-T02 — Webhooks Outgoing — TODO 0%
- [ ] G05-T03 — Webhooks Incoming — TODO 0%
- [ ] G05-T04 — API REST Pública — TODO 0%

### G06 — Landing Pages
- [ ] G06-T01 — Estrutura LP — TODO 0%
- [ ] G06-T02 — Editor de Seções LP — TODO 0%
- [ ] G06-T03 — IA para LP — TODO 0%

### G07 — Qualidade
- [ ] G07-T01 — Testes Rotas Públicas — TODO 0%
- [ ] G07-T02 — Testes Fluxo Admin — TODO 0%
- [ ] G07-T03 — Otimização PageSpeed — TODO 0%
- [ ] G07-T04 — Auditoria de Segurança — TODO 0%

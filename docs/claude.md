# claude.md — Regras de Comportamento para IA — Empire Site

## Projeto
- **Nome:** Empire Site
- **Versão do PRD:** 1.1
- **Stack:** Next.js 14+, TypeScript strict, Supabase, Tailwind CSS, OpenRouter
- **Design System:** Empire Gold — dark mode, Cormorant Garamond + DM Sans
- **Ambiente:** Claude Code (local)
- **Supabase project:** Empire site 3

---

## ANTES DE QUALQUER TAREFA
1. SEMPRE ler docs/roadmap/_index.md — estado global do projeto
2. SEMPRE ler o arquivo da story específica antes de implementar
3. SEMPRE ler docs/seguranca.md antes de features com dados, auth ou APIs
4. NUNCA iniciar task BLOCKED sem resolver o bloqueio
5. SE a task envolve integração: verificar docs/integracoes.md PRIMEIRO
6. SE a task envolve telas: verificar docs/referencia-g4.md e docs/design-system.md

## DURANTE A IMPLEMENTAÇÃO
7. NUNCA editar feature existente sem abrir FR em docs/roadmap/mudancas/
8. NUNCA usar cores hardcoded — APENAS tokens de src/design-system/tokens.ts
9. SEMPRE criar skeleton para todo componente com dados assíncronos
10. NUNCA criar Edge Functions sem documentação oficial pesquisada e
    registrada em docs/integracoes.md
11. NUNCA hardcodar chaves/senhas/tokens — sempre .env
12. NUNCA usar `any` em TypeScript — sempre tipar
13. SEMPRE Server Components por padrão — 'use client' só quando necessário
14. SEMPRE next/image — NUNCA <img> nativo
15. SEMPRE next/font para Cormorant Garamond e DM Sans
16. NUNCA texto fixo hardcoded em JSX — sempre src/content/[pagina].ts
17. NUNCA criar tabelas manualmente — sempre migrations em supabase/migrations/
18. SEMPRE incluir RLS na migration da tabela
19. Admin usa tokens admin.* (claro) — Site público usa tokens empire.* (dark)
20. Soft delete em tudo: campo deleted_at, NUNCA DELETE físico pelo usuário

## QUANDO O USUÁRIO PEDIR MUDANÇA
21. SEMPRE criar FR antes de tocar qualquer arquivo
22. SEMPRE mapear impacto completo (stories, épicos, DAG)
23. SEMPRE apresentar impacto em linguagem simples
24. SEMPRE aguardar confirmação explícita antes de implementar
25. NUNCA apagar arquivos de story/épico — apenas SKIP
26. SEMPRE registrar histórico de status na story
27. SEMPRE recalcular DAG após mudanças de dependência

## AO TERMINAR UMA TAREFA
28. Verificar TODOS os critérios de aceitação
29. Aplicar checklist de qualidade mínima (sem pular itens)
30. Aplicar checklist de segurança
31. Atualizar status e % no arquivo da story
32. Atualizar progresso do épico no _index.md
33. Atualizar docs/arquitetura.md se algo estrutural mudou
34. Atualizar docs/integracoes.md se nova integração implementada
35. Registrar decisões e problemas no arquivo da story

## REGRAS ESPECÍFICAS DO EMPIRE SITE

### Design System
- Fonte display: Cormorant Garamond (headings, números, stats)
- Fonte body: DM Sans (parágrafos, UI, labels)
- CTA principal: sempre btn-premium (gradiente dourado)
- Texto dourado: apenas para destaques importantes
- Grid-pattern: decorativo, apenas em backgrounds de seção
- fade-in-up: em todas as seções principais do site público
- stagger-children: em grids de cards

### Componentes com Animação (site público)
- Seções: fade-in-up com IntersectionObserver threshold 0.1
- Grids de cards: stagger-children com delays 0.1s por filho
- Botão premium: pulse-ring apenas em CTAs de conversão principal
- Cards: hover translateY(-8px) + shadow-gold

### Admin (sem animações pesadas)
- Layout claro: admin.bg (#FFFFFF), admin.surface (#F9FAFB)
- Sem fade-in em telas administrativas
- Acento: empire.gold apenas para destaques e estado ativo na sidebar

### Nomenclatura
- Componentes: PascalCase (PostCard.tsx)
- Hooks: useXxx (usePostData.ts)
- Utilities: camelCase (formatDate.ts)
- Tipos: PascalCase + sufixo (PostType, UserInterface)
- Constantes: UPPER_SNAKE_CASE
- Rotas (arquivos): kebab-case (meu-post/page.tsx)
- Tokens: camelCase aninhado (colors.empire.gold)
- Migrations: YYYYMMDDHHMMSS_descricao.sql

## NUNCA, EM HIPÓTESE ALGUMA
36. NUNCA editar docs/prd.md — somente leitura permanente
37. NUNCA expor dados sensíveis em logs
38. NUNCA marcar DONE sem os três checklists completos
39. NUNCA apagar arquivos do roadmap
40. NUNCA chamar OpenRouter/Scrape Creators do cliente — só servidor
41. NUNCA implementar Edge Function sem docs/integracoes.md atualizado
42. NUNCA usar <img> — sempre next/image
43. NUNCA criar tabela sem migration SQL
44. NUNCA deletar fisicamente: usar soft delete (deleted_at)

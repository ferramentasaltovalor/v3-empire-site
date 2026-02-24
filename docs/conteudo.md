# Sistema de Conteúdo — Empire Site

## Visão Geral

Todo o texto do site é armazenado em arquivos TypeScript em `src/content/`. Isso permite que não-técnicos editem o conteúdo sem tocar no código dos componentes.

**Benefícios:**
- ✅ Separação clara entre conteúdo e código
- ✅ Fácil manutenção por não-técnicos
- ✅ Type-safety com TypeScript
- ✅ Sem necessidade de CMS externo
- ✅ Versionamento junto com o código

---

## Arquivos de Conteúdo

| Arquivo | O que controla |
|---------|----------------|
| [`site.ts`](../src/content/site.ts) | Nome da empresa, contato, redes sociais |
| [`navigation.ts`](../src/content/navigation.ts) | Links do menu e CTA |
| [`home.ts`](../src/content/home.ts) | Todas as seções da homepage |
| [`sobre.ts`](../src/content/sobre.ts) | Página Sobre |
| [`contato.ts`](../src/content/contato.ts) | Página de Contato |
| [`footer.ts`](../src/content/footer.ts) | Rodapé |

---

## Como Editar

### Texto simples

Encontre o campo e altere o valor:

```typescript
companyName: 'Empire' // → mude para 'Nova Empire'
```

### Destaque dourado em títulos

Use colchetes para destacar uma palavra em dourado:

```typescript
title: 'Estratégia que [transforma] negócios'
// "transforma" aparecerá em dourado
```

**Como funciona:** O componente usa a função `splitTitleForGold()` para dividir o título em partes e aplicar a cor dourada nas palavras entre `[ ]`.

### Adicionar/remover itens de listas

Para adicionar um link ao menu:

```typescript
mainLinks: [
  { label: 'Início', href: '/' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'Novo Link', href: '/novo' }, // ← adicione aqui
]
```

Para remover, apague a linha inteira (incluindo a vírgula).

### Ícones

Os campos `icon` usam nomes de ícones da biblioteca **Lucide**.

Nomes disponíveis: `target`, `chart`, `team`, `mail`, `phone`, `map-pin`, `message-circle`, etc.

Lista completa: https://lucide.dev/icons/

---

## Regras Importantes

### ⚠️ NUNCA faça isso:

1. **NÃO apague nomes de propriedades**
   ```typescript
   // ❌ ERRADO - não apague o nome
   'Estratégia que transforma'
   
   // ✅ CORRETO - mantenha o nome, altere só o valor
   title: 'Estratégia que transforma'
   ```

2. **NÃO remova aspas**
   ```typescript
   // ❌ ERRADO
   title: Estratégia
   
   // ✅ CORRETO
   title: 'Estratégia'
   ```

3. **NÃO esqueça vírgulas**
   ```typescript
   // ❌ ERRADO - sem vírgula
   { label: 'Início', href: '/' }
   { label: 'Sobre', href: '/sobre' }
   
   // ✅ CORRETO - com vírgula
   { label: 'Início', href: '/' },
   { label: 'Sobre', href: '/sobre' },
   ```

4. **NÃO use caracteres especiais**
   - Evite emojis
   - Evite "aspas inteligentes" (use aspas simples `'`)
   - Evite caracteres de formatação

---

## Estrutura dos Arquivos

### `site.ts` — Conteúdo Global

```typescript
{
  companyName: string,      // Nome da empresa
  tagline: string,          // Frase curta
  shortDescription: string, // Meta description
  contact: {
    email: string,
    phone: string,
    whatsapp: string,
    address: string,
  },
  social: {
    instagram: string,
    youtube: string,
    linkedin: string,
  },
}
```

### `navigation.ts` — Menu

```typescript
{
  mainLinks: Array<{ label: string, href: string }>,
  cta: { label: string, href: string },
  mobileMenuOpen: string,
  mobileMenuClose: string,
}
```

### `home.ts` — Homepage

Contém todas as seções da homepage:

1. **hero** — Seção principal acima da dobra
2. **socialProof** — Números e logos de clientes
3. **problem** — Dores do cliente
4. **solution** — Como a Empire resolve
5. **methodology** — Processo em fases
6. **blogPreview** — Preview de artigos
7. **faq** — Perguntas frequentes
8. **finalCta** — Chamada para ação final

---

## Usando Conteúdo em Componentes

### Importação direta (recomendado para Server Components)

```typescript
import { homeContent } from '@/content/home'

export function HeroSection() {
  const { hero } = homeContent
  return <h1>{hero.title}</h1>
}
```

### Usando hooks (para Client Components)

```typescript
'use client'

import { useHomeContent } from '@/hooks/useContent'

export function HeroSection() {
  const { hero } = useHomeContent()
  return <h1>{hero.title}</h1>
}
```

### Processando títulos com destaque dourado

```typescript
import { splitTitleForGold } from '@/lib/utils/content'

export function GoldTitle({ title }: { title: string }) {
  const parts = splitTitleForGold(title)
  
  return (
    <h1>
      {parts.map((part, i) => (
        <span 
          key={i} 
          className={part.isGold ? 'text-gold' : 'text-white'}
        >
          {part.text}
        </span>
      ))}
    </h1>
  )
}
```

---

## Fluxo de Trabalho para Edição

1. **Localize o arquivo** — Encontre o arquivo correspondente na tabela acima
2. **Encontre a seção** — Use Ctrl+F para buscar o texto que deseja alterar
3. **Edite o valor** — Mantenha aspas e vírgulas
4. **Salve o arquivo** — O hot-reload atualizará a página
5. **Verifique o resultado** — Confira se apareceu como esperado

---

## Exemplos Práticos

### Mudar o nome da empresa

1. Abra `src/content/site.ts`
2. Altere `companyName: 'Empire'` para o novo nome
3. Salve

### Adicionar um link ao menu

1. Abra `src/content/navigation.ts`
2. Adicione uma linha em `mainLinks`:
   ```typescript
   { label: 'Serviços', href: '/servicos' },
   ```
3. Salve

### Mudar o título do Hero

1. Abra `src/content/home.ts`
2. Encontre `hero: { ... }`
3. Altere `title: '...'`
4. Use `[palavra]` para destaque dourado
5. Salve

### Atualizar números de Social Proof

1. Abra `src/content/home.ts`
2. Encontre `socialProof: { stats: [...] }`
3. Altere os valores de `number` e `label`
4. Salve

---

## Perguntas Frequentes

### Posso usar HTML no conteúdo?

Não. O conteúdo é texto puro. Se precisar de formatação, use um componente React.

### Posso traduzir o site para outros idiomas?

O sistema atual não suporta multi-idioma. Para isso, seria necessário implementar um sistema de i18n.

### Onde ficam as imagens?

Imagens ficam em `public/images/`. Nos arquivos de conteúdo, use caminhos como `/images/logo.png`.

### Como adiciono uma nova seção?

Novas seções requerem alterações em:
1. Arquivo de conteúdo (ex: `home.ts`)
2. Tipo correspondente (`src/types/content.ts`)
3. Componente React para renderizar

Consulte um desenvolvedor para isso.

---

## Arquivos Relacionados

- **Tipos:** [`src/types/content.ts`](../src/types/content.ts)
- **Hooks:** [`src/hooks/useContent.ts`](../src/hooks/useContent.ts)
- **Utilitários:** [`src/lib/utils/content.ts`](../src/lib/utils/content.ts)

---

**Dúvidas?** Consulte a documentação técnica em [`docs/`](.) ou fale com a equipe de desenvolvimento.

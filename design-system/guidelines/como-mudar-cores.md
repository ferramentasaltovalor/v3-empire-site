# Como Mudar Cores no Empire Site

## Regra fundamental

**NUNCA** escreva cores diretamente em componentes.
**SEMPRE** use os tokens definidos em `src/design-system/tokens.ts`.

## Passo a passo para mudar uma cor

### 1. Abra o arquivo de tokens
```
src/design-system/tokens.ts
```

### 2. Encontre o token que quer mudar
```typescript
export const colors = {
  empire: {
    gold: '#c9a962',  // ← Altere este valor
    // ...
  }
}
```

### 3. Altere o valor hexadecimal
```typescript
gold: '#d4af37',  // Novo tom de dourado
```

### 4. Atualize o globals.css
O Tailwind v4 usa variáveis CSS. Atualize também:
```
src/app/globals.css
```

Na seção `@theme`, altere a variável correspondente:
```css
--color-empire-gold: #d4af37;
```

### 5. Salve — o site inteiro reflete a mudança automaticamente

## Tokens disponíveis

### Site Público (prefixo `empire.*`)

| Token | Valor | Uso |
|-------|-------|-----|
| `empire.bg` | `#0a0a0b` | Fundo principal |
| `empire.surface` | `#111113` | Seções alternadas |
| `empire.card` | `#18181b` | Cards e containers |
| `empire.border` | `#27272a` | Bordas sutis |
| `empire.text` | `#fafafa` | Texto principal |
| `empire.muted` | `#71717a` | Texto secundário |
| `empire.gold` | `#c9a962` | CTAs, destaques |
| `empire.goldLight` | `#e4d4a5` | Hover, highlights |
| `empire.goldDark` | `#9a7b3c` | Sombras, profundidade |
| `empire.silver` | `#a8a8a8` | Acento secundário |
| `empire.silverLight` | `#d4d4d4` | Hover silver |
| `empire.silverDark` | `#737373` | Sombras silver |
| `empire.bronze` | `#b08d57` | Acento terciário |
| `empire.bronzeLight` | `#d4b896` | Hover bronze |
| `empire.bronzeDark` | `#8b6914` | Sombras bronze |

### Admin (prefixo `admin.*`)

| Token | Valor | Uso |
|-------|-------|-----|
| `admin.bg` | `#FFFFFF` | Fundo principal |
| `admin.surface` | `#F9FAFB` | Cards e containers |
| `admin.sidebar` | `#FFFFFF` | Sidebar |
| `admin.border` | `#E5E7EB` | Bordas |
| `admin.text` | `#111827` | Texto principal |
| `admin.muted` | `#6B7280` | Texto secundário |
| `admin.accent` | `#c9a962` | Acento (mesmo gold) |
| `admin.accentHover` | `#9a7b3c` | Hover do acento |

### Semânticas

| Token | Valor | Uso |
|-------|-------|-----|
| `semantic.success` | `#22C55E` | Sucesso, confirmação |
| `semantic.warning` | `#F59E0B` | Alerta, aviso |
| `semantic.error` | `#EF4444` | Erro, destrutivo |
| `semantic.info` | `#3B82F6` | Informação |

## Como usar no código

### Tailwind CSS v4
```tsx
// Fundos
<div className="bg-[var(--color-empire-bg)]">
<div className="bg-[var(--color-empire-card)]">

// Texto
<p className="text-[var(--color-empire-text)]">
<p className="text-[var(--color-empire-muted)]">

// Bordas
<div className="border border-[var(--color-empire-border)]">

// Acentos
<span className="text-[var(--color-empire-gold)]">
<button className="bg-[var(--color-semantic-error)]">
```

### CSS puro
```css
.meu-elemento {
  background-color: var(--color-empire-bg);
  color: var(--color-empire-text);
  border-color: var(--color-empire-border);
}
```

## Gradientes

### Gradiente dourado
```tsx
<span className="text-gold-gradient">Texto com gradiente</span>
```

### Borda com gradiente
```tsx
<div className="border-gold-gradient">Card premium</div>
```

## Exemplo completo de mudança

### Cenário: Mudar o dourado para um tom mais escuro

1. **tokens.ts**
```typescript
gold: '#b8962e',  // Era #c9a962
goldLight: '#d4c078',  // Era #e4d4a5
goldDark: '#8a6d2a',  // Era #9a7b3c
```

2. **globals.css**
```css
--color-empire-gold: #b8962e;
--color-empire-gold-light: #d4c078;
--color-empire-gold-dark: #8a6d2a;
```

3. **Resultado**: Todo o site agora usa o novo tom de dourado automaticamente.

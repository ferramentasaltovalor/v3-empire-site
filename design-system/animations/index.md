# Animações — Empire Gold

## Visão Geral

O design system inclui um conjunto de animações CSS para criar experiências visuais fluidas e premium.

## Animações Disponíveis

### fade-in-up

Animação de entrada com fade e movimento vertical.

**Uso:** Elementos que aparecem ao entrar na viewport.

```tsx
<div className="animate-[fade-in-up_0.6s_ease_forwards]">
    Conteúdo que aparece suavemente
</div>
```

**CSS:**
```css
@keyframes fade-in-up {
    0% {
        opacity: 0;
        transform: translateY(30px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
```

**Com useIntersectionObserver:**
```tsx
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

function AnimatedSection() {
    const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>()
    
    return (
        <div
            ref={ref}
            className={isVisible ? 'animate-[fade-in-up_0.6s_ease_forwards]' : 'opacity-0'}
        >
            Conteúdo animado
        </div>
    )
}
```

---

### pulse-ring

Animação de pulso que expande e desaparece.

**Uso:** CTAs principais, indicadores de atenção.

```tsx
<div className="relative">
    <span className="absolute inset-0 rounded-full bg-[var(--color-empire-gold)] opacity-30 animate-[pulse-ring_1.5s_ease-out_infinite]" />
    <button className="relative bg-[var(--color-empire-gold)] text-black px-6 py-3 rounded-full">
        CTA Principal
    </button>
</div>
```

**CSS:**
```css
@keyframes pulse-ring {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    100% {
        transform: scale(1.5);
        opacity: 0;
    }
}
```

**No componente Button:**
```tsx
<Button variant="premium" pulseRing>
    Começar Agora
</Button>
```

---

### shine

Efeito de luz que passa horizontalmente pelo elemento.

**Uso:** Botões premium, cards destacados.

```tsx
<button className="relative overflow-hidden bg-[var(--color-empire-gold)]">
    Botão Premium
    <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)] animate-[shine_4s_ease-in-out_infinite]" />
</button>
```

**CSS:**
```css
@keyframes shine {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(100%);
    }
}
```

**Aplicação no Button:**
O componente `Button` com `variant="premium"` já inclui o efeito shine no hover via pseudo-elemento `::after`.

---

### stagger-children

Animação em cascata para múltiplos filhos.

**Uso:** Listas, grids, grupos de elementos.

```tsx
<div className="[&>*]:animate-[stagger-children_0.6s_ease_forwards]">
    <div style={{ animationDelay: '0ms' }}>Item 1</div>
    <div style={{ animationDelay: '100ms' }}>Item 2</div>
    <div style={{ animationDelay: '200ms' }}>Item 3</div>
    <div style={{ animationDelay: '300ms' }}>Item 4</div>
</div>
```

**CSS:**
```css
@keyframes stagger-children {
    0% {
        opacity: 0;
        transform: translateY(20px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
```

**Helper para delays:**
```tsx
function StaggeredList({ items }: { items: string[] }) {
    return (
        <ul>
            {items.map((item, index) => (
                <li
                    key={item}
                    className="animate-[stagger-children_0.6s_ease_forwards] opacity-0"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    {item}
                </li>
            ))}
        </ul>
    )
}
```

---

## Classes Utilitárias

### Transições

```tsx
// Transição rápida (300ms)
<div className="transition-all duration-300">

// Transição média (400ms)
<div className="transition-all duration-400">

// Transição lenta (800ms)
<div className="transition-all duration-800">
```

### Hover com Elevação

```tsx
<div className="hover:-translate-y-2 transition-transform duration-300">
    Card que eleva no hover
</div>
```

### Opacidade com Hover

```tsx
<div className="opacity-80 hover:opacity-100 transition-opacity duration-200">
    Elemento que fica visível no hover
</div>
```

---

## Hooks Relacionados

### useIntersectionObserver

Detecta quando um elemento entra na viewport.

```tsx
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

function FadeInSection({ children }) {
    const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({
        threshold: 0.1,
        rootMargin: '0px',
        freezeOnceVisible: true,
    })
    
    return (
        <div
            ref={ref}
            className={`transition-all duration-600 ${
                isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
            }`}
        >
            {children}
        </div>
    )
}
```

### useScrolled

Detecta se a página foi scrollada além de um limite.

```tsx
import { useScrolled } from '@/hooks/useScrolled'

function StickyHeader() {
    const scrolled = useScrolled(20)
    
    return (
        <header className={`fixed top-0 w-full transition-all duration-300 ${
            scrolled 
                ? 'bg-[var(--color-empire-bg)]/95 backdrop-blur-md' 
                : 'bg-transparent'
        }`}>
            {/* ... */}
        </header>
    )
}
```

---

## Boas Práticas

### 1. Performance

- Use `transform` e `opacity` para animações (GPU aceleradas)
- Evite animar `width`, `height`, `margin`, `padding`
- Use `will-change` com moderação

### 2. Acessibilidade

```tsx
// Respeitar preferências do usuário
<div className="motion-reduce:transition-none">
    Conteúdo
</div>
```

### 3. Timing

- **Entrada:** 300-600ms
- **Interações:** 150-300ms
- **Ênfase:** 600-1000ms

### 4. Easing

```tsx
// Entrada suave
transition-all duration-300 ease-out

// Saída suave
transition-all duration-300 ease-in

// Ambos
transition-all duration-300 ease-in-out
```

---

## Exemplos Completos

### Seção com Fade-In

```tsx
function HeroSection() {
    const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>()
    
    return (
        <section
            ref={ref}
            className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
            <h1 className="text-gold-gradient">Título Hero</h1>
            <p>Subtítulo com animação</p>
            <Button variant="premium" pulseRing>CTA</Button>
        </section>
    )
}
```

### Lista Animada

```tsx
function FeatureList({ features }) {
    const [ref, isVisible] = useIntersectionObserver<HTMLUListElement>()
    
    return (
        <ul ref={ref} className="space-y-4">
            {features.map((feature, index) => (
                <li
                    key={feature.id}
                    className={`transition-all duration-500 ${
                        isVisible 
                            ? 'opacity-100 translate-x-0' 
                            : 'opacity-0 -translate-x-4'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                >
                    {feature.title}
                </li>
            ))}
        </ul>
    )
}
```

### Card com Hover Completo

```tsx
<Card className="group cursor-pointer">
    <CardContent>
        <img 
            src="/image.jpg" 
            alt="" 
            className="transition-transform duration-500 group-hover:scale-105"
        />
        <h3 className="transition-colors duration-300 group-hover:text-[var(--color-empire-gold)]">
            Título
        </h3>
    </CardContent>
</Card>
```

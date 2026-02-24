// src/components/public/sections/BlogPreviewSection.tsx
// ============================================================================
// BLOG PREVIEW SECTION — Homepage Empire Gold
// ============================================================================
// Preview dos últimos artigos do blog com:
// - Label, título, subtítulo
// - Grid de 3 cards de posts (placeholder por enquanto)
// - CTA link para /blog
// ============================================================================

'use client'

import Link from 'next/link'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import { homeContent } from '@/content/home'
import { Button } from '@/components/ui/button'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

// Placeholder posts - will be replaced with real data from Supabase in G02-T02
const placeholderPosts = [
    {
        title: 'Estratégias de crescimento para 2024',
        excerpt: 'Descubra as principais tendências e estratégias que estão impulsionando o crescimento das empresas líderes.',
        category: 'Estratégia',
        date: '15 Fev 2024',
        readTime: '5 min',
        slug: 'estrategias-crescimento-2024',
    },
    {
        title: 'Como medir o ROI das suas iniciativas',
        excerpt: 'Aprenda a definir métricas que realmente importam e a calcular o retorno sobre investimento.',
        category: 'Métricas',
        date: '10 Fev 2024',
        readTime: '7 min',
        slug: 'como-medir-roi-iniciativas',
    },
    {
        title: 'Liderança em tempos de incerteza',
        excerpt: 'Lições de líderes que navegaram crises e saíram mais fortes, com estratégias práticas.',
        category: 'Liderança',
        date: '05 Fev 2024',
        readTime: '6 min',
        slug: 'lideranca-tempos-incerteza',
    },
]

export function BlogPreviewSection() {
    const { blogPreview } = homeContent
    const { ref, isVisible } = useScrollAnimation()

    return (
        <section
            ref={ref}
            className="py-20 lg:py-28 bg-[var(--color-empire-surface)]"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    {/* Label */}
                    <span
                        className={`inline-block text-sm font-medium tracking-wider uppercase text-[var(--color-empire-gold)] mb-4 transition-all duration-700 ${isVisible
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                            }`}
                    >
                        {blogPreview.label}
                    </span>

                    {/* Title */}
                    <h2
                        className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-empire-text)] mb-6 transition-all duration-700 delay-100 ${isVisible
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                            }`}
                    >
                        {blogPreview.title}
                    </h2>

                    {/* Subtitle */}
                    <p
                        className={`text-lg text-[var(--color-empire-muted)] transition-all duration-700 delay-200 ${isVisible
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                            }`}
                    >
                        {blogPreview.subtitle}
                    </p>
                </div>

                {/* Blog posts grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
                    {placeholderPosts.map((post, index) => (
                        <Link
                            key={index}
                            href={`/blog/${post.slug}`}
                            className={`group block transition-all duration-700 ${isVisible
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                                }`}
                            style={{ transitionDelay: `${300 + index * 100}ms` }}
                        >
                            <article className="h-full bg-[var(--color-empire-card)] border border-[var(--color-empire-border)] rounded-sm overflow-hidden hover:border-[var(--color-empire-gold)]/30 transition-all duration-300">
                                {/* Image placeholder */}
                                <div className="aspect-[16/9] bg-gradient-to-br from-[var(--color-empire-gold)]/10 to-transparent relative">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-xs uppercase tracking-wider text-[var(--color-empire-gold)]/50">
                                            Imagem
                                        </span>
                                    </div>
                                    {/* Category badge */}
                                    <span className="absolute top-4 left-4 text-xs font-medium tracking-wider uppercase text-[var(--color-empire-gold)] bg-[var(--color-empire-bg)]/80 backdrop-blur-sm px-3 py-1 rounded-sm">
                                        {post.category}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Meta info */}
                                    <div className="flex items-center gap-4 text-xs text-[var(--color-empire-muted)] mb-4">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {post.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {post.readTime}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="font-display text-xl font-semibold text-[var(--color-empire-text)] mb-3 group-hover:text-[var(--color-empire-gold)] transition-colors">
                                        {post.title}
                                    </h3>

                                    {/* Excerpt */}
                                    <p className="text-sm text-[var(--color-empire-muted)] leading-relaxed line-clamp-2">
                                        {post.excerpt}
                                    </p>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div
                    className={`text-center transition-all duration-700 delay-600 ${isVisible
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                        }`}
                >
                    <Link href={blogPreview.cta.href}>
                        <Button variant="secondary" size="lg">
                            {blogPreview.cta.label}
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

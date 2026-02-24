// src/content/blog.ts
// Content strings for the blog section — Design System Empire Gold

export const blogContent = {
    listing: {
        title: 'Blog',
        subtitle: 'Insights, estratégias e conteúdos para impulsionar seu negócio',
        readMore: 'Ler mais',
        noPosts: 'Nenhum post encontrado',
        searchPlaceholder: 'Buscar artigos...',
        categoriesLabel: 'Filtrar por categoria:',
        allCategories: 'Todos',
    },
    post: {
        backToBlog: 'Voltar ao blog',
        writtenBy: 'Por',
        publishedOn: 'Publicado em',
        readingTime: 'min de leitura',
        share: 'Compartilhar',
        relatedPosts: 'Posts relacionados',
        tags: 'Tags',
        category: 'Categoria',
    },
    category: {
        postsIn: 'Posts em',
        noPosts: 'Nenhum post nesta categoria.',
    },
} as const

export type BlogContent = typeof blogContent

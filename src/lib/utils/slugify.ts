// src/lib/utils/slugify.ts

export function slugify(text: string): string {
    return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')           // Espaços → hífens
        .replace(/[^\w-]+/g, '')        // Remove caracteres especiais
        .replace(/--+/g, '-')           // Múltiplos hífens → um
        .replace(/^-+/, '')             // Remove hífens do início
        .replace(/-+$/, '')             // Remove hífens do fim
}

export function generateUniqueSlug(text: string, existingSlugs: string[]): string {
    const baseSlug = slugify(text)
    if (!existingSlugs.includes(baseSlug)) return baseSlug

    let counter = 1
    while (existingSlugs.includes(`${baseSlug}-${counter}`)) {
        counter++
    }
    return `${baseSlug}-${counter}`
}

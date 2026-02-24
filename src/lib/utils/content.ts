// src/lib/utils/content.ts
// ============================================================================
// UTILITÁRIOS PARA PROCESSAMENTO DE CONTEÚDO
// ============================================================================
// Este arquivo contém funções auxiliares para processar conteúdo dos arquivos
// em src/content/, como parsing de títulos com marcadores [gold].
//
// USAGE:
// ```tsx
// import { splitTitleForGold } from '@/lib/utils/content'
// 
// const title = 'Estratégia que [transforma] negócios'
// const parts = splitTitleForGold(title)
// // Resultado: [{ text: 'Estratégia que ', isGold: false }, { text: 'transforma', isGold: true }, { text: ' negócios', isGold: false }]
// ```
// ============================================================================

import type { TitlePart } from '@/types/content'

/**
 * Parseia um título com marcador [gold] e retorna a palavra destacada
 * 
 * @param title - Título com possível marcador [palavra]
 * @returns Objeto com texto completo e palavra gold (ou null se não houver)
 * 
 * @example
 * parseGoldTitle('Estratégia que [transforma] negócios')
 * // Retorna: { text: 'Estratégia que transforma negócios', goldWord: 'transforma' }
 * 
 * parseGoldTitle('Título sem destaque')
 * // Retorna: { text: 'Título sem destaque', goldWord: null }
 */
export function parseGoldTitle(title: string): { text: string; goldWord: string | null } {
    const match = title.match(/\[(.*?)\]/)
    if (match) {
        return {
            text: title.replace(/\[.*?\]/, match[1]),
            goldWord: match[1]
        }
    }
    return { text: title, goldWord: null }
}

/**
 * Divide um título em partes, marcando quais devem ser destacadas em dourado
 * 
 * @param title - Título com possíveis marcadores [palavra]
 * @returns Array de partes do título, cada uma com texto e flag isGold
 * 
 * @example
 * splitTitleForGold('Estratégia que [transforma] negócios')
 * // Retorna:
 * // [
 * //   { text: 'Estratégia que ', isGold: false },
 * //   { text: 'transforma', isGold: true },
 * //   { text: ' negócios', isGold: false }
 * // ]
 * 
 * @example
 * splitTitleForGold('[Império] do [futuro]')
 * // Retorna:
 * // [
 * //   { text: 'Império', isGold: true },
 * //   { text: ' do ', isGold: false },
 * //   { text: 'futuro', isGold: true }
 * // ]
 */
export function splitTitleForGold(title: string): TitlePart[] {
    const parts: TitlePart[] = []
    const regex = /\[(.*?)\]/g
    let lastIndex = 0
    let match

    while ((match = regex.exec(title)) !== null) {
        // Adiciona texto antes do match (se houver)
        if (match.index > lastIndex) {
            parts.push({ text: title.slice(lastIndex, match.index), isGold: false })
        }
        // Adiciona a palavra destacada
        parts.push({ text: match[1], isGold: true })
        lastIndex = match.index + match[0].length
    }

    // Adiciona texto restante após o último match (se houver)
    if (lastIndex < title.length) {
        parts.push({ text: title.slice(lastIndex), isGold: false })
    }

    // Se não houve nenhum match, retorna o título completo
    if (parts.length === 0) {
        parts.push({ text: title, isGold: false })
    }

    return parts
}

/**
 * Verifica se um título contém marcadores de destaque dourado
 * 
 * @param title - Título a verificar
 * @returns true se contém [palavra], false caso contrário
 * 
 * @example
 * hasGoldHighlight('Estratégia que [transforma] negócios') // true
 * hasGoldHighlight('Título sem destaque') // false
 */
export function hasGoldHighlight(title: string): boolean {
    return /\[.*?\]/.test(title)
}

/**
 * Remove os marcadores [ ] de um título, mantendo o texto
 * 
 * @param title - Título com marcadores
 * @returns Título limpo sem marcadores
 * 
 * @example
 * stripGoldMarkers('Estratégia que [transforma] negócios')
 * // Retorna: 'Estratégia que transforma negócios'
 */
export function stripGoldMarkers(title: string): string {
    return title.replace(/\[(.*?)\]/g, '$1')
}

/**
 * Formata um número de telefone para exibição
 * 
 * @param phone - Número de telefone (apenas dígitos ou formatado)
 * @returns Telefone formatado para exibição
 * 
 * @example
 * formatPhone('11999999999') // '(11) 99999-9999'
 * formatPhone('1133333333') // '(11) 3333-3333'
 */
export function formatPhone(phone: string): string {
    // Remove tudo que não é dígito
    const digits = phone.replace(/\D/g, '')

    if (digits.length === 11) {
        // Celular: (11) 99999-9999
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
    } else if (digits.length === 10) {
        // Fixo: (11) 3333-3333
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    }

    // Retorna original se não conseguir formatar
    return phone
}

/**
 * Gera URL de WhatsApp a partir de um número
 * 
 * @param whatsapp - Número do WhatsApp (com código do país)
 * @param message - Mensagem opcional pré-preenchida
 * @returns URL completa para WhatsApp
 * 
 * @example
 * getWhatsAppUrl('5511999999999', 'Olá, gostaria de mais informações!')
 * // Retorna: 'https://wa.me/5511999999999?text=Ol%C3%A1%2C%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%21'
 */
export function getWhatsAppUrl(whatsapp: string, message?: string): string {
    const baseUrl = `https://wa.me/${whatsapp.replace(/\D/g, '')}`
    if (message) {
        return `${baseUrl}?text=${encodeURIComponent(message)}`
    }
    return baseUrl
}

/**
 * Gera URL de mailto a partir de um email
 * 
 * @param email - Endereço de email
 * @param subject - Assunto opcional
 * @param body - Corpo opcional
 * @returns URL mailto completa
 * 
 * @example
 * getMailtoUrl('contato@empire.com.br', 'Contato pelo site', 'Gostaria de mais informações')
 * // Retorna: 'mailto:contato@empire.com.br?subject=Contato%20pelo%20site&body=Gostaria%20de%20mais%20informa%C3%A7%C3%B5es'
 */
export function getMailtoUrl(email: string, subject?: string, body?: string): string {
    const params = new URLSearchParams()
    if (subject) params.set('subject', subject)
    if (body) params.set('body', body)

    const queryString = params.toString()
    return queryString ? `mailto:${email}?${queryString}` : `mailto:${email}`
}

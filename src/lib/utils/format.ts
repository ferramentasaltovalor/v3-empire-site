// src/lib/utils/format.ts

import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function formatDate(date: string | Date): string {
    return format(new Date(date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
}

export function formatDateShort(date: string | Date): string {
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR })
}

export function formatRelativeDate(date: string | Date): string {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR })
}

export function formatReadingTime(minutes: number): string {
    if (minutes < 1) return 'menos de 1 min de leitura'
    if (minutes === 1) return '1 min de leitura'
    return `${minutes} min de leitura`
}

export function formatWordCount(count: number): string {
    if (count < 1000) return `${count} palavras`
    return `${(count / 1000).toFixed(1)}k palavras`
}

export function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

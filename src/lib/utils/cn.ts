// src/lib/utils/cn.ts
// Utilitário para combinar classes CSS condicionalmente
// Baseado em clsx + tailwind-merge

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

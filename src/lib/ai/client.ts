import { createClient } from '@/lib/supabase/client'
import type { AIGeneratorConfig, ScrapedContent, GeneratedContent, SEOAnalysisResult } from '@/types/ai'

const supabase = createClient()

export async function generateContent(config: AIGeneratorConfig): Promise<GeneratedContent> {
    const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
            prompt: config.topic,
            type: config.type,
            sourceType: config.sourceType === 'manual' ? undefined : config.sourceType,
            sourceContent: config.sourceContent,
            tone: config.tone,
            length: config.length,
            targetAudience: config.targetAudience,
            keywords: config.keywords,
            customInstructions: config.customInstructions,
        },
    })

    if (error) throw error
    return data
}

export async function scrapeInstagram(url: string): Promise<ScrapedContent> {
    const { data, error } = await supabase.functions.invoke('scrape-instagram', {
        body: { url },
    })

    if (error) throw error
    return {
        type: 'instagram',
        content: data.caption || '',
        metadata: data,
    }
}

export async function scrapeYouTube(url: string): Promise<ScrapedContent> {
    const { data, error } = await supabase.functions.invoke('scrape-youtube', {
        body: { url },
    })

    if (error) throw error
    return {
        type: 'youtube',
        content: data.transcript || '',
        metadata: data,
    }
}

export async function analyzeSEO(
    content: string,
    title?: string,
    keywords?: string[]
): Promise<SEOAnalysisResult> {
    const { data, error } = await supabase.functions.invoke('analyze-seo', {
        body: {
            content,
            title,
            keywords,
            generateMeta: true,
        },
    })

    if (error) throw error
    return data
}

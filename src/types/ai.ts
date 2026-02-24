export type ToneType = 'professional' | 'casual' | 'academic' | 'journalistic' | 'persuasive' | 'educational'
export type LengthType = 'short' | 'medium' | 'long' | 'very-long'
export type GenerateType = 'full' | 'intro' | 'conclusion' | 'rewrite'
export type SourceType = 'manual' | 'instagram' | 'youtube'

export interface AIGeneratorConfig {
    model: string
    tone: ToneType
    length: LengthType
    type: GenerateType
    sourceType: SourceType
    sourceUrl: string
    topic: string
    targetAudience: string
    keywords: string[]
    customInstructions: string
    sourceContent?: string
}

export interface ScrapedContent {
    type: 'instagram' | 'youtube'
    content: string
    metadata: Record<string, unknown>
}

export interface GeneratedContent {
    text: string
    usage: {
        prompt: number
        completion: number
        total: number
    }
}

export interface SEOCheck {
    status: 'pass' | 'warning' | 'fail'
    message: string
}

export interface SEOTitleAnalysis {
    value?: string
    suggestion?: string
    status?: 'pass' | 'warning' | 'fail'
}

export interface SEOMetaDescriptionAnalysis {
    value?: string
    suggestion?: string
    status?: 'pass' | 'warning' | 'fail'
}

export interface SEOKeywordsAnalysis {
    found: string[]
    missing: string[]
    suggested?: string[]
    density?: Record<string, number>
}

export interface SEOReadabilityAnalysis {
    score: number
    level: string
    avgSentenceLength?: number
    suggestions?: string[]
}

export interface SEOAnalysisResult {
    score: number
    suggestions: string[]
    title?: SEOTitleAnalysis
    metaDescription?: SEOMetaDescriptionAnalysis
    keywords?: SEOKeywordsAnalysis
    readability?: SEOReadabilityAnalysis
    checks?: Record<string, SEOCheck>
    meta?: {
        title: string
        description: string
    }
}

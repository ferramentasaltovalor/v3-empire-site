// src/lib/openrouter/client.ts
// OpenRouter API client for server-side use
// NUNCA importar em Client Components

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

interface OpenRouterMessage {
    role: 'system' | 'user' | 'assistant'
    content: string
}

interface OpenRouterRequest {
    model: string
    messages: OpenRouterMessage[]
    max_tokens?: number
    temperature?: number
    stream?: boolean
}

interface OpenRouterResponse {
    id: string
    choices: {
        message: {
            role: string
            content: string
        }
        finish_reason: string
    }[]
    usage: {
        prompt_tokens: number
        completion_tokens: number
        total_tokens: number
    }
}

export async function generateContent(options: {
    prompt: string
    systemPrompt?: string
    model?: string
    maxTokens?: number
    temperature?: number
}): Promise<{ content: string; usage: { prompt: number; completion: number; total: number } }> {
    const {
        prompt,
        systemPrompt = 'Você é um assistente de conteúdo especializado em criar artigos de blog em português brasileiro.',
        model = process.env.OPENROUTER_DEFAULT_MODEL || 'anthropic/claude-sonnet-4',
        maxTokens = 4096,
        temperature = 0.7,
    } = options

    const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': process.env.OPENROUTER_HTTP_REFERER || 'https://empire.com.br',
            'X-Title': process.env.OPENROUTER_X_TITLE || 'Empire Site',
        },
        body: JSON.stringify({
            model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt },
            ],
            max_tokens: maxTokens,
            temperature,
        }),
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`OpenRouter API error: ${response.status} - ${error}`)
    }

    const data: OpenRouterResponse = await response.json()

    return {
        content: data.choices[0]?.message?.content || '',
        usage: {
            prompt: data.usage?.prompt_tokens || 0,
            completion: data.usage?.completion_tokens || 0,
            total: data.usage?.total_tokens || 0,
        },
    }
}

export async function generateContentStream(options: {
    prompt: string
    systemPrompt?: string
    model?: string
    maxTokens?: number
    temperature?: number
    onChunk: (chunk: string) => void
}): Promise<void> {
    const {
        prompt,
        systemPrompt = 'Você é um assistente de conteúdo especializado em criar artigos de blog em português brasileiro.',
        model = process.env.OPENROUTER_DEFAULT_MODEL || 'anthropic/claude-sonnet-4',
        maxTokens = 4096,
        temperature = 0.7,
        onChunk,
    } = options

    const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': process.env.OPENROUTER_HTTP_REFERER || 'https://empire.com.br',
            'X-Title': process.env.OPENROUTER_X_TITLE || 'Empire Site',
        },
        body: JSON.stringify({
            model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt },
            ],
            max_tokens: maxTokens,
            temperature,
            stream: true,
        }),
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`OpenRouter API error: ${response.status} - ${error}`)
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No response body')

    const decoder = new TextDecoder()

    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(line => line.startsWith('data: '))

        for (const line of lines) {
            const data = line.slice(6)
            if (data === '[DONE]') return

            try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content
                if (content) {
                    onChunk(content)
                }
            } catch {
                // Ignore parse errors for incomplete chunks
            }
        }
    }
}

// Export config for reference
export const OPENROUTER_CONFIG = {
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: process.env.OPENROUTER_DEFAULT_MODEL || 'anthropic/claude-sonnet-4',
    headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.OPENROUTER_HTTP_REFERER || 'https://empire.com.br',
        'X-Title': process.env.OPENROUTER_X_TITLE || 'Empire Site',
        'Content-Type': 'application/json',
    },
} as const

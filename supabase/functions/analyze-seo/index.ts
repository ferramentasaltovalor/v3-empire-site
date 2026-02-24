import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

interface SEORequest {
    title?: string
    content: string
    keywords?: string[]
    generateMeta?: boolean
}

serve(async (req) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {
                global: {
                    headers: { Authorization: req.headers.get('Authorization') ?? '' },
                },
            }
        )

        const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
        if (authError || !user) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized' }),
                { status: 401, headers: { ...headers, 'Content-Type': 'application/json' } }
            )
        }

        const body: SEORequest = await req.json()

        const systemPrompt = `Você é um especialista em SEO para conteúdo em português brasileiro.
Analise o conteúdo fornecido e retorne um JSON com a seguinte estrutura:
{
  "score": number (0-100),
  "title": {
    "value": string,
    "length": number,
    "isOptimal": boolean,
    "suggestion": string
  },
  "metaDescription": {
    "value": string,
    "length": number,
    "isOptimal": boolean,
    "suggestion": string
  },
  "keywords": {
    "primary": string[],
    "suggested": string[],
    "density": { [keyword: string]: number }
  },
  "readability": {
    "score": number,
    "avgSentenceLength": number,
    "avgWordLength": number,
    "suggestions": string[]
  },
  "checks": {
    "titleLength": { "status": "pass" | "warning" | "fail", "message": string },
    "metaLength": { "status": "pass" | "warning" | "fail", "message": string },
    "keywordInTitle": { "status": "pass" | "warning" | "fail", "message": string },
    "keywordInFirstParagraph": { "status": "pass" | "warning" | "fail", "message": string },
    "contentLength": { "status": "pass" | "warning" | "fail", "message": string },
    "headingStructure": { "status": "pass" | "warning" | "fail", "message": string },
    "internalLinks": { "status": "pass" | "warning" | "fail", "message": string },
    "imageAlt": { "status": "pass" | "warning" | "fail", "message": string }
  }
}

Retorne APENAS o JSON, sem markdown ou texto adicional.`

        const userPrompt = `Analise o seguinte conteúdo para SEO:
    
Título: ${body.title || 'Não fornecido'}
Palavras-chave focais: ${body.keywords?.join(', ') || 'Não fornecidas'}

Conteúdo:
${body.content}

${body.generateMeta ? 'Gere também sugestões de título e meta description otimizados.' : ''}`

        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
                'HTTP-Referer': Deno.env.get('OPENROUTER_HTTP_REFERER') || 'https://empire.com.br',
                'X-Title': Deno.env.get('OPENROUTER_X_TITLE') || 'Empire Site',
            },
            body: JSON.stringify({
                model: 'anthropic/claude-3.5-haiku', // Faster model for analysis
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                max_tokens: 2048,
                temperature: 0.3,
            }),
        })

        const data = await response.json()
        const analysisText = data.choices?.[0]?.message?.content || '{}'

        // Parse JSON from response
        let analysis
        try {
            analysis = JSON.parse(analysisText)
        } catch {
            analysis = { error: 'Failed to parse analysis', raw: analysisText }
        }

        return new Response(
            JSON.stringify(analysis),
            { headers: { ...headers, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
        )
    }
})

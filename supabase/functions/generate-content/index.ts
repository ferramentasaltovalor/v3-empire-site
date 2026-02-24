import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

interface GenerateRequest {
    prompt: string
    type: 'full' | 'intro' | 'conclusion' | 'rewrite'
    sourceContent?: string
    sourceType?: 'instagram' | 'youtube'
    tone?: 'professional' | 'casual' | 'academic' | 'journalistic'
    length?: 'short' | 'medium' | 'long' | 'very-long'
    targetAudience?: string
    keywords?: string[]
}

serve(async (req) => {
    // CORS headers
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

        // Verify user is authenticated
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
        if (authError || !user) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized' }),
                { status: 401, headers: { ...headers, 'Content-Type': 'application/json' } }
            )
        }

        const body: GenerateRequest = await req.json()

        // Build system prompt based on type
        let systemPrompt = 'Você é um especialista em criação de conteúdo para blogs empresariais em português brasileiro.'

        if (body.tone === 'professional') {
            systemPrompt += ' Use um tom profissional e formal.'
        } else if (body.tone === 'casual') {
            systemPrompt += ' Use um tom informal e conversacional.'
        } else if (body.tone === 'academic') {
            systemPrompt += ' Use um tom acadêmico e técnico.'
        } else if (body.tone === 'journalistic') {
            systemPrompt += ' Use um tom jornalístico e objetivo.'
        }

        // Build user prompt
        let userPrompt = ''

        if (body.type === 'full') {
            userPrompt = `Crie um artigo de blog completo sobre: ${body.prompt}`
        } else if (body.type === 'intro') {
            userPrompt = `Crie uma introdução envolvente para um artigo sobre: ${body.prompt}`
        } else if (body.type === 'conclusion') {
            userPrompt = `Crie uma conclusão impactante para um artigo sobre: ${body.prompt}`
        } else if (body.type === 'rewrite' && body.sourceContent) {
            userPrompt = `Reescreva o seguinte conteúdo mantendo o sentido mas com novas palavras:\n\n${body.sourceContent}`
        }

        if (body.sourceType === 'instagram' && body.sourceContent) {
            userPrompt = `Transforme o seguinte conteúdo de Instagram em um artigo de blog completo:\n\n${body.sourceContent}`
        } else if (body.sourceType === 'youtube' && body.sourceContent) {
            userPrompt = `Transforme a seguinte transcrição de YouTube em um artigo de blog bem estruturado:\n\n${body.sourceContent}`
        }

        if (body.targetAudience) {
            userPrompt += `\n\nPúblico-alvo: ${body.targetAudience}`
        }

        if (body.keywords && body.keywords.length > 0) {
            userPrompt += `\n\nPalavras-chave: ${body.keywords.join(', ')}`
        }

        const lengthGuide = {
            'short': '300-500 palavras',
            'medium': '700-1000 palavras',
            'long': '1500-2500 palavras',
            'very-long': '3000-5000 palavras',
        }
        userPrompt += `\n\nTamanho: ${lengthGuide[body.length || 'medium']}`

        // Call OpenRouter
        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
                'HTTP-Referer': Deno.env.get('OPENROUTER_HTTP_REFERER') || 'https://empire.com.br',
                'X-Title': Deno.env.get('OPENROUTER_X_TITLE') || 'Empire Site',
            },
            body: JSON.stringify({
                model: Deno.env.get('OPENROUTER_DEFAULT_MODEL') || 'anthropic/claude-sonnet-4',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                max_tokens: 4096,
                temperature: 0.7,
            }),
        })

        if (!response.ok) {
            throw new Error(`OpenRouter error: ${response.status}`)
        }

        const data = await response.json()
        const content = data.choices?.[0]?.message?.content || ''

        // Log generation
        await supabaseClient.from('ai_generation_logs').insert({
            model: Deno.env.get('OPENROUTER_DEFAULT_MODEL'),
            prompt: userPrompt.substring(0, 500),
            input_tokens: data.usage?.prompt_tokens,
            output_tokens: data.usage?.completion_tokens,
            source_type: body.sourceType,
            created_by: user.id,
        })

        return new Response(
            JSON.stringify({
                content,
                usage: data.usage,
            }),
            { headers: { ...headers, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
        )
    }
})

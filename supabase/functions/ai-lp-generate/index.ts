import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

// ============================================================================
// Types
// ============================================================================

interface LPConfig {
  tone: 'professional' | 'casual' | 'urgent' | 'luxury' | 'friendly'
  goal: 'lead_generation' | 'sales' | 'webinar' | 'product_launch' | 'brand_awareness'
  productName?: string
  productDescription?: string
  targetAudience?: string
  keywords?: string[]
  customInstructions?: string
}

interface GenerateRequest {
  action: 'generate_titles' | 'generate_section' | 'generate_full_lp' | 'generate_headlines' | 'generate_ctas' | 'generate_seo' | 'optimize_conversion'
  model?: string
  config: LPConfig
  // Action-specific params
  sectionType?: string
  context?: {
    previousSections?: Array<{ type: string; title?: string; features?: string[] }>
    lpTitle?: string
  }
  sections?: string[]
  baseHeadline?: string
  count?: number
  lpName?: string
  content?: string
}

// ============================================================================
// Tone Prompts
// ============================================================================

function getTonePrompt(tone: LPConfig['tone']): string {
  const tones = {
    professional: 'Use um tom profissional, confiável e corporativo. Linguagem formal mas acessível.',
    casual: 'Use um tom casual, amigável e conversacional. Como se estivesse conversando com um amigo.',
    urgent: 'Use um tom de urgência, criando senso de escassez e necessidade de ação imediata.',
    luxury: 'Use um tom sofisticado, exclusivo e premium. Enfatize qualidade e status.',
    friendly: 'Use um tom acolhedor, empático e próximo. Conecte emocionalmente com o leitor.',
  }
  return tones[tone]
}

// ============================================================================
// Goal Prompts
// ============================================================================

function getGoalPrompt(goal: LPConfig['goal']): string {
  const goals = {
    lead_generation: 'O objetivo é capturar leads. Foque em oferecer valor em troca do contato.',
    sales: 'O objetivo é venda direta. Foque em benefícios, prova social e chamada para compra.',
    webinar: 'O objetivo é inscrição em webinar. Destaque o valor do conteúdo que será apresentado.',
    product_launch: 'O objetivo é lançamento de produto. Crie expectativa e mostre inovação.',
    brand_awareness: 'O objetivo é reconhecimento de marca. Foque em valores e diferenciação.',
  }
  return goals[goal]
}

// ============================================================================
// Action Handlers
// ============================================================================

async function generateTitles(config: LPConfig, model: string): Promise<{ titles: string[]; usage: unknown }> {
  const systemPrompt = `Você é um especialista em copywriting e marketing digital brasileiro.
Crie títulos de landing pages que convertem, seguindo as melhores práticas de CRO.
${getTonePrompt(config.tone)}
${getGoalPrompt(config.goal)}`

  let userPrompt = `Crie 5 títulos de landing page persuasivos e de alta conversão`
  
  if (config.productName) {
    userPrompt += ` para "${config.productName}"`
  }
  
  if (config.productDescription) {
    userPrompt += `\n\nDescrição do produto/serviço: ${config.productDescription}`
  }
  
  if (config.targetAudience) {
    userPrompt += `\n\nPúblico-alvo: ${config.targetAudience}`
  }
  
  if (config.keywords && config.keywords.length > 0) {
    userPrompt += `\n\nPalavras-chave: ${config.keywords.join(', ')}`
  }
  
  userPrompt += `\n\nRetorne APENAS um array JSON com os 5 títulos, sem numeração ou explicações. Exemplo: ["Título 1", "Título 2", ...]`

  const response = await callOpenRouter(systemPrompt, userPrompt, model)
  
  // Parse the JSON array from response
  let titles: string[] = []
  try {
    // Try to extract JSON array from response
    const jsonMatch = response.content.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      titles = JSON.parse(jsonMatch[0])
    }
  } catch {
    // Fallback: split by newlines and clean up
    titles = response.content.split('\n').filter((line: string) => line.trim()).slice(0, 5)
  }
  
  return { titles, usage: response.usage }
}

async function generateSection(
  sectionType: string,
  config: LPConfig,
  context: GenerateRequest['context'],
  model: string
): Promise<{ content: Record<string, unknown>; usage: unknown }> {
  const systemPrompt = `Você é um especialista em criação de landing pages de alta conversão.
Crie conteúdo persuasivo e otimizado para conversão.
${getTonePrompt(config.tone)}
${getGoalPrompt(config.goal)}

Responda APENAS com um objeto JSON válido contendo o conteúdo da seção. Não inclua explicações ou markdown.`

  let userPrompt = `Crie conteúdo para uma seção do tipo "${sectionType}" de uma landing page`
  
  if (config.productName) {
    userPrompt += ` para "${config.productName}"`
  }
  
  if (config.productDescription) {
    userPrompt += `\n\nDescrição: ${config.productDescription}`
  }
  
  if (context?.lpTitle) {
    userPrompt += `\n\nTítulo da LP: ${context.lpTitle}`
  }
  
  if (context?.previousSections && context.previousSections.length > 0) {
    userPrompt += `\n\nSeções anteriores: ${JSON.stringify(context.previousSections)}`
  }
  
  // Add section-specific instructions
  userPrompt += getSectionInstructions(sectionType, config)
  
  const response = await callOpenRouter(systemPrompt, userPrompt, model)
  
  // Parse JSON from response
  let content: Record<string, unknown> = {}
  try {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      content = JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error('Failed to parse section content:', e)
  }
  
  return { content, usage: response.usage }
}

function getSectionInstructions(sectionType: string, config: LPConfig): string {
  const instructions: Record<string, string> = {
    hero: `
      
      Estrutura do JSON:
      {
        "title": "Título principal impactante (máx 60 caracteres)",
        "subtitle": "Subtítulo que reforça o benefício principal",
        "description": "Parágrafo curto explicando a proposta de valor",
        "primaryCta": { "text": "Texto do botão principal", "href": "#" },
        "secondaryCta": { "text": "Texto do botão secundário", "href": "#" },
        "alignment": "center",
        "textColor": "light"
      }`,
      
    features: `
      Crie 3-6 features/benefícios principais.
      
      Estrutura do JSON:
      {
        "title": "Título da seção",
        "subtitle": "Subtítulo opcional",
        "columns": 3,
        "features": [
          { "title": "Título da feature", "description": "Descrição breve", "icon": "check" }
        ],
        "style": "icons"
      }`,
      
    testimonials: `
      Crie 3 depoimentos realistas e persuasivos.
      
      Estrutura do JSON:
      {
        "title": "Título da seção",
        "testimonials": [
          {
            "quote": "Depoimento completo",
            "author": "Nome",
            "role": "Cargo",
            "company": "Empresa"
          }
        ],
        "layout": "carousel"
      }`,
      
    cta: `
      Crie uma chamada para ação irresistível.
      
      Estrutura do JSON:
      {
        "title": "Título do CTA",
        "description": "Descrição motivadora",
        "buttonText": "Texto do botão",
        "buttonHref": "#",
        "buttonVariant": "primary",
        "alignment": "center"
      }`,
      
    form: `
      Crie um formulário de captura otimizado.
      
      Estrutura do JSON:
      {
        "title": "Título acima do formulário",
        "description": "Breve descrição do que receberá",
        "submitButtonText": "Texto do botão",
        "successMessage": "Mensagem de sucesso",
        "fields": [
          { "type": "text", "name": "name", "label": "Nome", "required": true },
          { "type": "email", "name": "email", "label": "E-mail", "required": true }
        ]
      }`,
      
    text: `
      Crie um bloco de texto informativo e persuasivo.
      
      Estrutura do JSON:
      {
        "content": "<p>Conteúdo HTML formatado</p>",
        "alignment": "left"
      }`,
  }
  
  return instructions[sectionType] || ''
}

async function generateFullLP(
  sections: string[],
  config: LPConfig,
  model: string
): Promise<{ 
  sections: Array<{ type: string; content: Record<string, unknown> }>
  seoTitle: string
  seoDescription: string
  usage: unknown 
}> {
  const systemPrompt = `Você é um especialista em criação de landing pages de alta conversão.
Crie uma landing page completa e otimizada para conversão.
${getTonePrompt(config.tone)}
${getGoalPrompt(config.goal)}

Responda APENAS com um objeto JSON válido. Não inclua explicações ou markdown.`

  let userPrompt = `Crie uma landing page completa com as seguintes seções: ${sections.join(', ')}
  
${config.productName ? `Produto/Serviço: "${config.productName}"` : ''}
${config.productDescription ? `Descrição: ${config.productDescription}` : ''}
${config.targetAudience ? `Público-alvo: ${config.targetAudience}` : ''}
${config.keywords?.length ? `Palavras-chave: ${config.keywords.join(', ')}` : ''}

Estrutura da resposta JSON:
{
  "sections": [
    { "type": "hero", "content": { ... } },
    { "type": "features", "content": { ... } },
    ...
  ],
  "seoTitle": "Título SEO (máx 60 caracteres)",
  "seoDescription": "Meta description (máx 160 caracteres)"
}

Use as estruturas de conteúdo definidas para cada tipo de seção.`

  const response = await callOpenRouter(systemPrompt, userPrompt, model, 8192)
  
  // Parse JSON from response
  let result = {
    sections: [] as Array<{ type: string; content: Record<string, unknown> }>,
    seoTitle: '',
    seoDescription: '',
    usage: response.usage,
  }
  
  try {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      result.sections = parsed.sections || []
      result.seoTitle = parsed.seoTitle || ''
      result.seoDescription = parsed.seoDescription || ''
    }
  } catch (e) {
    console.error('Failed to parse full LP:', e)
  }
  
  return result
}

async function generateHeadlines(
  baseHeadline: string,
  count: number,
  config: LPConfig,
  model: string
): Promise<{ headlines: Array<{ text: string; type: string }>; usage: unknown }> {
  const systemPrompt = `Você é um especialista em copywriting e testes A/B.
Crie variantes de headlines para testes A/B.
${getTonePrompt(config.tone)}
${getGoalPrompt(config.goal)}

Responda APENAS com um array JSON válido.`

  const userPrompt = `Crie ${count} variantes da seguinte headline para testes A/B:
  
Headline original: "${baseHeadline}"

Use diferentes tipos:
- question: Pergunta que desperta curiosidade
- statement: Afirmação forte e direta
- how-to: Promessa de ensinar algo
- benefit: Foco no benefício principal
- fear: Apelo ao medo de perder

Retorne um array JSON:
[
  { "text": "Headline variante", "type": "question" },
  ...
]`

  const response = await callOpenRouter(systemPrompt, userPrompt, model)
  
  let headlines: Array<{ text: string; type: string }> = []
  try {
    const jsonMatch = response.content.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      headlines = JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error('Failed to parse headlines:', e)
  }
  
  return { headlines, usage: response.usage }
}

async function generateCTAs(
  context: { sectionType: string; buttonText?: string; headline?: string; description?: string },
  config: LPConfig,
  model: string
): Promise<{ suggestions: Array<{ text: string; urgency: string; reasoning: string }>; usage: unknown }> {
  const systemPrompt = `Você é um especialista em CRO e copywriting.
Crie textos de CTA (Call-to-Action) otimizados para conversão.
${getTonePrompt(config.tone)}
${getGoalPrompt(config.goal)}

Responda APENAS com um array JSON válido.`

  const userPrompt = `Crie 5 sugestões de texto para botão CTA com diferentes níveis de urgência.

Contexto:
- Tipo de seção: ${context.sectionType}
- Headline: ${context.headline || 'Não informado'}
- Descrição: ${context.description || 'Não informado'}
- Texto atual: ${context.buttonText || 'Não definido'}
${config.productName ? `- Produto: ${config.productName}` : ''}

Retorne um array JSON:
[
  { 
    "text": "Texto do botão",
    "urgency": "low|medium|high",
    "reasoning": "Por que este CTA funciona"
  },
  ...
]`

  const response = await callOpenRouter(systemPrompt, userPrompt, model)
  
  let suggestions: Array<{ text: string; urgency: string; reasoning: string }> = []
  try {
    const jsonMatch = response.content.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      suggestions = JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error('Failed to parse CTAs:', e)
  }
  
  return { suggestions, usage: response.usage }
}

async function generateSEO(
  lpName: string,
  content: string,
  config: LPConfig,
  model: string
): Promise<{ title: string; description: string; keywords: string[]; usage: unknown }> {
  const systemPrompt = `Você é um especialista em SEO para landing pages.
Crie meta title, description e palavras-chave otimizadas.
Foco em CTR e relevância para buscadores.

Responda APENAS com um objeto JSON válido.`

  const userPrompt = `Crie metadados SEO para a seguinte landing page:

Nome da LP: ${lpName}
Conteúdo: ${content.slice(0, 2000)}
${config.keywords?.length ? `Palavras-chave sugeridas: ${config.keywords.join(', ')}` : ''}

Retorne um JSON:
{
  "title": "Título SEO (máx 60 caracteres, incluir palavra-chave principal)",
  "description": "Meta description persuasiva (máx 160 caracteres, incluir CTA implícito)",
  "keywords": ["palavra-chave1", "palavra-chave2", ...]
}`

  const response = await callOpenRouter(systemPrompt, userPrompt, model)
  
  let result = {
    title: '',
    description: '',
    keywords: [] as string[],
    usage: response.usage,
  }
  
  try {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      result.title = parsed.title || ''
      result.description = parsed.description || ''
      result.keywords = parsed.keywords || []
    }
  } catch (e) {
    console.error('Failed to parse SEO:', e)
  }
  
  return result
}

async function optimizeConversion(
  sections: Array<{ id: string; type: string; content: Record<string, unknown> }>,
  config: LPConfig,
  model: string
): Promise<{ 
  suggestions: Array<{ 
    section: string
    current: string
    suggested: string
    reasoning: string
    impact: string 
  }>
  usage: unknown 
}> {
  const systemPrompt = `Você é um especialista em Conversion Rate Optimization (CRO).
Analise landing pages e sugira melhorias para aumentar conversão.
${getTonePrompt(config.tone)}
${getGoalPrompt(config.goal)}

Responda APENAS com um objeto JSON válido.`

  const userPrompt = `Analise as seguintes seções de uma landing page e sugira melhorias para aumentar a conversão:

Seções:
${JSON.stringify(sections, null, 2)}

Para cada seção, identifique oportunidades de melhoria considerando:
- Clareza do valor proposition
- Urgência e escassez
- Prova social
- Call-to-action
- Remoção de atrito

Retorne um JSON:
{
  "suggestions": [
    {
      "section": "ID ou tipo da seção",
      "current": "Texto ou elemento atual",
      "suggested": "Sugestão de melhoria",
      "reasoning": "Por que esta mudança ajuda na conversão",
      "impact": "low|medium|high"
    },
    ...
  ]
}`

  const response = await callOpenRouter(systemPrompt, userPrompt, model)
  
  let result = {
    suggestions: [] as Array<{
      section: string
      current: string
      suggested: string
      reasoning: string
      impact: string
    }>,
    usage: response.usage,
  }
  
  try {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      result.suggestions = parsed.suggestions || []
    }
  } catch (e) {
    console.error('Failed to parse optimization:', e)
  }
  
  return result
}

// ============================================================================
// OpenRouter API Call
// ============================================================================

async function callOpenRouter(
  systemPrompt: string,
  userPrompt: string,
  model: string,
  maxTokens: number = 4096
): Promise<{ content: string; usage: { prompt: number; completion: number; total: number } }> {
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
      'HTTP-Referer': Deno.env.get('OPENROUTER_HTTP_REFERER') || 'https://empire.com.br',
      'X-Title': Deno.env.get('OPENROUTER_X_TITLE') || 'Empire Site',
    },
    body: JSON.stringify({
      model: model || Deno.env.get('OPENROUTER_DEFAULT_MODEL') || 'anthropic/claude-sonnet-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenRouter error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  
  return {
    content: data.choices?.[0]?.message?.content || '',
    usage: {
      prompt: data.usage?.prompt_tokens || 0,
      completion: data.usage?.completion_tokens || 0,
      total: (data.usage?.prompt_tokens || 0) + (data.usage?.completion_tokens || 0),
    },
  }
}

// ============================================================================
// Main Handler
// ============================================================================

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
    const model = body.model || Deno.env.get('OPENROUTER_DEFAULT_MODEL') || 'anthropic/claude-sonnet-4'
    
    let result: unknown
    
    switch (body.action) {
      case 'generate_titles':
        result = await generateTitles(body.config, model)
        break
        
      case 'generate_section':
        result = await generateSection(body.sectionType!, body.config, body.context, model)
        break
        
      case 'generate_full_lp':
        result = await generateFullLP(body.sections || ['hero', 'features', 'cta'], body.config, model)
        break
        
      case 'generate_headlines':
        result = await generateHeadlines(body.baseHeadline!, body.count || 5, body.config, model)
        break
        
      case 'generate_ctas':
        result = await generateCTAs(
          { sectionType: '', buttonText: '', headline: '', description: '' },
          body.config,
          model
        )
        break
        
      case 'generate_seo':
        result = await generateSEO(body.lpName!, body.content || '', body.config, model)
        break
        
      case 'optimize_conversion':
        result = await optimizeConversion([], body.config, model)
        break
        
      default:
        throw new Error(`Unknown action: ${body.action}`)
    }
    
    // Log generation
    await supabaseClient.from('ai_generation_logs').insert({
      model,
      prompt: JSON.stringify(body).substring(0, 500),
      input_tokens: (result as { usage?: { prompt: number } }).usage?.prompt,
      output_tokens: (result as { usage?: { completion: number } }).usage?.completion,
      source_type: 'lp_generator',
      created_by: user.id,
    }).catch(() => { /* Ignore logging errors */ })

    return new Response(
      JSON.stringify(result),
      { headers: { ...headers, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in ai-lp-generate:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
    )
  }
})

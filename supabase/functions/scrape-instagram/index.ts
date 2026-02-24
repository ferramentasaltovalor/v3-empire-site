import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const APIFY_API_URL = 'https://api.apify.com/v2'

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

        const { url } = await req.json()

        if (!url) {
            return new Response(
                JSON.stringify({ error: 'URL is required' }),
                { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
            )
        }

        // Extract post ID from URL
        const postMatch = url.match(/instagram\.com\/p\/([^/]+)/)
        if (!postMatch) {
            return new Response(
                JSON.stringify({ error: 'Invalid Instagram post URL' }),
                { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
            )
        }

        const postId = postMatch[1]
        const apifyToken = Deno.env.get('APIFY_API_KEY')

        // Run Apify Instagram scraper
        const runResponse = await fetch(
            `${APIFY_API_URL}/acts/apify~instagram-post-scraper/run-sync-get-dataset-items`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apifyToken}`,
                },
                body: JSON.stringify({
                    postUrls: [url],
                }),
            }
        )

        if (!runResponse.ok) {
            throw new Error(`Apify error: ${runResponse.status}`)
        }

        const items = await runResponse.json()
        const post = items[0]

        if (!post) {
            return new Response(
                JSON.stringify({ error: 'Post not found' }),
                { status: 404, headers: { ...headers, 'Content-Type': 'application/json' } }
            )
        }

        // Return structured data
        return new Response(
            JSON.stringify({
                id: post.id || postId,
                caption: post.caption || '',
                hashtags: post.hashtags || [],
                mentions: post.mentions || [],
                imageUrl: post.displayUrl || post.imageUrl,
                likes: post.likesCount || 0,
                comments: post.commentsCount || 0,
                timestamp: post.timestamp,
                ownerUsername: post.ownerUsername || '',
                url: url,
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

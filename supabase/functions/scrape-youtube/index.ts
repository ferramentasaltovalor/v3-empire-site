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

        // Extract video ID from URL
        const videoMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&/]+)/)
        if (!videoMatch) {
            return new Response(
                JSON.stringify({ error: 'Invalid YouTube URL' }),
                { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
            )
        }

        const videoId = videoMatch[1]
        const apifyToken = Deno.env.get('APIFY_API_KEY')

        // Run Apify YouTube transcript scraper
        const runResponse = await fetch(
            `${APIFY_API_URL}/acts/handlebar~youtube-transcript-scraper/run-sync-get-dataset-items`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apifyToken}`,
                },
                body: JSON.stringify({
                    videoIds: [videoId],
                }),
            }
        )

        if (!runResponse.ok) {
            throw new Error(`Apify error: ${runResponse.status}`)
        }

        const items = await runResponse.json()
        const video = items[0]

        if (!video) {
            return new Response(
                JSON.stringify({ error: 'Video transcript not found' }),
                { status: 404, headers: { ...headers, 'Content-Type': 'application/json' } }
            )
        }

        // Combine transcript parts
        const transcript = video.transcript
            ?.map((part: { text: string }) => part.text)
            ?.join(' ') || ''

        return new Response(
            JSON.stringify({
                id: videoId,
                title: video.title || '',
                description: video.description || '',
                transcript,
                duration: video.duration || 0,
                channelName: video.channelName || '',
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

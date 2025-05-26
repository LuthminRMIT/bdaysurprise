
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { code, action } = await req.json()

    if (action === 'getAccessToken') {
      const clientId = Deno.env.get('SPOTIFY_CLIENT_ID')
      const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET')
      
      // Use the playlist page as redirect URI
      const redirectUri = 'https://e0f709b7-f7a0-4e02-be85-4c766ae389db.lovableproject.com/playlist'
      
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
        },
        body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}`
      })

      const tokenData = await response.json()
      console.log('Spotify token response:', tokenData)
      
      return new Response(JSON.stringify(tokenData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'getAuthUrl') {
      const clientId = Deno.env.get('SPOTIFY_CLIENT_ID')
      const redirectUri = 'https://e0f709b7-f7a0-4e02-be85-4c766ae389db.lovableproject.com/playlist'
      const scopes = 'playlist-modify-public playlist-modify-private user-read-private'
      
      const authUrl = `https://accounts.spotify.com/authorize?` +
        `client_id=${clientId}&` +
        `response_type=code&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(scopes)}`

      return new Response(JSON.stringify({ authUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response('Invalid action', { status: 400, headers: corsHeaders })
  } catch (error) {
    console.error('Spotify auth error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

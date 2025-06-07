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
    console.log('Spotify auth request:', { action, code: code ? 'provided' : 'missing' })

    if (action === 'getAuthUrl') {
      const clientId = Deno.env.get('SPOTIFY_CLIENT_ID')
      if (!clientId) {
        console.error('SPOTIFY_CLIENT_ID not configured')
        return new Response(JSON.stringify({ error: 'Spotify client ID not configured' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Use your actual Vercel deployment URL
      const redirectUri = 'https://bdaysurprise-git-main-luthminrmits-projects.vercel.app/playlist'
      const scopes = 'playlist-modify-public playlist-modify-private user-read-private'
      
      const authUrl = `https://accounts.spotify.com/authorize?` +
        `client_id=${clientId}&` +
        `response_type=code&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(scopes)}&` +
        `state=spotify_auth`

      console.log('Generated auth URL:', authUrl)
      console.log('Redirect URI:', redirectUri)

      return new Response(JSON.stringify({ authUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'getAccessToken') {
      const clientId = Deno.env.get('SPOTIFY_CLIENT_ID')
      const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET')
      
      if (!clientId || !clientSecret) {
        console.error('Spotify credentials not configured')
        return new Response(JSON.stringify({ error: 'Spotify credentials not configured' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      if (!code) {
        console.error('Authorization code missing')
        return new Response(JSON.stringify({ error: 'Authorization code missing' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      // Use the same Vercel URL for token exchange
      const redirectUri = 'https://bdaysurprise-git-main-luthminrmits-projects.vercel.app/playlist'
      
      console.log('Exchanging code for token with redirect URI:', redirectUri)
      
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
        },
        body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}`
      })

      const tokenData = await response.json()
      console.log('Spotify token response status:', response.status)
      console.log('Spotify token response:', tokenData)
      
      if (!response.ok) {
        console.error('Spotify token exchange failed:', tokenData)
        return new Response(JSON.stringify({ 
          error: 'Token exchange failed', 
          details: tokenData 
        }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      return new Response(JSON.stringify(tokenData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { 
      status: 400, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  } catch (error) {
    console.error('Spotify auth error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error', 
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
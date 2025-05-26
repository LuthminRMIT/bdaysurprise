
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

    const { action, accessToken, query, playlistId, trackIds, name, description } = await req.json()

    const spotifyHeaders = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }

    if (action === 'searchTracks') {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`,
        { headers: spotifyHeaders }
      )
      const data = await response.json()
      console.log('Spotify search response:', data)
      
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'createPlaylist') {
      const userResponse = await fetch('https://api.spotify.com/v1/me', {
        headers: spotifyHeaders
      })
      const userData = await userResponse.json()
      
      const playlistResponse = await fetch(
        `https://api.spotify.com/v1/users/${userData.id}/playlists`,
        {
          method: 'POST',
          headers: spotifyHeaders,
          body: JSON.stringify({
            name,
            description,
            public: false
          })
        }
      )
      const playlistData = await playlistResponse.json()
      console.log('Created playlist:', playlistData)
      
      return new Response(JSON.stringify(playlistData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'addTracksToPlaylist') {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          method: 'POST',
          headers: spotifyHeaders,
          body: JSON.stringify({
            uris: trackIds.map((id: string) => `spotify:track:${id}`)
          })
        }
      )
      const data = await response.json()
      console.log('Added tracks to playlist:', data)
      
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response('Invalid action', { status: 400, headers: corsHeaders })
  } catch (error) {
    console.error('Spotify API error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

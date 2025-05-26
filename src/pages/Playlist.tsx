
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import SearchResults from '@/components/SearchResults';
import PlaylistManager from '@/components/PlaylistManager';
import { Heart, Music, Search, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Playlist = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    // Check for auth code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    
    console.log('URL params:', { code: code ? 'present' : 'missing', state, error });
    
    if (error) {
      console.error('Spotify auth error from URL:', error);
      setError(`Spotify authorization failed: ${error}`);
      toast.error(`Spotify authorization failed: ${error}`);
      // Clear the URL parameters
      window.history.replaceState({}, document.title, '/playlist');
      return;
    }
    
    if (code && state === 'spotify_auth' && !accessToken) {
      console.log('Found auth code, attempting to exchange for token');
      handleSpotifyCallback(code);
    }
  }, [accessToken]);

  const handleSpotifyCallback = async (code: string) => {
    try {
      setIsAuthenticating(true);
      setError(null);
      console.log('Exchanging code for access token...');
      
      const { data, error } = await supabase.functions.invoke('spotify-auth', {
        body: { code, action: 'getAccessToken' }
      });

      console.log('Token exchange response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Function error: ${error.message}`);
      }
      
      if (data.error) {
        console.error('Spotify API error:', data);
        throw new Error(data.error + (data.details ? `: ${JSON.stringify(data.details)}` : ''));
      }
      
      if (data.access_token) {
        setAccessToken(data.access_token);
        console.log('Successfully authenticated with Spotify!');
        toast.success('Successfully connected to Spotify!');
        // Clear the URL parameters
        window.history.replaceState({}, document.title, '/playlist');
      } else {
        throw new Error('No access token received from Spotify');
      }
    } catch (error) {
      console.error('Error getting access token:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to connect to Spotify: ${errorMessage}`);
      toast.error(`Failed to connect to Spotify: ${errorMessage}`);
      // Clear the URL parameters even on error
      window.history.replaceState({}, document.title, '/playlist');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const authenticateSpotify = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Getting Spotify auth URL...');
      
      const { data, error } = await supabase.functions.invoke('spotify-auth', {
        body: { action: 'getAuthUrl' }
      });

      console.log('Auth URL response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Function error: ${error.message}`);
      }
      
      if (data.error) {
        console.error('Spotify auth URL error:', data);
        throw new Error(data.error);
      }
      
      if (data.authUrl) {
        console.log('Redirecting to Spotify auth:', data.authUrl);
        window.location.href = data.authUrl;
      } else {
        throw new Error('No auth URL received');
      }
    } catch (error) {
      console.error('Error getting auth URL:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to start Spotify authentication: ${errorMessage}`);
      toast.error(`Failed to start Spotify authentication: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const searchTracks = async () => {
    if (!searchQuery.trim() || !accessToken) return;

    try {
      setIsLoading(true);
      setError(null);
      console.log('Searching tracks:', searchQuery);
      
      const { data, error } = await supabase.functions.invoke('spotify-api', {
        body: {
          action: 'searchTracks',
          accessToken,
          query: searchQuery
        }
      });

      console.log('Search response:', { data, error });

      if (error) {
        console.error('Search error:', error);
        throw new Error(`Search failed: ${error.message}`);
      }
      
      if (data.error) {
        console.error('Spotify search error:', data);
        throw new Error(data.error.message || 'Search failed');
      }
      
      setSearchResults(data.tracks?.items || []);
      console.log('Search results:', data.tracks?.items?.length || 0, 'tracks');
    } catch (error) {
      console.error('Error searching tracks:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Search failed: ${errorMessage}`);
      toast.error(`Search failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const addToSelection = (track: any) => {
    if (!selectedTracks.find(t => t.id === track.id)) {
      setSelectedTracks([...selectedTracks, track]);
      toast.success(`Added "${track.name}" to selection`);
    }
  };

  const removeFromSelection = (trackId: string) => {
    setSelectedTracks(selectedTracks.filter(t => t.id !== trackId));
    toast.success('Removed track from selection');
  };

  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-kitty-lightPink via-kitty-softPink to-kitty-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <Loader2 className="h-8 w-8 mx-auto animate-spin text-kitty-pink mb-4" />
            <p className="text-gray-600">Connecting to Spotify...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-kitty-lightPink via-kitty-softPink to-kitty-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-kitty-pink">
              <Music className="h-6 w-6" />
              Connect to Spotify
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <p className="text-gray-600">
              Connect your Spotify account to create and manage playlists!
            </p>
            <Button 
              onClick={authenticateSpotify} 
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect Spotify'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kitty-lightPink via-kitty-softPink to-kitty-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-cute text-kitty-pink mb-2">Our Playlist 🎵</h1>
          <p className="text-kitty-red font-cute">Create beautiful playlists together!</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Search & Add</TabsTrigger>
            <TabsTrigger value="manage">Manage Playlists</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search for Songs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search for songs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchTracks()}
                  />
                  <Button onClick={searchTracks} disabled={isLoading || !searchQuery.trim()}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      'Search'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <SearchResults
              results={searchResults}
              selectedTracks={selectedTracks}
              onAddTrack={addToSelection}
              onRemoveTrack={removeFromSelection}
            />
          </TabsContent>

          <TabsContent value="manage">
            <PlaylistManager
              accessToken={accessToken}
              selectedTracks={selectedTracks}
              onClearSelection={() => setSelectedTracks([])}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Playlist;

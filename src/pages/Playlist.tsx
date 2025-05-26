
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SearchResults from '@/components/SearchResults';
import PlaylistManager from '@/components/PlaylistManager';
import { Heart, Music, Search } from 'lucide-react';

const Playlist = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for auth code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code && !accessToken) {
      handleSpotifyCallback(code);
    }
  }, [accessToken]);

  const handleSpotifyCallback = async (code: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('spotify-auth', {
        body: { code, action: 'getAccessToken' }
      });

      if (error) throw error;
      
      if (data.access_token) {
        setAccessToken(data.access_token);
        console.log('Successfully authenticated with Spotify!');
        // Clear the URL parameters
        window.history.replaceState({}, document.title, '/playlist');
      }
    } catch (error) {
      console.error('Error getting access token:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const authenticateSpotify = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('spotify-auth', {
        body: { action: 'getAuthUrl' }
      });

      if (error) throw error;
      
      window.location.href = data.authUrl;
    } catch (error) {
      console.error('Error getting auth URL:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchTracks = async () => {
    if (!searchQuery.trim() || !accessToken) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('spotify-api', {
        body: {
          action: 'searchTracks',
          accessToken,
          query: searchQuery
        }
      });

      if (error) throw error;
      
      setSearchResults(data.tracks?.items || []);
    } catch (error) {
      console.error('Error searching tracks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToSelection = (track: any) => {
    if (!selectedTracks.find(t => t.id === track.id)) {
      setSelectedTracks([...selectedTracks, track]);
    }
  };

  const removeFromSelection = (trackId: string) => {
    setSelectedTracks(selectedTracks.filter(t => t.id !== trackId));
  };

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
            <p className="text-gray-600">
              Connect your Spotify account to create and manage playlists!
            </p>
            <Button 
              onClick={authenticateSpotify} 
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              {isLoading ? 'Connecting...' : 'Connect Spotify'}
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
                  <Button onClick={searchTracks} disabled={isLoading}>
                    {isLoading ? 'Searching...' : 'Search'}
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

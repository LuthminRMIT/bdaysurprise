
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { Music, Plus, Save } from 'lucide-react';

interface PlaylistManagerProps {
  accessToken: string;
  selectedTracks: any[];
  onClearSelection: () => void;
}

const PlaylistManager: React.FC<PlaylistManagerProps> = ({
  accessToken,
  selectedTracks,
  onClearSelection
}) => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlaylists(data || []);
    } catch (error) {
      console.error('Error loading playlists:', error);
    }
  };

  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) return;

    try {
      setIsLoading(true);
      
      // Create playlist on Spotify
      const { data: spotifyData, error: spotifyError } = await supabase.functions.invoke('spotify-api', {
        body: {
          action: 'createPlaylist',
          accessToken,
          name: newPlaylistName,
          description: newPlaylistDescription
        }
      });

      if (spotifyError) throw spotifyError;

      // Save playlist to our database
      const { data, error } = await supabase
        .from('playlists')
        .insert([
          {
            name: newPlaylistName,
            description: newPlaylistDescription,
            spotify_id: spotifyData.id,
            image_url: spotifyData.images?.[0]?.url,
            total_tracks: 0
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Add selected tracks if any
      if (selectedTracks.length > 0) {
        await addTracksToPlaylist(data.id, spotifyData.id);
      }

      setNewPlaylistName('');
      setNewPlaylistDescription('');
      loadPlaylists();
      console.log('Playlist created successfully!');
    } catch (error) {
      console.error('Error creating playlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTracksToPlaylist = async (playlistDbId: string, spotifyPlaylistId: string) => {
    if (selectedTracks.length === 0) return;

    try {
      setIsLoading(true);

      // Add tracks to Spotify playlist
      const { error: spotifyError } = await supabase.functions.invoke('spotify-api', {
        body: {
          action: 'addTracksToPlaylist',
          accessToken,
          playlistId: spotifyPlaylistId,
          trackIds: selectedTracks.map(track => track.id)
        }
      });

      if (spotifyError) throw spotifyError;

      // Save tracks to our database
      const trackData = selectedTracks.map(track => ({
        playlist_id: playlistDbId,
        spotify_track_id: track.id,
        track_name: track.name,
        artist_name: track.artists.map((a: any) => a.name).join(', '),
        album_name: track.album.name,
        duration_ms: track.duration_ms,
        preview_url: track.preview_url,
        image_url: track.album.images?.[0]?.url
      }));

      const { error } = await supabase
        .from('playlist_tracks')
        .insert(trackData);

      if (error) throw error;

      // Update playlist track count
      await supabase
        .from('playlists')
        .update({ 
          total_tracks: selectedTracks.length,
          updated_at: new Date().toISOString()
        })
        .eq('id', playlistDbId);

      onClearSelection();
      loadPlaylists();
      console.log('Tracks added successfully!');
    } catch (error) {
      console.error('Error adding tracks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Playlist
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Playlist name..."
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
          />
          <Textarea
            placeholder="Playlist description (optional)..."
            value={newPlaylistDescription}
            onChange={(e) => setNewPlaylistDescription(e.target.value)}
          />
          {selectedTracks.length > 0 && (
            <div className="p-3 bg-kitty-lightPink rounded-lg">
              <p className="text-sm font-medium">
                Will add {selectedTracks.length} selected tracks to this playlist
              </p>
            </div>
          )}
          <Button
            onClick={createPlaylist}
            disabled={!newPlaylistName.trim() || isLoading}
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Creating...' : 'Create Playlist'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Playlists</CardTitle>
        </CardHeader>
        <CardContent>
          {playlists.length === 0 ? (
            <div className="text-center py-8">
              <Music className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No playlists yet. Create your first one!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {playlists.map((playlist) => (
                <div key={playlist.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    {playlist.image_url ? (
                      <img
                        src={playlist.image_url}
                        alt={playlist.name}
                        className="w-16 h-16 rounded object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <Music className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{playlist.name}</h3>
                      {playlist.description && (
                        <p className="text-sm text-gray-600">{playlist.description}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        {playlist.total_tracks} tracks • Created {new Date(playlist.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {selectedTracks.length > 0 && (
                    <Button
                      size="sm"
                      onClick={() => addTracksToPlaylist(playlist.id, playlist.spotify_id)}
                      disabled={isLoading}
                    >
                      Add {selectedTracks.length} tracks
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaylistManager;

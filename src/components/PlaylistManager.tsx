import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { Music, Plus, Save, Play } from 'lucide-react';
import { toast } from 'sonner';

interface PlaylistManagerProps {
  accessToken: string;
  selectedTracks: any[];
  onClearSelection: () => void;
  onPlayTrack?: (track: any, trackList?: any[]) => void;
}

const PlaylistManager: React.FC<PlaylistManagerProps> = ({
  accessToken,
  selectedTracks,
  onClearSelection,
  onPlayTrack
}) => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
  const [playlistTracks, setPlaylistTracks] = useState<any[]>([]);
  const [isTracksLoading, setIsTracksLoading] = useState(false);

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
      toast.error('Failed to load playlists');
    }
  };

  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) return;

    try {
      setIsLoading(true);
      
      const { data: spotifyData, error: spotifyError } = await supabase.functions.invoke('spotify-api', {
        body: {
          action: 'createPlaylist',
          accessToken,
          name: newPlaylistName,
          description: newPlaylistDescription
        }
      });

      if (spotifyError) throw spotifyError;

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

      if (selectedTracks.length > 0) {
        await addTracksToPlaylist(data.id, spotifyData.id);
      }

      setNewPlaylistName('');
      setNewPlaylistDescription('');
      loadPlaylists();
      toast.success('Playlist created successfully!');
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast.error('Failed to create playlist');
    } finally {
      setIsLoading(false);
    }
  };

  const addTracksToPlaylist = async (playlistDbId: string, spotifyPlaylistId: string) => {
    if (selectedTracks.length === 0) return;

    try {
      setIsLoading(true);

      const { error: spotifyError } = await supabase.functions.invoke('spotify-api', {
        body: {
          action: 'addTracksToPlaylist',
          accessToken,
          playlistId: spotifyPlaylistId,
          trackIds: selectedTracks.map(track => track.id)
        }
      });

      if (spotifyError) throw spotifyError;

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

      await supabase
        .from('playlists')
        .update({ 
          total_tracks: selectedTracks.length,
          updated_at: new Date().toISOString()
        })
        .eq('id', playlistDbId);

      onClearSelection();
      loadPlaylists();
      toast.success('Tracks added successfully!');
    } catch (error) {
      console.error('Error adding tracks:', error);
      toast.error('Failed to add tracks');
    } finally {
      setIsLoading(false);
    }
  };

  const playSelectedTracks = () => {
    if (selectedTracks.length > 0 && onPlayTrack) {
      onPlayTrack(selectedTracks[0], selectedTracks);
      toast.success(`Playing ${selectedTracks.length} selected tracks`);
    }
  };

  const fetchPlaylistTracks = async (playlistId: string) => {
    setIsTracksLoading(true);
    setActivePlaylistId(playlistId);
    try {
      const { data, error } = await supabase
        .from('playlist_tracks')
        .select('*')
        .eq('playlist_id', playlistId)
        .order('added_at', { ascending: true });
      if (error) throw error;
      setPlaylistTracks(data || []);
    } catch (error) {
      toast.error('Failed to load playlist tracks');
      setPlaylistTracks([]);
    } finally {
      setIsTracksLoading(false);
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
            <div className="p-3 bg-kitty-lightPink rounded-lg space-y-2">
              <p className="text-sm font-medium">
                Will add {selectedTracks.length} selected tracks to this playlist
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={playSelectedTracks}
                className="w-full"
              >
                <Play className="h-4 w-4 mr-2" />
                Play Selected Tracks
              </Button>
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
                <div key={playlist.id} className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 justify-between cursor-pointer" onClick={() => fetchPlaylistTracks(playlist.id)}>
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
                    <Button size="icon" variant="ghost" onClick={e => { e.stopPropagation(); fetchPlaylistTracks(playlist.id); }}>
                      <Play className="h-5 w-5" />
                    </Button>
                  </div>
                  {activePlaylistId === playlist.id && (
                    <div className="mt-2 bg-gray-50 rounded p-2">
                      {isTracksLoading ? (
                        <div className="text-center text-gray-500">Loading tracks...</div>
                      ) : playlistTracks.length === 0 ? (
                        <div className="text-center text-gray-500">No tracks in this playlist.</div>
                      ) : (
                        <div className="space-y-2">
                          {playlistTracks.map((track, idx) => (
                            <div key={track.id} className="flex items-center gap-3 justify-between p-2 rounded hover:bg-gray-100">
                              <div className="flex items-center gap-3">
                                {track.image_url && (
                                  <img src={track.image_url} alt={track.track_name} className="w-10 h-10 rounded object-cover" />
                                )}
                                <div>
                                  <div className="font-medium">{track.track_name}</div>
                                  <div className="text-xs text-gray-500">{track.artist_name}</div>
                                </div>
                              </div>
                              {track.preview_url && onPlayTrack && (
                                <Button size="icon" variant="outline" onClick={() => onPlayTrack(track, playlistTracks)}>
                                  <Play className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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

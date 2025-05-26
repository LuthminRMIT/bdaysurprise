
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Music, Play } from 'lucide-react';

interface SearchResultsProps {
  results: any[];
  selectedTracks: any[];
  onAddTrack: (track: any) => void;
  onRemoveTrack: (trackId: string) => void;
  onPlayTrack?: (track: any, trackList?: any[]) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  selectedTracks,
  onAddTrack,
  onRemoveTrack,
  onPlayTrack
}) => {
  const isTrackSelected = (trackId: string) => {
    return selectedTracks.some(track => track.id === trackId);
  };

  const handlePlayTrack = (track: any) => {
    if (onPlayTrack) {
      onPlayTrack(track, results);
    }
  };

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Music className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Search for songs to add to your playlist!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">Search Results</h3>
        <div className="space-y-3">
          {results.map((track) => (
            <div key={track.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3 flex-1">
                {track.album.images[0] && (
                  <img
                    src={track.album.images[0].url}
                    alt={track.album.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{track.name}</p>
                  <p className="text-sm text-gray-600">{track.artists.map((a: any) => a.name).join(', ')}</p>
                  <p className="text-xs text-gray-500">{track.album.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {track.preview_url && onPlayTrack && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePlayTrack(track)}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant={isTrackSelected(track.id) ? "destructive" : "default"}
                  onClick={() => isTrackSelected(track.id) ? onRemoveTrack(track.id) : onAddTrack(track)}
                >
                  {isTrackSelected(track.id) ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {selectedTracks.length > 0 && (
          <div className="mt-6 p-4 bg-kitty-lightPink rounded-lg">
            <h4 className="font-medium mb-2">Selected Tracks ({selectedTracks.length})</h4>
            <div className="flex flex-wrap gap-2">
              {selectedTracks.map((track) => (
                <span key={track.id} className="bg-white px-2 py-1 rounded text-sm">
                  {track.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchResults;

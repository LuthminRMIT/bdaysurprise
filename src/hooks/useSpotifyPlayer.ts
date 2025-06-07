import { useEffect, useRef, useState, useCallback } from 'react';

interface SpotifyPlayerState {
  deviceId: string | null;
  isReady: boolean;
  isPlaying: boolean;
  track: any | null;
  error: string | null;
}

declare global {
  interface Window {
    Spotify: any;
    onSpotifyWebPlaybackSDKReady?: () => void;
  }
}

export function useSpotifyPlayer(accessToken: string | null) {
  const [state, setState] = useState<SpotifyPlayerState>({
    deviceId: null,
    isReady: false,
    isPlaying: false,
    track: null,
    error: null,
  });
  const playerRef = useRef<any>(null);

  // Load the Spotify Web Playback SDK script
  useEffect(() => {
    if (window.Spotify) return;
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Initialize the player
  useEffect(() => {
    if (!accessToken) return;
    const onSpotifyWebPlaybackSDKReady = () => {
      if (playerRef.current) return;
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK Player',
        getOAuthToken: (cb: any) => { cb(accessToken); },
        volume: 0.5,
      });
      playerRef.current = player;

      player.addListener('ready', ({ device_id }: any) => {
        setState((s) => ({ ...s, deviceId: device_id, isReady: true }));
      });
      player.addListener('not_ready', () => {
        setState((s) => ({ ...s, isReady: false }));
      });
      player.addListener('player_state_changed', (playerState: any) => {
        setState((s) => ({
          ...s,
          isPlaying: !!playerState && !playerState.paused,
          track: playerState?.track_window?.current_track || null,
        }));
      });
      player.addListener('initialization_error', ({ message }: any) => {
        setState((s) => ({ ...s, error: message }));
      });
      player.addListener('authentication_error', ({ message }: any) => {
        setState((s) => ({ ...s, error: message }));
      });
      player.addListener('account_error', ({ message }: any) => {
        setState((s) => ({ ...s, error: message }));
      });
      player.connect();
    };
    // @ts-ignore
    window.onSpotifyWebPlaybackSDKReady = onSpotifyWebPlaybackSDKReady;
    if (window.Spotify) onSpotifyWebPlaybackSDKReady();
  }, [accessToken]);

  // Playback controls
  const play = useCallback(async (uris: string[] | string) => {
    if (!state.deviceId || !accessToken) return;
    await fetch('https://api.spotify.com/v1/me/player/play?device_id=' + state.deviceId, {
      method: 'PUT',
      body: JSON.stringify({ uris: Array.isArray(uris) ? uris : [uris] }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }, [state.deviceId, accessToken]);

  const pause = useCallback(() => {
    playerRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    playerRef.current?.resume();
  }, []);

  const next = useCallback(() => {
    playerRef.current?.nextTrack();
  }, []);

  const previous = useCallback(() => {
    playerRef.current?.previousTrack();
  }, []);

  return {
    ...state,
    play,
    pause,
    resume,
    next,
    previous,
    player: playerRef.current,
  };
} 
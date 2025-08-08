import axios from 'axios';
import { basicHeaders } from './axiosHelpers';
import { TokenData } from './UserInfoUtils';
import { SpotifyTrack } from './TopListeningDataUtils';

export interface SpotifyPlaylistTrackItem {
  added_at: string;
  added_by: {
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  is_local: boolean;
  primary_color: string | null;
  track: SpotifyTrack;
  video_thumbnail: {
    url: string | null;
  };
}

export interface SpotifyPlaylistTracksResponse {
  href: string;
  items: SpotifyPlaylistTrackItem[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

export interface ReplaceTracksRequest {
  uris: string[];
}

/**
 * URL to get a playlist's tracks
 * @param playlistId ID of the requested playlist
 * @returns The playlist's url
 */
export const playlistTracksUrl = (playlistId: string): string => {
  return `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
};

/**
 * Calls Spotify's API to get the current tracks of a playlist
 * @param retrievedTokenData object containing tokens necessary for header
 * @param playlistId ID of the requested playlist
 * @returns The response data
 */
export const getPlaylistTracksById = async (
  retrievedTokenData: TokenData,
  playlistId: string
): Promise<SpotifyPlaylistTracksResponse | undefined> => {
  const headers = basicHeaders(retrievedTokenData);

  try {
    const response = await axios.get<SpotifyPlaylistTracksResponse>(
      playlistTracksUrl(playlistId),
      headers
    );
    return response.data;
  } catch (error) {
    console.error('Error getting playlist tracks:', error);
    return undefined;
  }
};

/**
 * Calls Spotify's API to replace the current tracks of a playlist
 * @param retrievedTokenData object containing tokens necessary for header
 * @param playlistId ID of the requested playlist
 * @param trackUris Array of track URIs to set as the playlist content
 * @returns The response data
 */
export const replacePlaylistTracks = async (
  retrievedTokenData: TokenData,
  playlistId: string,
  trackUris: string[]
): Promise<{ snapshot_id: string } | undefined> => {
  const headers = basicHeaders(retrievedTokenData);
  const data: ReplaceTracksRequest = { uris: trackUris };

  try {
    const response = await axios.put<{ snapshot_id: string }>(
      playlistTracksUrl(playlistId),
      data,
      headers
    );
    return response.data;
  } catch (error) {
    console.error('Error replacing playlist tracks:', error);
    return undefined;
  }
};

/**
 * Transforms the output of the track items list to get a list of uris
 * @param trackList list of "items" in the response object
 * @returns The list of track uris
 */
export const getURIsFromList = (trackList: SpotifyPlaylistTrackItem[]): string[] => {
  return trackList.map(trackItem => {
    // a playlist track object has a track object within
    return trackItem.track.uri;
  });
};

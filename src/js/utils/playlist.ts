import axios, { AxiosResponse } from 'axios';
import { basicHeaders } from './axiosHelpers';
import { TokenData } from './UserInfoUtils';

export const limitQueryParam = 50;

export interface SpotifyPlaylist {
  collaborative: boolean;
  description: string | null;
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  href: string;
  id: string;
  images: Array<{
    height: number | null;
    url: string;
    width: number | null;
  }>;
  name: string;
  owner: {
    display_name: string;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  primary_color: string | null;
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  type: string;
  uri: string;
}

export interface SpotifyPlaylistsResponse {
  href: string;
  items: SpotifyPlaylist[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

export interface CreatePlaylistRequest {
  name: string;
  description: string;
  public?: boolean;
}

/**
 * URL to create a playlist
 * @param userId ID of the user
 * @returns The user's playlists url
 */
export const createPlaylistUrl = (userId: string): string => {
  return `https://api.spotify.com/v1/users/${userId}/playlists`;
};

/**
 * Calls Spotify's API to create a new Goldify playlist
 * @param retrievedTokenData object containing tokens necessary for header
 * @param userId ID of the user
 * @param playlistName name of the Playlist to create
 * @param playlistDescription description of the desired playlist
 * @returns The response data
 */
export const createGoldifyPlaylist = async (
  retrievedTokenData: TokenData,
  userId: string,
  playlistName: string,
  playlistDescription: string
): Promise<SpotifyPlaylist | undefined> => {
  const headers = basicHeaders(retrievedTokenData);
  const data: CreatePlaylistRequest = { 
    name: playlistName, 
    description: playlistDescription 
  };

  try {
    const response = await axios.post<SpotifyPlaylist>(
      createPlaylistUrl(userId), 
      data, 
      headers
    );
    return response.data;
  } catch (error) {
    console.error('Error creating playlist:', error);
    return undefined;
  }
};

/**
 * URL to get a list of the user's playlists
 * @returns The logged-in user's playlists url
 */
export const getUserPlaylistsUrl = (): string => {
  return `https://api.spotify.com/v1/me/playlists?limit=${limitQueryParam}`;
};

/**
 * Calls Spotify's API to see if the user already has a Goldify playlist
 * @param retrievedTokenData object containing tokens necessary for header
 * @param playlistName name of the Playlist to create
 * @returns The Goldify playlist, if it exists, null otherwise
 */
export const findExistingGoldifyPlaylistByName = async (
  retrievedTokenData: TokenData,
  playlistName: string
): Promise<SpotifyPlaylist | null> => {
  const headers = basicHeaders(retrievedTokenData);
  try {
    let url: string | null = getUserPlaylistsUrl();
    while (url) {
      const response: AxiosResponse<SpotifyPlaylistsResponse> = await axios.get(url, headers);
      const playlists = response.data.items;
      const playlistFound = playlists.find((playlist: SpotifyPlaylist) => playlist.name === playlistName);
      if (playlistFound) {
        return playlistFound;
      }
      url = response.data.next;
    }
    return null;
  } catch (error) {
    console.error('Error finding existing playlist:', error);
    return null;
  }
};

/**
 * URL to get a playlist by ID
 * @param playlistId ID of the playlist
 * @returns The playlist url
 */
export const getPlaylistUrl = (playlistId: string): string => {
  return `https://api.spotify.com/v1/playlists/${playlistId}`;
};

/**
 * Calls Spotify's API to get a playlist by ID
 * @param retrievedTokenData object containing tokens necessary for header
 * @param playlistId ID of the playlist
 * @returns The response data
 */
export const getPlaylistById = async (
  retrievedTokenData: TokenData, 
  playlistId: string
): Promise<SpotifyPlaylist | undefined> => {
  const headers = basicHeaders(retrievedTokenData);
  try {
    const response = await axios.get<SpotifyPlaylist>(
      getPlaylistUrl(playlistId), 
      headers
    );
    return response.data;
  } catch (error) {
    console.error('Error getting playlist by ID:', error);
    return undefined;
  }
};

/**
 * URL to upload a playlist cover image
 * @param playlistId ID of the playlist
 * @returns The playlist url
 */
export const uploadPlaylistImageUrl = (playlistId: string): string => {
  return `https://api.spotify.com/v1/playlists/${playlistId}/images`;
};

/**
 * Calls Spotify's API to add a cover image to a playlist
 * @param retrievedTokenData object containing tokens necessary for header
 * @param playlistId ID of the playlist
 * @param imageBase64 base64 encoded string for the jpeg to be uploaded
 * @returns The response data
 */
export const uploadPlaylistImage = async (
  retrievedTokenData: TokenData,
  playlistId: string,
  imageBase64: string
): Promise<AxiosResponse | undefined> => {
  const headers = {
    headers: {
      Authorization: `Bearer ${retrievedTokenData.access_token}`,
      'Content-Type': 'image/jpeg',
    },
  };

  try {
    const response = await axios.put(
      uploadPlaylistImageUrl(playlistId),
      imageBase64,
      headers
    );
    if (response.status === 202) {
      return response;
    }
    throw new Error('Spotify did not accept the image uploaded');
  } catch (error) {
    console.error('Error uploading playlist image:', error);
    return undefined;
  }
}; 
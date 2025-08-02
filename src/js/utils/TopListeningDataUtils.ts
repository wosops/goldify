import axios from 'axios';
import { basicHeaders } from './axiosHelpers';
import { TokenData } from './UserInfoUtils';

export const shortTermTimeRangeQueryParam = 'short_term';
export const mediumTermTimeRangeQueryParam = 'medium_term';
export const longTermTimeRangeQueryParam = 'long_term';
export const limitQueryParam = '20';
export const offsetQueryParam = '0';

export interface SpotifyArtist {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface SpotifyAlbum {
  album_type: string;
  artists: SpotifyArtist[];
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: Array<{
    height: number;
    url: string;
    width: number;
  }>;
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

export interface SpotifyTrack {
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc: string;
  };
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: string;
  uri: string;
}

export interface SpotifyTopTracksResponse {
  href: string;
  items: SpotifyTrack[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

export interface TopListeningData {
  short_term: SpotifyTopTracksResponse;
  medium_term: SpotifyTopTracksResponse;
  long_term: SpotifyTopTracksResponse;
}

/**
 * Generates a URL to get the user's top listening data
 * @param timeRangeQueryParam The term of user listening data we're looking for
 * @returns URL to get a users listening data
 */
export const getTopListeningDataSpotifyApiURL = (timeRangeQueryParam: string): string => {
  return (
    'https://api.spotify.com/v1/me/top/tracks' +
    '?time_range=' +
    timeRangeQueryParam +
    '&limit=' +
    limitQueryParam +
    '&offset=' +
    offsetQueryParam
  );
};

/**
 * Gets the user's top listening data over all three listening time ranges
 * @param retrievedTokenData Object containing the user's access token
 * @returns Contains the user's top listening data over all three time ranges
 */
export const retrieveTopListeningDataAxios = async (
  retrievedTokenData: TokenData
): Promise<TopListeningData | undefined> => {
  const headers = basicHeaders(retrievedTokenData);
  try {
    const [shortTermResponse, mediumTermResponse, longTermResponse] = await Promise.all([
      axios.get<SpotifyTopTracksResponse>(
        getTopListeningDataSpotifyApiURL(shortTermTimeRangeQueryParam),
        headers
      ),
      axios.get<SpotifyTopTracksResponse>(
        getTopListeningDataSpotifyApiURL(mediumTermTimeRangeQueryParam),
        headers
      ),
      axios.get<SpotifyTopTracksResponse>(
        getTopListeningDataSpotifyApiURL(longTermTimeRangeQueryParam),
        headers
      ),
    ]);

    return {
      short_term: shortTermResponse.data,
      medium_term: mediumTermResponse.data,
      long_term: longTermResponse.data,
    };
  } catch (error) {
    console.error('Error retrieving top listening data:', error);
    return undefined;
  }
}; 
import { httpGet, isHttpError } from './http';

export interface SpotifyImage {
  url: string;
  height?: number;
  width?: number;
}

export interface SpotifyExternalUrls {
  spotify: string;
}

export interface SpotifyFollowers {
  href?: string;
  total: number;
}

export interface SpotifyUser {
  country?: string;
  display_name: string;
  email?: string;
  explicit_content?: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: SpotifyExternalUrls;
  followers: SpotifyFollowers;
  href: string;
  id: string;
  images: SpotifyImage[];
  product?: string;
  type: string;
  uri: string;
  error?: string;
}

export interface TokenData {
  access_token: string;
  token_type: string;
  scope?: string; // The scopes that were actually granted
  expires_in?: number;
  refresh_token?: string;
  error?: string;
}

/**
 * Retrieves the user's Spotify profile data using the provided token
 * @param tokenData The token data object containing access token
 * @returns Promise resolving to user profile data
 */
export const retrieveUserDataAxios = async (tokenData: TokenData): Promise<SpotifyUser> => {
  try {
    return await httpGet<SpotifyUser>('https://api.spotify.com/v1/me', tokenData);
  } catch (error) {
    console.error('❌ /me API call failed:', error);

    if (isHttpError(error)) {
      console.error('Error status:', error.status);
      console.error('Error body:', error.body);
    } else {
      console.error('Non-HTTP error:', error);
    }

    return { error: 'Failed to retrieve user data' } as SpotifyUser;
  }
};

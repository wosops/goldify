import React from 'react';
import { env } from './env';
import axios from 'axios';
import qs from 'qs';
import { spotifyWebPlayerDomain } from './constants';

export const clientId = env.VITE_SPOTIFY_CLIENT_ID as string;
export const clientSecret = env.VITE_SPOTIFY_CLIENT_SECRET as string;
export const redirectUri = env.VITE_SPOTIFY_REDIRECT_URI as string;

interface TokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
  error?: string;
}

/**
 * Generates a random string containing numbers and letters
 * @param length The length of the string
 * @returns The generated string
 */
export const generateRandomString = (length: number): string => {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

/**
 * Grabs the auth code after spotify has authenticated the user
 * @returns Auth code giving access to the user's spotify data
 */
export const retrieveAuthenticationCode = (): string | null => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return urlSearchParams.get('code');
};

/**
 * Determines which api scopes are needed to take full use of this app
 * @returns A space-separated list of goldify's required api scopes
 */
export const retrieveSpotifyApiScopesNeeded = (): string => {
  return [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'playlist-modify-public',
    'playlist-modify-private',
    'ugc-image-upload',
    'playlist-read-private',
  ].join(' ');
};

/**
 * Returns a link to spotify's auth page with the proper scopes and app information
 * @returns Link to spotify's authentication page
 */
export const getSpotifyAuthenticationLink = (): string => {
  const state = generateRandomString(16);
  const scope = retrieveSpotifyApiScopesNeeded();

  let url = 'https://accounts.spotify.com/authorize';
  url += '?response_type=code';
  url += '&client_id=' + encodeURIComponent(clientId);
  url += '&scope=' + encodeURIComponent(scope);
  url += '&redirect_uri=' + encodeURIComponent(redirectUri);
  url += '&state=' + encodeURIComponent(state);

  return url;
};

/**
 * Retrieves user authorization by redirecting to spotify's auth page
 */
export const retrieveAuthorization = (): void => {
  window.location.href = getSpotifyAuthenticationLink();
};

/**
 * Handles auth with spotify, and returns tokens necessary for api usage
 * @param code Auth code returned from spotify after authentication
 * @returns Promise resolving to token data
 */
export const retrieveTokensAxios = async (code: string): Promise<TokenResponse> => {
  const authOptions = {
    method: 'POST',
    url: 'https://accounts.spotify.com/api/token',
    data: qs.stringify({
      code: code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
    headers: {
      Authorization:
        'Basic ' + btoa(clientId + ':' + clientSecret),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  try {
    const response = await axios(authOptions);
    return response.data;
  } catch (error) {
    console.error('Error retrieving tokens:', error);
    return { error: 'Failed to retrieve tokens' } as TokenResponse;
  }
};

/**
 * Replaces the current window URL without reloading the page
 * @param newUrl The new URL to replace the current one with
 */
export const replaceWindowURL = (newUrl: string): void => {
  window.location.replace(newUrl);
};

/**
 * Clears the authorization code from the URL to prevent reuse
 */
export const clearAuthCodeFromURL = (): void => {
  const url = new URL(window.location.href);
  url.searchParams.delete('code');
  url.searchParams.delete('state');
  window.history.replaceState({}, document.title, url.toString());
};

/**
 * Generates a URL to redirect to Spotify for a specific item type
 * @param itemType The type of Spotify item (track, album, artist, etc.)
 * @param itemId The Spotify ID of the item
 * @returns URL to the Spotify web player for the item
 */
export const getSpotifyRedirectURL = (itemType: string, itemId: string): string => {
  return `${spotifyWebPlayerDomain}/${itemType}/${itemId}`;
};

/**
 * Returns a loading page component while data is being retrieved
 * @returns JSX element showing loading state
 */
export const getLoadingPage = (): React.ReactElement => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <h2>Loading your Spotify data...</h2>
    </div>
  );
}; 
import '@testing-library/jest-dom';
import axios from 'axios';
import qs from 'qs';
import { spotifyWebPlayerDomain } from '../../js/utils/constants';
import {
  clientId,
  redirectUri,
  generateRandomString,
  retrieveSpotifyApiScopesNeeded,
  getSpotifyAuthenticationLink,
  retrieveAuthorization,
  retrieveAuthenticationCode,
  retrieveTokensAxios,
  replaceWindowURL,
  getLoadingPage,
  getSpotifyRedirectURL,
} from '../../js/utils/GoldifySoloUtils';

vi.mock('axios');

// Mock window.location
const mockReplace = vi.fn();
let mockHref = '';

Object.defineProperty(window, 'location', {
  value: {
    replace: mockReplace,
    get href() { return mockHref; },
    set href(value) { mockHref = value; },
    search: '',
  },
  writable: true,
});

// Reset mocks before each test
beforeEach(() => {
  mockReplace.mockClear();
  mockHref = '';
  Object.defineProperty(window.location, 'search', { value: '', writable: true });
});

import * as goldifySoloFixtures from '../../__fixtures__/GoldifySoloFixtures';

test('Function to generate random function is random', () => {
  const randomStr1 = generateRandomString(16);
  const randomStr2 = generateRandomString(16);
  const randomStr3 = generateRandomString(16);
  expect(randomStr1).not.toEqual(randomStr2);
  expect(randomStr2).not.toEqual(randomStr3);
  expect(randomStr1).not.toEqual(randomStr3);
});

test('The Spotify API scopes string includes all scopes needed for Goldify', () => {
  const spotifyApiScope = retrieveSpotifyApiScopesNeeded();
  expect(spotifyApiScope).toContain('user-read-private');
  expect(spotifyApiScope).toContain('user-read-email');
  expect(spotifyApiScope).toContain('user-top-read');
  expect(spotifyApiScope).toContain('playlist-modify-public');
  expect(spotifyApiScope).toContain('ugc-image-upload');
});

test('The Spotify API Authorization URL has correct components in it', () => {
  const spotifyApiAuthURL = getSpotifyAuthenticationLink();
  expect(spotifyApiAuthURL).toContain('https://accounts.spotify.com/authorize?');
  expect(spotifyApiAuthURL).toContain('response_type=code');
  expect(spotifyApiAuthURL).toContain('client_id=' + qs.stringify(clientId));
  expect(spotifyApiAuthURL).toContain('scope=');
  expect(spotifyApiAuthURL).toContain('redirect_uri=' + qs.stringify(redirectUri));
  expect(spotifyApiAuthURL).toContain('state=');
});

test('The function retrieveAuthorization attempts to replace the window with the Spotify API URL', () => {
  retrieveAuthorization();
  expect(window.location.href).toContain('https://accounts.spotify.com/authorize');
});

test('Landing page should render null authentication code', () => {
  expect(retrieveAuthenticationCode()).toEqual(null);
});

test('Check for to make sure retrieveTokensAxios returns correct mock data', async () => {
  const mockAxios = axios as unknown as import('vitest').Mock;
  mockAxios.mockResolvedValue({
    data: goldifySoloFixtures.getTokensTestData(),
  });

  const responseData = await retrieveTokensAxios('test_code');
  expect(responseData).toEqual(goldifySoloFixtures.getTokensTestData());
});

test('Check for to make sure retrieveTokensAxios throws error on bad data', async () => {
  const mockAxios = axios as unknown as import('vitest').Mock;
  mockAxios.mockResolvedValue(null);
  console.error = vi.fn();
  const result = await retrieveTokensAxios('test_code');
  expect(result).toEqual({ error: 'Failed to retrieve tokens' });
  expect(console.error).toHaveBeenCalledWith('Error retrieving tokens:', expect.any(TypeError));

  mockAxios.mockResolvedValue(undefined);
  console.error = vi.fn();
  const result2 = await retrieveTokensAxios('test_code');
  expect(result2).toEqual({ error: 'Failed to retrieve tokens' });
  expect(console.error).toHaveBeenCalledWith('Error retrieving tokens:', expect.any(TypeError));
});

test('Confirm replaceWindowURL replaces the window with the given URL', async () => {
  replaceWindowURL('TEST_URL');
  expect(mockReplace).toHaveBeenCalledTimes(1);
  expect(mockReplace).toHaveBeenCalledWith('TEST_URL');
});

test('Check for Loading... in loading page', () => {
  const loadingPageString = JSON.stringify(getLoadingPage());
  expect(loadingPageString).toContain('Loading your Spotify data...');
});

test('Confirm getSpotifyRedirectURL returns proper Spotify URL', () => {
  const TEST_ID = 'TEST_ID';
  expect(getSpotifyRedirectURL('album', TEST_ID)).toEqual(
    spotifyWebPlayerDomain + '/album/' + TEST_ID
  );
  expect(getSpotifyRedirectURL('track', TEST_ID)).toEqual(
    spotifyWebPlayerDomain + '/track/' + TEST_ID
  );
  expect(getSpotifyRedirectURL('artist', TEST_ID)).toEqual(
    spotifyWebPlayerDomain + '/artist/' + TEST_ID
  );
  expect(getSpotifyRedirectURL('test', TEST_ID)).toEqual(
    spotifyWebPlayerDomain + '/test/' + TEST_ID
  );
}); 
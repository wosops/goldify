import '@testing-library/jest-dom';
import { vi } from 'vitest';
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
import { httpPostForm, HttpError } from '../../js/utils/http';

vi.mock('../../js/utils/http', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../js/utils/http')>();
  return {
    ...actual,
    httpGet: vi.fn(),
    httpPost: vi.fn(),
    httpPut: vi.fn(),
    httpPutBinary: vi.fn(),
    httpPostForm: vi.fn(),
  };
});

const mockedHttpPostForm = vi.mocked(httpPostForm);

// Mock window.location
const mockReplace = vi.fn();
let mockHref = '';

Object.defineProperty(window, 'location', {
  value: {
    replace: mockReplace,
    get href() {
      return mockHref;
    },
    set href(value) {
      mockHref = value;
    },
    search: '',
  },
  writable: true,
});

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
  expect(spotifyApiAuthURL).toContain('client_id=' + encodeURIComponent(clientId));
  expect(spotifyApiAuthURL).toContain('scope=');
  expect(spotifyApiAuthURL).toContain('redirect_uri=' + encodeURIComponent(redirectUri));
  expect(spotifyApiAuthURL).toContain('state=');
});

test('The function retrieveAuthorization attempts to replace the window with the Spotify API URL', () => {
  retrieveAuthorization();
  expect(window.location.href).toContain('https://accounts.spotify.com/authorize');
});

test('Landing page should render null authentication code', () => {
  expect(retrieveAuthenticationCode()).toEqual(null);
});

test('retrieveTokensAxios returns token data on success', async () => {
  const tokens = goldifySoloFixtures.getTokensTestData();
  mockedHttpPostForm.mockResolvedValue(tokens);

  const responseData = await retrieveTokensAxios('test_code');
  expect(responseData).toEqual(tokens);
});

test('retrieveTokensAxios returns an error object when httpPostForm rejects', async () => {
  const thrown = new HttpError(400, 'invalid_grant');
  mockedHttpPostForm.mockRejectedValue(thrown);
  console.error = vi.fn();
  const result = await retrieveTokensAxios('test_code');
  expect(result).toEqual({ error: 'Failed to retrieve tokens' });
  expect(console.error).toHaveBeenCalledWith('Error retrieving tokens:', thrown);
});

test('Confirm replaceWindowURL replaces the window with the given URL', () => {
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

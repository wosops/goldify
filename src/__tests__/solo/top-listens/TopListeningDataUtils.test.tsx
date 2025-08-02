import '@testing-library/jest-dom';
import axios from 'axios';
import {
  retrieveTopListeningDataAxios,
  getTopListeningDataSpotifyApiURL,
} from '../../../js/utils/TopListeningDataUtils';
import { TokenData } from '../../../js/utils/UserInfoUtils';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

import * as goldifySoloFixtures from '../../../__fixtures__/GoldifySoloFixtures';

// Mock console.error to avoid noise in tests
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = jest.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
  jest.clearAllMocks();
});

test('Check for to make sure retrieveTopListeningDataAxios throws error on bad data', async () => {
  const tokenData: TokenData = goldifySoloFixtures.getTokensTestData();
  
  mockedAxios.get.mockResolvedValue(null);
  const result = await retrieveTopListeningDataAxios(tokenData);
  expect(result).toBeUndefined();
  expect(console.error).toHaveBeenCalled();
});

test('getTopListeningDataSpotifyApiURL returns correct URL', () => {
  const termQuery = 'short_term';
  const expectedUrl = 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=20&offset=0';
  expect(getTopListeningDataSpotifyApiURL(termQuery)).toEqual(expectedUrl);
}); 
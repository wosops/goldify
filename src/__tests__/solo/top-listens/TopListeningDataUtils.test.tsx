import '@testing-library/jest-dom';
import { vi } from 'vitest';
import {
  retrieveTopListeningDataAxios,
  getTopListeningDataSpotifyApiURL,
} from '../../../js/utils/TopListeningDataUtils';
import { httpGet, HttpError } from '../../../js/utils/http';
import { TokenData } from '../../../js/utils/UserInfoUtils';

const mockedHttpGet = vi.mocked(httpGet);

import * as goldifySoloFixtures from '../../../__fixtures__/GoldifySoloFixtures';

const originalConsoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
  vi.clearAllMocks();
});

test('retrieveTopListeningDataAxios throws error on bad data', async () => {
  const tokenData: TokenData = goldifySoloFixtures.getTokensTestData();

  mockedHttpGet.mockRejectedValue(new HttpError(500, 'server error'));
  const result = await retrieveTopListeningDataAxios(tokenData);
  expect(result).toBeUndefined();
  expect(console.error).toHaveBeenCalled();
});

test('retrieveTopListeningDataAxios returns all three time ranges on success', async () => {
  const tokenData: TokenData = goldifySoloFixtures.getTokensTestData();
  const stub = { href: '', items: [], limit: 20, next: null, offset: 0, previous: null, total: 0 };
  mockedHttpGet.mockResolvedValue(stub);

  const result = await retrieveTopListeningDataAxios(tokenData);
  expect(result).toEqual({ short_term: stub, medium_term: stub, long_term: stub });
  expect(mockedHttpGet).toHaveBeenCalledTimes(3);
});

test('getTopListeningDataSpotifyApiURL returns correct URL', () => {
  const termQuery = 'short_term';
  const expectedUrl =
    'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=20&offset=0';
  expect(getTopListeningDataSpotifyApiURL(termQuery)).toEqual(expectedUrl);
});

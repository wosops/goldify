import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { retrieveUserDataAxios } from '../../../js/utils/UserInfoUtils';
import { httpGet, HttpError } from '../../../js/utils/http';
import { TokenData } from '../../../js/utils/UserInfoUtils';

vi.mock('../../../js/utils/http', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../js/utils/http')>();
  return {
    ...actual,
    httpGet: vi.fn(),
    httpPost: vi.fn(),
    httpPut: vi.fn(),
    httpPutBinary: vi.fn(),
    httpPostForm: vi.fn(),
  };
});

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

test('retrieveUserDataAxios returns user data on success', async () => {
  const tokenData: TokenData = goldifySoloFixtures.getTokensTestData();
  const userData = { id: 'u1', display_name: 'u', followers: { total: 0 }, images: [], external_urls: { spotify: '' }, href: '', type: 'user', uri: '' };
  mockedHttpGet.mockResolvedValue(userData);

  const result = await retrieveUserDataAxios(tokenData);
  expect(result).toEqual(userData);
});

test('retrieveUserDataAxios returns error object and logs HttpError details on failure', async () => {
  const tokenData: TokenData = goldifySoloFixtures.getTokensTestData();

  mockedHttpGet.mockRejectedValue(new HttpError(401, { message: 'bad token' }));
  const result = await retrieveUserDataAxios(tokenData);
  expect(result).toHaveProperty('error');
  expect(console.error).toHaveBeenCalledWith('Error status:', 401);
  expect(console.error).toHaveBeenCalledWith('Error body:', { message: 'bad token' });
});

test('retrieveUserDataAxios logs non-HTTP errors through the non-HTTP branch', async () => {
  const tokenData: TokenData = goldifySoloFixtures.getTokensTestData();

  const thrown = new TypeError('network boom');
  mockedHttpGet.mockRejectedValue(thrown);
  const result = await retrieveUserDataAxios(tokenData);
  expect(result).toHaveProperty('error');
  expect(console.error).toHaveBeenCalledWith('Non-HTTP error:', thrown);
});

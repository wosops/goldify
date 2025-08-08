import '@testing-library/jest-dom';
import axios from 'axios';
import { retrieveUserDataAxios } from '../../../js/utils/UserInfoUtils';
import { TokenData } from '../../../js/utils/UserInfoUtils';

vi.mock('axios');
import type { Mocked } from 'vitest';
const mockedAxios = axios as Mocked<typeof axios> & { isAxiosError: (err: unknown) => boolean };

import * as goldifySoloFixtures from '../../../__fixtures__/GoldifySoloFixtures';

// Mock console.error to avoid noise in tests
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
  vi.clearAllMocks();
});

test('Check for to make sure retrieveUserDataAxios throws error on bad data', async () => {
  const tokenData: TokenData = goldifySoloFixtures.getTokensTestData();
  
  mockedAxios.get.mockResolvedValue(null);
  mockedAxios.isAxiosError = () => true;
  const result = await retrieveUserDataAxios(tokenData);
  expect(result).toHaveProperty('error');
  expect(console.error).toHaveBeenCalled();
}); 
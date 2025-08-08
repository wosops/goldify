export const testAuthenticationCode = 'TEST_AUTH_CODE';

export const testRefreshToken = 'TEST_REFRESH_TOKEN';
export const testAccessToken = 'TEST_ACCESS_TOKEN';

import type { TokenData } from '../js/utils/UserInfoUtils';

export const getTokensTestData = (): TokenData => {
  return {
    refresh_token: testRefreshToken,
    access_token: testAccessToken,
    token_type: 'Bearer',
  };
}; 
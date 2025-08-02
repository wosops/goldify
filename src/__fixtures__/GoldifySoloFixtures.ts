export const testAuthenticationCode = 'TEST_AUTH_CODE';

export const testRefreshToken = 'TEST_REFRESH_TOKEN';
export const testAccessToken = 'TEST_ACCESS_TOKEN';

export interface TokenData {
  refresh_token: string;
  access_token: string;
}

export const getTokensTestData = (): TokenData => {
  return {
    refresh_token: testRefreshToken,
    access_token: testAccessToken,
  };
}; 
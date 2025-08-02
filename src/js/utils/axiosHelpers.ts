import { TokenData } from './UserInfoUtils';

export interface AxiosConfig {
  headers: {
    Authorization: string;
    'Content-Type'?: string;
  };
}

/**
 * Creates basic HTTP headers with authorization token
 * @param tokenData The token data containing access token
 * @returns Axios configuration object with headers
 */
export const basicHeaders = (tokenData: TokenData): AxiosConfig => {
  return {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  };
};

/**
 * Creates headers for POST requests with JSON content type
 * @param tokenData The token data containing access token
 * @returns Axios configuration object with headers for POST requests
 */
export const postHeaders = (tokenData: TokenData): AxiosConfig => {
  return {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      'Content-Type': 'application/json',
    },
  };
}; 
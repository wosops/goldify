import { testAccessToken } from './GoldifySoloFixtures';

export interface BasicHeaders {
  headers: {
    Authorization: string;
  };
}

export const basicHeaders = (): BasicHeaders => {
  return {
    headers: {
      Authorization: 'Bearer ' + testAccessToken,
    },
  };
}; 
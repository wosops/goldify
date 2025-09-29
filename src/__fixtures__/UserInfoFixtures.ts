export const testUserId = 'TEST_ID';
export const testUserDisplayName = 'Test User';
export const testUserEmail = 'test@email.com';
export const testUserImageURL = 'test_image.com';
export const testUserFollowersTotal = 47;
export const testUserExternalUrlSpotify = 'test_spotify.com';
export const testUserCountry = 'Codeland';

export interface UserImage {
  url: string;
}

export interface UserFollowers {
  total: number;
}

export interface UserExternalUrls {
  spotify: string;
}

import type { SpotifyUser } from '../js/utils/UserInfoUtils';

export const getUserTestData = (): SpotifyUser => {
  return {
    id: testUserId,
    display_name: testUserDisplayName,
    email: testUserEmail,
    images: [
      {
        url: testUserImageURL,
      },
    ],
    followers: {
      total: testUserFollowersTotal,
    },
    external_urls: {
      spotify: testUserExternalUrlSpotify,
    },
    country: testUserCountry,
    href: '',
    type: 'user',
    uri: '',
  };
}; 
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

export interface UserData {
  id: string;
  display_name: string;
  email: string;
  images: UserImage[];
  followers: UserFollowers;
  external_urls: UserExternalUrls;
  country: string;
}

export const getUserTestData = (): UserData => {
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
  };
}; 
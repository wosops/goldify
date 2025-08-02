export const testPlaylistId = 'TEST_PLAYLIST_ID';
const testPlaylistName = 'TEST_PLAYLIST_NAME';
const testPlaylistDescription = 'TEST_PLAYLIST_DESCRIPTION';
const testNonGoldifyPlaylistId = 'TEST_NON_GOLDIFY_PLAYLIST_ID';
const testNonGoldifyPlaylistName = 'TEST_NON_GOLDIFY_PLAYLIST_NAME';
const testNonGoldifyPlaylistDescription = 'TEST_NON_GOLDIFY_PLAYLIST_DESCRIPTION';
const testUserId = 'TEST_USER_ID';
const testSnapshotId = 'abcd12345';

export interface SpotifyExternalUrls {
  spotify: string;
}

export interface SpotifyFollowers {
  href: string | null;
  total: number;
}

export interface SpotifyOwner {
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
}

export interface SpotifyTracks {
  href: string;
  items: any[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

export interface SpotifyPlaylist {
  collaborative: boolean;
  description: string;
  external_urls: SpotifyExternalUrls;
  followers: SpotifyFollowers;
  href: string;
  id: string;
  images: any[];
  name: string;
  owner: SpotifyOwner;
  public: boolean;
  snapshot_id: string;
  tracks: SpotifyTracks;
  type: string;
  uri: string;
}

export interface SpotifyPlaylistResponse {
  href: string;
  items: SpotifyPlaylist[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

export const createGoldifyPlaylist = (userId: string, playlistName: string, playlistDescription: string): SpotifyPlaylist => {
  return {
    collaborative: false,
    description: playlistDescription,
    external_urls: {
      spotify: 'http://open.spotify.com/user/' + userId + '/playlist/' + testPlaylistId,
    },
    followers: {
      href: null,
      total: 0,
    },
    href: 'https://api.spotify.com/v1/users/' + userId + '/playlists/' + testPlaylistId,
    id: testPlaylistId,
    images: [],
    name: playlistName,
    owner: {
      external_urls: {
        spotify: 'http://open.spotify.com/user/' + userId,
      },
      href: 'https://api.spotify.com/v1/users/' + userId,
      id: userId,
      type: 'user',
      uri: 'spotify:user:' + userId,
    },
    public: false,
    snapshot_id: testSnapshotId,
    tracks: {
      href:
        'https://api.spotify.com/v1/users/' + userId + '/playlists/' + testPlaylistId + '/tracks',
      items: [],
      limit: 100,
      next: null,
      offset: 0,
      previous: null,
      total: 0,
    },
    type: 'playlist',
    uri: 'spotify:user:' + userId + ':playlist:' + testPlaylistId,
  };
};

export const getPlaylistById = (playlistId: string): SpotifyPlaylist => {
  return {
    collaborative: false,
    description: testPlaylistDescription,
    external_urls: {
      spotify: 'http://open.spotify.com/user/' + testUserId + '/playlist/' + playlistId,
    },
    followers: {
      href: null,
      total: 0,
    },
    href: 'https://api.spotify.com/v1/users/' + testUserId + '/playlists/' + playlistId,
    id: playlistId,
    images: [],
    name: testPlaylistName,
    owner: {
      external_urls: {
        spotify: 'http://open.spotify.com/user/' + testUserId,
      },
      href: 'https://api.spotify.com/v1/users/' + testUserId,
      id: testUserId,
      type: 'user',
      uri: 'spotify:user:' + testUserId,
    },
    public: false,
    snapshot_id: testSnapshotId,
    tracks: {
      href:
        'https://api.spotify.com/v1/users/' + testUserId + '/playlists/' + playlistId + '/tracks',
      items: [],
      limit: 100,
      next: null,
      offset: 0,
      previous: null,
      total: 0,
    },
    type: 'playlist',
    uri: 'spotify:user:' + testUserId + ':playlist:' + playlistId,
  };
};

export const userHasExistingGoldifyPlaylist = (playlistName: string): SpotifyPlaylistResponse => {
  return {
    href: 'https://api.spotify.com/v1/users/' + testUserId + '/playlists',
    items: [
      {
        collaborative: false,
        description: testNonGoldifyPlaylistDescription,
        external_urls: {
          spotify:
            'http://open.spotify.com/user/' + testUserId + '/playlist/' + testNonGoldifyPlaylistId,
        },
        followers: {
          href: null,
          total: 0,
        },
        href:
          'https://api.spotify.com/v1/users/' +
          testUserId +
          '/playlists/' +
          testNonGoldifyPlaylistId,
        id: testNonGoldifyPlaylistId,
        images: [],
        name: testNonGoldifyPlaylistName,
        owner: {
          external_urls: {
            spotify: 'http://open.spotify.com/user/' + testUserId,
          },
          href: 'https://api.spotify.com/v1/users/' + testUserId,
          id: testUserId,
          type: 'user',
          uri: 'spotify:user:' + testUserId,
        },
        public: false,
        snapshot_id: testSnapshotId,
        tracks: {
          href:
            'https://api.spotify.com/v1/users/' +
            testUserId +
            '/playlists/' +
            testNonGoldifyPlaylistId +
            '/tracks',
          items: [],
          limit: 100,
          next: null,
          offset: 0,
          previous: null,
          total: 0,
        },
        type: 'playlist',
        uri: 'spotify:user:' + testUserId + ':playlist:' + testNonGoldifyPlaylistId,
      },
      {
        collaborative: false,
        description: testPlaylistDescription,
        external_urls: {
          spotify: 'http://open.spotify.com/user/' + testUserId + '/playlist/' + testPlaylistId,
        },
        followers: {
          href: null,
          total: 0,
        },
        href: 'https://api.spotify.com/v1/users/' + testUserId + '/playlists/' + testPlaylistId,
        id: testPlaylistId,
        images: [],
        name: playlistName,
        owner: {
          external_urls: {
            spotify: 'http://open.spotify.com/user/' + testUserId,
          },
          href: 'https://api.spotify.com/v1/users/' + testUserId,
          id: testUserId,
          type: 'user',
          uri: 'spotify:user:' + testUserId,
        },
        public: false,
        snapshot_id: testSnapshotId,
        tracks: {
          href:
            'https://api.spotify.com/v1/users/' +
            testUserId +
            '/playlists/' +
            testPlaylistId +
            '/tracks',
          items: [],
          limit: 100,
          next: null,
          offset: 0,
          previous: null,
          total: 0,
        },
        type: 'playlist',
        uri: 'spotify:user:' + testUserId + ':playlist:' + testPlaylistId,
      },
    ],
    limit: 9,
    next: null,
    offset: 0,
    previous: null,
    total: 2,
  };
};

// Matches goldify playlist in userHasExistingGoldifyPlaylist
export const existingGoldifyPlaylist = (playlistName?: string): SpotifyPlaylist => {
  return {
    collaborative: false,
    description: testPlaylistDescription,
    external_urls: {
      spotify: 'http://open.spotify.com/user/' + testUserId + '/playlist/' + testPlaylistId,
    },
    followers: {
      href: null,
      total: 0,
    },
    href: 'https://api.spotify.com/v1/users/' + testUserId + '/playlists/' + testPlaylistId,
    id: testPlaylistId,
    images: [],
    name: playlistName || testPlaylistName,
    owner: {
      external_urls: {
        spotify: 'http://open.spotify.com/user/' + testUserId,
      },
      href: 'https://api.spotify.com/v1/users/' + testUserId,
      id: testUserId,
      type: 'user',
      uri: 'spotify:user:' + testUserId,
    },
    public: false,
    snapshot_id: testSnapshotId,
    tracks: {
      href:
        'https://api.spotify.com/v1/users/' +
        testUserId +
        '/playlists/' +
        testPlaylistId +
        '/tracks',
      items: [],
      limit: 100,
      next: null,
      offset: 0,
      previous: null,
      total: 0,
    },
    type: 'playlist',
    uri: 'spotify:user:' + testUserId + ':playlist:' + testPlaylistId,
  };
};

export const userDoesntHaveExistingGoldifyPlaylist = (): SpotifyPlaylistResponse => {
  return {
    href: 'https://api.spotify.com/v1/users/' + testUserId + '/playlists',
    items: [
      {
        collaborative: false,
        description: testNonGoldifyPlaylistDescription,
        external_urls: {
          spotify:
            'http://open.spotify.com/user/' + testUserId + '/playlist/' + testNonGoldifyPlaylistId,
        },
        followers: {
          href: null,
          total: 0,
        },
        href:
          'https://api.spotify.com/v1/users/' +
          testUserId +
          '/playlists/' +
          testNonGoldifyPlaylistId,
        id: testNonGoldifyPlaylistId,
        images: [],
        name: testNonGoldifyPlaylistName,
        owner: {
          external_urls: {
            spotify: 'http://open.spotify.com/user/' + testUserId,
          },
          href: 'https://api.spotify.com/v1/users/' + testUserId,
          id: testUserId,
          type: 'user',
          uri: 'spotify:user:' + testUserId,
        },
        public: false,
        snapshot_id: testSnapshotId,
        tracks: {
          href:
            'https://api.spotify.com/v1/users/' +
            testUserId +
            '/playlists/' +
            testNonGoldifyPlaylistId +
            '/tracks',
          items: [],
          limit: 100,
          next: null,
          offset: 0,
          previous: null,
          total: 0,
        },
        type: 'playlist',
        uri: 'spotify:user:' + testUserId + ':playlist:' + testNonGoldifyPlaylistId,
      },
    ],
    limit: 9,
    next: null,
    offset: 0,
    previous: null,
    total: 1,
  };
};

export const userDoesntHavePlaylists = (): SpotifyPlaylistResponse => {
  return {
    href: 'https://api.spotify.com/v1/users/' + testUserId + '/playlists',
    items: [],
    limit: 9,
    next: null,
    offset: 0,
    previous: null,
    total: 0,
  };
}; 
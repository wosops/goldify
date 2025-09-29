export const testUserId = 'TEST_USER_ID';
export const testAlbumArtImageURL = 'test-album-art.com';
export const testAlbumName = 'TEST_ALBUM_NAME';
export const testAlbumId = 'TEST_ALBUM_ID';
export const testArtistName1 = 'TEST_ARTIST_NAME_1';
export const testArtistId1 = 'TEST_ARTIST_ID_1';
export const testArtistName2 = 'TEST_ARTIST_NAME_2';
export const testArtistId2 = 'TEST_ARTIST_ID_2';
export const testTrackName1 = 'TEST_SONG_NAME_1';
export const testTrackId1 = 'TEST_SONG_ID_1';
export const testTrackName2 = 'TEST_SONG_NAME_2';
export const testTrackId2 = 'TEST_SONG_ID_2';
export const testTimeStamp = '2020-11-11T11:11:11Z';

export interface SpotifyArtist {
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface SpotifyAlbumImage {
  height: number;
  url: string;
  width: number;
}

export interface SpotifyAlbum {
  album_type: string;
  artists: SpotifyArtist[];
  available_markets: string[];
  href: string;
  id: string;
  images: SpotifyAlbumImage[];
  name: string;
  type: string;
  uri: string;
}

export interface SpotifyTrack {
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  href: string;
  id: string;
  name: string;
  popularity: number;
  track_number: number;
  type: string;
  uri: string;
}

export interface SpotifyPlaylistTrack {
  added_at: string;
  added_by: {
    external_urls: { spotify: string };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  is_local: boolean;
  track: SpotifyTrack;
  primary_color: string | null;
  video_thumbnail: { url: string | null };
}

export interface SpotifyPlaylistTracksResponse {
  href: string;
  items: SpotifyPlaylistTrack[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

export const testTrack = (trackName: string, trackId: string): SpotifyPlaylistTrack => {
  return {
    added_at: testTimeStamp,
    added_by: {
      external_urls: { spotify: '' },
      href: 'https://api.spotify.com/v1/users/' + testUserId,
      id: testUserId,
      type: 'user',
      uri: 'spotify:user:' + testUserId,
    },
    is_local: false,
    primary_color: null,
    video_thumbnail: { url: null },
    track: {
      album: {
        album_type: 'single',
        artists: [
          {
            id: testArtistId1,
            name: testArtistName1,
            type: 'artist',
            uri: 'spotify:artist:' + testArtistId1,
          },
          {
            id: testArtistId2,
            name: testArtistName2,
            type: 'artist',
            uri: 'spotify:artist:' + testArtistId2,
          },
        ],
        available_markets: ['US'],
        href: 'https://api.spotify.com/v1/albums/' + testAlbumId,
        id: testAlbumId,
        images: [
          {
            height: 640,
            url: testAlbumArtImageURL,
            width: 640,
          },
        ],
        name: testAlbumName,
        type: 'album',
        uri: 'spotify:album:' + testAlbumId,
      },
      artists: [
        {
          id: testArtistId1,
          name: testArtistName1,
          type: 'artist',
          uri: 'spotify:artist:' + testArtistId1,
        },
        {
          id: testArtistId2,
          name: testArtistName2,
          type: 'artist',
          uri: 'spotify:artist:' + testArtistId2,
        },
      ],
      available_markets: [],
      disc_number: 1,
      duration_ms: 123456,
      explicit: false,
      href: 'https://api.spotify.com/v1/tracks/' + trackId,
      id: trackId,
      name: trackName,
      popularity: 85,
      track_number: 1,
      type: 'track',
      uri: 'spotify:track:' + trackId,
    },
  };
};

export const playlistTracksById = (playlistId: string): SpotifyPlaylistTracksResponse => {
  return {
    href:
      'https://api.spotify.com/v1/users/' +
      testUserId +
      '/playlists/' +
      playlistId +
      '/tracks',
    items: [
      testTrack(testTrackName1, testTrackId1),
      testTrack(testTrackName2, testTrackId2),
    ],
    limit: 100,
    next: null,
    offset: 0,
    previous: null,
    total: 58,
  };
};

export const replacePlaylistTracksByIdAndURIs = (playlistId: string, trackURIs: string[]): SpotifyPlaylistTracksResponse => {
  return {
    href:
      'https://api.spotify.com/v1/users/' +
      testUserId +
      '/playlists/' +
      playlistId +
      '/tracks',
    items: trackURIs.map(uri => testTrack(testTrackName1, uri)),
    limit: 100,
    next: null,
    offset: 0,
    previous: null,
    total: 58,
  };
};

export const tracksWithURIs = (): SpotifyPlaylistTrack[] => {
  return [
    testTrack(testTrackName1, testTrackId1),
    testTrack(testTrackName2, testTrackId2),
  ];
};

export const trackURIs = (): string[] => {
  return ['spotify:track:' + testTrackId1, 'spotify:track:' + testTrackId2];
}; 
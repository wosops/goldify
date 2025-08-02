export const testAlbumName = 'TEST_ALBUM_NAME';
export const testAlbumId = 'TEST_ALBUM_ID';
export const testArtistName1 = 'TEST_ARTIST_NAME_1';
export const testArtistId1 = 'TEST_ARTIST1_ID';
export const testArtistName2 = 'TEST_ARTIST_NAME_2';
export const testArtistId2 = 'TEST_ARTIST2_ID';
export const testTrackName = 'TEST_SONG_NAME';
export const testTrackId = 'TEST_TRACK_ID';
export const testPopularity = 47;
export const testAlbumArtImageURL = 'test-album-art.com';
export const testUri = 'TEST_URI';
export const badUri = 'BAD_URI';

export interface Artist {
  id: string;
  name: string;
}

export interface AlbumImage {
  url: string;
}

export interface Album {
  name: string;
  images: AlbumImage[];
  artists: Artist[];
  id: string;
}

export interface Track {
  album: Album;
  id: string;
  name: string;
  popularity: number;
  uri: string;
}

export interface TermTopListeningData {
  items: Track[];
}

export interface TopListeningData {
  short_term: TermTopListeningData;
  medium_term: TermTopListeningData;
  long_term: TermTopListeningData;
}

export const getTermTopListeningData = (): TermTopListeningData => {
  return {
    items: [
      {
        album: {
          name: testAlbumName,
          images: [
            {
              url: testAlbumArtImageURL,
            },
          ],
          artists: [
            {
              id: testArtistId1,
              name: testArtistName1,
            },
            {
              id: testArtistId2,
              name: testArtistName2,
            },
          ],
          id: testAlbumId,
        },
        id: testTrackId,
        name: testTrackName,
        popularity: testPopularity,
        uri: testUri,
      },
      {
        album: {
          name: testAlbumName,
          images: [
            {
              url: testAlbumArtImageURL,
            },
          ],
          artists: [
            {
              id: testArtistId1,
              name: testArtistName1,
            },
            {
              id: testArtistId2,
              name: testArtistName2,
            },
          ],
          id: testAlbumId,
        },
        id: testTrackId,
        name: testTrackName,
        popularity: testPopularity,
        uri: badUri,
      },
    ],
  };
};

export const getTopListeningData = (): TopListeningData => {
  return {
    short_term: getTermTopListeningData(),
    medium_term: getTermTopListeningData(),
    long_term: getTermTopListeningData(),
  };
}; 
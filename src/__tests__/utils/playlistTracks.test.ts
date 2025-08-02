import '@testing-library/jest-dom';
import axios from 'axios';
import {
  playlistTracksUrl,
  getPlaylistTracksById,
  replacePlaylistTracks,
  getURIsFromList,
} from '../../js/utils/playlistTracks';
import { TokenData } from '../../js/utils/UserInfoUtils';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

import * as goldifySoloFixtures from '../../__fixtures__/GoldifySoloFixtures';
import * as playlistTracksFixtures from '../../__fixtures__/playlistTracksFixtures';

// Mock console.error to avoid noise in tests
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = jest.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
  jest.clearAllMocks();
});

test('Confirm playlistTracksUrl returns the correct Spotify API URL including params', () => {
  const playlistId = 'abc123';
  expect(playlistTracksUrl(playlistId)).toEqual(
    'https://api.spotify.com/v1/playlists/abc123/tracks'
  );
});

test('Gets Tracks by Playlist Id', async () => {
  const playlistId = 'Abcd1234';
  const tokenData: TokenData = goldifySoloFixtures.getTokensTestData();

  const playlistTracksResponseData = playlistTracksFixtures.playlistTracksById(playlistId);
  mockedAxios.get.mockResolvedValue({
    data: playlistTracksResponseData,
  });

  const responseData = await getPlaylistTracksById(tokenData, playlistId);
  expect(responseData).toEqual(playlistTracksResponseData);
});

test('GetTracks throws error on bad data', async () => {
  const playlistId = 'Abcd1234';
  const tokenData: TokenData = goldifySoloFixtures.getTokensTestData();

  mockedAxios.get.mockResolvedValue(null);
  const result = await getPlaylistTracksById(tokenData, playlistId);
  expect(result).toBeUndefined();
  expect(console.error).toHaveBeenCalled();
});

test('Replaces Tracks', async () => {
  const playlistId = 'Abcd1234';
  const trackURIs = ['testTrackURI1', 'testTrackURI2'];
  const tokenData: TokenData = goldifySoloFixtures.getTokensTestData();

  const replaceTracksResponseData = playlistTracksFixtures.replacePlaylistTracksByIdAndURIs(
    playlistId,
    trackURIs
  );
  mockedAxios.put.mockResolvedValue({
    data: replaceTracksResponseData,
  });

  const responseData = await replacePlaylistTracks(tokenData, playlistId, trackURIs);
  expect(responseData).toEqual(replaceTracksResponseData);
});

test('Replace Tracks throws error on bad data', async () => {
  const playlistId = 'Abcd1234';
  const trackURIs = ['testTrackURI1', 'testTrackURI2'];
  const tokenData: TokenData = goldifySoloFixtures.getTokensTestData();

  mockedAxios.put.mockResolvedValue(null);
  const result = await replacePlaylistTracks(tokenData, playlistId, trackURIs);
  expect(result).toBeUndefined();
  expect(console.error).toHaveBeenCalled();
});

test('getURIsFromList returns proper URIs from track data', () => {
  const trackListData = playlistTracksFixtures.tracksWithURIs();
  const result = getURIsFromList(trackListData);
  const expectedUris = trackListData.map((item: any) => item.track.uri);
  expect(result).toEqual(expectedUris);
}); 
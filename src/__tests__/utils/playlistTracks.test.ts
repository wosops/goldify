import '@testing-library/jest-dom';
import { vi } from 'vitest';
import {
  playlistTracksUrl,
  getPlaylistTracksById,
  replacePlaylistTracks,
  getURIsFromList,
} from '../../js/utils/playlistTracks';
import { httpGet, httpPut, HttpError } from '../../js/utils/http';
import { TokenData } from '../../js/utils/UserInfoUtils';

vi.mock('../../js/utils/http', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../js/utils/http')>();
  return {
    ...actual,
    httpGet: vi.fn(),
    httpPost: vi.fn(),
    httpPut: vi.fn(),
    httpPutBinary: vi.fn(),
    httpPostForm: vi.fn(),
  };
});

const mockedHttpGet = vi.mocked(httpGet);
const mockedHttpPut = vi.mocked(httpPut);

import * as goldifySoloFixtures from '../../__fixtures__/GoldifySoloFixtures';
import * as playlistTracksFixtures from '../../__fixtures__/playlistTracksFixtures';

const originalConsoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
  vi.clearAllMocks();
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
  mockedHttpGet.mockResolvedValue(playlistTracksResponseData);

  const responseData = await getPlaylistTracksById(tokenData, playlistId);
  expect(responseData).toEqual(playlistTracksResponseData);
});

test('GetTracks throws error on bad data', async () => {
  const playlistId = 'Abcd1234';
  const tokenData: TokenData = goldifySoloFixtures.getTokensTestData();

  mockedHttpGet.mockRejectedValue(new HttpError(500, 'server error'));
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
  mockedHttpPut.mockResolvedValue(replaceTracksResponseData);

  const responseData = await replacePlaylistTracks(tokenData, playlistId, trackURIs);
  expect(responseData).toEqual(replaceTracksResponseData);
});

test('Replace Tracks throws error on bad data', async () => {
  const playlistId = 'Abcd1234';
  const trackURIs = ['testTrackURI1', 'testTrackURI2'];
  const tokenData: TokenData = goldifySoloFixtures.getTokensTestData();

  mockedHttpPut.mockRejectedValue(new HttpError(500, 'server error'));
  const result = await replacePlaylistTracks(tokenData, playlistId, trackURIs);
  expect(result).toBeUndefined();
  expect(console.error).toHaveBeenCalled();
});

test('getURIsFromList returns proper URIs from track data', () => {
  const trackListData = playlistTracksFixtures.tracksWithURIs();
  const result = getURIsFromList(trackListData);
  const expectedUris = trackListData.map((item: { track: { uri: string } }) => item.track.uri);
  expect(result).toEqual(expectedUris);
});

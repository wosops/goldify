import '@testing-library/jest-dom';
import axios from 'axios';
import {
  createPlaylistUrl,
  createGoldifyPlaylist,
  getUserPlaylistsUrl,
  findExistingGoldifyPlaylistByName,
  getPlaylistUrl,
  getPlaylistById,
  uploadPlaylistImageUrl,
  uploadPlaylistImage,
} from '../../js/utils/playlist';
import { goldifyBase64 } from '../../assets/goldifyBase64String';
import { TokenData } from '../../js/utils/UserInfoUtils';

vi.mock('axios');
import type { Mocked } from 'vitest';
const mockedAxios = axios as Mocked<typeof axios>;

import * as goldifySoloFixtures from '../../__fixtures__/GoldifySoloFixtures';
import * as playlistFixtures from '../../__fixtures__/playlistFixtures';

// Mock console.error to avoid noise in tests
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
  vi.clearAllMocks();
});

test('Confirm createPlaylistUrl returns the correct Spotify API URL including params', () => {
  const userId = 'abc123';
  expect(createPlaylistUrl(userId)).toEqual('https://api.spotify.com/v1/users/abc123/playlists');
});

test('Confirm getUserPlaylistUrl returns the correct Spotify API URL', () => {
  expect(getUserPlaylistsUrl()).toEqual('https://api.spotify.com/v1/me/playlists?limit=50');
});

test('Confirm getPlaylistUrl returns the correct Spotify API URL including params', () => {
  const playlistId = 'testPlaylistId123';
  expect(getPlaylistUrl(playlistId)).toEqual(
    'https://api.spotify.com/v1/playlists/testPlaylistId123'
  );
});

test('Confirm uploadPlaylistImageUrl returns the correct Spotify API URL including params', () => {
  const playlistId = 'testPlaylistId123';
  expect(uploadPlaylistImageUrl(playlistId)).toEqual(
    'https://api.spotify.com/v1/playlists/testPlaylistId123/images'
  );
});

test('Creates a Goldify Playlist', async () => {
  const userId = 'Abcd1234';
  const playlistName = 'Goldify';
  const playlistDescription = 'Goldify Goldify';
  const tokenData: TokenData = goldifySoloFixtures.getTokensTestData();

  const playlistResponseData = playlistFixtures.createGoldifyPlaylist(
    userId,
    playlistName,
    playlistDescription
  );
  mockedAxios.post.mockResolvedValue({
    data: playlistResponseData,
  });

  const responseData = await createGoldifyPlaylist(
    tokenData,
    userId,
    playlistName,
    playlistDescription
  );
  expect(responseData).toEqual(playlistResponseData);
});

test('CreatePlaylist throws error on bad data', async () => {
  const userId = 'Abcd1234';
  const playlistName = 'Goldify';
  const playlistDescription = 'Goldify Goldify';
  const tokenData: TokenData = goldifySoloFixtures.getTokensTestData();

  mockedAxios.post.mockResolvedValue(null);
  const result = await createGoldifyPlaylist(tokenData, userId, playlistName, playlistDescription);
  expect(result).toBeUndefined();
  expect(console.error).toHaveBeenCalled();
});

test('Gets a Playlist by ID', async () => {
  const playlistId = 'Abcd1234';
  const tokenData: TokenData = goldifySoloFixtures.getTokensTestData();

  const playlistResponseData = playlistFixtures.getPlaylistById(playlistId);
  mockedAxios.get.mockResolvedValue({
    data: playlistResponseData,
  });

  const responseData = await getPlaylistById(tokenData, playlistId);
  expect(responseData).toEqual(playlistResponseData);
});

test('GetPlaylistById throws error on bad data', async () => {
  const playlistId = 'Abcd1234';
  const tokenData: TokenData = goldifySoloFixtures.getTokensTestData();

  mockedAxios.get.mockResolvedValue(null);
  const result = await getPlaylistById(tokenData, playlistId);
  expect(result).toBeUndefined();
  expect(console.error).toHaveBeenCalled();
});

test('Find a playlist by name that exists', async () => {
  const playlistName = 'Goldify';
  const tokenData: TokenData = goldifySoloFixtures.getTokensTestData();

  const userPlaylistResponseData = playlistFixtures.userHasExistingGoldifyPlaylist(playlistName);
  mockedAxios.get.mockResolvedValue({
    data: userPlaylistResponseData,
  });

  const expectedPlaylist = playlistFixtures.existingGoldifyPlaylist(playlistName);
  const responseData = await findExistingGoldifyPlaylistByName(tokenData, playlistName);
  expect(responseData).toEqual(expectedPlaylist);
});

test('Find a playlist by name that does not exist', async () => {
  const playlistName = 'NonExistentPlaylist';
  const tokenData: TokenData = goldifySoloFixtures.getTokensTestData();

  const userPlaylistResponseData = playlistFixtures.userDoesntHaveExistingGoldifyPlaylist();
  mockedAxios.get.mockResolvedValue({
    data: userPlaylistResponseData,
  });

  const responseData = await findExistingGoldifyPlaylistByName(tokenData, playlistName);
  expect(responseData).toBeNull();
});

test('findExistingGoldifyPlaylistByName throws error on bad data', async () => {
  const playlistName = 'Goldify';
  const tokenData: TokenData = goldifySoloFixtures.getTokensTestData();

  mockedAxios.get.mockResolvedValue(null);
  const result = await findExistingGoldifyPlaylistByName(tokenData, playlistName);
  expect(result).toBeNull();
  expect(console.error).toHaveBeenCalled();
});

test('Upload Goldify Playlist Image', async () => {
  const playlistId = 'testPlaylistId123';
  const base64Image = goldifyBase64;
  const tokenData: TokenData = goldifySoloFixtures.getTokensTestData();

  mockedAxios.put.mockResolvedValue({
    status: 202,
  });

  const responseData = await uploadPlaylistImage(tokenData, playlistId, base64Image);
  expect(responseData).toEqual({ status: 202 });
});

test('Upload Goldify Playlist throws error on bad data', async () => {
  const playlistId = 'testPlaylistId123';
  const base64Image = goldifyBase64;
  const tokenData: TokenData = goldifySoloFixtures.getTokensTestData();

  mockedAxios.put.mockResolvedValue(null);
  const result = await uploadPlaylistImage(tokenData, playlistId, base64Image);
  expect(result).toBeUndefined();
  expect(console.error).toHaveBeenCalled();
}); 
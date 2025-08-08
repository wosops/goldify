import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import GoldifyPlaylistData from "../../../js/solo/goldify-playlist/GoldifyPlaylistData";
import { GOLDIFY_PLAYLIST_NAME } from "../../../js/utils/constants";
import { getPlaylistTracksById } from "../../../js/utils/playlistTracks";

// Mock the utility functions
vi.mock("../../../js/utils/GoldifySoloUtils", () => ({
  replaceWindowURL: vi.fn(),
  getSpotifyRedirectURL: vi.fn(),
}));

vi.mock("../../../js/utils/playlistTracks", () => ({
  getPlaylistTracksById: vi.fn(),
  replacePlaylistTracks: vi.fn(),
}));

describe('GoldifyPlaylistData Component', () => {
  const mockAutoFillCompletedHandler = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders empty container when no token/data", () => {
    const { container } = render(
      <GoldifyPlaylistData
        retrievedTokenData={null}
        goldifyPlaylistId="test-id"
        newlyCreatedPlaylist={false}
        autoFillCompletedHandler={mockAutoFillCompletedHandler}
      />
    );
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  test("renders playlist header after data loads", async () => {
    (getPlaylistTracksById as unknown as import('vitest').Mock).mockResolvedValue({
      href: '',
      items: [
        {
          added_at: '',
          added_by: { external_urls: { spotify: '' }, href: '', id: '', type: '', uri: '' },
          is_local: false,
          primary_color: null,
          track: {
            album: {
              album_type: 'album',
              artists: [
                { external_urls: { spotify: '' }, href: '', id: 'a1', name: 'Artist', type: 'artist', uri: '' },
              ],
              external_urls: { spotify: '' },
              href: '',
              id: 'alb1',
              images: [{ height: 50, url: 'http://image', width: 50 }],
              name: 'Album',
              release_date: '',
              release_date_precision: '',
              total_tracks: 1,
              type: 'album',
              uri: '',
            },
            artists: [
              { external_urls: { spotify: '' }, href: '', id: 'a1', name: 'Artist', type: 'artist', uri: '' },
            ],
            disc_number: 1,
            duration_ms: 1000,
            explicit: false,
            external_ids: { isrc: '' },
            external_urls: { spotify: '' },
            href: '',
            id: 't1',
            is_local: false,
            name: 'Track 1',
            popularity: 0,
            preview_url: null,
            track_number: 1,
            type: 'track',
            uri: 'spotify:track:t1',
          },
          video_thumbnail: { url: null },
        },
      ],
      limit: 1,
      next: null,
      offset: 0,
      previous: null,
      total: 1,
    });

    render(
      <GoldifyPlaylistData
        retrievedTokenData={{ access_token: "test-token" }}
        goldifyPlaylistId="test-playlist-id"
        newlyCreatedPlaylist={true}
        autoFillCompletedHandler={mockAutoFillCompletedHandler}
      />
    );

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: `Your ${GOLDIFY_PLAYLIST_NAME} Playlist` })
      ).toBeInTheDocument()
    );
  });
}); 
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import GoldifyPlaylistData from "../../../js/solo/goldify-playlist/GoldifyPlaylistData";

// Mock the utility functions
jest.mock("../../../js/utils/GoldifySoloUtils", () => ({
  replaceWindowURL: jest.fn(),
  getSpotifyRedirectURL: jest.fn(),
}));

jest.mock("../../../js/utils/playlistTracks", () => ({
  getPlaylistTracksById: jest.fn(),
  replacePlaylistTracks: jest.fn(),
}));

describe('GoldifyPlaylistData Component', () => {
  const mockAutoFillCompletedHandler = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders placeholder component when no data", () => {
    render(
      <GoldifyPlaylistData
        retrievedTokenData={null}
        goldifyPlaylistId="test-id"
        newlyCreatedPlaylist={false}
        autoFillCompletedHandler={mockAutoFillCompletedHandler}
      />
    );
    
    // Should render the component heading
    expect(screen.getByRole('heading', { name: 'Goldify Playlist Data' })).toBeInTheDocument();
  });

  test("renders placeholder component with valid props", () => {
    render(
      <GoldifyPlaylistData
        retrievedTokenData={{ access_token: "test-token" }}
        goldifyPlaylistId="test-playlist-id"
        newlyCreatedPlaylist={true}
        autoFillCompletedHandler={mockAutoFillCompletedHandler}
      />
    );
    
    // Should render the component heading and new playlist indicator
    expect(screen.getByRole('heading', { name: 'Goldify Playlist Data' })).toBeInTheDocument();
    expect(screen.getByText('This is a newly created playlist!')).toBeInTheDocument();
  });
}); 
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import GoldifyCreatePlaylist from "../../../js/solo/goldify-playlist/GoldifyCreatePlaylist";
import * as userInfoFixtures from "../../../__fixtures__/UserInfoFixtures";

// Mock the utility functions
vi.mock("../../../js/utils/GoldifySoloUtils", () => ({
  replaceWindowURL: vi.fn(),
}));

vi.mock("../../../js/utils/playlist", () => ({
  createGoldifyPlaylist: vi.fn(),
  uploadPlaylistImage: vi.fn(),
}));

describe('GoldifyCreatePlaylist Component', () => {
  const mockPlaylistUpdater = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders create playlist component with heading", () => {
    render(
      <GoldifyCreatePlaylist
        retrievedTokenData={{ access_token: 'x', token_type: 'Bearer' }}
        userData={null}
        playlistUpdater={mockPlaylistUpdater}
      />
    );
    
    expect(screen.getByRole('heading', { name: 'Create Goldify Playlist' })).toBeInTheDocument();
    expect(screen.getByText('This component will create a new Goldify playlist...')).toBeInTheDocument();
  });

  test("displays user name when userData is provided", () => {
    const testUser = userInfoFixtures.getUserTestData();
    
    render(
      <GoldifyCreatePlaylist
        retrievedTokenData={{ access_token: 'x', token_type: 'Bearer' }}
        userData={testUser}
        playlistUpdater={mockPlaylistUpdater}
      />
    );
    
    expect(screen.getByText(`Creating playlist for ${testUser.display_name}`)).toBeInTheDocument();
  });

  test("does not display user name when userData is null", () => {
    render(
      <GoldifyCreatePlaylist
        retrievedTokenData={{ access_token: 'x', token_type: 'Bearer' }}
        userData={null}
        playlistUpdater={mockPlaylistUpdater}
      />
    );
    
    expect(screen.queryByText(/Creating playlist for/)).not.toBeInTheDocument();
  });
}); 
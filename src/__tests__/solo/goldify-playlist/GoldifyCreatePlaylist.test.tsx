import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import GoldifyCreatePlaylist from "../../../js/solo/goldify-playlist/GoldifyCreatePlaylist";
import * as userInfoFixtures from "../../../__fixtures__/UserInfoFixtures";

// Mock the utility functions
jest.mock("../../../js/utils/GoldifySoloUtils", () => ({
  replaceWindowURL: jest.fn(),
}));

jest.mock("../../../js/utils/playlist", () => ({
  createGoldifyPlaylist: jest.fn(),
  uploadPlaylistImage: jest.fn(),
}));

describe('GoldifyCreatePlaylist Component', () => {
  const mockPlaylistUpdater = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders create playlist component with heading", () => {
    render(
      <GoldifyCreatePlaylist
        retrievedTokenData={{}}
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
        retrievedTokenData={{}}
        userData={testUser}
        playlistUpdater={mockPlaylistUpdater}
      />
    );
    
    expect(screen.getByText(`Creating playlist for ${testUser.display_name}`)).toBeInTheDocument();
  });

  test("does not display user name when userData is null", () => {
    render(
      <GoldifyCreatePlaylist
        retrievedTokenData={{}}
        userData={null}
        playlistUpdater={mockPlaylistUpdater}
      />
    );
    
    expect(screen.queryByText(/Creating playlist for/)).not.toBeInTheDocument();
  });
}); 
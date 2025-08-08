import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import GoldifyPlaylist from "../../../js/solo/goldify-playlist/GoldifyPlaylist";

// Mock the utility functions
vi.mock("../../../js/utils/GoldifySoloUtils", () => ({
  replaceWindowURL: vi.fn(),
}));

vi.mock("../../../js/utils/playlist", () => ({
  findExistingGoldifyPlaylistByName: vi.fn(),
}));

describe('GoldifyPlaylist Component', () => {
  const mockAutoFillCompletedHandler = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders playlist component without crashing", () => {
    const { container } = render(
      <GoldifyPlaylist
        retrievedTokenData={null}
        userData={null}
        newlyCreatedPlaylist={false}
        autoFillCompletedHandler={mockAutoFillCompletedHandler}
      />
    );
    
    // Should render empty div when no playlist data
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  test("renders playlist component with valid props", () => {
    const { container } = render(
      <GoldifyPlaylist
        retrievedTokenData={{ access_token: "test-token" }}
        userData={{ id: "test-user", display_name: "Test User" }}
        newlyCreatedPlaylist={true}
        autoFillCompletedHandler={mockAutoFillCompletedHandler}
      />
    );
    
    // Should render empty div when no existing playlist is found
    expect(container.firstChild).toBeEmptyDOMElement();
  });
}); 
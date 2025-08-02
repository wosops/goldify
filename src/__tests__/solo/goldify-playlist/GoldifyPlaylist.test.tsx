import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import GoldifyPlaylist from "../../../js/solo/goldify-playlist/GoldifyPlaylist";

// Mock the utility functions
jest.mock("../../../js/utils/GoldifySoloUtils", () => ({
  replaceWindowURL: jest.fn(),
}));

jest.mock("../../../js/utils/playlist", () => ({
  findExistingGoldifyPlaylistByName: jest.fn(),
}));

describe('GoldifyPlaylist Component', () => {
  const mockAutoFillCompletedHandler = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
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
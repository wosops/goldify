import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TopListeningData from "../../../js/solo/top-listens/TopListeningData";
import {
  replaceWindowURL,
  getSpotifyRedirectURL,
} from "../../../js/utils/GoldifySoloUtils";
import { retrieveTopListeningDataAxios } from "../../../js/utils/TopListeningDataUtils";
import { HOME_PAGE_PATH } from "../../../js/utils/constants";

vi.mock("../../../js/utils/GoldifySoloUtils", () => ({
  replaceWindowURL: vi.fn(),
  getSpotifyRedirectURL: vi.fn(),
}));

vi.mock("../../../js/utils/TopListeningDataUtils", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    retrieveTopListeningDataAxios: vi.fn(),
  };
});

import * as goldifySoloFixtures from "../../../__fixtures__/GoldifySoloFixtures";
import * as topListeningDataFixtures from "../../../__fixtures__/TopListeningDataFixtures";

describe('TopListeningData Component', () => {
  const mockAddTrackHandler = vi.fn();
  const mockOnAutoFillCompleteHandler = vi.fn();
  const mockGetRemovedTrackData = vi.fn();

  const defaultProps = {
    retrievedTokenData: goldifySoloFixtures.getTokensTestData(),
    goldifyUriList: [],
    addTrackHandler: mockAddTrackHandler,
    playlistDirty: false,
    newlyCreatedPlaylist: false,
    onAutoFillCompleteHandler: mockOnAutoFillCompleteHandler,
    getRemovedTrackData: mockGetRemovedTrackData,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetRemovedTrackData.mockReturnValue({ items: [] });
  });

  test("renders empty state when no token data", () => {
    const { container } = render(
      <TopListeningData
        {...defaultProps}
        retrievedTokenData={null}
      />
    );
    
    // Should render empty div when no token data  
    expect(container.firstChild).toBeEmptyDOMElement();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  test("fetches top listening data when token is provided", async () => {
    (retrieveTopListeningDataAxios as unknown as import('vitest').Mock).mockResolvedValue(
      topListeningDataFixtures.getTopListeningData()
    );

    render(<TopListeningData {...defaultProps} />);

    // Wait for UI to reflect loaded state
    await screen.findByRole('heading', { name: 'Your Top Hits' });

    expect(retrieveTopListeningDataAxios).toHaveBeenCalledWith(
      goldifySoloFixtures.getTokensTestData()
    );
  });

  test("redirects to home page on data fetch failure", async () => {
    (retrieveTopListeningDataAxios as unknown as import('vitest').Mock).mockResolvedValue(undefined);

    render(<TopListeningData {...defaultProps} />);
    
    await waitFor(() => {
      expect(replaceWindowURL).toHaveBeenCalledWith(HOME_PAGE_PATH);
    });
  });

  test("displays track data when successfully loaded", async () => {
    (retrieveTopListeningDataAxios as unknown as import('vitest').Mock).mockResolvedValue(
      topListeningDataFixtures.getTopListeningData()
    );

    render(<TopListeningData {...defaultProps} />);

    // Wait for data to load and component to render
    await screen.findByRole('heading', { name: 'Your Top Hits' });

    // Should also have the time range selector
    expect(screen.getByLabelText('Time Range')).toBeInTheDocument();
  });

  test("auto-fills playlist for newly created empty playlists", async () => {
    (retrieveTopListeningDataAxios as unknown as import('vitest').Mock).mockResolvedValue(
      topListeningDataFixtures.getTopListeningData()
    );

    render(
      <TopListeningData
        {...defaultProps}
        newlyCreatedPlaylist={true}
        goldifyUriList={[]}
      />
    );

    // Ensure UI loaded first
    await screen.findByRole('heading', { name: 'Your Top Hits' });

    // Wait for auto-fill to complete
    await waitFor(() => {
      expect(mockAddTrackHandler).toHaveBeenCalled();
    });
  });

  test("does not auto-fill non-empty playlists", async () => {
    (retrieveTopListeningDataAxios as unknown as import('vitest').Mock).mockResolvedValue(
      topListeningDataFixtures.getTopListeningData()
    );

    render(
      <TopListeningData
        {...defaultProps}
        newlyCreatedPlaylist={true}
        goldifyUriList={["spotify:track:existing"]}
      />
    );

    // Ensure UI loaded first
    await screen.findByRole('heading', { name: 'Your Top Hits' });

    // Ensure no auto-fill happens
    await waitFor(() => {
      expect(mockAddTrackHandler).not.toHaveBeenCalled();
    });
  });
}); 
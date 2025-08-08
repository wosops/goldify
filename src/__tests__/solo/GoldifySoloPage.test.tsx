import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import GoldifySoloPage from "../../js/solo/GoldifySoloPage";
import {
  retrieveTokensAxios,
  retrieveAuthenticationCode,
  replaceWindowURL,
  getLoadingPage,
} from "../../js/utils/GoldifySoloUtils";
import { retrieveUserDataAxios } from "../../js/utils/UserInfoUtils";
import { HOME_PAGE_PATH } from "../../js/utils/constants";

vi.mock("../../js/utils/GoldifySoloUtils", () => ({
  retrieveAuthenticationCode: jest.fn(),
  retrieveAuthorization: jest.fn(),
  retrieveTokensAxios: jest.fn(),
  replaceWindowURL: jest.fn(),
  getLoadingPage: jest.fn(),
  clearAuthCodeFromURL: jest.fn(),
}));

vi.mock("../../js/utils/UserInfoUtils", () => ({
  retrieveUserDataAxios: jest.fn(),
}));

import * as goldifySoloFixtures from "../../__fixtures__/GoldifySoloFixtures";
import * as userInfoFixtures from "../../__fixtures__/UserInfoFixtures";

describe('GoldifySoloPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders loading page when authentication code is available", async () => {
    (retrieveAuthenticationCode as jest.Mock).mockReturnValue("test-auth-code");
    (getLoadingPage as jest.Mock).mockReturnValue(<div>Loading...</div>);
    (retrieveTokensAxios as jest.Mock).mockResolvedValue(goldifySoloFixtures.getTokensTestData());
    (retrieveUserDataAxios as jest.Mock).mockResolvedValue(userInfoFixtures.getUserTestData());

    render(<GoldifySoloPage />);

    expect(retrieveAuthenticationCode).toHaveBeenCalled();
    await waitFor(() => {
      expect(retrieveTokensAxios).toHaveBeenCalledWith("test-auth-code");
    });
  });

  test("redirects to authorization when no authentication code", () => {
    (retrieveAuthenticationCode as jest.Mock).mockReturnValue(null);
    (getLoadingPage as jest.Mock).mockReturnValue(<div>Loading...</div>);

    render(<GoldifySoloPage />);
    
    expect(retrieveAuthenticationCode).toHaveBeenCalled();
  });

  test("redirects to home page on token retrieval failure", async () => {
    (retrieveAuthenticationCode as jest.Mock).mockReturnValue("test-auth-code");
    (getLoadingPage as jest.Mock).mockReturnValue(<div>Loading...</div>);
    (retrieveTokensAxios as jest.Mock).mockResolvedValue(undefined);

    render(<GoldifySoloPage />);
    
    await waitFor(() => {
      expect(replaceWindowURL).toHaveBeenCalledWith(HOME_PAGE_PATH);
    });
  });

  test("redirects to home page on user data retrieval failure", async () => {
    (retrieveAuthenticationCode as jest.Mock).mockReturnValue("test-auth-code");
    (getLoadingPage as jest.Mock).mockReturnValue(<div>Loading...</div>);
    (retrieveTokensAxios as jest.Mock).mockResolvedValue(goldifySoloFixtures.getTokensTestData());
    (retrieveUserDataAxios as jest.Mock).mockResolvedValue(undefined);

    render(<GoldifySoloPage />);
    
    await waitFor(() => {
      expect(replaceWindowURL).toHaveBeenCalledWith(HOME_PAGE_PATH);
    });
  });

  test("renders main content when data is loaded successfully", async () => {
    (retrieveAuthenticationCode as jest.Mock).mockReturnValue("test-auth-code");
    (getLoadingPage as jest.Mock).mockReturnValue(<div>Loading...</div>);
    (retrieveTokensAxios as jest.Mock).mockResolvedValue(goldifySoloFixtures.getTokensTestData());
    (retrieveUserDataAxios as jest.Mock).mockResolvedValue(userInfoFixtures.getUserTestData());

    render(<GoldifySoloPage />);
    
    // Should eventually render the main goldify page with user's name
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Test User' })).toBeInTheDocument();
    });
    
    // Should also show the container is rendered
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });
}); 
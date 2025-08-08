import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserInfo from "../../../js/solo/user-info/UserInfo";
import * as userInfoFixtures from "../../../__fixtures__/UserInfoFixtures";

// Mock the utility functions
jest.mock("../../../js/utils/GoldifySoloUtils", () => ({
  replaceWindowURL: jest.fn(),
}));

// Mock window.open for profile link tests
const mockWindowOpen = jest.fn();
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockWindowOpen
});

describe('UserInfo Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders empty state when no user data provided", () => {
    const { container } = render(<UserInfo userData={null} />);
    
    // Should render just an empty div when no data
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.queryByAltText('Profile Image')).not.toBeInTheDocument();
  });

  test("displays user information when userData is provided", async () => {
    const testUser = userInfoFixtures.getUserTestData();
    render(<UserInfo userData={testUser} />);
    
    // Check that user's display name appears as a heading
    await screen.findByRole('heading', { name: testUser.display_name });
    
    // Check that profile image is displayed
    expect(screen.getByAltText('Profile Image')).toBeInTheDocument();
    
    // Check that Spotify logo is displayed
    expect(screen.getByAltText('Spotify Logo')).toBeInTheDocument();
  });

  test("displays default image when user has no profile picture", async () => {
    const userDataNoImage = {
      ...userInfoFixtures.getUserTestData(),
      images: []
    };
    
    render(<UserInfo userData={userDataNoImage} />);
    
    // Should still show user name
    await screen.findByRole('heading', { name: userDataNoImage.display_name });
    
    // Should show a profile image or fallback avatar icon when no image
    const profileImage = screen.queryByAltText('Profile Image');
    if (profileImage) {
      expect(profileImage).toBeInTheDocument();
    } else {
      expect(screen.getByTestId('PersonIcon')).toBeInTheDocument();
    }
  });

  test("opens Spotify profile when user card is clicked", async () => {
    const testUser = userInfoFixtures.getUserTestData();
    render(<UserInfo userData={testUser} />);
    
    // Find the clickable card and click it
    const userCard = (await screen.findByRole('heading', { name: testUser.display_name })).closest('.card');
    expect(userCard).toBeInTheDocument();
    
    fireEvent.click(userCard!);
    
    // Check that window.open was called with the correct URL
    expect(mockWindowOpen).toHaveBeenCalledWith(testUser.external_urls.spotify, '_blank');
  });
}); 
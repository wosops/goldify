import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../../test-utils';
import '@testing-library/jest-dom';
import GoldifyLandingPage from '../../js/landing/GoldifyLandingPage';

test('Goldify Landing Page has expected contents', () => {
  render(<GoldifyLandingPage />);
  const welcomeElement = screen.getByText(/Welcome to Goldify!/i);
  expect(welcomeElement).toBeInTheDocument();
  const mobileFriendlyElement = screen.getByText(/Mobile Friendly/i);
  expect(mobileFriendlyElement).toBeInTheDocument();
  const questionElement = screen.getByText(/Question Time!/i);
  expect(questionElement).toBeInTheDocument();
  const followOnGitHubElement = screen.getByText(/Follow On GitHub/i);
  expect(followOnGitHubElement).toBeInTheDocument();
}); 
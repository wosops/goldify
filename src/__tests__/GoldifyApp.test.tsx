import React from 'react';
import { act, screen, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import GoldifyApp from '../js/GoldifyApp';

// Since GoldifyApp has its own Router, we'll test the actual app initialization
test('Goldify App has proper footer', () => {
  render(<GoldifyApp />);
  
  const footerElement = screen.getByText(/Goldify is powered by/i);
  expect(footerElement).toBeInTheDocument();
});

test('Goldify App renders without crashing', () => {
  render(<GoldifyApp />);
  
  // Get all logo elements and verify at least one exists
  const logoElements = screen.getAllByAltText('Goldify Logo');
  expect(logoElements.length).toBeGreaterThan(0);
  expect(logoElements[0]).toBeInTheDocument();
});

test('Load index script file without error', async () => {
  const root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
  await act(async () => {
    await import('../index');
  });
});
import React from 'react';
import { act, screen, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import reportWebVitals from '../js/utils/reportWebVitals';
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

test('Run Web Vitals', () => {
  const mockCallback = jest.fn();
  reportWebVitals(mockCallback);
  
  // Test with console.log
  reportWebVitals(console.log);
});

test('Load index script file without error', () => {
  const root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
  act(() => {
    require('../index.tsx');
  });
}); 
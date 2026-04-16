// Extend expect with jest-dom matchers (works in Vitest too)
import '@testing-library/jest-dom';

import { vi } from 'vitest';

// Silence noisy console.error logs from utility calls in tests that intentionally simulate failures
const originalConsoleError = global.console.error;
beforeEach(() => {
  vi.spyOn(global.console, 'error').mockImplementation((...args: unknown[]) => {
    if (originalConsoleError && args.length === 0) {
      originalConsoleError();
    }
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

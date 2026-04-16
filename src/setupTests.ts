// Extend expect with jest-dom matchers (works in Vitest too)
import '@testing-library/jest-dom';

import { vi } from 'vitest';

// Globally mock the http wrapper so tests can use vi.mocked(httpGet) etc. without
// repeating the factory in every file. http.test.ts opts out via vi.unmock to
// exercise the real wrapper against a stubbed fetch.
vi.mock('./js/utils/http', async importOriginal => {
  const actual = await importOriginal<typeof import('./js/utils/http')>();
  return {
    ...actual,
    httpGet: vi.fn(),
    httpPost: vi.fn(),
    httpPut: vi.fn(),
    httpPutBinary: vi.fn(),
    httpPostForm: vi.fn(),
  };
});

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

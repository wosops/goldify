// Extend expect with jest-dom matchers (works in Vitest too)
import '@testing-library/jest-dom';

// Provide a runtime bridge so existing Jest-style tests continue to work under Vitest
import { vi } from 'vitest';
(globalThis as any).jest = vi;

// Provide a default axios mock that matches typical usage in tests
vi.mock('axios', () => {
  const axiosFn: any = vi.fn();
  axiosFn.get = vi.fn();
  axiosFn.post = vi.fn();
  axiosFn.put = vi.fn();
  axiosFn.delete = vi.fn();
  axiosFn.create = vi.fn(() => ({ get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() }));
  return { __esModule: true, default: axiosFn };
});

// Silence noisy console.error logs from axios calls in tests that intentionally simulate failures
const originalConsoleError = global.console.error;
beforeEach(() => {
  // Use the bridged Jest API (backed by Vitest) so existing tests don't change
  jest.spyOn(global.console, 'error').mockImplementation((...args: unknown[]) => {
    originalConsoleError && args.length === 0 && originalConsoleError();
  });
});

afterEach(() => {
  (global.console.error as jest.Mock | undefined)?.mockRestore?.();
});

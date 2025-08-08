declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.ico' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.ttf' {
  const content: string;
  export default content;
}

// React 19 type shim for react-dom/client when using bundler resolution
declare module 'react-dom/client' {
  import { ReactNode } from 'react';
  interface Root {
    render(children: ReactNode): void;
  }
  export function createRoot(container: Element | DocumentFragment): Root;
}

// Minimal Jest type shims so existing casts like `as jest.Mock` compile under Vitest
declare namespace jest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Mock<T = any, Y extends any[] = any> = {
    (...args: Y): T;
    mockImplementation: (...args: unknown[]) => unknown;
    mockResolvedValue: (value: unknown) => unknown;
    mockReturnValue: (value: unknown) => unknown;
    mockRestore?: () => void;
    // allow index access for axios method mocks like get/post/put
    [key: string]: unknown;
  } & ((...args: Y) => T);
}

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

// These globals are injected at build time by Vite (see vite.config.ts -> define)
// They serve as a fallback when import.meta.env is not directly available (e.g., certain test environments)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const __VITE_SPOTIFY_CLIENT_ID__: string | undefined;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const __VITE_SPOTIFY_CLIENT_SECRET__: string | undefined;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const __VITE_SPOTIFY_REDIRECT_URI__: string | undefined;

// Safely access import.meta.env via an indirect eval to avoid parser/runtime issues in Jest/Node
const importMetaEnv = (() => {
  try {
    // Avoid direct syntax that mentions import.meta so Jest/CommonJS can parse this file
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
    return new Function(
      'return (typeof import !== "undefined" && typeof import.meta !== "undefined" && import.meta.env) ? import.meta.env : undefined;'
    )();
  } catch {
    return undefined;
  }
})() as Record<string, string | undefined> | undefined;

// Guarded access to process.env so it never throws in the browser
interface NodeProcessLike {
  env?: Record<string, string | undefined>;
}

const nodeProcessEnv = (() => {
  try {
    // In Node/Jest this will exist; in the browser it won't
    return typeof process !== 'undefined' && (process as NodeProcessLike)?.env
      ? (process.env as Record<string, string | undefined>)
      : undefined;
  } catch {
    return undefined;
  }
})();

export const env = {
  VITE_SPOTIFY_CLIENT_ID:
    importMetaEnv?.VITE_SPOTIFY_CLIENT_ID ||
    (typeof __VITE_SPOTIFY_CLIENT_ID__ !== 'undefined' ? __VITE_SPOTIFY_CLIENT_ID__ : undefined) ||
    nodeProcessEnv?.VITE_SPOTIFY_CLIENT_ID ||
    nodeProcessEnv?.REACT_APP_SPOTIFY_CLIENT_ID,
  VITE_SPOTIFY_CLIENT_SECRET:
    importMetaEnv?.VITE_SPOTIFY_CLIENT_SECRET ||
    (typeof __VITE_SPOTIFY_CLIENT_SECRET__ !== 'undefined' ? __VITE_SPOTIFY_CLIENT_SECRET__ : undefined) ||
    nodeProcessEnv?.VITE_SPOTIFY_CLIENT_SECRET ||
    nodeProcessEnv?.REACT_APP_SPOTIFY_CLIENT_SECRET,
  VITE_SPOTIFY_REDIRECT_URI:
    importMetaEnv?.VITE_SPOTIFY_REDIRECT_URI ||
    (typeof __VITE_SPOTIFY_REDIRECT_URI__ !== 'undefined' ? __VITE_SPOTIFY_REDIRECT_URI__ : undefined) ||
    nodeProcessEnv?.VITE_SPOTIFY_REDIRECT_URI ||
    nodeProcessEnv?.REACT_APP_SPOTIFY_REDIRECT_URI,
} as const;



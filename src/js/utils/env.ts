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

export const env = {
  VITE_SPOTIFY_CLIENT_ID:
    importMetaEnv?.VITE_SPOTIFY_CLIENT_ID ||
    process.env.VITE_SPOTIFY_CLIENT_ID ||
    process.env.REACT_APP_SPOTIFY_CLIENT_ID,
  VITE_SPOTIFY_CLIENT_SECRET:
    importMetaEnv?.VITE_SPOTIFY_CLIENT_SECRET ||
    process.env.VITE_SPOTIFY_CLIENT_SECRET ||
    process.env.REACT_APP_SPOTIFY_CLIENT_SECRET,
  VITE_SPOTIFY_REDIRECT_URI:
    importMetaEnv?.VITE_SPOTIFY_REDIRECT_URI ||
    process.env.VITE_SPOTIFY_REDIRECT_URI ||
    process.env.REACT_APP_SPOTIFY_REDIRECT_URI,
} as const;



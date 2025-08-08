import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      host: '127.0.0.1',
      port: 3000,
      open: false,
    },
    build: {
      outDir: 'dist',
    },
    define: {
      __VITE_SPOTIFY_CLIENT_ID__: JSON.stringify(env.VITE_SPOTIFY_CLIENT_ID),
      __VITE_SPOTIFY_CLIENT_SECRET__: JSON.stringify(env.VITE_SPOTIFY_CLIENT_SECRET),
      __VITE_SPOTIFY_REDIRECT_URI__: JSON.stringify(env.VITE_SPOTIFY_REDIRECT_URI),
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['src/setupTests.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'lcov', 'html'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/**/__tests__/**'],
      },
    },
  };
});




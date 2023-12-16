/// <reference types="vitest" />
import { defineConfig } from 'vite';

import viteTsConfigPaths from 'vite-tsconfig-paths';
import eslint from 'vite-plugin-eslint';
import checker from 'vite-plugin-checker';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/chess-client',
  build: {
    sourcemap: true,
  },
  server: {
    port: 4200,
    host: 'localhost',
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [
    viteTsConfigPaths({
      root: '../../',
    }),
    eslint({
      fix: true,
      failOnError: false,
    }),
    checker({
      typescript: {
        tsconfigPath: 'packages/chess-client/tsconfig.app.json',
      },
    }),
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [
  //    viteTsConfigPaths({
  //      root: '../../',
  //    }),
  //  ],
  // },

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});

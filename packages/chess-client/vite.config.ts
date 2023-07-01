/// <reference types="vitest" />
import { defineConfig } from 'vite';

import viteTsConfigPaths from 'vite-tsconfig-paths';
import eslint from 'vite-plugin-eslint'

export default defineConfig({
  cacheDir: '../../node_modules/.vite/chess-client',
  build: {
    rollupOptions:
    {
      output: {
        manualChunks: {
          'chess-client': [
            'packages/chess-client/src/app/components/pages/best-score-page/best-score-page.ts',
            ],
          'game-page': [
            'packages/chess-client/src/app/components/pages/game-page/game-page.ts',
            ],
        }
      }
    }
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
    })
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

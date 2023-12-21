/// <reference types="vitest" />
import { defineConfig } from 'vite';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import eslint from 'vite-plugin-eslint';
import checker from 'vite-plugin-checker';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/chess-client',
  build: {
    outDir: '../../dist/packages/chess-client',
    reportCompressedSize: true,
    commonjsOptions: { transformMixedEsModules: true },
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
    nxViteTsPaths(),
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
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/packages/chess-client',
      provider: 'v8',
    },
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});

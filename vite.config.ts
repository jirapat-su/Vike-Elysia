import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import vike from 'vike/plugin';
import { defineConfig } from 'vite';
import vercel from 'vite-plugin-vercel';

import { devServer } from './dev-server';

export default defineConfig({
  build: {
    target: 'es2022',
  },
  plugins: [
    vike(),
    devServer({
      entry: 'server/app.server.ts',

      exclude: [
        /^\/@.+$/,
        /.*\.(ts|tsx|vue)($|\?)/,
        /.*\.(s?css|less)($|\?)/,
        /^\/favicon\.ico$/,
        /.*\.(svg|png)($|\?)/,
        /^\/(public|assets|static)\/.+/,
        /^\/node_modules\/.*/,
      ],

      injectClientScript: false,
    }),
    react(),
    tailwindcss(),
    vercel({ source: '/.*' }),
  ],
  resolve: {
    alias: { '@': __dirname },
  },
  vercel: {
    additionalEndpoints: [
      {
        destination: 'ssr_',
        route: false,
        source: 'server/app.server.ts',
      },
    ],
  },
});

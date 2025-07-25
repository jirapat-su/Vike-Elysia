import type { Config } from 'vike/types';

import vikeServer from 'vike-server/config';

const serverConfig: Config = {
  extends: [vikeServer],
  server: {
    entry: 'server/standalone.server.ts',
    standalone: {
      esbuild: {
        minify: true,
      },
    },
  },
};

const config = (() => {
  if (process.env.VERCEL === '1') return {};
  if (process.env.npm_lifecycle_event !== 'build') return {};
  return serverConfig;
})();

export default config;

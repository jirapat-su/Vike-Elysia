import type { Config } from 'vike/types';

import vikeServer from 'vike-server/config';

const serverConfig: Config = {
  extends: [vikeServer as Config],
  server: {
    entry: 'server/standalone.server.ts',
    standalone: true,
  },
};

const config = (() => {
  // Vercel provides its own server environment
  if (process.env.VERCEL === '1') {
    return {};
  }

  // Only use the server config for `vike build` (not for `vike dev`)
  if (process.env.npm_lifecycle_event !== 'build') {
    return {};
  }
  return serverConfig;
})();

export default config;

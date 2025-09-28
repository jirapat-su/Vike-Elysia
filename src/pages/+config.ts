import type { Config } from 'vike/types';

import vikeReact from 'vike-react/config';

const config: Config = {
  extends: vikeReact,
  prerender: false,
  title: 'My Vike App',
};

export default config;

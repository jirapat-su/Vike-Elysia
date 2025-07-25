import node from '@elysiajs/node';
import staticPlugin from '@elysiajs/static';
import Elysia from 'elysia';
import path from 'node:path';

import appServer from './app.server';

const standaloneServer = new Elysia({
  adapter: node(),
  name: 'standalone.server',
})
  .use(
    staticPlugin({
      assets: path.join(process.cwd(), 'dist', 'client'),
      prefix: '/',
    })
  )
  .use(appServer!);

export default standaloneServer;

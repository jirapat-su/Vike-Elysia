import staticPlugin from '@elysiajs/static';
import Elysia from 'elysia';
import path from 'node:path';

import appServer from './app.server';

const standaloneServer = new Elysia({
  name: 'standalone.server',
})
  .use(
    staticPlugin({
      assets: path.join(process.cwd(), 'dist', 'client'),
      prefix: '/',
    })
  )
  .use(appServer!);

const server = {
  fetch: standaloneServer.fetch,
  port: process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000,
};

export default server;

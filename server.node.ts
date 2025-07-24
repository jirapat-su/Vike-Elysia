import { staticPlugin } from '@elysiajs/static';
import { Elysia } from 'elysia';
import path from 'node:path';

import app from './server';

const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000;

const staticFile = new Elysia({ name: 'client.static' }).use(
  staticPlugin({
    assets: path.join(process.cwd(), 'dist', 'client'),
    prefix: '/',
  })
);

const nodeServer = new Elysia({
  name: 'prod.server',
})
  .use(staticFile)
  .use(app)
  .listen(port);

// eslint-disable-next-line no-console
console.log(`Server listening on ${nodeServer.server?.url}`);

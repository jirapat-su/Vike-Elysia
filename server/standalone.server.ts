import path from 'node:path';
import staticPlugin from '@elysiajs/static';
import type { ServeFunctionOptions } from 'bun';
import Elysia from 'elysia';
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
  .use(
    appServer ??
      (() => {
        throw new Error('App Server is undefined');
      })
  );

const server: ServeFunctionOptions<unknown, 0> = {
  development: false,
  fetch: standaloneServer.fetch,
  hostname: '0.0.0.0',
  port: process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000,
};

export default server;

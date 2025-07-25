import cors from '@elysiajs/cors';
import swagger from '@elysiajs/swagger';
import Elysia from 'elysia';

import pkg from '@/package.json';

import { apiRoutes } from './routes';

const api = new Elysia({ name: 'app.api', prefix: '/api', strictPath: true })
  .use(
    cors({
      origin: true,
    })
  )
  .use(apiRoutes())
  .use(
    swagger({
      documentation: {
        info: {
          title: 'API Documentation',
          version: pkg.version,
        },
      },
      exclude: ['/api/docs', '/api/docs/json'],
      path: '/docs',
      provider: 'scalar',
      scalarConfig: {
        defaultHttpClient: {
          clientKey: 'fetch',
          targetKey: 'javascript',
        },
        spec: { url: '/api/docs/json' },
      },
    })
  );

export type API = typeof api;
export { api };

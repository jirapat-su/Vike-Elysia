import cors from '@elysiajs/cors';
import openapi from '@elysiajs/openapi';
import { fromTypes } from '@elysiajs/openapi/gen';
import Elysia from 'elysia';
import { defaultRouter } from './router/default';

export const api = new Elysia({
  name: 'app.api',
  prefix: '/api',
  strictPath: true,
})
  .use(
    openapi({
      documentation: {
        components: {
          securitySchemes: {
            bearerAuth: {
              bearerFormat: 'JWT',
              scheme: 'bearer',
              type: 'http',
            },
          },
        },
        info: {
          title: 'Vike + Elysia API',
          version: '1.0.0',
        },
        security: [{ bearerAuth: [] }],
      },
      enabled: process.env.NODE_ENV === 'development',
      exclude: {
        methods: ['all', 'options', 'head'],
      },
      path: '/docs',
      provider: 'scalar',
      references: fromTypes('src/api/index.ts'),
      specPath: '/docs/json',
    })
  )
  .use(
    cors({
      origin: true,
    })
  )
  .use(defaultRouter);

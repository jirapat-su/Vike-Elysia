import { createHandler, createMiddleware } from '@universal-middleware/elysia';
import { Elysia } from 'elysia';

import { api } from '@/src/api';
import { simpleContext } from '@/src/utils/server/simple-context';
import { vikeHandler } from '@/src/utils/server/vike-handler';

const app = new Elysia({
  name: 'app.server',
})
  .use(createMiddleware(simpleContext)())
  .use(api)
  .all('*', createHandler(vikeHandler)());

export const GET = (request: Request) => app.fetch(request);
export const POST = (request: Request) => app.fetch(request);
export const PUT = (request: Request) => app.fetch(request);
export const DELETE = (request: Request) => app.fetch(request);
export const PATCH = (request: Request) => app.fetch(request);
export const OPTIONS = (request: Request) => app.fetch(request);
export const HEAD = (request: Request) => app.fetch(request);

export default app;

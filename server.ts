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

const GET = app.handle;
const POST = app.handle;
const PUT = app.handle;
const DELETE = app.handle;
const PATCH = app.handle;
const OPTIONS = app.handle;
const HEAD = app.handle;

export default process.env.VERCEL === '1' ? undefined : app;
export { DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT };

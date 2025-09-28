import type { Get, UniversalHandler } from '@universal-middleware/core';
import { createHandler, createMiddleware } from '@universal-middleware/elysia';
import Elysia from 'elysia';
import { renderPage } from 'vike/server';

import { api } from '@/src/api';
import { simpleContext } from '@/src/utils/simple-context';

// Define the Vike handler for rendering pages
const vikeHandler: Get<[], UniversalHandler> =
  () => async (request, context, runtime) => {
    const pageContextInit = {
      ...context,
      ...runtime,
      headersOriginal: request.headers,
      urlOriginal: request.url,
    };
    const pageContext = await renderPage(pageContextInit);
    const response = pageContext.httpResponse;

    const { readable, writable } = new TransformStream();
    response.pipe(writable);

    return new Response(readable, {
      headers: response.headers,
      status: response.statusCode,
    });
  };

// Create the main application server instance
const appServer = new Elysia({
  name: 'app.server',
})
  .use(api)
  .use(createMiddleware(simpleContext)())
  .all('*', createHandler(vikeHandler)());

// Export the handlers for different HTTP methods
export const GET = appServer.handle;
export const POST = appServer.handle;
export const PUT = appServer.handle;
export const DELETE = appServer.handle;
export const PATCH = appServer.handle;
export const OPTIONS = appServer.handle;
export const HEAD = appServer.handle;

// Export the Elysia app instance for use in the Vite dev server
export default process.env.VERCEL === '1' ? undefined : appServer;

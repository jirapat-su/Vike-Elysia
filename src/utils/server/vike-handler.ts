import type { Get, UniversalHandler } from '@universal-middleware/core';

import { renderPage } from 'vike/server';

export const vikeHandler: Get<[], UniversalHandler> =
  () => async (request, context, runtime) => {
    const pageContextInit = {
      ...context,
      ...runtime,
      headersOriginal: request.headers,
      urlOriginal: request.url,
    };

    const pageContext = await renderPage(pageContextInit);
    const response = pageContext.httpResponse;
    const readable = response.getReadableWebStream();

    return new Response(readable, {
      headers: response.headers,
      status: response.statusCode,
    });
  };

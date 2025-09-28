import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin, ViteDevServer } from 'vite';

type ElysiaApp = {
  fetch: (request: Request) => Promise<Response>;
};

type ElysiaDevServerOptions = {
  entry: string;
  exclude?: (RegExp | string)[];
  injectClientScript?: boolean;
};

export function devServer(options: ElysiaDevServerOptions): Plugin {
  const { entry, exclude = [] } = options;

  let server: ViteDevServer;
  let elysiaApp: ElysiaApp;

  const shouldExclude = (url: string): boolean => {
    return exclude.some(pattern => {
      if (typeof pattern === 'string') {
        return url.startsWith(pattern);
      }
      return pattern.test(url);
    });
  };

  return {
    configureServer(viteServer) {
      server = viteServer;

      const getRequestUrl = (req: IncomingMessage, url: string) => {
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const host = req.headers.host;
        return `${protocol}://${host}${url}`;
      };

      const appendArrayHeaders = (
        headers: Headers,
        key: string,
        values: string[]
      ) => {
        for (const v of values) {
          headers.append(key, v);
        }
      };

      const getHeaders = (req: IncomingMessage) => {
        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers)) {
          if (typeof value === 'string') {
            headers.set(key, value);
          } else if (Array.isArray(value)) {
            appendArrayHeaders(headers, key, value);
          }
        }
        return headers;
      };

      const getRequestBody = async (
        req: IncomingMessage
      ): Promise<null | string> => {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          return await new Promise<string>(resolve => {
            const chunks: Buffer[] = [];
            req.on('data', (chunk: Buffer) => chunks.push(chunk));
            req.on('end', () => resolve(Buffer.concat(chunks).toString()));
          });
        }
        return null;
      };

      const readResponseBody = async (response: Response): Promise<string> => {
        if (!response.body) return '';

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let result = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += decoder.decode(value, { stream: true });
        }

        return result;
      };

      const sendResponse = async (res: ServerResponse, response: Response) => {
        // Set headers and status from the original response without consuming the body
        response.headers.forEach((value: string, key: string) => {
          res.setHeader(key, value);
        });

        res.statusCode = response.status;

        // Handle response body safely
        if (response.body) {
          try {
            const result = await readResponseBody(response);
            res.write(result);
            res.end();
          } catch (error) {
            console.error('Error reading response:', error);
            res.end();
          }
        } else {
          res.end();
        }
      };

      const middleware = async (
        req: IncomingMessage,
        res: ServerResponse,
        next: () => void
      ) => {
        const url = req.url || '';

        if (shouldExclude(url)) {
          return next();
        }

        try {
          // Load the Elysia app dynamically
          const entryModule = await server.ssrLoadModule(entry);
          elysiaApp = entryModule.default || entryModule.app;

          if (!elysiaApp || typeof elysiaApp.fetch !== 'function') {
            console.warn('Elysia app not found or invalid in entry file');
            return next();
          }

          const requestUrl = getRequestUrl(req, url);
          const headers = getHeaders(req);
          const body = await getRequestBody(req);

          const request = new Request(requestUrl, {
            body,
            headers,
            method: req.method,
          });

          const response = await elysiaApp.fetch(request);
          await sendResponse(res, response);
        } catch (error) {
          console.error('Elysia dev server error:', error);
          next();
        }
      };

      // Use the middleware for all requests
      server.middlewares.use(middleware);
    },
    name: 'dev-server-plugin',
  };
}

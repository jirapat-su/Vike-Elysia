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

export function elysiaDevServer(options: ElysiaDevServerOptions): Plugin {
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

          // Convert Node.js request to Web API Request
          const protocol = req.headers['x-forwarded-proto'] || 'http';
          const host = req.headers.host;
          const requestUrl = `${protocol}://${host}${url}`;

          const headers = new Headers();
          for (const [key, value] of Object.entries(req.headers)) {
            if (typeof value === 'string') {
              headers.set(key, value);
            } else if (Array.isArray(value)) {
              value.forEach(v => headers.append(key, v));
            }
          }

          let body: null | string = null;
          if (req.method !== 'GET' && req.method !== 'HEAD') {
            body = await new Promise<string>(resolve => {
              const chunks: Buffer[] = [];
              req.on('data', (chunk: Buffer) => chunks.push(chunk));
              req.on('end', () => resolve(Buffer.concat(chunks).toString()));
            });
          }

          const request = new Request(requestUrl, {
            body,
            headers,
            method: req.method,
          });

          // Call Elysia app
          const response = await elysiaApp.fetch(request);

          // Set response headers
          response.headers.forEach((value: string, key: string) => {
            res.setHeader(key, value);
          });

          res.statusCode = response.status;

          if (response.body) {
            const reader = response.body.getReader();
            const pump = async () => {
              try {
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  res.write(value);
                }
                res.end();
              } catch (error) {
                console.error('Error streaming response:', error);
                res.end();
              }
            };
            pump();
          } else {
            res.end();
          }
        } catch (error) {
          console.error('Elysia dev server error:', error);
          next();
        }
      };

      // Use the middleware for all requests
      server.middlewares.use(middleware);
    },
    name: 'elysia-dev-server',
  };
}

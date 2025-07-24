import Elysia from 'elysia';
import { uptime } from 'node:process';

type DefaultRouteProps = Readonly<{
  prefixPath?: string;
}>;

export const defaultRoute = (props?: DefaultRouteProps) =>
  new Elysia({
    detail: {
      tags: ['Default'],
    },
    name: 'default.route',
    prefix: props?.prefixPath || '',
  })
    .get(
      '/',
      () => {
        return { message: 'Hello from Elysia API!' };
      },
      {
        detail: {
          description: 'This is the default route of the API.',
          summary: 'Default Route',
        },
      }
    )
    .get(
      '/health',
      () => {
        return {
          message: 'ok',
          uptime: uptime(),
        };
      },
      {
        detail: {
          description: 'Health check endpoint.',
          summary: 'Health Check',
        },
      }
    );

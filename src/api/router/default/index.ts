import Elysia from 'elysia';

export const defaultRouter = new Elysia({
  detail: {
    tags: ['Default'],
  },
  name: 'default.route',
}).get(
  '/',
  ({ status }) => {
    return status(200, { message: 'ok' });
  },
  {
    detail: {
      description: 'This is the default route of the API.',
      summary: 'Default Route',
    },
  }
);

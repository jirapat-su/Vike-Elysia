import Elysia from 'elysia';

export const defaultRouter = new Elysia({
  detail: {
    tags: ['Default'],
  },
  name: 'default.route',
  prefix: '',
}).get(
  '/',
  () => {
    return { message: 'Hello from Elysia API!' } as const;
  },
  {
    detail: {
      description: 'This is the default route of the API.',
      summary: 'Default Route',
    },
  }
);

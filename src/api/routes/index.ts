import type Elysia from 'elysia';

import { defaultRoute } from './default';

export const apiRoutes = () => (app: Elysia) => {
  return app.use(defaultRoute());
};

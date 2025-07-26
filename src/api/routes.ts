import type Elysia from 'elysia';

import { defaultRoute } from './features/default';

export const apiRoutes = (app: Elysia) => app.use(defaultRoute);

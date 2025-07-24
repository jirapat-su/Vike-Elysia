import type { Get, UniversalMiddleware } from '@universal-middleware/core';

const simpleContext: Get<[], UniversalMiddleware> =
  () => async (_: Request, context: Universal.Context) => {
    return {
      ...context,
      simpleText: 'Hello, world!',
    };
  };

export { simpleContext };

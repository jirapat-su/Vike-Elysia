import type { Get, UniversalMiddleware } from '@universal-middleware/core';

const simpleContext: Get<[], UniversalMiddleware> =
  () => async (_, context) => {
    return {
      ...context,
      simpleText: 'Hello, world!',
    };
  };

export { simpleContext };

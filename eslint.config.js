import antfu from '@antfu/eslint-config';
import perfectionist from 'eslint-plugin-perfectionist';
import prettier from 'eslint-plugin-prettier';

export default antfu(
  {
    react: true,
    stylistic: false,
    typescript: true,
  },
  {
    ignores: ['node_modules', '.vercel', 'dist'],
    plugins: {
      perfectionist,
      prettier,
    },
    rules: {
      // Custom perfectionist rules
      ...perfectionist.configs['recommended-alphabetical'].rules,
      'perfectionist/sort-classes': 'off',
      'perfectionist/sort-exports': [
        'error',
        {
          order: 'asc',
          type: 'alphabetical',
        },
      ],
      'perfectionist/sort-imports': [
        'error',
        {
          groups: [
            'type',
            ['builtin', 'external'],
            'internal-type',
            'internal',
            ['parent-type', 'sibling-type', 'index-type'],
            ['parent', 'sibling', 'index'],
            'object',
            'unknown',
          ],
          ignoreCase: true,
          newlinesBetween: 'always',
          order: 'asc',
          type: 'alphabetical',
        },
      ],
      'perfectionist/sort-modules': 'off',
      'perfectionist/sort-named-imports': [
        'error',
        {
          order: 'asc',
          type: 'alphabetical',
        },
      ],
      'perfectionist/sort-objects': [
        'error',
        {
          order: 'asc',
          partitionByComment: true,
          type: 'alphabetical',
        },
      ],

      // Custom unused-imports rules
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          vars: 'all',
          varsIgnorePattern: '^_',
        },
      ],

      // Other custom rules
      'jsonc/sort-keys': 'off',
      'no-console': ['error', { allow: ['warn', 'error', 'debug'] }],
      'node/prefer-global/buffer': 'off',
      'node/prefer-global/process': 'off',
      'prettier/prettier': 'warn',
      'ts/consistent-type-definitions': ['error', 'type'],
      'unicorn/throw-new-error': 'off',
    },
  }
);

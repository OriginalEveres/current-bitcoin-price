export default {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'import', 'vitest'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vitest/recommended',
    'prettier'
  ],
  rules: {
    // prefer spaces inside object literals: { a: 1 }
    'object-curly-spacing': ['error', 'always'],
    // allow explicit any rarely
    '@typescript-eslint/no-explicit-any': 'off',
    // prefer explicit function return types for public APIs
    '@typescript-eslint/explicit-function-return-type': 'off',
    // disable requiring .js extensions in imports (handled by TS resolver)
    'import/extensions': 'off',
    // turn off unresolved import false-positives in TypeScript projects
    'import/no-unresolved': 'off'
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json'
      }
    }
  }
}


import eslint from '@eslint/js';
import react from '@eslint-react/eslint-plugin';
import vitest from '@vitest/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import jsdoc from 'eslint-plugin-jsdoc';
import json from 'eslint-plugin-jsonc';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier/recommended';
import promise from 'eslint-plugin-promise';
import hooks from 'eslint-plugin-react-hooks';
import sonarjs from 'eslint-plugin-sonarjs';
import testingLibrary from 'eslint-plugin-testing-library';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

const tsConfig = tsEslint.config({
  files: ['**/*.{ts,tsx}'],
  extends: [...tsEslint.configs.strictTypeChecked, ...tsEslint.configs.stylisticTypeChecked],
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        fixStyle: 'inline-type-imports',
        prefer: 'type-imports',
      },
    ],
    // '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        format: null,
        selector: 'parameter',
        modifiers: ['unused'],
        leadingUnderscore: 'require',
      },
    ],
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
    '@typescript-eslint/only-throw-error': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
  },
});

const reactConfig = [
  {
    files: ['**/*.{ts,tsx}'],
    ...react.configs['recommended-type-checked'],
  },
  {
    files: ['**/*.{jsx,tsx}'],
    rules: {
      '@eslint-react/no-leaked-conditional-rendering': 'error',
      '@eslint-react/prefer-read-only-props': 'off',
    },
  },
  {
    plugins: {
      'react-hooks': hooks,
    },
    rules: {
      ...hooks.configs.recommended.rules,
    },
  },
];

const importConfig = [
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    settings: {
      'import/resolver': {
        typescript: {
          project: ['./tsconfig.cloudflare.json'],
        },
      },
    },
    rules: {
      'import/namespace': 'off',
      'import/default': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-absolute-path': 'off',
      'import/prefer-default-export': 'off',
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      'import/no-extraneous-dependencies': 'off',
      'import/order': [
        'error',
        {
          pathGroups: [
            {
              pattern: '~/**',
              group: 'external',
              position: 'after',
            },
          ],
          distinctGroup: true,
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            orderImportKind: 'asc',
            caseInsensitive: true,
          },
          warnOnUnassignedImports: false,
        },
      ],
      'import/export': 'off',
      'import/no-unresolved': ['error', { ignore: ['^virtual:'] }],
    },
  },
];

const unicornConfig = [
  unicorn.configs['all'],
  {
    rules: {
      'unicorn/no-null': 'off',
      'unicorn/prefer-spread': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
          ignore: [String.raw`^README\.md$`],
        },
      ],
      'unicorn/prevent-abbreviations': [
        'error',
        {
          replacements: {
            prop: false,
            props: false,
            ref: false,
            refs: false,
            env: false,
          },
        },
      ],
      'unicorn/error-message': 'error',
      'unicorn/escape-case': 'error',
      'unicorn/no-instanceof-array': 'error',
      'unicorn/no-new-buffer': 'error',
      'unicorn/no-unsafe-regex': 'off',
      'unicorn/number-literal-case': 'error',
      'unicorn/prefer-includes': 'error',
      'unicorn/prefer-string-starts-ends-with': 'error',
      'unicorn/prefer-type-error': 'error',
      'unicorn/throw-new-error': 'error',
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/prefer-number-properties': 'error',
      'unicorn/no-new-array': 'error',
      'unicorn/no-keyword-prefix': 'off',
      'unicorn/prefer-top-level-await': 'off',
    },
  },
];

const _sonarjsConfig = [
  sonarjs.configs.recommended,
  {
    rules: {
      'sonarjs/sonar-prefer-read-only-props': 'off',
      'sonarjs/todo-tag': 'off',
      'sonarjs/fixme-tag': 'off',
      'sonarjs/function-return-type': 'off',
      'sonarjs/no-commented-code': 'off',
    },
  },
];

// eslint-disable-next-line unicorn/prevent-abbreviations
const jsDocConfig = [
  jsdoc.configs['flat/recommended-typescript-error'],
  {
    rules: {
      'jsdoc/tag-lines': 'off',
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-returns ': 'off',
      'jsdoc/require-param': 'off',
      'jsdoc/require-returns': 'off',
    },
  },
];

const jsonConfig = [
  ...json.configs['flat/recommended-with-json'],
  ...json.configs['flat/prettier'],
  {
    files: ['package.json'],
    rules: {
      'jsonc/sort-keys': [
        'error',
        {
          pathPattern: '^$',
          order: [
            'publisher',
            'name',
            'displayName',
            'type',
            'version',
            'private',
            'packageManager',
            'description',
            'author',
            'license',
            'funding',
            'homepage',
            'repository',
            'bugs',
            'keywords',
            'categories',
            'sideEffects',
            'exports',
            'main',
            'module',
            'unpkg',
            'jsdelivr',
            'types',
            'typesVersions',
            'bin',
            'icon',
            'files',
            'engines',
            'activationEvents',
            'contributes',
            'scripts',
            'peerDependencies',
            'peerDependenciesMeta',
            'dependencies',
            'optionalDependencies',
            'devDependencies',
            'pnpm',
            'overrides',
            'resolutions',
            'husky',
            'simple-git-hooks',
            'lint-staged',
            'eslintConfig',
          ],
        },
        {
          pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies$',
          order: { type: 'asc' },
        },
        {
          pathPattern: '^exports.*$',
          order: ['types', 'require', 'import'],
        },
      ],
    },
  },
];

const testConfig = [
  {
    files: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
    plugin: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/max-nested-describe': ['error', { max: 0 }],
    },
  },
  {
    files: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
    ...testingLibrary.configs['flat/react'],
  },
];

const a11yConfig = [
  jsxA11y.flatConfigs.recommended,

  {
    rules: {
      'jsx-a11y/anchor-is-valid': 'off',
    },
  },
];

export default [
  {
    ignores: [
      'build/*',
      '.react-router/*',
      '.wrangler/*',
      'worker-configuration.d.ts',
      'wrangler.jsonc',
    ],
  },
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  eslint.configs.recommended,
  promise.configs['flat/recommended'],
  ...a11yConfig,
  /** FIXME: Enable it when it's properly working with the latest version of eslint. */
  // ...sonarjsConfig,
  ...importConfig,
  ...tsConfig,
  ...reactConfig,
  ...unicornConfig,
  ...jsDocConfig,
  ...jsonConfig,
  ...testConfig,
  {
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  prettier,
];

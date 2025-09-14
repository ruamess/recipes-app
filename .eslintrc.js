// eslint-disable-next-line no-undef
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    'react',
    'react-native',
    '@typescript-eslint',
    'eslint-plugin-simple-import-sort',
    'prettier',
  ],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // 1. Group for all imports that include "react"
          ['^.*react.*$'],
          // 2. Group for all imports that include "expo"
          ['^.*expo.*$'],
          // 3. Imports from node_modules
          ['^@?\\w'],
          // 4. Side effect imports
          ['^\\u0000'],
          // 5. Absolute imports
          ['^'],
          // 6. Relative imports from parent directories
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // 7. Relative imports from the current directory
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',

    // React Native
    'react-native/no-unused-styles': 0,
    'react-native/split-platform-components': 2,
    'react-native/no-inline-styles': 2,
    'react-native/no-color-literals': 2,
    // 'react-native/no-raw-text': 2,
    'react-native/no-single-element-style-arrays': 2,
    'react-native/sort-styles': 'error',

    // React Hooks
    'react-hooks/exhaustive-deps': 'off',

    // Prettier
    'prettier/prettier': [
      'error',
      {
        plugins: ['prettier-plugin-tailwindcss'],
        singleQuote: true,
        semi: false,
        trailingComma: 'all',
        bracketSpacing: true,
        bracketSameLine: false,
        printWidth: 100,
      },
    ],

    // TypeScript
    '@typescript-eslint/no-empty-function': [
      'off',
      {
        allow: [],
      },
    ],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-require-imports': 'off',
  },
}

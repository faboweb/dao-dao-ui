module.exports = {
  extends: ['next/core-web-vitals'],
  plugins: ['import'],

  settings: {
    next: {
      rootDir: ['apps/*/', 'packages/*/'],
    },
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          {
            pattern: 'recoil',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: '{next,next/**}',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: 'react',
            group: 'builtin',
            position: 'before',
            patternOptions: { nocomment: false },
          },
          {
            pattern: '@components',
            group: 'external',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['react', '{next,next/**}', 'recoil'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
}
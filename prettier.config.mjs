/** @type {import('prettier').Config} */
export default {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  printWidth: 100,
  trailingComma: 'all',
  bracketSpacing: true,
  arrowParens: 'always',
  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
  overrides: [
    { files: '*.astro', options: { parser: 'astro' } },
    { files: '*.tsx', options: { jsxSingleQuote: true } },
  ],
};

// Valida los mensajes de commit contra Conventional Commits (hook commit-msg
// via lefthook). Los tipos permitidos reflejan docs/CONTRIBUTING.md.
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'refactor',
        'chore',
        'docs',
        'ci',
        'style',
        'perf',
        'test',
        'build',
        'seo',
        'a11y',
        'revert',
      ],
    ],
  },
};

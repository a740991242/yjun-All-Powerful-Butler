import { defineConfig } from '@vben/oxfmt-config';

export default defineConfig({
  // Course templates use explicit flex/grid gaps. Keep multiline component
  // closing tags consistent with the repository's Vue ESLint rules.
  overrides: [
    {
      files: ['apps/web-antd/src/views/education/**/*.vue'],
      options: { htmlWhitespaceSensitivity: 'ignore' },
    },
  ],
  ignorePatterns: [
    'dist',
    'dev-dist',
    '.local',
    '.claude',
    '.agent',
    '.agents',
    '.codex',
    '.output.js',
    'node_modules',
    '.nvmrc',
    'coverage',
    'CODEOWNERS',
    '.nitro',
    '.output',
    '**/*.svg',
    '**/*.sh',
    'public',
    '.npmrc',
    '*-lock.yaml',
    'skills-lock.json',
  ],
});

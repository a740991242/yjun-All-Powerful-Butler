import { createRequire } from 'node:module';

import { oxlintConfig } from '@vben/oxlint-config';

import { defineConfig } from 'oxlint';

// pnpm keeps these plugins alongside the shared config, not at the repo root.
const resolvePlugin = createRequire(
  import.meta.resolve('@vben/oxlint-config'),
).resolve;

export default defineConfig({
  ...oxlintConfig,
  overrides: [
    ...(oxlintConfig.overrides ?? []),
    {
      // Fixture lookups are deliberately asserted in generated curriculum tests.
      // Branches enumerate different rule kinds, rather than skip an assertion.
      files: ['apps/web-antd/src/views/education/**/*.test.ts'],
      rules: {
        'typescript/no-non-null-assertion': 'off',
        'vitest/no-conditional-expect': 'off',
        'vitest/valid-expect': ['error', { maxArgs: 2 }],
      },
    },
  ],
  jsPlugins: oxlintConfig.jsPlugins?.map((plugin) =>
    typeof plugin === 'string'
      ? resolvePlugin(plugin)
      : { ...plugin, specifier: resolvePlugin(plugin.specifier) },
  ),
});

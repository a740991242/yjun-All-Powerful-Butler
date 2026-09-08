import { createRequire } from 'node:module';

import { oxlintConfig } from '@vben/oxlint-config';

import { defineConfig } from 'oxlint';

// pnpm keeps these plugins alongside the shared config, not at the repo root.
const resolvePlugin = createRequire(
  import.meta.resolve('@vben/oxlint-config'),
).resolve;

export default defineConfig({
  ...oxlintConfig,
  jsPlugins: oxlintConfig.jsPlugins?.map((plugin) =>
    typeof plugin === 'string'
      ? resolvePlugin(plugin)
      : { ...plugin, specifier: resolvePlugin(plugin.specifier) },
  ),
});

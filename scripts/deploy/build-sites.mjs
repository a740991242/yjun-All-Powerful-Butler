import { cp, mkdir, rm } from 'node:fs/promises';

// Sites accepts a standard Worker entry and its sibling client asset directory.
await rm('dist', { recursive: true, force: true });
await mkdir('dist/server', { recursive: true });
await mkdir('dist/.openai', { recursive: true });
await cp('apps/web-antd/dist', 'dist/client', { recursive: true });
await cp('apps/web-antd/server/index.mjs', 'dist/server/index.js');
await cp('.openai/hosting.json', 'dist/.openai/hosting.json');

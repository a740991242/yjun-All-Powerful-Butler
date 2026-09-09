import { afterEach, describe, expect, it, vi } from 'vitest';

import { publicAsset } from './public-asset';

afterEach(() => vi.unstubAllEnvs());

describe('public asset paths', () => {
  it('keeps images under the GitHub Pages repository path', () => {
    vi.stubEnv('BASE_URL', '/yjun-All-Powerful-Butler/');
    expect(publicAsset('brand/logo.svg')).toBe(
      '/yjun-All-Powerful-Butler/brand/logo.svg',
    );
    expect(publicAsset('/brand/avatar.svg')).toBe(
      '/yjun-All-Powerful-Butler/brand/avatar.svg',
    );
  });

  it('also supports a localhost root deployment', () => {
    vi.stubEnv('BASE_URL', '/');
    expect(publicAsset('brand/logo.svg')).toBe('/brand/logo.svg');
  });
});

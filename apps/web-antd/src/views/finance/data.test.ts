import { afterEach, expect, it, vi } from 'vitest';

import { snapshot } from './data';

afterEach(() => {
  vi.unstubAllGlobals();
});

it('bypasses stale HTTP caches for finance snapshots', async () => {
  const fetchMock = vi.fn().mockResolvedValue({
    json: async () => ({ rangeEnd: '2026-11-02' }),
    ok: true,
  });
  vi.stubGlobal('fetch', fetchMock);

  await expect(snapshot('stocks')).resolves.toEqual({
    rangeEnd: '2026-11-02',
  });
  expect(fetchMock).toHaveBeenCalledWith(
    expect.stringContaining('data/finance/stocks.json'),
    { cache: 'no-store' },
  );
});

import { expect, it } from 'vitest';

import { isParadeFramesVisual, paradeFrames } from './parade-frames';
it('orders three positions geometrically for each direction and keeps the complete float inside the canvas', () => {
  for (const variant of ['main', 'review'] as const) {
    const m = paradeFrames(variant);
    const order = m.positions
      .map((x, index) => ({ x, id: 'ABC'[index] }))
      .toSorted((a, b) => (variant === 'main' ? a.x - b.x : b.x - a.x))
      .map((x) => x.id)
      .join('');
    expect(order).toBe(variant === 'main' ? 'BAC' : 'CBA');
    expect(m.positions.filter((x) => x === m.observer)).toHaveLength(1);
    for (const x of m.positions) {
      expect(x - 40).toBeGreaterThan(0);
      expect(x + 40).toBeLessThan(300);
    }
  }
});
it('rejects malformed variants, arrays and extra answer or time fields', () => {
  expect(isParadeFramesVisual({ kind: 'parade-frames', variant: 'main' })).toBe(
    true,
  );
  expect(
    isParadeFramesVisual({ kind: 'parade-frames', variant: 'review' }),
  ).toBe(true);
  for (const value of [
    null,
    [],
    { kind: 'parade-frames', variant: ['main'] },
    { kind: 'parade-frames', variant: 'main', answer: 'BAC' },
    { kind: 'parade-frames', variant: 'main', time: 1 },
    { kind: 'parade-frames', variant: 'other' },
  ])
    expect(isParadeFramesVisual(value)).toBe(false);
});

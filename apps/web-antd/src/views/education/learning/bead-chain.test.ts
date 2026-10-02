import { expect, it } from 'vitest';

import { beadGroupB, hiddenBeads, isBeadChainVisual } from './bead-chain';
import { fold } from './fold';
it('checks every supported first count, group count and concealment interval', () => {
  for (const firstB of [1, 2] as const)
    for (const groups of [3, 4] as const) {
      for (let start = 1; start <= 4; start++)
        for (let end = 1; end <= 4; end++) {
          const model = {
            kind: 'bead-chain' as const,
            firstB,
            groups,
            hidden: [start, end] as [number, number],
          };
          const valid = start >= 2 && start <= end && end < groups;
          expect(isBeadChainVisual(model)).toBe(valid);
          if (valid) {
            const expectedB = fold(
              Array.from(
                { length: end - start + 1 },
                (_, i) => firstB + start + i - 1,
              ),
              0,
              (a, b) => a + b,
            );
            expect(hiddenBeads(model)).toEqual([end - start + 1, expectedB]);
            expect(beadGroupB(model, groups)).toBe(firstB + groups - 1);
          }
        }
    }
});
it('rejects unsupported rules and extra hidden answers', () => {
  const model = { kind: 'bead-chain', firstB: 1, groups: 4, hidden: [2, 3] };
  for (const patch of [
    { firstB: 0 },
    { firstB: 3 },
    { groups: 5 },
    { groups: 3.5 },
    { hidden: [2, 2.5] },
    { hidden: [2] },
    { hidden: [3, 2] },
    { answer: [2, 5] },
    { increment: 2 },
  ])
    expect(isBeadChainVisual({ ...model, ...patch })).toBe(false);
});

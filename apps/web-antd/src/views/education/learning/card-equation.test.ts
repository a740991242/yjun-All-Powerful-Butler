import type { CardEquationRule } from './card-equation';

import { describe, expect, it } from 'vitest';

import { isCardEquationRule, matchesCardEquation } from './card-equation';
import { evaluate } from './engine';

const model: CardEquationRule = {
  kind: 'card-equation',
  values: [18, 19, 20, 21],
};
describe('four distinct cards used once in a complete arithmetic equation', () => {
  it('independently checks all 256 selections, including every permutation and repeated card', () => {
    const accepted: number[][] = [];
    for (const a of [18, 19, 20, 21])
      for (const b of [18, 19, 20, 21])
        for (const c of [18, 19, 20, 21])
          for (const d of [18, 19, 20, 21]) {
            const expected =
              new Set([a, b, c, d]).size === 4 && a + b - c === d;
            expect(matchesCardEquation(model, [a, b, c, d])).toBe(expected);
            if (expected) accepted.push([a, b, c, d]);
          }
    expect(accepted).toEqual([
      [18, 21, 19, 20],
      [18, 21, 20, 19],
      [19, 20, 18, 21],
      [19, 20, 21, 18],
      [20, 19, 18, 21],
      [20, 19, 21, 18],
      [21, 18, 19, 20],
      [21, 18, 20, 19],
    ]);
  });
  it('accepts a real zero card but distinguishes missing input, repeats and unknown cards', () => {
    const zero: CardEquationRule = {
      kind: 'card-equation',
      values: [0, 5, 10, 15],
    };
    expect(evaluate(zero, [0, 15, 5, 10])).toBe(true);
    expect(() => evaluate(zero, [0, 15, null, 10])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(() => evaluate(zero, [0, 15, 5])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(evaluate(model, [18, 21, 18, 21])).toBe(false);
    expect(evaluate(model, [18, 21, 19, 22])).toBe(false);
    expect(matchesCardEquation(model, ['18', 21, 19, 20])).toBe(false);
  });
  it('rejects impossible, sparse, oversized or extra-field model snapshots', () => {
    for (const value of [
      null,
      [],
      { ...model, answer: [18, 21, 19, 20] },
      { ...model, values: [18, 19, 20] },
      { ...model, values: [18, 18, 20, 20] },
      { ...model, values: [18, 19, 20, 22] },
      { ...model, values: [1, 2, 3, 99] },
      { ...model, values: [-1, 0, 1, 2] },
      { ...model, values: [0, 1.5, 2, 3] },
      { ...model, values: [96, 97, 98, 99] },
      { ...model, values: [0, 1, 2, 100] },
      { ...model, values: Array.from({ length: 4 }) },
    ])
      expect(isCardEquationRule(value)).toBe(false);
    expect(isCardEquationRule(model)).toBe(true);
  });
});

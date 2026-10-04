import { expect, it } from 'vitest';

import {
  arithmeticCell,
  isArithmeticGridVisual,
} from '../learning/arithmetic-grid';
import { bnuLowerSubtractionSource as source } from './bnu-lower-subtraction-source';

it('checks all seventeen original cards, preserving repeats and the left outside 13−6 card', () => {
  expect(source.cards.map(([a, b]) => a - b)).toEqual([
    7, 7, 8, 9, 7, 8, 8, 7, 9, 5, 6, 3, 6, 7, 7, 9, 8,
  ]);
  expect(source.cards[13]).toEqual([13, 6]);
  const cards = (predicate: (a: number, b: number) => boolean) =>
    source.cards.flatMap(([a, b], i) => (predicate(a, b) ? [i + 1] : []));
  expect(cards((a, b) => a - b === 7)).toEqual([1, 2, 5, 8, 14, 15]);
  expect(cards((a) => a === 12)).toEqual([5, 11, 16, 17]);
  expect(cards((_a, b) => b === 9)).toEqual([2, 3, 4, 6, 9, 13, 15]);
  expect(source.cards.filter(([a, b]) => a === 16 && b === 9)).toHaveLength(2);
});
it('keeps the original 26 givens and all nineteen omitted formulas in source order', () => {
  expect(source.blankPositions).toHaveLength(19);
  expect(
    isArithmeticGridVisual({
      kind: 'arithmetic-grid',
      mode: 'bnu-subtract',
      hidden: source.blankPositions,
    }),
  ).toBe(true);
  expect(
    source.blankPositions.map(
      ([r, c]) => arithmeticCell('bnu-subtract', r, c)?.expression,
    ),
  ).toEqual([
    '10−4',
    '10−5',
    '10−7',
    '10−8',
    '11−3',
    '11−6',
    '11−7',
    '11−9',
    '12−5',
    '12−8',
    '12−9',
    '13−6',
    '13−7',
    '14−6',
    '14−7',
    '15−7',
    '15−9',
    '16−7',
    '17−9',
  ]);
  const givens: string[] = [];
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++) {
      const cell = arithmeticCell('bnu-subtract', r, c);
      if (
        cell &&
        !source.blankPositions.some(([row, col]) => r === row && c === col)
      )
        givens.push(cell.expression);
    }
  expect(givens).toHaveLength(26);
  expect(givens).toEqual([
    '10−1',
    '10−2',
    '10−3',
    '10−6',
    '10−9',
    '11−2',
    '11−4',
    '11−5',
    '11−8',
    '12−3',
    '12−4',
    '12−6',
    '12−7',
    '13−4',
    '13−5',
    '13−8',
    '13−9',
    '14−5',
    '14−8',
    '14−9',
    '15−6',
    '15−8',
    '16−8',
    '16−9',
    '17−8',
    '18−9',
  ]);
  expect(source.table).toMatchObject({ equations: 45, given: 26, blanks: 19 });
  expect(source.status).toBe('source-checked');
});

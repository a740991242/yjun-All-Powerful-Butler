import { describe, expect, it } from 'vitest';

import { bnuLowerPineconesSource as source } from './bnu-lower-pinecones-source';

describe('printed 64–65 pinecones source preparation', () => {
  it('keeps inspected pages separate from teaching availability and covers all eight activities', () => {
    expect(source.status).toBe('source-checked');
    expect(source.readPrintedPages).toEqual([64, 65]);
    expect(source.pageImages).toEqual([
      { printedPage: 64, suffix: '068.jpg' },
      { printedPage: 65, suffix: '069.jpg' },
    ]);
    expect(source.activities.map((a) => [a.page, a.key])).toEqual([
      [64, 'mother-child-addition-three-methods'],
      [64, 'mother-father-comparison-three-methods'],
      [65, 'interpret-two-equations'],
      [65, 'four-stick-calculations'],
      [65, 'both-arrow-lines'],
      [65, 'all-eight-calculations'],
      [65, 'swans-arrival-total'],
      [65, 'dinosaurs-length-difference'],
    ]);
  });
  it('distinguishes ones addition, tens subtraction and the two changed questions', () => {
    expect(source.picked).toEqual({
      mother: 45,
      child: 3,
      father: 30,
      unit: '个',
    });
    expect(source.addition.values).toEqual([45, 3, 48]);
    expect(source.addition.countAfter45).toEqual([46, 47, 48]);
    expect(source.addition.associatedEquations).toEqual([
      [3, 5, 8],
      [40, 8, 48],
    ]);
    expect(source.comparison.values).toEqual([45, 30, 15]);
    expect(source.comparison.countBackwardByTen).toEqual([35, 25, 15]);
    expect(source.comparison.associatedEquations).toEqual([
      [40, 30, 10],
      [10, 5, 15],
    ]);
    expect(source.interpretEquations.map((q) => q.values)).toEqual([
      [45, 3, 42],
      [45, 30, 75],
    ]);
  });
  it('reads both complete arrow scales and all twelve practice calculations', () => {
    expect(source.numberLines).toEqual([
      {
        labels: [21, 22, 23, 24, 25, 26],
        start: 22,
        jump: 3,
        end: 25,
        operation: '+',
      },
      {
        labels: [49, 59, 69, 79, 89, 99],
        start: 89,
        jump: 30,
        end: 59,
        operation: '−',
      },
    ]);
    expect(source.stickCalculations.map((q) => q.values)).toEqual([
      [32, 5, 37],
      [75, 40, 35],
      [78, 6, 72],
      [68, 30, 98],
    ]);
    expect(source.eightCalculations.map((q) => q.values)).toEqual([
      [4, 65, 69],
      [85, 30, 55],
      [40, 4, 44],
      [72, 5, 77],
      [67, 2, 65],
      [36, 50, 86],
      [44, 40, 4],
      [77, 5, 72],
    ]);
    for (const q of [
      ...source.stickCalculations,
      ...source.eightCalculations,
      ...source.interpretEquations,
    ]) {
      const [a, b, result] = q.values;
      expect(q.operation === '+' ? a + b : a - b).toBe(result);
    }
  });
  it('keeps arrival totals and length comparison in their original units', () => {
    expect(source.swans).toEqual({
      before: 55,
      arrived: 20,
      after: 75,
      unit: '只',
    });
    expect(source.dinosaurs).toEqual({
      large: 25,
      small: 2,
      difference: 23,
      unit: '米',
    });
  });
});

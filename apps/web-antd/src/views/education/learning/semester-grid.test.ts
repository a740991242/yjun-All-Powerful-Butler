import { describe, expect, it } from 'vitest';

import { arithmeticAxes, sumFrequency } from './arithmetic-grid';
import { required } from './required';
import {
  isSemesterGridVisual,
  semesterAxes,
  semesterCell,
  semesterFrequency,
} from './semester-grid';

describe('semester grid mathematical ranges and strict model', () => {
  it('represents all 100 number cells and a valid adjacent 1–19 route, keeping positions separate from values', () => {
    const axes = semesterAxes('numbers');
    expect(axes).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const cells = axes.flatMap((r) =>
      axes.map((c) => required(semesterCell('numbers', r, c)).value),
    );
    expect(cells).toHaveLength(100);
    expect(Math.min(...cells)).toBe(1);
    expect(Math.max(...cells)).toBe(19);
    expect(semesterCell('numbers', 8, 6)?.value).toBe(13);
    expect(semesterFrequency('numbers', 11)).toBe(9);
    const route = [
      ...axes.map((c) => required(semesterCell('numbers', 1, c)).value),
      ...axes
        .slice(1)
        .map((r) => required(semesterCell('numbers', r, 10)).value),
    ];
    expect(route).toEqual(Array.from({ length: 19 }, (_, i) => i + 1));
    expect(semesterCell('numbers', 0, 1)).toBeNull();
  });
  it('includes the zero and ten borders of all 121 addition pairs without changing earlier nine-by-nine tables', () => {
    const axes = semesterAxes('addition');
    const cells = axes.flatMap((r) =>
      axes.map((c) => required(semesterCell('addition', r, c))),
    );
    expect(cells).toHaveLength(121);
    expect(new Set(cells.map((c) => c.expression)).size).toBe(121);
    expect(semesterCell('addition', 0, 0)?.value).toBe(0);
    expect(semesterCell('addition', 10, 10)?.value).toBe(20);
    expect(semesterFrequency('addition', 10)).toBe(11);
    expect(semesterFrequency('addition', 11)).toBe(10);
    expect(sumFrequency(10)).toBe(9);
    expect(arithmeticAxes('sum-grid').rows).toHaveLength(9);
  });
  it('accepts zero only within the addition mode and rejects missing, duplicate, fractional and out-of-scope positions and marks', () => {
    expect(
      isSemesterGridVisual({
        kind: 'semester-grid',
        mode: 'addition',
        hidden: [
          [0, 0],
          [10, 10],
        ],
        marked: 0,
      }),
    ).toBe(true);
    expect(
      isSemesterGridVisual({
        kind: 'semester-grid',
        mode: 'numbers',
        hidden: [
          [1, 1],
          [10, 10],
        ],
        marked: 11,
      }),
    ).toBe(true);
    const model = { kind: 'semester-grid', mode: 'numbers', hidden: [] };
    for (const patch of [
      { mode: 'sum-grid' },
      { hidden: [[0, 1]] },
      {
        hidden: [
          [1, 1],
          [1, 1],
        ],
      },
      { hidden: [[1.5, 2]] },
      { hidden: [[11, 1]] },
      { hidden: [[1]] },
      { hidden: 'missing' },
      { hidden: Array.from({ length: 13 }, (_, i) => [1, i + 1]) },
      { marked: 0 },
      { marked: 20 },
      { marked: Number.NaN },
      { extra: true },
    ])
      expect(isSemesterGridVisual({ ...model, ...patch })).toBe(false);
    expect(
      isSemesterGridVisual({ kind: 'semester-grid', mode: 'addition' }),
    ).toBe(false);
  });
});

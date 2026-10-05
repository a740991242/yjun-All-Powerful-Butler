import { describe, expect, it } from 'vitest';

import { bnuLowerFillGameSource as source } from './bnu-lower-fill-game-source';

type Grid = readonly (readonly (null | number)[])[];
/** Independent finite enumeration using only the inspected row/column conditions. */
function completions(input: Grid) {
  const grid = input.map((row) => [...row]);
  const size = grid.length;
  const answers: number[][][] = [];
  function visit() {
    let target: undefined | { row: number; column: number; allowed: number[] };
    for (let row = 0; row < size; row++)
      for (let column = 0; column < size; column++) {
        if (grid[row]?.[column] !== null) continue;
        const allowed = Array.from({ length: size }, (_, i) => i + 1).filter(
          (n) => !grid[row]?.includes(n) && !grid.some((r) => r[column] === n),
        );
        if (!target || allowed.length < target.allowed.length)
          target = { row, column, allowed };
      }
    if (!target) {
      answers.push(
        grid.map((row) =>
          row.map((n) => {
            if (n === null) throw new Error('Unfilled result');
            return n;
          }),
        ),
      );
      return;
    }
    const row = grid[target.row];
    if (!row) throw new Error('Missing source row');
    for (const n of target.allowed) {
      row[target.column] = n;
      visit();
    }
    row[target.column] = null;
  }
  visit();
  return answers;
}
function blanks(grid: Grid) {
  return grid.flatMap((row, r) =>
    row.flatMap((n, c) => (n === null ? [[r + 1, c + 1]] : [])),
  );
}
describe('inspected BNU lower fill-number game, printed 60–61', () => {
  it('keeps the original rules and all five 3×3 blanks without extra Sudoku conditions', () => {
    expect(source.status).toBe('source-checked');
    expect(source.readPrintedPages).toEqual([60, 61]);
    expect(source.pageImages).toEqual([
      { printedPage: 60, suffix: '064.jpg' },
      { printedPage: 61, suffix: '065.jpg' },
    ]);
    expect(source.rules).toMatchObject({
      fixedGivens: true,
      eachRowDistinct: true,
      eachColumnDistinct: true,
      extraBlockRule: false,
      extraDiagonalRule: false,
    });
    expect(source.three.given).toEqual([
      [1, null, null],
      [null, 1, null],
      [null, 2, 1],
    ]);
    expect(source.three.allowed).toEqual([1, 2, 3]);
    expect(blanks(source.three.given)).toEqual(source.three.blankCoordinates);
    expect(completions(source.three.given)).toEqual([
      [
        [1, 3, 2],
        [2, 1, 3],
        [3, 2, 1],
      ],
    ]);
    expect(source.three.completed).toEqual(completions(source.three.given)[0]);
    expect(source.three.blankValuesRowMajor).toEqual([3, 2, 2, 3, 3]);
    expect(source.three.start).toEqual({
      row: 3,
      column: 1,
      givenInRow: [2, 1],
      candidates: [3],
    });
  });
  it('independently completes all seven original 5×5 blanks preserving the initial givens', () => {
    const original = [
      [5, 1, null, null, 3],
      [1, 3, null, null, 4],
      [4, 2, null, 1, 5],
      [2, null, 4, 3, 1],
      [3, 4, 1, null, 2],
    ];
    expect(source.five.given).toEqual(original);
    expect(source.five.allowed).toEqual([1, 2, 3, 4, 5]);
    expect(blanks(original)).toHaveLength(7);
    expect(blanks(original)).toEqual(source.five.blankCoordinates);
    const solutions = completions(original);
    expect(solutions).toEqual([
      [
        [5, 1, 2, 4, 3],
        [1, 3, 5, 2, 4],
        [4, 2, 3, 1, 5],
        [2, 5, 4, 3, 1],
        [3, 4, 1, 5, 2],
      ],
    ]);
    expect(source.five.completed).toEqual(solutions[0]);
    expect(source.five.blankValuesRowMajor).toEqual([2, 4, 5, 2, 3, 5, 5]);
  });
  it('distinguishes the two demonstrated stages from the original seven-blank grid', () => {
    expect(source.five.fewBlanksStage).toEqual([
      [5, 1, null, null, 3],
      [1, 3, null, null, 4],
      [4, 2, 3, 1, 5],
      [2, 5, 4, 3, 1],
      [3, 4, 1, 5, 2],
    ]);
    expect(source.five.nextStage).toEqual([
      [5, 1, 2, null, 3],
      [1, 3, null, null, 4],
      [4, 2, 3, 1, 5],
      [2, 5, 4, 3, 1],
      [3, 4, 1, 5, 2],
    ]);
    expect(blanks(source.five.fewBlanksStage)).toHaveLength(4);
    expect(blanks(source.five.nextStage)).toHaveLength(3);
    for (const stage of [source.five.fewBlanksStage, source.five.nextStage]) {
      source.five.given.forEach((row, r) =>
        row.forEach((given, c) => {
          if (given !== null) expect(stage[r]?.[c]).toBe(given);
        }),
      );
      expect(completions(stage)).toEqual([source.five.completed]);
    }
    const row: readonly (null | number)[] = source.five.fewBlanksStage[0];
    const rowOptions = source.five.allowed.filter((n) => !row.includes(n));
    expect(rowOptions).toEqual([2, 4]);
    const column: number[] = source.five.fewBlanksStage
      .map((r) => r[2])
      .filter((n) => n !== null);
    expect(column).toEqual([3, 4, 1]);
    expect(rowOptions.filter((n) => !column.includes(n))).toEqual([2]);
    expect(source.five.bothConstraints).toEqual({
      row: 1,
      column: 3,
      rowCandidates: [2, 4],
      columnAlready: [3, 4, 1],
      selected: 2,
    });
  });
  it('records all five source activities and keeps personal reflection and actual activities ungraded', () => {
    expect(source.activities.map((a) => [a.page, a.key])).toEqual([
      [60, 'understand-row-column-rule'],
      [60, 'three-complete-grid'],
      [61, 'five-upgrade-grid'],
      [61, 'intermediate-and-both-constraints'],
      [61, 'review-method-and-real-check'],
    ]);
    expect(source.reflection).toMatchObject({
      fewBlanksFirst: true,
      trialThenAdjust: true,
      finalCheckRowsAndColumns: true,
    });
    expect(source.reflection.boundary).toContain('不自动确认');
    expect(source.reflection.boundary).toContain('不统一判分');
    expect(source.reflection.boundary).toContain('未来打算另记');
  });
});

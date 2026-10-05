import { expect, it } from 'vitest';

import { bnuLowerDesignChallengeSource as source } from './bnu-lower-design-challenge-source';

it('records each read page and all four separate outline-matching targets without guessing counts', () => {
  expect(source.readPrintedPages).toEqual([84, 85, 86]);
  expect(source.pageImages.map((p) => p.suffix)).toEqual([
    '088.jpg',
    '089.jpg',
    '090.jpg',
  ]);
  expect(source.design.matchingTargets).toEqual([
    'triangle',
    'hexagon',
    'trapezoid',
    'parallelogram',
  ]);
  expect(source.design.matchingOrder).toEqual(['上左', '上右', '下左', '下右']);
  expect(source.design.boundary).toContain('组合边界');
  expect(source.design.boundary).toContain('不强制学生预先记新名称');
  expect(source.design.boundary).toContain('数量待逐个几何核对');
  expect(source.activities).toHaveLength(10);
});
it('keeps both two-piece sizes and both four-piece alternatives distinct from any-subset or equal-area claims', () => {
  expect(source.squareChallenge.pieceCountsDiscussed).toEqual([2, 3, 4, 7]);
  expect(
    source.squareChallenge.shownExamples.map((p) => [p.count, p.pieces.length]),
  ).toEqual([
    [2, 2],
    [2, 2],
    [3, 3],
    [4, 4],
    [4, 4],
  ]);
  expect(source.squareChallenge.shownExamples[3]?.pieces).toContain('square');
  expect(source.squareChallenge.shownExamples[4]?.pieces).toContain(
    'medium-triangle',
  );
  expect(source.squareChallenge.boundary).toContain('不要求同面积');
  expect(source.squareChallenge.boundary).toContain('任意选四片');
  expect(source.squareChallenge.boundary).toContain('5/6片未由本页结论证明');
  expect(source.status).toBe('source-checked-teaching-mapped');
});

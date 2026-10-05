import { expect, it } from 'vitest';

import { bnuLowerFinalSource as source } from './bnu-lower-final-source';
it('keeps the complete six-page original activity range, following blank and actual appendix identity separate from registered teaching', () => {
  expect(source.readPrintedPages).toEqual([90, 91, 92, 93, 94, 95]);
  expect(source.pageImages.map((p) => [p.printedPage, p.suffix])).toEqual([
    [90, '094.jpg'],
    [91, '095.jpg'],
    [92, '096.jpg'],
    [93, '097.jpg'],
    [94, '098.jpg'],
    [95, '099.jpg'],
  ]);
  expect(source.activities).toHaveLength(24);
  expect(new Set(source.activities.map((a) => a.key)).size).toBe(24);
  expect(source.followingImages[0].observed).toContain('无印刷页码');
  expect(source.followingImages[1].observed).toContain('印刷97页');
  expect(source.geometry.appendixFigure).toBe(3);
  expect(source.geometry.collageCounts).toBeNull();
  expect(source.status).toBe('source-checked-teaching-partial');
});
it('distinguishes number-line positions, sequential quantity scopes, ranks and three independent continuation patterns', () => {
  const applications = source.numberApplications;
  expect(applications.forwardLine.blanks).toEqual([26, 28, 30, 32]);
  expect(applications.backwardLine.blanks).toEqual([59, 58, 55, 54]);
  expect(
    applications.compositions.map((n) => [Math.floor(n / 10), n % 10]),
  ).toEqual([
    [3, 7],
    [2, 4],
    [5, 1],
  ]);
  expect(applications.pandaGroups[0] + applications.pandaGroups[1]).toBe(13);
  expect(applications.ropeJump.counts).toEqual([92, 95, 94, 99]);
  expect(applications.rescue.asked).toContain('不是全年合计');
  expect(source.numberReview.lifeExamplesRequested).toBe(2);
  expect(source.practice.nextDrawings.faces).toEqual(['happy', 'happy', 'sad']);
  expect(source.practice.nextDrawings.cupHandles).toEqual([
    'right',
    'left',
    'right',
  ]);
  expect(source.practice.nextDrawings.rectangleDivisions).toEqual([
    'horizontal',
    'vertical',
    'horizontal',
  ]);
  expect(source.practice.boundary).toContain('真实与同伴/家人合作');
});

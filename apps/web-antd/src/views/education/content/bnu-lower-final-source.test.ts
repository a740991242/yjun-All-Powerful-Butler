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

it('keeps all given drawings and three blanks in each independent row, and the complete dot-grid dimensions without invented centimetres', () => {
  expect(source.geometry.dotGrid).toEqual({
    rows: 6,
    columns: 11,
    printedPhysicalSpacing: null,
  });
  expect(source.practice.givenDrawings.faces).toEqual([
    'happy',
    'happy',
    'sad',
    'happy',
    'happy',
    'sad',
  ]);
  expect(source.practice.givenDrawings.cupHandles).toEqual([
    'right',
    'left',
    'right',
    'left',
  ]);
  expect(source.practice.givenDrawings.rectangleDivisions).toEqual([
    'horizontal',
    'vertical',
    'horizontal',
    'vertical',
  ]);
  expect(source.practice.continuationSlotsPerRow).toBe(3);
  const patterns = [
    {
      given: source.practice.givenDrawings.faces,
      cycle: ['happy', 'happy', 'sad'],
      next: source.practice.nextDrawings.faces,
    },
    {
      given: source.practice.givenDrawings.cupHandles,
      cycle: ['right', 'left'],
      next: source.practice.nextDrawings.cupHandles,
    },
    {
      given: source.practice.givenDrawings.rectangleDivisions,
      cycle: ['horizontal', 'vertical'],
      next: source.practice.nextDrawings.rectangleDivisions,
    },
  ];
  for (const { given, cycle, next } of patterns) {
    expect(
      given.every((value, index) => value === cycle[index % cycle.length]),
    ).toBe(true);
    expect(
      Array.from(
        { length: 3 },
        (_, i) => cycle[(given.length + i) % cycle.length],
      ),
    ).toEqual(next);
  }
});

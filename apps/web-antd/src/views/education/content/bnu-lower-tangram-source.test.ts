import { expect, it } from 'vitest';

import { bnuLowerBook } from './bnu-lower';
import { bnuLowerTangramSource as source } from './bnu-lower-tangram-source';
import { bnuLowerUnitSixAudit as audit } from './bnu-lower-unit-six-audit';

it('preserves the original seven-piece numbering and all four blanks without substituting another tangram convention', () => {
  expect(source.readPrintedPages).toEqual([80, 81, 82]);
  expect(source.pageImages.map((p) => [p.printedPage, p.suffix])).toEqual([
    [80, '084.jpg'],
    [81, '085.jpg'],
    [82, '086.jpg'],
  ]);
  expect(source.numberedSquare.pieceIds).toEqual([1, 2, 3, 4, 5, 6, 7]);
  expect(source.numberedSquare.triangleIds).toEqual([1, 2, 4, 6, 7]);
  expect(source.numberedSquare.parallelogramId).toBe(3);
  expect(source.numberedSquare.squareId).toBe(5);
  expect(source.numberedSquare.congruentPairs).toEqual([
    [1, 2],
    [4, 6],
  ]);
  expect(source.numberedSquare.blanks).toEqual([3, 5, 2, 6]);
});
it('keeps all six trial pictures and each independent open story or physical activity in the three-page preparation', () => {
  expect(source.trace.shapes).toEqual(['square', 'parallelogram', 'triangle']);
  expect(source.tryPatterns.count).toBe(6);
  expect(source.tryPatterns.arrangement).toBe('two-rows-three-columns');
  expect(source.activities.map((a) => a.page)).toEqual([
    80, 80, 81, 81, 81, 82, 82, 82, 82,
  ]);
  expect(new Set(source.activities.map((a) => a.key)).size).toBe(9);
  expect(source.peopleStory.figureCount).toBe(3);
  expect(source.waitingForHare.figureCount).toBe(3);
  expect(source.freeCreation.examples).toEqual(['apple', 'coconut-tree']);
});
it('does not invent mandatory all-seven use or unique picture/story labels and keeps teaching pending', () => {
  expect(source.tryPatterns.boundary).toContain('不擅自补此限制');
  expect(source.largerTriangles.boundary).toContain('不补约束');
  expect(source.largerTriangles.requestedCount).toBe(2);
  expect(source.peopleStory.boundary).toContain('足球是场景道具');
  expect(source.status).toBe('source-checked-teaching-mapped');
});
it('maps all nine read-page activities to actual registered steps and separate task kinds without closing pages 83 onward', () => {
  const activities = audit.activities.filter((a) =>
    a.lesson.startsWith('bnu-lower-tangram-'),
  );
  expect(activities.map((a) => [a.page, a.sourceActivity])).toEqual(
    source.activities.map((a) => [a.page, a.key]),
  );
  for (const activity of activities) {
    const lesson = bnuLowerBook.units
      .flatMap((u) => u.lessons)
      .find((l) => l.id === activity.lesson);
    expect(lesson).toBeDefined();
    if (!lesson) throw new Error('Missing mapped course');
    expect(lesson.status).toBe('available');
    for (const step of activity.steps)
      expect(lesson.steps[step - 1]).toBeDefined();
    const kinds = new Map(
      lesson.questions.map((q) => [
        q.id.slice(lesson.id.length + 1),
        q.rule.kind,
      ]),
    );
    for (const key of activity.objective)
      expect(['choice', 'number']).toContain(kinds.get(key));
    for (const key of activity.manual) expect(kinds.get(key)).toBe('manual');
    for (const key of activity.records)
      expect(kinds.get(key)).toBe('reflection');
  }
  expect(audit.pendingPrintedPages).toEqual([]);
  expect(audit.status).toBe('original-teaching-mapped');
});

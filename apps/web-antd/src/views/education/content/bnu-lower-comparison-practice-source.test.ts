import { expect, it } from 'vitest';

import { bnuLowerComparisonPracticeSource as source } from './bnu-lower-comparison-practice-source';

it('keeps both original sports conditions and distinct drawing symbols', () => {
  expect(source.sports.reference).toEqual({
    activity: '跑步',
    quantity: 86,
    unit: '人',
  });
  expect(source.sports.candidates).toEqual([88, 12, 76]);
  expect(source.sports.longJump).toEqual({
    description: '比跑步少得多',
    selected: 12,
    symbol: '○',
  });
  expect(source.sports.skipping).toEqual({
    description: '比跑步少一些',
    selected: 76,
    symbol: '✓',
  });
  expect(source.sports.boundary).toContain('不补造普遍差数或比例阈值');
});
it('interprets approximate age only among the three given candidates', () => {
  expect(source.ages).toMatchObject({
    reference: 37,
    candidates: [39, 50, 28],
    description: '差不多',
    selected: 39,
  });
  expect(source.ages.boundary).toContain('差不多不是相等');
});
it('preserves all four group-score associations and the original descending direction', () => {
  expect(source.scores.original).toEqual([
    { group: '淘气组', score: 95 },
    { group: '笑笑组', score: 88 },
    { group: '妙想组', score: 91 },
    { group: '奇思组', score: 79 },
  ]);
  expect(source.scores.descending).toEqual([95, 91, 88, 79]);
  expect(source.scores.orderedGroups).toEqual([
    '淘气组',
    '妙想组',
    '笑笑组',
    '奇思组',
  ]);
  expect(source.scores.comparisonSigns).toEqual(['>', '>', '>']);
  expect(
    [...source.scores.original]
      .toSorted((a, b) => b.score - a.score)
      .map((x) => x.score),
  ).toEqual(source.scores.descending);
  expect(
    [...source.scores.original]
      .toSorted((a, b) => b.score - a.score)
      .map((x) => x.group),
  ).toEqual(source.scores.orderedGroups);
});
it('does not confuse source preparation with registered teaching', () => {
  expect(source.status).toBe('source-checked');
  expect(source.readPrintedPages).toEqual([54]);
  expect(source.activities.map((x) => [x.page, x.key])).toEqual([
    [54, 'sports-candidates'],
    [54, 'age-candidates'],
    [54, 'sort-four-scores'],
  ]);
});

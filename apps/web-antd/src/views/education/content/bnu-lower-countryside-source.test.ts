import { expect, it } from 'vitest';

import { bnuLowerCountrysideSource as source } from './bnu-lower-countryside-source';

it('keeps the printed addition attached to the correct two groups and separates bird sum from difference', () => {
  const counts = source.countryside.counts;
  expect(source.countryside.addition.groups).toEqual([
    'riverWaterbirds',
    'shoreWaterbirds',
  ]);
  expect(counts.riverWaterbirds + counts.shoreWaterbirds).toBe(14);
  expect(counts.airBirds + counts.treeBirds).toBe(16);
  expect(counts.airBirds - counts.treeBirds).toBe(6);
  expect(counts.whiteSheep + counts.darkSheep).toBe(12);
  expect(source.countryside.countBasis).toContain('上枝2、下枝3');
});

it('does not turn a subtraction operand into an independently verified animal count or a fabricated removal event', () => {
  expect(source.practice.counts.squirrels).toBe(9);
  expect(source.practice.counts.deer).toBe(14);
  expect(source.practice.counts.ducks).toBe(17);
  expect(source.practice.subtraction.operands).toEqual([17, 9]);
  expect(source.practice.subtraction.interpretation).toBe(
    'ducks-more-than-squirrels',
  );
  expect(source.practice.countBasis).toContain('卷尾不是另一个身体');
  expect(source.practice.boundary).toContain('不能给17−9补造9只游走');
});

it('covers both complete hidden-quantity conditions and all original activity types without releasing teaching', () => {
  expect(source.hidden.map(({ total, visible }) => total - visible)).toEqual([
    9, 7,
  ]);
  expect(source.hidden.map(({ object, unit }) => [object, unit])).toEqual([
    ['pencil', '支'],
    ['shuttlecock', '个'],
  ]);
  expect(source.activities.map(({ key }) => key)).toEqual([
    'six-groups',
    'bird-comparison',
    'addition-meaning',
    'own-countryside',
    'practice-counts',
    'deer-comparison',
    'subtraction-meaning',
    'own-practice',
    'hidden-pencils',
    'hidden-shuttlecocks',
  ]);
  expect(source.activities.filter(({ page }) => page === 38)).toHaveLength(3);
  expect(source.activities.filter(({ page }) => page === 39)).toHaveLength(7);
  expect(source.status).toBe('source-checked');
  expect(source.finalTeacherReview).toBe('not-verified');
  expect(source.images.map(({ printedPage }) => printedPage)).toEqual([38, 39]);
});

import { expect, it } from 'vitest';

import { bnuLowerNumberPracticeSource as source } from './bnu-lower-number-practice-source';

it('preserves the four inspected materials, all fifteen loose cubes and unchanged regrouped value', () => {
  expect(source.readPrintedPages).toEqual([58, 59]);
  expect(source.status).toBe('source-checked');
  expect(source.materials.orangeObjects.shownRows).toEqual([10, 10, 10, 10, 3]);
  expect(source.materials.orangeObjects.derived).toEqual({
    tens: 4,
    ones: 3,
    value: 43,
  });
  expect(source.materials.sticks.shown).toEqual({ tenBundles: 3, loose: 8 });
  expect(source.materials.sticks.derived).toEqual({
    tens: 3,
    ones: 8,
    value: 38,
  });
  expect(source.materials.counter.shown).toEqual({
    tensBeads: 2,
    onesBeads: 5,
  });
  expect(source.materials.counter.derived).toEqual({
    tens: 2,
    ones: 5,
    value: 25,
  });
  expect(source.materials.cubes.shown).toEqual({ tenRods: 2, singleCubes: 15 });
  expect(source.materials.cubes.raw).toEqual({ tens: 2, ones: 15, value: 35 });
  expect(source.materials.cubes.regrouped).toEqual({
    tens: 3,
    ones: 5,
    value: 35,
  });
  expect(source.writeGame.original).toEqual({ value: 34, tens: 3, ones: 4 });
});
it('checks complete candidate conditions without inventing universal qualitative thresholds', () => {
  expect(source.peaches.reference).toBe(38);
  expect(source.peaches.candidates).toEqual([96, 42, 35]);
  expect(source.peaches.selected).toBe(42);
  expect(source.books.pictureBooks).toBe(36);
  expect(source.books.candidates).toEqual([85, 99, 40]);
  expect(source.books.secondClue.reference).toBe(90);
  expect(source.books.onlyGreaterThan36).toEqual([85, 99, 40]);
  expect(source.books.onlyLessThan90).toEqual([85, 40]);
  expect(source.books.selected).toBe(85);
  expect(source.books.boundary).toContain('两条完整线索');
});
it('independently checks all original train positions, all sixteen blanks and each constant direction', () => {
  const given = [
    [15, 20, 25, null, 35, null, 45, null, null],
    [22, null, 26, 28, null, 32, null, null],
    [10, 20, 30, null, null, null, null],
    [100, 95, 90, 85, null, null, null, null],
  ];
  const answers = [
    [30, 40, 50, 55],
    [24, 30, 34, 36],
    [40, 50, 60, 70],
    [80, 75, 70, 65],
  ];
  const starts = [15, 22, 10, 100];
  const steps = [5, 2, 10, -5];
  for (const [i, train] of source.trains.entries()) {
    expect(train.given).toEqual(given[i]);
    expect(train.blanks).toEqual(answers[i]);
    expect(train.complete).toEqual(
      Array.from(
        { length: train.given.length },
        (_, k) => starts[i]! + k * steps[i]!,
      ),
    );
    expect(train.step).toBe(steps[i]);
    expect(train.complete.filter((_, k) => train.given[k] === null)).toEqual(
      answers[i],
    );
  }
  expect(source.trains.flatMap((t) => t.blanks)).toHaveLength(16);
});
it('exhausts all five four-bead placements and six distinct two-card numbers, keeping one-digit four and real zero', () => {
  const placements = Array.from({ length: 5 }, (_, tens) => ({
    tens,
    ones: 4 - tens,
    value: tens * 10 + 4 - tens,
  }));
  expect(source.fourBeads.allAscending).toEqual(placements.map((p) => p.value));
  expect(source.fourBeads.pairs).toEqual(
    placements.map((p) => [p.tens, p.ones]),
  );
  expect(source.fourBeads.given).toEqual({ tens: 1, ones: 3, value: 13 });
  expect(source.fourBeads.remainingAscending).toEqual([4, 22, 31, 40]);
  const numbers: number[] = [];
  for (const tens of [2, 5, 8])
    for (const ones of [2, 5, 8])
      if (tens !== ones) numbers.push(tens * 10 + ones);
  expect(source.numberCards.cards).toEqual([2, 5, 8]);
  expect(source.numberCards.ascending).toEqual(
    numbers.toSorted((a, b) => a - b),
  );
  expect(source.numberCards.ascending).toEqual([25, 28, 52, 58, 82, 85]);
  expect(source.numberCards.count).toBe(6);
});
it('keeps all seven inspected activities separate from teaching release and physical confirmation', () => {
  expect(source.activities.map((a) => [a.page, a.key])).toEqual([
    [58, 'four-material-compositions'],
    [58, 'counter-write-game'],
    [58, 'peach-candidates'],
    [59, 'book-two-clues'],
    [59, 'four-complete-trains'],
    [59, 'four-beads-all-five'],
    [59, 'three-cards-all-six'],
  ]);
  expect(source.pageImages).toEqual([
    { printedPage: 58, suffix: '062.jpg' },
    { printedPage: 59, suffix: '063.jpg' },
  ]);
});

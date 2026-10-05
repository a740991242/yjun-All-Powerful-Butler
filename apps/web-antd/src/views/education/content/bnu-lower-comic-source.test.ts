import { expect, it } from 'vitest';

import { bnuLowerComicSource as source } from './bnu-lower-comic-source';
it('preserves both four-panel source examples and the two sequential duck events without making four panels compulsory for personal work', () => {
  expect(source.readPrintedPages).toEqual([87, 88, 89]);
  expect(source.pageImages.map((p) => p.suffix)).toEqual([
    '091.jpg',
    '092.jpg',
    '093.jpg',
  ]);
  expect(source.milkStory.order).toEqual(['上左', '上右', '下左', '下右']);
  expect(source.milkStory.tendered - source.milkStory.price).toBe(
    source.milkStory.change,
  );
  expect(source.milkStory.cartons).toBe(1);
  expect(source.duckStory.start + source.duckStory.arrive).toBe(
    source.duckStory.total,
  );
  expect(source.duckStory.total - source.duckStory.leave).toBe(
    source.duckStory.remaining,
  );
  expect(source.duckStory.remaining).toBe(9);
  expect(source.ownComic.boundary).toContain('不强制所有作品都4格');
});
it('keeps all eleven activities and three real self-assessment criteria independent from automatic score or invented personal experiences', () => {
  expect(source.activities).toHaveLength(11);
  expect(source.selfAssessment.criteria).toHaveLength(3);
  expect(source.selfAssessment.starsPerCriterion).toBe(3);
  expect(source.selfAssessment.boundary).toContain('不能由客观题自动填满');
  expect(source.ownComic.boundary).toContain('不捏造同伴或购买经历');
  expect(source.status).toBe('source-checked-teaching-mapped');
});

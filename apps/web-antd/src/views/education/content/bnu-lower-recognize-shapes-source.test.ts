import { expect, it } from 'vitest';

import { bnuLowerRecognizeShapesSource as source } from './bnu-lower-recognize-shapes-source';

it('preserves the complete eleven-shape order and the actually rotated square, including the provided first connection', () => {
  expect(source.readPrintedPages).toEqual([76, 77]);
  expect(source.pageImages).toEqual([
    { printedPage: 76, suffix: '080.jpg' },
    { printedPage: 77, suffix: '081.jpg' },
  ]);
  expect(source.matching.shapes).toEqual([
    'rectangle',
    'triangle',
    'circle',
    'square',
    'circle',
    'square',
    'triangle',
    'rectangle',
    'rectangle',
    'triangle',
    'square',
  ]);
  const positions = (category: string) =>
    source.matching.shapes.flatMap((shape, index) =>
      shape === category ? [index + 1] : [],
    );
  expect(positions('rectangle')).toEqual([1, 8, 9]);
  expect(positions('square')).toEqual([4, 6, 11]);
  expect(positions('circle')).toEqual([3, 5]);
  expect(positions('triangle')).toEqual([2, 7, 10]);
  expect(source.matching.rotationDialogueCategory).toBe('square');
  expect(source.matching.alreadyConnectedPositions).toEqual([1]);
  for (const [shape, count] of Object.entries(source.matching.counts))
    expect(positions(shape)).toHaveLength(count);
});

it('retains all seventeen identified coloring regions and the exact legend without assigning nonbasic remainders or open lines', () => {
  expect(source.coloring.legend).toEqual({
    triangle: 'red',
    circle: 'green',
    rectangle: 'blue',
    square: 'yellow',
  });
  const regions = source.coloring.knownRegions;
  expect(new Set(regions.map((x) => x.key)).size).toBe(17);
  expect(
    regions
      .filter((x) => x.key.startsWith('boat-porthole'))
      .map((x) => x.shape),
  ).toEqual(['circle', 'circle', 'circle', 'circle']);
  expect(
    regions.filter((x) => x.key.startsWith('boat-window')).map((x) => x.shape),
  ).toEqual(['rectangle', 'rectangle', 'rectangle', 'rectangle']);
  expect(
    regions.filter((x) => x.key.startsWith('rocket')).map((x) => x.shape),
  ).toEqual([
    'triangle',
    'square',
    'rectangle',
    'square',
    'triangle',
    'triangle',
  ]);
  expect(source.coloring.excluded).toEqual([
    'flag-pole-open-line',
    'boat-deck-surrounding-circles',
    'boat-hull-surrounding-windows',
  ]);
  expect(source.coloring.boundary).toContain('不是原图所有白色区域总数');
});

it('counts train components independently with every wheel and does not turn smoke or a slanted chimney into extra rectangles', () => {
  const parts = source.train.confirmedParts;
  expect(new Set(parts.map((x) => x.key)).size).toBe(15);
  expect(
    parts.filter((x) => x.shape === 'rectangle').map((x) => x.key),
  ).toEqual(['wagon-1', 'wagon-2', 'wagon-3', 'engine-base', 'engine-roof']);
  expect(parts.filter((x) => x.shape === 'square').map((x) => x.key)).toEqual([
    'engine-cab',
  ]);
  expect(parts.filter((x) => x.shape === 'triangle').map((x) => x.key)).toEqual(
    ['engine-front'],
  );
  expect(parts.filter((x) => x.shape === 'circle').map((x) => x.key)).toEqual([
    'wheel-1',
    'wheel-2',
    'wheel-3',
    'wheel-4',
    'wheel-5',
    'wheel-6',
    'wheel-7',
    'wheel-8',
  ]);
  for (const [shape, count] of Object.entries(source.train.confirmedCounts))
    expect(parts.filter((x) => x.shape === shape)).toHaveLength(count);
  expect(source.train.excluded).toEqual([
    'smoke-open-lines',
    'slanted-blue-chimney',
  ]);
});

it('keeps all six original activities without claiming unit completion or known hidden contact faces', () => {
  expect(source.status).toBe('source-checked');
  expect(source.footprints.purpleObject).toBe(
    'choose-and-check-the-contact-face',
  );
  expect(source.activities.map((x) => [x.page, x.key])).toEqual([
    [76, 'predict-contact-footprints'],
    [76, 'trace-faces-and-name-four-shapes'],
    [77, 'match-all-eleven-and-rotate-square'],
    [77, 'nearby-object-predict-before-tracing'],
    [77, 'color-boat-and-rocket-by-four-shape-legend'],
    [77, 'count-train-four-categories'],
  ]);
});

import { expect, it } from 'vitest';

import { bnuLowerFoldOneSource as source } from './bnu-lower-fold-one-source';

it('ties body pages to the actually read appendix rather than guessing triangle types or printed sizes', () => {
  expect(source.readPrintedPages).toEqual([78, 79, 97]);
  expect(source.pageImages.map((x) => [x.printedPage, x.suffix])).toEqual([
    [78, '082.jpg'],
    [79, '083.jpg'],
    [97, '101.jpg'],
  ]);
  expect(source.appendix.figureOne).toEqual(['square', 'square']);
  expect(source.appendix.figureTwo).toEqual([
    'rectangle',
    'isosceles-triangle',
    'circle',
  ]);
  expect(source.appendix.figureThree).toEqual(['long-rectangle']);
  expect(source.otherHalves.rectangleObliquePhoto).toBe(
    'fold-line-and-overlap-need-further-operation-check',
  );
  expect(source.otherHalves.boundary).toContain('不保证两半重合');
});

it('retains all four copy patterns, cooperation examples and seven aircraft panels with the snake-shaped arrow order', () => {
  expect(source.copyPatterns.outlines).toEqual([
    'triangle',
    'slanted-quadrilateral',
    'mushroom',
    'flag',
  ]);
  expect(source.cooperate.shownExamples).toEqual(['flower', 'fish']);
  expect(source.airplane.visiblePanels).toBe(7);
  expect(source.airplane.readingOrder).toEqual([
    'upper-left',
    'upper-second',
    'upper-third',
    'upper-right',
    'lower-right',
    'lower-middle',
    'lower-left',
  ]);
  expect(source.activities.map((x) => [x.page, x.key])).toEqual([
    [78, 'square-two-equal-halves-cut-and-compare'],
    [78, 'rectangle-triangle-circle-halves-cut-and-compare'],
    [78, 'copy-all-four-cut-piece-patterns'],
    [79, 'cooperate-create-color-and-describe'],
    [79, 'fold-airplane-seven-panel-arrow-order'],
    [79, 'fold-rectangle-into-square-without-mandatory-cut'],
    [79, 'square-four-equal-triangles-open-recomposition'],
  ]);
});

it('keeps folding distinct from forced cutting and four triangular pieces distinct from square quarters or a closed answer list', () => {
  expect(source.rectangleToSquare.originalOperation).toBe('fold');
  expect(source.fourTriangles.cutLines).toBe('both-diagonals');
  expect(source.fourTriangles.count).toBe(4);
  expect(source.fourTriangles.shapes).toBe(
    'four-congruent-right-isosceles-triangles',
  );
  expect(source.fourTriangles.shownJoinedOutlines).toEqual([
    'triangle',
    'trapezoid',
  ]);
  expect(source.fourTriangles.originalTask).toBe('open-exploration');
  expect(source.fourTriangles.boundary).toContain('不强判只有两种');
  expect(source.status).toBe('source-checked');
});

import { describe, expect, it } from 'vitest';

import { finalPlaneCards, isFinalPlaneCardsVisual } from './final-plane-cards';
describe('fixed labelled five-category independent plane pieces', () => {
  it('keeps every letter unique and changed review inventory separate from the original', () => {
    const main = finalPlaneCards({
      kind: 'final-plane-cards',
      variant: 'main',
    });
    const review = finalPlaneCards({
      kind: 'final-plane-cards',
      variant: 'review',
    });
    expect(main.map((c) => c.label).join('')).toBe('ABCDEFGHIJKL');
    expect(review.map((c) => c.label).join('')).toBe('ABCDEFGHIJKLM');
    expect(
      main.filter((c) => c.shape === 'rectangle').map((c) => c.label),
    ).toEqual(['A', 'F', 'K']);
    expect(
      main.filter((c) => c.shape === 'parallelogram').map((c) => c.label),
    ).toEqual(['D', 'J']);
    expect(
      review.filter((c) => c.shape === 'parallelogram').map((c) => c.label),
    ).toEqual(['F']);
    main.splice(0, 1);
    expect(
      finalPlaneCards({ kind: 'final-plane-cards', variant: 'main' }),
    ).toHaveLength(12);
  });
  it('strictly accepts only two fixed variants without answer-bearing or mutable diagram fields', () => {
    for (const variant of ['main', 'review'])
      expect(
        isFinalPlaneCardsVisual({ kind: 'final-plane-cards', variant }),
      ).toBe(true);
    for (const bad of [
      null,
      [],
      { kind: 'final-plane-cards' },
      { kind: 'final-plane-cards', variant: 'other' },
      { kind: 'final-plane-cards', variant: ['main'] },
      { kind: 'final-plane-cards', variant: 'main', answer: 12 },
      { kind: 'final-plane-cards', variant: 'main', shapes: [] },
    ])
      expect(isFinalPlaneCardsVisual(bad)).toBe(false);
  });
});

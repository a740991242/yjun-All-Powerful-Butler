import type { SolidRowVisual } from './types';

import { expect, it } from 'vitest';

import { fold } from './fold';
import { isSolidRowVisual, solidCounts, solidPositions } from './solid-row';

it('accepts two to nine whole models, counts every object exactly once, and preserves repeated-shape positions', () => {
  for (let length = 2; length <= 9; length++) {
    const row: SolidRowVisual = {
      kind: 'solid-row',
      shapes: Array.from(
        { length },
        (_, i) => (['cube', 'cuboid', 'cylinder', 'sphere'] as const)[i % 4]!,
      ),
    };
    expect(isSolidRowVisual(row)).toBe(true);
    expect(fold(Object.values(solidCounts(row)), 0, (a, b) => a + b)).toBe(
      length,
    );
    for (const shape of ['cube', 'cuboid', 'cylinder', 'sphere'] as const) {
      const indices = solidPositions(row, shape);
      expect(indices.length).toBe(solidCounts(row)[shape]);
      expect(
        indices.every((position) => row.shapes[position - 1] === shape),
      ).toBe(true);
    }
  }
  expect(
    solidPositions(
      { kind: 'solid-row', shapes: ['cube', 'sphere', 'cube'] },
      'cube',
    ),
  ).toEqual([1, 3]);
});

it('rejects planes, unsupported shapes, missing models and answer-bearing or depth-bearing diagrams', () => {
  const row = { kind: 'solid-row', shapes: ['cube', 'sphere'] };
  for (const bad of [
    null,
    [],
    {},
    { ...row, shapes: [] },
    { ...row, shapes: ['cube'] },
    { ...row, shapes: Array.from({ length: 10 }, () => 'sphere') },
    { ...row, shapes: ['cube', 'circle'] },
    { ...row, shapes: ['sphere', 'cone'] },
    { ...row, shapes: ['cube', 1] },
    { ...row, depth: 2 },
    { ...row, answer: 2 },
    { ...row, front: 'left' },
  ])
    expect(isSolidRowVisual(bad)).toBe(false);
});

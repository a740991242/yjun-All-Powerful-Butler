import { expect, it } from 'vitest';

import {
  isSolidPatternVisual,
  solidPatternAt,
  solidPatternGroup,
} from './solid-pattern';
it('keeps shapes and sizes separate and repeats complete groups at all nine positions', () => {
  for (const variant of ['main', 'review'] as const) {
    const sequences =
      variant === 'main'
        ? {
            alternating: ['cuboid', 'cube'],
            'three-shapes': ['cylinder', 'cube', 'sphere'],
            'ball-sizes': ['large', 'small', 'small'],
          }
        : {
            alternating: ['cube', 'cuboid'],
            'three-shapes': ['cuboid', 'cylinder', 'cube'],
            'ball-sizes': ['small', 'large', 'large'],
          };
    for (const pattern of [
      'alternating',
      'three-shapes',
      'ball-sizes',
    ] as const) {
      const model = { kind: 'solid-pattern' as const, pattern, variant };
      expect(solidPatternGroup(model)).toHaveLength(
        pattern === 'alternating' ? 2 : 3,
      );
      for (let position = 1; position <= 9; position++) {
        const item = solidPatternAt(model, position);
        expect(pattern === 'ball-sizes' ? item.size : item.shape).toBe(
          sequences[pattern][(position - 1) % sequences[pattern].length],
        );
        if (pattern === 'ball-sizes') expect(item.shape).toBe('sphere');
      }
      expect(() => solidPatternAt(model, 0)).toThrow(
        'Invalid pattern position',
      );
      expect(() => solidPatternAt(model, 10)).toThrow(
        'Invalid pattern position',
      );
    }
  }
});
it('rejects unknown, extra and missing model fields rather than accepting embedded answers', () => {
  const model = {
    kind: 'solid-pattern',
    pattern: 'ball-sizes',
    variant: 'main',
  };
  expect(isSolidPatternVisual(model)).toBe(true);
  for (const value of [
    null,
    [],
    { ...model, pattern: ['ball-sizes'] },
    { ...model, variant: 'old' },
    { ...model, answer: 'large' },
    { ...model, size: 3 },
    { kind: 'solid-pattern', variant: 'main' },
  ]) {
    expect(isSolidPatternVisual(value)).toBe(false);
  }
});

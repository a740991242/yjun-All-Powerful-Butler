import type { SolidShape } from './types';

import { required } from './required';

export interface SolidPatternVisual {
  kind: 'solid-pattern';
  pattern: 'alternating' | 'ball-sizes' | 'three-shapes';
  variant: 'main' | 'review';
}
export interface SolidPatternItem {
  shape: SolidShape;
  size: 'large' | 'small';
}
export function solidPatternGroup(
  model: SolidPatternVisual,
): SolidPatternItem[] {
  const review = model.variant === 'review';
  if (model.pattern === 'alternating')
    return (review ? ['cube', 'cuboid'] : ['cuboid', 'cube']).map((shape) => ({
      shape: shape === 'cube' ? 'cube' : 'cuboid',
      size: 'large',
    }));
  if (model.pattern === 'three-shapes')
    return (
      review ? ['cuboid', 'cylinder', 'cube'] : ['cylinder', 'cube', 'sphere']
    ).map((shape) => {
      if (
        shape !== 'cuboid' &&
        shape !== 'cylinder' &&
        shape !== 'cube' &&
        shape !== 'sphere'
      )
        throw new Error('Invalid solid pattern');
      return { shape, size: 'large' };
    });
  return (
    review ? ['small', 'large', 'large'] : ['large', 'small', 'small']
  ).map((size) => ({
    shape: 'sphere',
    size: size === 'large' ? 'large' : 'small',
  }));
}
export function solidPatternAt(
  model: SolidPatternVisual,
  index: number,
): SolidPatternItem {
  if (!Number.isInteger(index) || index < 1 || index > 9)
    throw new Error('Invalid pattern position');
  const group = solidPatternGroup(model);
  return required(group[(index - 1) % group.length]);
}
export function isSolidPatternVisual(
  value: unknown,
): value is SolidPatternVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const m = value as Record<string, unknown>;
  return (
    Object.keys(m).length === 3 &&
    m.kind === 'solid-pattern' &&
    (m.pattern === 'alternating' ||
      m.pattern === 'three-shapes' ||
      m.pattern === 'ball-sizes') &&
    (m.variant === 'main' || m.variant === 'review')
  );
}

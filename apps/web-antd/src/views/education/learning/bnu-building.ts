import type { SolidShape } from './types';

export interface BnuBuildingVisual {
  kind: 'bnu-building';
  scene: 'beam' | 'gate' | 'tower-flat' | 'tower-upright';
  variant: 'main' | 'review';
}
export function isBnuBuildingVisual(
  value: unknown,
): value is BnuBuildingVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  return (
    Object.keys(model).length === 3 &&
    model.kind === 'bnu-building' &&
    typeof model.scene === 'string' &&
    ['beam', 'gate', 'tower-flat', 'tower-upright'].includes(model.scene) &&
    (model.variant === 'main' || model.variant === 'review')
  );
}
export function bnuBuildingItems(model: BnuBuildingVisual) {
  let shapes: SolidShape[] = [
    'cuboid',
    'cuboid',
    'cuboid',
    'cube',
    'cube',
    'cylinder',
    'cylinder',
    'sphere',
  ];
  let levels = [1, 2, 3, 4, 5, 6, 7, 8];
  let reviewLabels = ['H', 'D', 'G', 'B', 'F', 'C', 'A', 'E'];
  if (model.scene === 'beam') {
    shapes = ['cylinder', 'cylinder', 'cuboid', 'cube'];
    levels = [1, 1, 2, 3];
    reviewLabels = ['D', 'C', 'A', 'B'];
  } else if (model.scene === 'gate') {
    shapes = [
      'cube',
      'cube',
      'cylinder',
      'cylinder',
      'cuboid',
      'sphere',
      'sphere',
    ];
    levels = [1, 1, 2, 2, 3, 4, 4];
    reviewLabels = ['G', 'B', 'D', 'F', 'C', 'A', 'E'];
  }
  const labels =
    model.variant === 'main'
      ? ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      : reviewLabels;
  return shapes.map((shape, index) => {
    const label = labels[index];
    if (!label) throw new Error('Missing building label');
    const level = levels[index];
    if (!level) throw new Error('Missing building level');
    let side: 'center' | 'left' | 'right' = 'center';
    if (model.scene === 'beam' && index < 2)
      side = index === 0 ? 'left' : 'right';
    if (model.scene === 'gate' && index !== 4)
      side = index % 2 === 0 ? 'left' : 'right';
    // The two balls are indexed 5/6 rather than 0/1.
    if (model.scene === 'gate' && index >= 5)
      side = index === 5 ? 'left' : 'right';
    return {
      label,
      shape,
      level,
      side,
      upright: model.scene === 'tower-upright' && shape === 'cuboid',
    };
  });
}
export function bnuBuildingLayers(model: BnuBuildingVisual) {
  const items = bnuBuildingItems(model);
  const highest = Math.max(...items.map((item) => item.level));
  return Array.from({ length: highest }, (_, index) => {
    const level = highest - index;
    return { level, pieces: items.filter((item) => item.level === level) };
  });
}

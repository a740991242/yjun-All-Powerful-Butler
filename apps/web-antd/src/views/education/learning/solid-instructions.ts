import type { SolidShape } from './types';

export interface SolidInstructionsVisual {
  kind: 'solid-instructions';
  arrangement: 'bridge' | 'cross';
  variant: 'main' | 'review';
}
export function isSolidInstructionsVisual(
  value: unknown,
): value is SolidInstructionsVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  return (
    Object.keys(model).length === 3 &&
    model.kind === 'solid-instructions' &&
    (model.arrangement === 'cross' || model.arrangement === 'bridge') &&
    (model.variant === 'main' || model.variant === 'review')
  );
}
export function solidInstructionItems(model: SolidInstructionsVisual) {
  const labels =
    model.variant === 'main'
      ? ['A', 'B', 'C', 'D', 'E', 'F', 'G']
      : ['D', 'G', 'B', 'F', 'A', 'C', 'E'];
  const roles =
    model.arrangement === 'cross'
      ? ['center', 'left', 'right', 'front', 'back', 'lowerTop', 'upperTop']
      : [
          'leftPillar',
          'rightPillar',
          'beam',
          'leftCube',
          'rightCube',
          'leftBall',
          'rightBall',
        ];
  return roles.map((role, index) => {
    const label = labels[index];
    if (!label) throw new Error('Missing instruction label');
    const shape: SolidShape = (() => {
      if (model.arrangement === 'cross' || role.endsWith('Cube')) return 'cube';
      if (role.endsWith('Pillar')) return 'cylinder';
      if (role === 'beam') return 'cuboid';
      return 'sphere';
    })();
    return { role, label, shape };
  });
}

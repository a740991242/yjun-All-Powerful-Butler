import type { PaperFoldVisual } from './types';

import { required } from './required';

export type FoldPoint = [number, number];
export function isPaperFoldVisual(value: unknown): value is PaperFoldVisual {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const model = value as Record<string, unknown>;
  return (
    Object.keys(model).length === 4 &&
    model.kind === 'paper-fold' &&
    typeof model.paper === 'string' &&
    ['rectangle', 'square'].includes(model.paper) &&
    typeof model.method === 'string' &&
    ['cross', 'diagonal', 'parallel'].includes(model.method) &&
    [0, 1, 2].includes(model.stage as number) &&
    typeof model.stage === 'number'
  );
}
export function foldOutline(
  model: PaperFoldVisual,
  stage = model.stage,
): FoldPoint[] {
  const height = model.paper === 'square' ? 4 : 2;
  if (stage === 0)
    return [
      [0, 0],
      [4, 0],
      [4, height],
      [0, height],
    ];
  if (model.paper === 'square' && model.method === 'diagonal')
    return stage === 1
      ? [
          [0, 0],
          [4, 4],
          [0, 4],
        ]
      : [
          [0, 0],
          [2, 2],
          [0, 4],
        ];
  if (stage === 1)
    return [
      [0, 0],
      [2, 0],
      [2, height],
      [0, height],
    ];
  if (model.method === 'diagonal')
    return [
      [0, 0],
      [2, 2],
      [0, 2],
    ];
  const width = model.method === 'parallel' ? 1 : 2;
  const finalHeight = model.method === 'cross' ? height / 2 : height;
  return [
    [0, 0],
    [width, 0],
    [width, finalHeight],
    [0, finalHeight],
  ];
}
/** Crease on the current outline; only the next fold is indicated, not its resulting silhouette. */
export function nextFoldLine(
  model: PaperFoldVisual,
  stage = model.stage,
): [FoldPoint, FoldPoint] | null {
  if (stage === 2) return null;
  const height = model.paper === 'square' ? 4 : 2;
  if (stage === 0)
    return model.paper === 'square' && model.method === 'diagonal'
      ? [
          [0, 0],
          [4, 4],
        ]
      : [
          [2, 0],
          [2, height],
        ];
  if (model.paper === 'square' && model.method === 'diagonal')
    return [
      [0, 4],
      [2, 2],
    ];
  if (model.method === 'diagonal')
    return [
      [0, 0],
      [2, 2],
    ];
  return model.method === 'parallel'
    ? [
        [1, 0],
        [1, height],
      ]
    : [
        [0, height / 2],
        [2, height / 2],
      ];
}
export function foldShape(
  model: PaperFoldVisual,
  stage = model.stage,
): 'rectangle' | 'square' | 'triangle' {
  const points = foldOutline(model, stage);
  if (points.length === 3) return 'triangle';
  const height = Math.abs(required(points[3])[1] - required(points[0])[1]);
  const width = Math.abs(required(points[1])[0] - required(points[0])[0]);
  return width === height ? 'square' : 'rectangle';
}

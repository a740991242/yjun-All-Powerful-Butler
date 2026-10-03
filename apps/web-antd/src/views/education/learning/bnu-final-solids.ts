import type { SolidShape } from './types';

export interface BnuFinalSolidsVisual {
  kind: 'bnu-final-solids';
  scene: 'materials' | 'objects' | 'robot' | 'stability';
  variant: 'main' | 'review';
}
export function isBnuFinalSolidsVisual(
  value: unknown,
): value is BnuFinalSolidsVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const data = value as Record<string, unknown>;
  return (
    Object.keys(data).length === 3 &&
    data.kind === 'bnu-final-solids' &&
    typeof data.scene === 'string' &&
    ['materials', 'objects', 'robot', 'stability'].includes(data.scene) &&
    (data.variant === 'main' || data.variant === 'review')
  );
}

const objects: { name: string; shape: SolidShape }[] = [
  { name: 'can', shape: 'cylinder' },
  { name: 'ball', shape: 'sphere' },
  { name: 'rubik', shape: 'cube' },
  { name: 'book', shape: 'cuboid' },
  { name: 'microwave', shape: 'cuboid' },
  { name: 'column', shape: 'cylinder' },
  { name: 'block', shape: 'cube' },
];
export function bnuFinalObjects(variant: BnuFinalSolidsVisual['variant']) {
  const order =
    variant === 'main' ? [0, 1, 2, 3, 4, 5, 6] : [6, 3, 1, 0, 5, 4, 2];
  return order.map((index, position) => {
    const object = objects[index];
    if (!object) throw new Error('Missing life object');
    return { ...object, position: position + 1 };
  });
}
export type FinalMaterial = 'roof' | SolidShape;
export function bnuFinalMaterials(variant: BnuFinalSolidsVisual['variant']) {
  const left: FinalMaterial[] =
    variant === 'main'
      ? [
          'roof',
          'cube',
          'cube',
          'cuboid',
          'cylinder',
          'cylinder',
          'cylinder',
          'cuboid',
        ]
      : ['cube', 'cylinder', 'cuboid', 'roof', 'cube', 'cuboid', 'cube'];
  const right: FinalMaterial[] =
    variant === 'main'
      ? ['roof', 'roof', 'cube', 'cube', 'cube', 'cube', 'cuboid', 'cuboid']
      : ['roof', 'cube', 'cuboid', 'cylinder', 'cube', 'cube'];
  return [left, right].map((shapes, index) => ({
    label: index === 0 ? 'A' : 'B',
    shapes: shapes.map((shape, position) => ({
      shape,
      label: `${index === 0 ? 'A' : 'B'}${position + 1}`,
    })),
  }));
}
export interface FinalRobotPiece {
  label: string;
  shape: SolidShape;
  x: number;
  y: number;
  width: number;
  height: number;
  direction?: 'horizontal';
  rotate?: number;
  base?: boolean;
}
const robot: FinalRobotPiece[] = [
  {
    label: 'A',
    shape: 'cuboid',
    x: 50,
    y: 350,
    width: 260,
    height: 28,
    base: true,
  },
  { label: 'E', shape: 'cylinder', x: 147, y: 277, width: 24, height: 50 },
  { label: 'F', shape: 'cylinder', x: 185, y: 277, width: 24, height: 50 },
  { label: 'C', shape: 'cube', x: 135, y: 317, width: 45, height: 45 },
  { label: 'D', shape: 'cube', x: 180, y: 317, width: 45, height: 45 },
  { label: 'B', shape: 'cuboid', x: 142, y: 190, width: 76, height: 102 },
  {
    label: 'G',
    shape: 'cylinder',
    x: 69,
    y: 198,
    width: 76,
    height: 24,
    direction: 'horizontal',
  },
  { label: 'H', shape: 'cylinder', x: 52, y: 199, width: 24, height: 81 },
  {
    label: 'I',
    shape: 'cylinder',
    x: 215,
    y: 198,
    width: 76,
    height: 24,
    direction: 'horizontal',
  },
  { label: 'J', shape: 'cylinder', x: 277, y: 142, width: 24, height: 77 },
  {
    label: 'K',
    shape: 'cylinder',
    x: 154,
    y: 55,
    width: 16,
    height: 59,
    rotate: -35,
  },
  {
    label: 'L',
    shape: 'cylinder',
    x: 193,
    y: 55,
    width: 16,
    height: 59,
    rotate: 35,
  },
  { label: 'M', shape: 'sphere', x: 137, y: 110, width: 88, height: 88 },
  { label: 'N', shape: 'sphere', x: 128, y: 135, width: 22, height: 22 },
  { label: 'O', shape: 'sphere', x: 215, y: 135, width: 22, height: 22 },
  { label: 'P', shape: 'sphere', x: 170, y: 101, width: 22, height: 22 },
];
export function bnuFinalRobot(variant: BnuFinalSolidsVisual['variant']) {
  const removed = new Set(
    variant === 'review' ? ['A', 'K', 'L', 'N', 'O'] : [],
  );
  return robot
    .filter((piece) => !removed.has(piece.label))
    .map((piece) => ({ ...piece }));
}

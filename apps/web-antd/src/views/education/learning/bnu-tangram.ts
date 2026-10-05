import {
  bnuSquareChallengePieces,
  bnuSquareChallengeScenes,
  isBnuSquareChallengeScene,
} from './bnu-square-challenge';
import { fold } from './fold';

export type TangramPoint = [number, number];
export const bnuTangramScenes = [
  'square',
  'spread',
  'trace',
  'large-triangle',
  'small-triangle',
  'goose-head',
  'fish-head',
  ...bnuSquareChallengeScenes,
] as const;
export interface BnuTangramVisual {
  kind: 'bnu-tangram';
  scene: (typeof bnuTangramScenes)[number];
  variant: 'main' | 'review';
}
export interface TangramPiece {
  id: number;
  points: TangramPoint[];
  label: TangramPoint;
}
/** Original normalized geometry, keeping the numbering actually read on printed page 80. */
const units: Record<number, TangramPoint[]> = {
  1: [
    [0, 0],
    [4, 0],
    [2, 2],
  ],
  2: [
    [0, 0],
    [2, 2],
    [0, 4],
  ],
  3: [
    [4, 0],
    [4, 2],
    [3, 3],
    [3, 1],
  ],
  4: [
    [2, 2],
    [3, 1],
    [3, 3],
  ],
  5: [
    [2, 2],
    [3, 3],
    [2, 4],
    [1, 3],
  ],
  6: [
    [0, 4],
    [1, 3],
    [2, 4],
  ],
  7: [
    [4, 2],
    [4, 4],
    [2, 4],
  ],
};
const piece = (id: number, points: TangramPoint[]): TangramPiece => ({
  id,
  points,
  label: [
    fold(points, 0, (sum, p) => sum + p[0]) / points.length,
    fold(points, 0, (sum, p) => sum + p[1]) / points.length,
  ],
});
const placed = (
  id: number,
  x = 80,
  y = 60,
  source = units[id],
  normalize = false,
) => {
  if (!source) throw new Error('educationLearning.invalidRecord');
  const left = normalize ? Math.min(...source.map((p) => p[0])) : 0;
  const top = normalize ? Math.min(...source.map((p) => p[1])) : 0;
  return piece(
    id,
    source.map(([a, b]): TangramPoint => [
      x + (a - left) * 50,
      y + (b - top) * 50,
    ]),
  );
};
export function isBnuTangramVisual(value: unknown): value is BnuTangramVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  return (
    Object.keys(model).length === 3 &&
    model.kind === 'bnu-tangram' &&
    bnuTangramScenes.some((scene) => scene === model.scene) &&
    (model.variant === 'main' || model.variant === 'review')
  );
}
export function bnuTangramHeight(visual: BnuTangramVisual) {
  if (!isBnuTangramVisual(visual))
    throw new Error('educationLearning.invalidRecord');
  if (visual.scene === 'spread') return 610;
  if (visual.scene === 'trace') return 430;
  return 360;
}
export function bnuTangramPieces(visual: BnuTangramVisual): TangramPiece[] {
  if (!isBnuTangramVisual(visual))
    throw new Error('educationLearning.invalidRecord');
  if (isBnuSquareChallengeScene(visual.scene))
    return bnuSquareChallengePieces(visual.scene);
  switch (visual.scene) {
    case 'square': {
      return [1, 2, 3, 4, 5, 6, 7].map((id) => placed(id));
    }
    case 'large-triangle':
    case 'fish-head': {
      return [1, 2].map((id) => placed(id));
    }
    case 'small-triangle': {
      return [
        placed(4, 80, 60, [
          [0, 0],
          [2, 0],
          [1, 1],
        ]),
        placed(6, 80, 60, [
          [0, 0],
          [1, 1],
          [0, 2],
        ]),
      ];
    }
    case 'goose-head': {
      return [3, 4].map((id) => placed(id));
    }
    case 'trace': {
      return [
        placed(3, 40, 40, undefined, true),
        placed(5, 150, 40, undefined, true),
        placed(7, 150, 240, undefined, true),
      ];
    }
    case 'spread': {
      return (
        [
          [1, 24, 24],
          [2, 240, 24],
          [3, 24, 274],
          [4, 124, 274],
          [5, 240, 274],
          [6, 24, 474],
          [7, 174, 474],
        ] as const
      ).map(([id, x, y]) => placed(id, x, y, undefined, true));
    }
  }
}

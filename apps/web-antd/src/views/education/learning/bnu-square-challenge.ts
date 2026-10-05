import type { TangramPiece, TangramPoint } from './bnu-tangram';

import { fold } from './fold';
export const bnuSquareChallengeScenes = [
  'square-two-large',
  'square-two-small',
  'square-three',
  'square-four-square',
  'square-four-triangle',
] as const;
export type BnuSquareChallengeScene = (typeof bnuSquareChallengeScenes)[number];
export function isBnuSquareChallengeScene(
  value: unknown,
): value is BnuSquareChallengeScene {
  return (
    typeof value === 'string' &&
    bnuSquareChallengeScenes.some((s) => s === value)
  );
}
/** Original site placements preserving the page80 pieces; page85–86 has no numbered labels. */
const units: Record<BnuSquareChallengeScene, [number, TangramPoint[]][]> = {
  'square-two-large': [
    [
      1,
      [
        [0, 2],
        [2, 0],
        [4, 2],
      ],
    ],
    [
      2,
      [
        [0, 2],
        [4, 2],
        [2, 4],
      ],
    ],
  ],
  'square-two-small': [
    [
      4,
      [
        [0, 1],
        [1, 0],
        [2, 1],
      ],
    ],
    [
      6,
      [
        [0, 1],
        [2, 1],
        [1, 2],
      ],
    ],
  ],
  'square-three': [
    [
      7,
      [
        [0, 0],
        [0, 2],
        [2, 2],
      ],
    ],
    [
      4,
      [
        [0, 0],
        [2, 0],
        [1, 1],
      ],
    ],
    [
      6,
      [
        [2, 0],
        [2, 2],
        [1, 1],
      ],
    ],
  ],
  'square-four-square': [
    [
      1,
      [
        [0, 2],
        [2, 0],
        [4, 2],
      ],
    ],
    [
      5,
      [
        [2, 2],
        [3, 3],
        [2, 4],
        [1, 3],
      ],
    ],
    [
      4,
      [
        [0, 2],
        [2, 2],
        [1, 3],
      ],
    ],
    [
      6,
      [
        [2, 2],
        [4, 2],
        [3, 3],
      ],
    ],
  ],
  'square-four-triangle': [
    [
      1,
      [
        [0, 2],
        [2, 0],
        [4, 2],
      ],
    ],
    [
      7,
      [
        [0, 2],
        [2, 2],
        [2, 4],
      ],
    ],
    [
      4,
      [
        [2, 2],
        [4, 2],
        [3, 3],
      ],
    ],
    [
      6,
      [
        [2, 2],
        [3, 3],
        [2, 4],
      ],
    ],
  ],
};
export function bnuSquareChallengePieces(
  scene: BnuSquareChallengeScene,
): TangramPiece[] {
  const recipe = units[scene];
  if (!recipe) throw new Error('educationLearning.invalidRecord');
  return recipe.map(([id, shape]) => {
    const points = shape.map(([x, y]): TangramPoint => [
      80 + x * 50,
      60 + y * 50,
    ]);
    return {
      id,
      points,
      label: [
        fold(points, 0, (n, p) => n + p[0]) / points.length,
        fold(points, 0, (n, p) => n + p[1]) / points.length,
      ],
    };
  });
}

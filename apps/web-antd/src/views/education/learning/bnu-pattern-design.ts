import { required } from './required';
export const bnuPatternDesignScenes = [
  'triangle',
  'hexagon',
  'trapezoid',
  'parallelogram',
  'dot-grid',
] as const;
export interface BnuPatternDesignVisual {
  kind: 'bnu-pattern-design';
  scene: (typeof bnuPatternDesignScenes)[number];
  variant: 'main' | 'review';
}
export type DesignPoint = [number, number];
export interface DesignCard {
  label: string;
  points: DesignPoint[];
  seam: DesignPoint[];
}
const shapes: Record<
  Exclude<BnuPatternDesignVisual['scene'], 'dot-grid'>,
  DesignPoint[]
> = {
  triangle: [
    [-1, 0.6],
    [1, 0.6],
    [0, -Math.sqrt(3) + 0.6],
  ],
  hexagon: Array.from({ length: 6 }, (_, i): DesignPoint => [
    Math.cos((i * Math.PI) / 3),
    Math.sin((i * Math.PI) / 3),
  ]),
  trapezoid: [
    [-1.3, 0.65],
    [1.3, 0.65],
    [0.65, -0.65],
    [-0.65, -0.65],
  ],
  parallelogram: [
    [-1, -0.65],
    [0.5, -0.65],
    [1, 0.65],
    [-0.5, 0.65],
  ],
};
export function isBnuPatternDesignVisual(
  value: unknown,
): value is BnuPatternDesignVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const m = value as Record<string, unknown>;
  return (
    Object.keys(m).length === 3 &&
    m.kind === 'bnu-pattern-design' &&
    bnuPatternDesignScenes.some((s) => s === m.scene) &&
    (m.variant === 'main' || m.variant === 'review')
  );
}
/** Original outline comparisons, not the scanned three-hexagon coloring worksheet. */
export function bnuPatternDesignCards(
  visual: BnuPatternDesignVisual,
): DesignCard[] {
  if (!isBnuPatternDesignVisual(visual))
    throw new Error('educationLearning.invalidRecord');
  if (visual.scene === 'dot-grid') return [];
  const wrong = visual.scene === 'triangle' ? 'hexagon' : 'triangle';
  const kinds: Exclude<BnuPatternDesignVisual['scene'], 'dot-grid'>[] =
    visual.variant === 'main'
      ? [visual.scene, visual.scene, wrong, visual.scene]
      : [visual.scene, wrong, visual.scene, visual.scene];
  return kinds.map((kind, i) => {
    const radians =
      (required(
        (visual.variant === 'main' ? [0, 90, 0, 180] : [30, 0, 150, 270])[i],
      ) *
        Math.PI) /
      180;
    const scale = required(
      (visual.variant === 'main' ? [34, 29, 34, 36] : [29, 36, 34, 31])[i],
    );
    const source = shapes[kind];
    const third: DesignPoint =
      kind === 'triangle'
        ? [
            (required(source[1])[0] + required(source[2])[0]) / 2,
            (required(source[1])[1] + required(source[2])[1]) / 2,
          ]
        : required(source[2]);
    const transform = ([x, y]: DesignPoint): DesignPoint => [
      72 + scale * (x * Math.cos(radians) - y * Math.sin(radians)),
      72 + scale * (x * Math.sin(radians) + y * Math.cos(radians)),
    ];
    return {
      label: String.fromCodePoint(65 + i),
      points: source.map((point) => transform(point)),
      seam:
        i === 3
          ? [
              transform(third),
              transform(required(source[0])),
              ...(visual.variant === 'review' && kind === 'hexagon'
                ? [transform(required(source[4]))]
                : []),
            ]
          : [],
    };
  });
}
/** Fixed site grids (main seven rows, review five rows); no hidden strokes and no claim about original dimensions. */
export function bnuPatternDesignDots(
  visual: BnuPatternDesignVisual,
): DesignPoint[] {
  if (!isBnuPatternDesignVisual(visual))
    throw new Error('educationLearning.invalidRecord');
  return visual.scene === 'dot-grid'
    ? Array.from(
        { length: visual.variant === 'main' ? 49 : 35 },
        (_, i): DesignPoint => [24 + (i % 7) * 24, 24 + Math.floor(i / 7) * 24],
      )
    : [];
}

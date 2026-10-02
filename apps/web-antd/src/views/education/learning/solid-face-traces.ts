import type { SolidFaceTracesVisual } from './types';

import { required } from './required';

export interface FaceTrace {
  letter: string;
  shape: 'rectangle' | 'square' | 'triangle';
  width: number;
  height: number;
}
const dimensions = {
  cube: [2, 2, 2],
  'cuboid-distinct': [2, 3, 4],
  'cuboid-square-end': [2, 2, 3],
} as const;
export function isSolidFaceTracesVisual(
  value: unknown,
): value is SolidFaceTracesVisual {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const model = value as Record<string, unknown>;
  return (
    Object.keys(model).length === 2 &&
    model.kind === 'solid-face-traces' &&
    typeof model.solid === 'string' &&
    [
      'cube',
      'cuboid-distinct',
      'cuboid-square-end',
      'triangular-prism',
    ].includes(model.solid)
  );
}
/** A is the front, B the right side, C the top. Prism examples show only front A and right B. */
export function faceTraces(model: SolidFaceTracesVisual): FaceTrace[] {
  if (model.solid === 'triangular-prism')
    return [
      { letter: 'A', shape: 'triangle', width: 2, height: Math.sqrt(3) },
      { letter: 'B', shape: 'rectangle', width: 2, height: 3 },
    ];
  const [width, depth, height] = dimensions[model.solid];
  return [
    [width, height],
    [depth, height],
    [width, depth],
  ].map(([w, h], index) => ({
    letter: required(['A', 'B', 'C'][index]),
    shape: w === h ? 'square' : 'rectangle',
    width: required(w),
    height: required(h),
  }));
}
export function tracePolygon(trace: FaceTrace) {
  const x = 80 - trace.width * 12;
  const y = 80 - trace.height * 12;
  return trace.shape === 'triangle'
    ? [
        [80, y],
        [x + trace.width * 24, y + trace.height * 24],
        [x, y + trace.height * 24],
      ]
    : [
        [x, y],
        [x + trace.width * 24, y],
        [x + trace.width * 24, y + trace.height * 24],
        [x, y + trace.height * 24],
      ];
}
export function solidFacePolygons(
  model: SolidFaceTracesVisual,
): { letter: string; points: number[][] }[] {
  if (model.solid === 'triangular-prism') {
    const bottom = 160;
    const top = bottom - 60 * Math.sqrt(3);
    const front = [
      [35, bottom],
      [155, bottom],
      [95, top],
    ];
    return [
      {
        letter: 'B',
        points: [
          required(front[2]),
          [145, top - 25],
          [205, bottom - 25],
          required(front[1]),
        ],
      },
      { letter: 'A', points: front },
    ];
  }
  const [width, depth, height] = dimensions[model.solid];
  const dx = depth * 18;
  const dy = -depth * 12;
  const h = height * 30;
  const w = width * 30;
  const x = 24;
  const y = 60;
  return [
    {
      letter: 'C',
      points: [
        [x, y],
        [x + dx, y + dy],
        [x + w + dx, y + dy],
        [x + w, y],
      ],
    },
    {
      letter: 'B',
      points: [
        [x + w, y],
        [x + w + dx, y + dy],
        [x + w + dx, y + h + dy],
        [x + w, y + h],
      ],
    },
    {
      letter: 'A',
      points: [
        [x, y],
        [x + w, y],
        [x + w, y + h],
        [x, y + h],
      ],
    },
  ];
}
export function distinctTraces(
  model: SolidFaceTracesVisual,
  shape: FaceTrace['shape'],
) {
  return new Set(
    faceTraces(model)
      .filter((face) => face.shape === shape)
      .map((face) =>
        [face.width, face.height].toSorted((a, b) => a - b).join(':'),
      ),
  ).size;
}

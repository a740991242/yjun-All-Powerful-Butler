import { fold } from './fold';
import { required } from './required';
export interface MotionSequencesVisual {
  kind: 'motion-sequences';
  variant: 'main' | 'review';
  scene: 'meet' | 'slide' | 'turn';
}
export function isMotionSequencesVisual(
  value: unknown,
): value is MotionSequencesVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    Object.keys(v).length === 3 &&
    v.kind === 'motion-sequences' &&
    (v.variant === 'main' || v.variant === 'review') &&
    (v.scene === 'slide' || v.scene === 'meet' || v.scene === 'turn')
  );
}
/** Indices name frames, never the chronology. All conditions/data are original. */
export function motionSequenceFrames(v: MotionSequencesVisual): number[] {
  if (v.scene === 'slide') return v.variant === 'main' ? [1, 2, 0] : [2, 0, 1];
  if (v.scene === 'meet') return v.variant === 'main' ? [2, 0, 1] : [1, 2, 0];
  return v.variant === 'main' ? [1, 0, 2] : [2, 0, 1];
}
export function slidePosition(
  v: MotionSequencesVisual,
  time: number,
): [number, number] {
  const x = 50 + time * 90;
  return [v.variant === 'main' ? x : 300 - x, 35 + time * 60];
}
export function meetingPositions(
  v: MotionSequencesVisual,
  time: number,
): [number, number] {
  const x = 50 + time * 100;
  return v.variant === 'main' ? [x, 300 - x] : [300 - x, x];
}
export function planeTurnAngle(v: MotionSequencesVisual, time: number): number {
  return v.variant === 'main' ? -90 + 90 * time : 90 - 90 * time;
}
export function planeNoseDirection(
  v: MotionSequencesVisual,
  time: number,
): 'left' | 'right' | 'toward' {
  const angle = planeTurnAngle(v, time);
  return (() => {
    if (angle === 0) return 'toward';
    return angle < 0 ? 'left' : 'right';
  })();
}
type Point3 = [number, number, number];
/** Low-poly airplane, rigid Y-axis turn. Fixed elevated front camera, no view-dependent mesh substitutions. */
export function projectedPlane(
  angle: number,
): { points: string; layer: number; part: 'body' | 'fin' | 'wing' }[] {
  const rear: Point3[] = [
    [-0.3, 0, -2],
    [0, 0.3, -2],
    [0.3, 0, -2],
    [0, -0.3, -2],
  ];
  const front: Point3[] = [
    [-0.26, 0, 1.6],
    [0, 0.26, 1.6],
    [0.26, 0, 1.6],
    [0, -0.26, 1.6],
  ];
  const nose: Point3 = [0, 0, 2.8];
  const surfaces: { points: Point3[]; part: 'body' | 'fin' | 'wing' }[] = [
    { points: rear, part: 'body' },
    ...rear.flatMap((p, i) => [
      {
        points: [
          p,
          required(rear[(i + 1) % 4]),
          required(front[(i + 1) % 4]),
          required(front[i]),
        ],
        part: 'body' as const,
      },
      {
        points: [required(front[i]), required(front[(i + 1) % 4]), nose],
        part: 'body' as const,
      },
    ]),
    {
      points: [
        [-2.7, 0, -0.6],
        [-2.7, 0, 0.2],
        [2.7, 0, 0.2],
        [2.7, 0, -0.6],
      ],
      part: 'wing',
    },
    {
      points: [
        [-1, 0, -2],
        [-1, 0, -1.4],
        [1, 0, -1.4],
        [1, 0, -2],
      ],
      part: 'wing',
    },
    {
      points: [
        [0, 0.1, -2],
        [0, 1.2, -2],
        [0, 0.1, -1.2],
      ],
      part: 'fin',
    },
  ];
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const pitch = Math.PI / 9;
  return surfaces
    .map(({ points, part }) => {
      const transformed = points.map(([x, y, z]): Point3 => [
        x * cos + z * sin,
        y,
        -x * sin + z * cos,
      ]);
      const layer =
        fold(
          transformed,
          0,
          (sum, [, y, z]) => sum + z * Math.cos(pitch) + y * Math.sin(pitch),
        ) / points.length;
      return {
        part,
        layer,
        points: transformed
          .map(
            ([x, y, z]) =>
              `${150 + x * 28},${80 - y * 28 * Math.cos(pitch) + z * 28 * Math.sin(pitch)}`,
          )
          .join(' '),
      };
    })
    .toSorted((a, b) => a.layer - b.layer);
}

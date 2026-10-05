export interface BnuNumberReviewVisual {
  kind: 'bnu-number-review';
  scene:
    | 'counter'
    | 'cubes'
    | 'five-down'
    | 'five-up'
    | 'objects'
    | 'sticks'
    | 'ten-up'
    | 'two-up';
  variant: 'main' | 'review';
}
export function isBnuNumberReviewVisual(
  value: unknown,
): value is BnuNumberReviewVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    Object.keys(v).length === 3 &&
    Object.keys(v).every((key) => ['kind', 'scene', 'variant'].includes(key)) &&
    v.kind === 'bnu-number-review' &&
    typeof v.scene === 'string' &&
    [
      'counter',
      'cubes',
      'five-down',
      'five-up',
      'objects',
      'sticks',
      'ten-up',
      'two-up',
    ].includes(v.scene) &&
    (v.variant === 'main' || v.variant === 'review')
  );
}
export type BnuNumberReviewContent =
  | {
      type: 'material';
      material: 'counter' | 'cubes' | 'objects' | 'sticks';
      tens: number;
      singles: number;
      rows: number[];
    }
  | { type: 'train'; values: (null | number)[]; labels: (null | string)[] };
/** Only givens, physical objects and blank labels are returned; never fill answers. */
export function bnuNumberReview(
  visual: BnuNumberReviewVisual,
): BnuNumberReviewContent {
  if (!isBnuNumberReviewVisual(visual))
    throw new Error('educationLearning.invalidRecord');
  const review = visual.variant === 'review';
  switch (visual.scene) {
    case 'objects': {
      return {
        type: 'material',
        material: 'objects',
        tens: 0,
        singles: review ? 52 : 43,
        rows: review ? [10, 10, 10, 10, 10, 2] : [10, 10, 10, 10, 3],
      };
    }
    case 'sticks': {
      return {
        type: 'material',
        material: 'sticks',
        tens: review ? 4 : 3,
        singles: review ? 6 : 8,
        rows: [],
      };
    }
    case 'counter': {
      return {
        type: 'material',
        material: 'counter',
        tens: review ? 3 : 2,
        singles: review ? 2 : 5,
        rows: [],
      };
    }
    case 'cubes': {
      return {
        type: 'material',
        material: 'cubes',
        tens: review ? 3 : 2,
        singles: review ? 12 : 15,
        rows: [],
      };
    }
    default: {
      const givens: Record<
        'five-down' | 'five-up' | 'ten-up' | 'two-up',
        (null | number)[]
      > = {
        'five-up': [15, 20, 25, null, 35, null, 45, null, null],
        'two-up': [22, null, 26, 28, null, 32, null, null],
        'ten-up': [10, 20, 30, null, null, null, null],
        'five-down': [100, 95, 90, 85, null, null, null, null],
      };
      const scene = visual.scene;
      const values = givens[scene].map((n) =>
        n === null
          ? null
          : n +
            (review
              ? { 'five-up': -3, 'two-up': 19, 'ten-up': -1, 'five-down': -1 }[
                  scene
                ]
              : 0),
      );
      let blank = 0;
      return {
        type: 'train',
        values,
        labels: values.map((n) =>
          n === null ? String.fromCodePoint(65 + blank++) : null,
        ),
      };
    }
  }
}

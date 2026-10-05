import { required } from './required';

export interface BnuHundredTableVisual {
  kind: 'bnu-hundred-table';
  scene:
    | 'complete'
    | 'fifty-eight'
    | 'full'
    | 'practice-one'
    | 'practice-three'
    | 'practice-two'
    | 'sixty-seven';
  variant: 'main' | 'review';
  /** Only the full chart can nominate one row; letters identify its eight inputs. */
  row?: number;
}
export function isBnuHundredTableVisual(
  value: unknown,
): value is BnuHundredTableVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  const keys = Object.keys(v);
  return (
    keys.every((key) => ['kind', 'row', 'scene', 'variant'].includes(key)) &&
    keys.length === ('row' in v ? 4 : 3) &&
    v.kind === 'bnu-hundred-table' &&
    typeof v.scene === 'string' &&
    [
      'complete',
      'fifty-eight',
      'full',
      'practice-one',
      'practice-three',
      'practice-two',
      'sixty-seven',
    ].includes(v.scene) &&
    (v.variant === 'main' || v.variant === 'review') &&
    (!('row' in v) ||
      (v.scene === 'full' &&
        typeof v.row === 'number' &&
        Number.isInteger(v.row) &&
        v.row >= 1 &&
        v.row <= 10))
  );
}
/** Fill scenes return givens and position labels; complete provides an unclassified chart for observation. */
export function bnuHundredTable(visual: BnuHundredTableVisual) {
  if (!isBnuHundredTableVisual(visual))
    throw new Error('educationLearning.invalidRecord');
  let matrix: (null | number)[][];
  if (visual.scene === 'full' || visual.scene === 'complete') {
    const given =
      visual.variant === 'main'
        ? [
            1, 10, 12, 19, 23, 28, 34, 37, 45, 46, 55, 56, 64, 67, 73, 78, 82,
            89, 91, 100,
          ]
        : [
            2, 9, 13, 18, 24, 27, 35, 36, 44, 47, 54, 57, 65, 66, 74, 77, 83,
            88, 92, 99,
          ];
    matrix = Array.from({ length: 10 }, (_, r) =>
      Array.from({ length: 10 }, (_, c) => {
        const value = r * 10 + c + 1;
        return visual.scene === 'complete' || given.includes(value)
          ? value
          : null;
      }),
    );
  } else {
    const review = visual.variant === 'review';
    switch (visual.scene) {
      case 'fifty-eight': {
        const n = review ? 48 : 58;
        matrix = [
          [n, null, n + 2],
          [null, null, null],
          [n + 20, null, n + 22],
        ];
        break;
      }
      case 'sixty-seven': {
        matrix = [
          [null, null, null],
          [null, review ? 76 : 67, null],
          [null, null, null],
        ];
        break;
      }
      case 'practice-one': {
        const n = review ? 37 : 27;
        matrix = [
          [n, n + 1, null],
          [null, n + 11, null],
          [null, null, n + 22],
        ];
        break;
      }
      case 'practice-two': {
        const n = review ? 50 : 30;
        matrix = [
          [null, n + 1, null],
          [n + 10, null, n + 12],
          [null, n + 21, null],
        ];
        break;
      }
      case 'practice-three': {
        matrix = [
          [null, null, null],
          [null, review ? 64 : 85, null],
          [null, null, null],
        ];
        break;
      }
    }
  }
  let blank = 0;
  return matrix.map((values, r) => ({
    row: r + 1,
    cells: values.map((value, c) => ({
      row: r + 1,
      column: c + 1,
      value,
      label:
        value === null &&
        ((visual.scene !== 'full' && visual.scene !== 'complete') ||
          visual.row === r + 1)
          ? String.fromCodePoint(65 + blank++)
          : null,
    })),
  }));
}
export function bnuHundredRow(visual: BnuHundredTableVisual, row: number) {
  return required(bnuHundredTable(visual).find((item) => item.row === row));
}

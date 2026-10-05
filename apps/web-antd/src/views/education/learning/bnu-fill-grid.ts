export interface BnuFillGridVisual {
  kind: 'bnu-fill-grid';
  scene: 'five' | 'five-next' | 'five-stage' | 'three';
  variant: 'main' | 'review';
}
export function isBnuFillGridVisual(
  value: unknown,
): value is BnuFillGridVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    Object.keys(v).length === 3 &&
    Object.keys(v).every((k) => ['kind', 'scene', 'variant'].includes(k)) &&
    v.kind === 'bnu-fill-grid' &&
    ['five', 'five-next', 'five-stage', 'three'].includes(
      typeof v.scene === 'string' ? v.scene : '',
    ) &&
    ['main', 'review'].includes(typeof v.variant === 'string' ? v.variant : '')
  );
}
/** Fixed inspected givens or explicitly named intermediate stages; never return fill answers. */
export function bnuFillGrid(visual: BnuFillGridVisual) {
  if (!isBnuFillGridVisual(visual))
    throw new Error('educationLearning.invalidRecord');
  const source: Record<BnuFillGridVisual['scene'], (null | number)[][]> = {
    three: [
      [1, null, null],
      [null, 1, null],
      [null, 2, 1],
    ],
    five: [
      [5, 1, null, null, 3],
      [1, 3, null, null, 4],
      [4, 2, null, 1, 5],
      [2, null, 4, 3, 1],
      [3, 4, 1, null, 2],
    ],
    'five-stage': [
      [5, 1, null, null, 3],
      [1, 3, null, null, 4],
      [4, 2, 3, 1, 5],
      [2, 5, 4, 3, 1],
      [3, 4, 1, 5, 2],
    ],
    'five-next': [
      [5, 1, 2, null, 3],
      [1, 3, null, null, 4],
      [4, 2, 3, 1, 5],
      [2, 5, 4, 3, 1],
      [3, 4, 1, 5, 2],
    ],
  };
  const size = source[visual.scene].length;
  let blank = 0;
  const givens = source[visual.scene].map((row) =>
    row.map((n) => {
      if (n === null) return null;
      return visual.variant === 'review' ? (n % size) + 1 : n;
    }),
  );
  const labels = givens.map((row) =>
    row.map((n) => (n === null ? String.fromCodePoint(65 + blank++) : null)),
  );
  return { size, givens, labels };
}

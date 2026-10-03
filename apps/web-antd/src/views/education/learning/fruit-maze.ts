export interface FruitMazeVisual {
  kind: 'fruit-maze';
  variant: 'main' | 'review';
}

// Original 4×4 maze. null is a wall, not a cell with zero fruit.
export function fruitMazeCells(variant: FruitMazeVisual['variant']) {
  const labels = [
    'A',
    'B',
    'C',
    'D',
    'E',
    null,
    null,
    'F',
    'G',
    'H',
    null,
    'I',
    null,
    'J',
    'K',
    'L',
  ];
  const fruit =
    variant === 'main'
      ? [0, 2, 1, 0, 3, 0, 0, 2, 0, 1, 0, 1, 0, 2, 1, 0]
      : [1, 1, 0, 2, 0, 0, 0, 3, 2, 1, 0, 0, 0, 0, 2, 1];
  return labels.map((label, index) => ({
    label,
    index,
    fruit: fruit[index] ?? 0,
  }));
}

export function isFruitMazeVisual(value: unknown): value is FruitMazeVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const entries = Object.entries(value);
  return (
    entries.length === 2 &&
    entries.some(([k, v]) => k === 'kind' && v === 'fruit-maze') &&
    entries.some(
      ([k, v]) => k === 'variant' && (v === 'main' || v === 'review'),
    )
  );
}

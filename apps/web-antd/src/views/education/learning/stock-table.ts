import { required } from './required';
export interface StockTableVisual {
  kind: 'stock-table';
  variant: 'main' | 'review';
}
export function isStockTableVisual(value: unknown): value is StockTableVisual {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const v = value as Record<string, unknown>;
  return (
    Object.keys(v).length === 2 &&
    v.kind === 'stock-table' &&
    (v.variant === 'main' || v.variant === 'review')
  );
}
export function stockRows(visual: StockTableVisual) {
  if (!isStockTableVisual(visual)) throw new Error('Invalid stock table');
  const quantities =
    visual.variant === 'main'
      ? [
          [43, 7],
          [30, 6],
          [52, 9],
        ]
      : [
          [64, 8],
          [40, 7],
          [71, 6],
        ];
  return ['cards', 'stickers', 'bookmarks'].map((item, index) => ({
    id: String.fromCodePoint(65 + index),
    item,
    unit: index === 2 ? 'pieces' : 'sheets',
    initial: required(required(quantities[index])[0]),
    sold: required(required(quantities[index])[1]),
  }));
}

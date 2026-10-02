import { required } from './required';
export interface StockTableVisual {
  kind: 'stock-table';
  variant: 'main' | 'review' | 'within-twenty' | 'within-twenty-review';
}
export function isStockTableVisual(value: unknown): value is StockTableVisual {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const v = value as Record<string, unknown>;
  return (
    Object.keys(v).length === 2 &&
    v.kind === 'stock-table' &&
    typeof v.variant === 'string' &&
    ['main', 'review', 'within-twenty', 'within-twenty-review'].includes(
      String(v.variant),
    )
  );
}
export function stockRows(visual: StockTableVisual) {
  if (!isStockTableVisual(visual)) throw new Error('Invalid stock table');
  const quantities = {
    main: [
      [43, 7],
      [30, 6],
      [52, 9],
    ],
    review: [
      [64, 8],
      [40, 7],
      [71, 6],
    ],
    'within-twenty': [
      [12, 7],
      [14, 8],
      [16, 9],
    ],
    'within-twenty-review': [
      [13, 8],
      [15, 9],
      [17, 8],
    ],
  }[visual.variant];
  return ['cards', 'stickers', 'bookmarks'].map((item, index) => ({
    id: String.fromCodePoint(65 + index),
    item,
    unit: index === 2 ? 'pieces' : 'sheets',
    initial: required(required(quantities[index])[0]),
    sold: required(required(quantities[index])[1]),
  }));
}

import type { BlockCardsVisual, SolidShape } from './types';
export const blockShapes: SolidShape[] = [
  'cube',
  'cuboid',
  'cylinder',
  'sphere',
];
export const blockColors: BlockCardsVisual['cards'][number]['color'][] = [
  'red',
  'blue',
  'yellow',
];
export function isBlockCardsVisual(value: unknown): value is BlockCardsVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  if (
    Object.keys(v).length !== 2 ||
    v.kind !== 'block-cards' ||
    !Array.isArray(v.cards) ||
    v.cards.length === 0 ||
    v.cards.length > 12
  )
    return false;
  for (const card of v.cards) {
    if (!card || typeof card !== 'object' || Array.isArray(card)) return false;
    const c = card as Record<string, unknown>;
    if (
      Object.keys(c).length !== 2 ||
      !blockShapes.some((s) => s === c.shape) ||
      !blockColors.some((color) => color === c.color)
    )
      return false;
  }
  return true;
}
export function blockGroups(
  visual: BlockCardsVisual,
  criterion: 'color' | 'shape',
) {
  return (criterion === 'shape' ? blockShapes : blockColors).map((value) => ({
    value,
    letters: visual.cards.flatMap((c, i) =>
      c[criterion] === value ? [String.fromCodePoint(65 + i)] : [],
    ),
  }));
}

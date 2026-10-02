import type { NatureCardsVisual } from './types';
export type LeafShape = 'fan' | 'lobed' | 'long';
export type LeafColor = 'green' | 'red' | 'yellow';
export type NatureObject = 'bird' | 'cat' | 'flower' | 'tree';
export interface LeafCard {
  id: string;
  shape: LeafShape;
  color: LeafColor;
}
export const leafShapes: LeafShape[] = ['long', 'fan', 'lobed'];
export const leafColors: LeafColor[] = ['red', 'green', 'yellow'];
export function leafCards(review: boolean): LeafCard[] {
  const pairs: [LeafShape, LeafColor][] = review
    ? [
        ['fan', 'green'],
        ['long', 'yellow'],
        ['fan', 'yellow'],
        ['lobed', 'red'],
        ['fan', 'green'],
        ['long', 'green'],
        ['lobed', 'yellow'],
        ['fan', 'yellow'],
      ]
    : [
        ['long', 'green'],
        ['fan', 'yellow'],
        ['lobed', 'red'],
        ['long', 'red'],
        ['lobed', 'green'],
        ['fan', 'red'],
        ['long', 'yellow'],
        ['lobed', 'red'],
      ];
  return pairs.map(([shape, color], i) => ({
    id: String.fromCodePoint(65 + i),
    shape,
    color,
  }));
}
export function plantCards(review: boolean) {
  const objects: NatureObject[] = review
    ? ['bird', 'flower', 'cat', 'tree', 'bird', 'tree', 'cat', 'flower']
    : ['tree', 'cat', 'flower', 'bird', 'tree', 'flower', 'cat', 'flower'];
  return objects.map((object, i) => ({
    id: String.fromCodePoint(65 + i),
    object,
  }));
}
export function natureModel(
  deck: NatureCardsVisual['deck'],
  review: boolean,
): NatureCardsVisual {
  return { kind: 'nature-cards', deck, variant: review ? 'review' : 'main' };
}
export function isNatureCardsVisual(
  value: unknown,
): value is NatureCardsVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    Object.keys(v).length === 3 &&
    v.kind === 'nature-cards' &&
    (v.deck === 'plants' || v.deck === 'leaves') &&
    (v.variant === 'main' || v.variant === 'review')
  );
}

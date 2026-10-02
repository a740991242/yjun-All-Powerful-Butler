import type { PlaneCardsVisual, PlaneShape } from './types';

export const planeShapes: PlaneShape[] = [
  'rectangle',
  'square',
  'triangle',
  'circle',
];
export function isPlaneCardsVisual(value: unknown): value is PlaneCardsVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  return (
    Object.keys(model).length === 2 &&
    model.kind === 'plane-cards' &&
    Array.isArray(model.cards) &&
    model.cards.length > 0 &&
    model.cards.length <= 6 &&
    [...model.cards].every((value) => {
      if (!value || typeof value !== 'object' || Array.isArray(value))
        return false;
      const card = value as Record<string, unknown>;
      return (
        Object.keys(card).length === 3 &&
        typeof card.shape === 'string' &&
        planeShapes.some((shape) => shape === card.shape) &&
        (card.size === 1 || card.size === 2) &&
        typeof card.turn === 'number' &&
        [0, 45, 90, 135, 180].includes(card.turn)
      );
    })
  );
}

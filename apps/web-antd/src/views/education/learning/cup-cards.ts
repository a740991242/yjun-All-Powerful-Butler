import type { CupCardsVisual } from './types';
export interface CupCard {
  id: string;
  body: 'straight' | 'tapered';
  handle: boolean;
  color: 'blue' | 'red' | 'yellow';
}
export function cupCards(review: boolean): CupCard[] {
  const data: Omit<CupCard, 'id'>[] = review
    ? [
        { body: 'straight', handle: false, color: 'blue' },
        { body: 'straight', handle: true, color: 'yellow' },
        { body: 'straight', handle: true, color: 'red' },
        { body: 'tapered', handle: false, color: 'yellow' },
        { body: 'straight', handle: false, color: 'blue' },
        { body: 'straight', handle: true, color: 'yellow' },
        { body: 'tapered', handle: false, color: 'red' },
        { body: 'tapered', handle: true, color: 'yellow' },
      ]
    : [
        { body: 'straight', handle: true, color: 'red' },
        { body: 'tapered', handle: true, color: 'blue' },
        { body: 'straight', handle: false, color: 'yellow' },
        { body: 'straight', handle: true, color: 'blue' },
        { body: 'tapered', handle: true, color: 'red' },
        { body: 'tapered', handle: false, color: 'blue' },
        { body: 'straight', handle: true, color: 'yellow' },
        { body: 'tapered', handle: false, color: 'red' },
      ];
  return data.map((card, i) => ({ ...card, id: String.fromCodePoint(65 + i) }));
}
export function cupModel(review: boolean): CupCardsVisual {
  return { kind: 'cup-cards', variant: review ? 'review' : 'main' };
}
export function isCupCardsVisual(value: unknown): value is CupCardsVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    Object.keys(v).length === 2 &&
    v.kind === 'cup-cards' &&
    (v.variant === 'main' || v.variant === 'review')
  );
}

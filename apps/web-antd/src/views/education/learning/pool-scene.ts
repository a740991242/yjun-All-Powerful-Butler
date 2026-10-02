import type { PoolSceneVisual } from './types';
export interface PoolPerson {
  id: string;
  role: 'adult' | 'child';
  place: 'deck' | 'pool';
  ring: 'blue' | 'none' | 'red';
}
export function poolPeople(review: boolean): PoolPerson[] {
  const data: Omit<PoolPerson, 'id'>[] = review
    ? [
        { role: 'adult', place: 'deck', ring: 'none' },
        { role: 'child', place: 'pool', ring: 'blue' },
        { role: 'child', place: 'deck', ring: 'none' },
        { role: 'adult', place: 'pool', ring: 'none' },
        { role: 'child', place: 'pool', ring: 'red' },
        { role: 'child', place: 'deck', ring: 'blue' },
        { role: 'adult', place: 'deck', ring: 'none' },
        { role: 'child', place: 'pool', ring: 'none' },
      ]
    : [
        { role: 'child', place: 'pool', ring: 'red' },
        { role: 'child', place: 'pool', ring: 'none' },
        { role: 'adult', place: 'deck', ring: 'none' },
        { role: 'child', place: 'deck', ring: 'blue' },
        { role: 'child', place: 'pool', ring: 'blue' },
        { role: 'adult', place: 'pool', ring: 'none' },
        { role: 'child', place: 'pool', ring: 'none' },
        { role: 'child', place: 'pool', ring: 'red' },
      ];
  return data.map((person, i) => ({
    ...person,
    id: String.fromCodePoint(65 + i),
  }));
}
export function poolModel(review: boolean): PoolSceneVisual {
  return { kind: 'pool-scene', variant: review ? 'review' : 'main' };
}
export function isPoolSceneVisual(value: unknown): value is PoolSceneVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    Object.keys(v).length === 2 &&
    v.kind === 'pool-scene' &&
    (v.variant === 'main' || v.variant === 'review')
  );
}

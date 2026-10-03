import type { SolidShape } from './types';

export interface BnuFinalClassificationVisual {
  kind: 'bnu-final-classification';
  scene: 'habitat' | 'legs' | 'motion' | 'objects';
  variant: 'main' | 'review';
}
export function isBnuFinalClassificationVisual(
  value: unknown,
): value is BnuFinalClassificationVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const data = value as Record<string, unknown>;
  return (
    Object.keys(data).length === 3 &&
    data.kind === 'bnu-final-classification' &&
    typeof data.scene === 'string' &&
    ['habitat', 'legs', 'motion', 'objects'].includes(data.scene) &&
    (data.variant === 'main' || data.variant === 'review')
  );
}
export interface FinalAnimalCard {
  label: string;
  name: string;
  icon: string;
}
const animals: Record<
  'habitat' | 'legs' | 'motion',
  Omit<FinalAnimalCard, 'label'>[]
> = {
  legs: [
    { name: 'chicken', icon: '🐔' },
    { name: 'goose', icon: '🪿' },
    { name: 'duck', icon: '🦆' },
    { name: 'cat', icon: '🐈' },
  ],
  habitat: [
    { name: 'shark', icon: '🦈' },
    { name: 'eagle', icon: '🦅' },
    { name: 'seaTurtle', icon: '🐢' },
    { name: 'starfish', icon: '⭐' },
  ],
  motion: [
    { name: 'flyingBird', icon: '🐦' },
    { name: 'panda', icon: '🐼' },
    { name: 'sheep', icon: '🐑' },
    { name: 'rabbit', icon: '🐇' },
    { name: 'goldfish', icon: '🐟' },
    { name: 'swallow', icon: '🐦' },
    { name: 'shrimp', icon: '🦐' },
  ],
};
export function bnuFinalAnimals(
  scene: 'habitat' | 'legs' | 'motion',
  variant: BnuFinalClassificationVisual['variant'],
): FinalAnimalCard[] {
  const items = animals[scene];
  let order = items.map((_, i) => i);
  if (variant === 'review')
    order = scene === 'motion' ? [4, 3, 1, 0, 6, 2, 5] : [3, 2, 1, 0];
  return order.map((index, position) => {
    const item = items[index];
    if (!item) throw new Error('Missing final animal');
    return { ...item, label: String.fromCodePoint(65 + position) };
  });
}
export interface FinalObjectCard {
  label: string;
  name: string;
  shape: SolidShape;
  color: 'blue' | 'brown' | 'multi' | 'orange' | 'red' | 'yellow';
  size: 'large' | 'small';
}
const objects: Omit<FinalObjectCard, 'label'>[] = [
  { name: 'redBox', shape: 'cuboid', color: 'red', size: 'large' },
  { name: 'basketball', shape: 'sphere', color: 'orange', size: 'large' },
  { name: 'brownColumn', shape: 'cylinder', color: 'brown', size: 'large' },
  { name: 'yellowBox', shape: 'cuboid', color: 'yellow', size: 'small' },
  { name: 'coloredBall', shape: 'sphere', color: 'multi', size: 'small' },
  { name: 'blueColumn', shape: 'cylinder', color: 'blue', size: 'small' },
];
export function bnuFinalClassificationObjects(
  variant: BnuFinalClassificationVisual['variant'],
): FinalObjectCard[] {
  const order = variant === 'main' ? [0, 1, 2, 3, 4, 5] : [2, 5, 0, 4, 1, 3];
  return order.map((index, position) => {
    const item = objects[index];
    if (!item) throw new Error('Missing final object');
    return { ...item, label: String.fromCodePoint(65 + position) };
  });
}

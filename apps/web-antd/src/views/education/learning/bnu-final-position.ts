import type { ClockVisual, PlaneShape } from './types';
export interface BnuFinalPositionVisual {
  kind: 'bnu-final-position';
  scene: 'annex' | 'clocks' | 'flower-blank' | 'flower-filled' | 'items';
  variant: 'main' | 'review';
}
export function isBnuFinalPositionVisual(
  value: unknown,
): value is BnuFinalPositionVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const data = value as Record<string, unknown>;
  return (
    Object.keys(data).length === 3 &&
    data.kind === 'bnu-final-position' &&
    typeof data.scene === 'string' &&
    ['annex', 'clocks', 'flower-blank', 'flower-filled', 'items'].includes(
      data.scene,
    ) &&
    (data.variant === 'main' || data.variant === 'review')
  );
}
export interface FinalFlowerSlot {
  label: string;
  x: number;
  y: number;
  shape: 'star' | PlaneShape;
  sample: boolean;
}
export function bnuFinalFlower(
  variant: BnuFinalPositionVisual['variant'],
): FinalFlowerSlot[] {
  return [
    {
      label: 'A',
      x: 150,
      y: 40,
      shape: variant === 'main' ? 'square' : 'circle',
      sample: false,
    },
    {
      label: 'B',
      x: variant === 'main' ? 40 : 260,
      y: 150,
      shape: variant === 'main' ? 'triangle' : 'square',
      sample: false,
    },
    {
      label: 'C',
      x: 150,
      y: 260,
      shape: variant === 'main' ? 'circle' : 'triangle',
      sample: false,
    },
    {
      label: 'D',
      x: variant === 'main' ? 260 : 40,
      y: 150,
      shape: 'star',
      sample: true,
    },
  ];
}
export interface FinalPositionItem {
  label: string;
  name: string;
  icon: string;
  row: number;
  column: number;
}
const items = [
  { name: 'sun', icon: '☀️' },
  { name: 'balloon', icon: '🎈' },
  { name: 'moon', icon: '🌙' },
  { name: 'house', icon: '🏠' },
  { name: 'lamp', icon: '💡' },
  { name: 'pencilCup', icon: '✏️' },
  { name: 'pinwheel', icon: '✳️' },
  { name: 'clock', icon: '🕒' },
];
export function bnuFinalPositionItems(
  variant: BnuFinalPositionVisual['variant'],
): FinalPositionItem[] {
  const order =
    variant === 'main' ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 2, 5, 4, 3, 0, 1, 6];
  return order.map((index, position) => {
    const item = items[index];
    if (!item) throw new Error('Missing position item');
    return {
      ...item,
      label: String.fromCodePoint(65 + position),
      row: Math.floor(position / 4) + 1,
      column: (position % 4) + 1,
    };
  });
}
export function bnuFinalClockCards(
  variant: BnuFinalPositionVisual['variant'],
): { label: string; clock: ClockVisual }[] {
  const values: [number, 0 | 30][] =
    variant === 'main'
      ? [
          [12, 0],
          [3, 30],
          [8, 30],
          [10, 30],
        ]
      : [
          [5, 30],
          [12, 30],
          [8, 0],
          [10, 0],
        ];
  return values.map(([hour, minute], position) => ({
    label: String.fromCodePoint(65 + position),
    clock: { kind: 'clock', hour, minute },
  }));
}
export interface FinalAnnexCard {
  label: string;
  shape: 'circle' | 'square' | 'triangle';
  color: 'blue' | 'green' | 'yellow';
}
const annex: Omit<FinalAnnexCard, 'label'>[] = [
  { color: 'yellow', shape: 'circle' },
  { color: 'blue', shape: 'square' },
  { color: 'yellow', shape: 'triangle' },
  { color: 'blue', shape: 'circle' },
  { color: 'green', shape: 'triangle' },
  { color: 'blue', shape: 'triangle' },
  { color: 'green', shape: 'square' },
  { color: 'green', shape: 'circle' },
  { color: 'yellow', shape: 'square' },
];
export function bnuFinalAnnexCards(
  variant: BnuFinalPositionVisual['variant'],
): FinalAnnexCard[] {
  const order =
    variant === 'main'
      ? [0, 1, 2, 3, 4, 5, 6, 7, 8]
      : [6, 0, 5, 2, 7, 1, 8, 4, 3];
  return order.map((index, position) => {
    const card = annex[index];
    if (!card) throw new Error('Missing annex card');
    return { ...card, label: String.fromCodePoint(65 + position) };
  });
}

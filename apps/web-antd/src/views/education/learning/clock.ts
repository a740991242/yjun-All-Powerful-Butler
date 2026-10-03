import type { ClockVisual } from './types';

export function isClockVisual(value: unknown): value is ClockVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  return (
    Object.keys(model).length === 3 &&
    model.kind === 'clock' &&
    typeof model.hour === 'number' &&
    Number.isInteger(model.hour) &&
    model.hour >= 1 &&
    model.hour <= 12 &&
    (model.minute === 0 || model.minute === 30)
  );
}
export function clockHands(model: ClockVisual) {
  return {
    hour: (model.hour % 12) * 30 + model.minute / 2,
    minute: model.minute * 6,
  };
}
export function clockPoint(degrees: number, length: number) {
  const radians = (degrees * Math.PI) / 180;
  return {
    x: 120 + length * Math.sin(radians),
    y: 120 - length * Math.cos(radians),
  };
}

export interface BnuDayClockVisual {
  kind: 'bnu-day-clock';
}
export function isBnuDayClockVisual(
  value: unknown,
): value is BnuDayClockVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  return Object.keys(model).length === 1 && model.kind === 'bnu-day-clock';
}
export function bnuDayClockHands() {
  return { hour: 272.5, minute: 30 };
}

export interface PlaceCountersVisual {
  kind: 'place-counters';
  values: number[];
}
const bounded = (value: unknown): value is number =>
  typeof value === 'number' &&
  Number.isInteger(value) &&
  value >= 0 &&
  value <= 100;
export function isPlaceCountersVisual(
  value: unknown,
): value is PlaceCountersVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const data = value as Record<string, unknown>;
  const values = data.values;
  return (
    Object.keys(data).length === 2 &&
    data.kind === 'place-counters' &&
    Array.isArray(values) &&
    values.length > 0 &&
    values.length <= 4 &&
    Array.from({ length: values.length }, (_, i) => i).every(
      (i) => Object.hasOwn(values, i) && bounded(values[i]),
    )
  );
}
export function counterPlaces(value: number) {
  if (!bounded(value)) throw new Error('educationLearning.invalidRecord');
  return {
    hundreds: Math.floor(value / 100),
    tens: Math.floor(value / 10) % 10,
    ones: value % 10,
  };
}

import type { GeoboardShiftState, GeoboardShiftVisual } from './types';
const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
export function isGeoboardShiftState(
  value: unknown,
): value is GeoboardShiftState {
  return (
    record(value) &&
    Object.keys(value).length === 2 &&
    (value.width === 3 || value.width === 4) &&
    typeof value.shift === 'number' &&
    Number.isInteger(value.shift) &&
    value.shift >= -1 &&
    value.shift <= 5 - value.width
  );
}
export function isGeoboardShiftVisual(
  value: unknown,
): value is GeoboardShiftVisual {
  return (
    record(value) &&
    Object.keys(value).length === 3 &&
    value.kind === 'geoboard-shift' &&
    isGeoboardShiftState({ width: value.width, shift: value.shift })
  );
}
export function boardCorners(state: GeoboardShiftState): [number, number][] {
  return [
    [1 + state.shift, 1],
    [1 + state.width + state.shift, 1],
    [1 + state.width, 3],
    [1, 3],
  ];
}
export function moveUpperEdge(
  state: GeoboardShiftState,
  direction: 'left' | 'right',
): GeoboardShiftState {
  if (!isGeoboardShiftState(state))
    throw new Error('educationLearning.invalidRecord');
  const next = {
    width: state.width,
    shift: state.shift + (direction === 'left' ? -1 : 1),
  };
  return isGeoboardShiftState(next) ? next : { ...state };
}
export function boardShape(
  state: GeoboardShiftState,
): 'parallelogram' | 'rectangle' {
  return state.shift === 0 ? 'rectangle' : 'parallelogram';
}

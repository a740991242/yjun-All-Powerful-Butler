export interface PlaceValueState {
  value: number;
  hundreds: number;
  tens: number;
}
export type PlaceValueAction =
  | 'bundle-hundred'
  | 'bundle-ten'
  | 'split-hundred'
  | 'split-ten';

const bounded = (value: unknown, maximum: number): value is number =>
  typeof value === 'number' &&
  Number.isSafeInteger(value) &&
  value >= 0 &&
  value <= maximum;

export function isPlaceValueState(value: unknown): value is PlaceValueState {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const state = value as Record<string, unknown>;
  return (
    Object.keys(state).length === 3 &&
    Object.keys(state).every((key) =>
      ['hundreds', 'tens', 'value'].includes(key),
    ) &&
    bounded(state.value, 100) &&
    bounded(state.hundreds, 1) &&
    bounded(state.tens, 10) &&
    state.hundreds * 100 + state.tens * 10 <= state.value
  );
}

export function placeValue(value: number, saved?: PlaceValueState) {
  if (!bounded(value, 100)) throw new Error('educationLearning.invalidRecord');
  const state: PlaceValueState =
    saved && isPlaceValueState(saved) && saved.value === value
      ? { ...saved }
      : {
          value,
          hundreds: Math.floor(value / 100),
          tens: Math.floor(value / 10) % 10,
        };
  const ones = value - state.hundreds * 100 - state.tens * 10;
  return {
    ...state,
    ones,
    canBundleTen: ones >= 10,
    canSplitTen: state.tens > 0,
    canBundleHundred: state.tens >= 10,
    canSplitHundred: state.hundreds > 0,
  };
}

/** Each permitted exchange preserves the exact quantity; forbidden actions are no-ops. */
export function exchangePlaceValue(
  value: number,
  saved: PlaceValueState | undefined,
  action: PlaceValueAction,
): PlaceValueState {
  const current = placeValue(value, saved);
  let { hundreds, tens } = current;
  switch (action) {
    case 'bundle-ten': {
      if (current.canBundleTen) tens++;
      break;
    }
    case 'split-ten': {
      if (current.canSplitTen) tens--;
      break;
    }
    case 'bundle-hundred': {
      if (current.canBundleHundred) {
        hundreds++;
        tens -= 10;
      }
      break;
    }
    case 'split-hundred': {
      if (current.canSplitHundred) {
        hundreds--;
        tens += 10;
      }
      break;
    }
  }
  return { value, hundreds, tens };
}

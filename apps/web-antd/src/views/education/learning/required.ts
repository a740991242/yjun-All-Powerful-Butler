/** Fail explicitly when a required curriculum or saved-state value is absent. */
export function required<T>(value: null | T | undefined): T {
  if (value === null || value === undefined)
    throw new Error('Missing required education value');
  return value;
}

export interface MarkedNumberLineVisual {
  kind: 'marked-number-line';
  values: number[];
}
/** One fixed 0–100 scale; each labelled value gets a separate leader row. */
export function isMarkedNumberLineVisual(
  value: unknown,
): value is MarkedNumberLineVisual {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const data = value as Record<string, unknown>;
  if (
    Object.keys(data).length !== 2 ||
    !Object.hasOwn(data, 'kind') ||
    !Object.hasOwn(data, 'values') ||
    data.kind !== 'marked-number-line' ||
    !Array.isArray(data.values) ||
    data.values.length === 0 ||
    data.values.length > 5
  )
    return false;
  const values = data.values;
  for (let index = 0; index < values.length; index++)
    if (
      !Object.hasOwn(values, index) ||
      typeof values[index] !== 'number' ||
      !Number.isSafeInteger(values[index]) ||
      values[index] < 0 ||
      values[index] > 100
    )
      return false;
  return new Set(values).size === values.length;
}
export function numberLineX(value: number) {
  if (!Number.isSafeInteger(value) || value < 0 || value > 100)
    throw new Error('educationLearning.invalidRecord');
  return 44 + (value * 912) / 100;
}

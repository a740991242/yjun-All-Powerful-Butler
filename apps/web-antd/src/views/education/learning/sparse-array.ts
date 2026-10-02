/** Construct sparse fixtures for validation tests; holes must not become null values. */
export function sparseArray(length: number): never[] {
  const values: never[] = [];
  values.length = length;
  return values;
}

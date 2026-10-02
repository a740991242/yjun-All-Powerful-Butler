export interface BookGroupsVisual {
  kind: 'book-groups';
  size: 5 | 10;
  groups: number;
}
export interface NumberLineGridVisual {
  kind: 'number-line-grid';
  minimum: number;
  maximum: number;
  points: number[];
}
export function numberLineTicks(model: NumberLineGridVisual) {
  return Array.from({ length: model.maximum - model.minimum + 1 }, (_, i) => ({
    value: model.minimum + i,
    major: (model.minimum + i) % 10 === 0,
    x: 30 + i * 16,
  }));
}
export function numberLinePointX(model: NumberLineGridVisual, value: number) {
  return 30 + (value - model.minimum) * 16;
}
export function isBookGroupsVisual(value: unknown): value is BookGroupsVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  return (
    Object.keys(model).length === 3 &&
    model.kind === 'book-groups' &&
    (model.size === 5 || model.size === 10) &&
    typeof model.groups === 'number' &&
    Number.isInteger(model.groups) &&
    model.groups >= 1 &&
    model.groups * model.size <= 90
  );
}
export function isNumberLineGridVisual(
  value: unknown,
): value is NumberLineGridVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  if (
    Object.keys(model).length !== 4 ||
    model.kind !== 'number-line-grid' ||
    typeof model.minimum !== 'number' ||
    typeof model.maximum !== 'number' ||
    !Number.isInteger(model.minimum) ||
    !Number.isInteger(model.maximum) ||
    model.minimum < 0 ||
    model.maximum > 90 ||
    model.minimum % 10 !== 0 ||
    model.maximum % 10 !== 0 ||
    model.maximum - model.minimum < 20 ||
    model.maximum - model.minimum > 60 ||
    !Array.isArray(model.points) ||
    (model.points.length > 0 && model.points.length !== 6)
  )
    return false;
  const maximum = model.maximum;
  const minimum = model.minimum;
  return (
    [...model.points].every(
      (n) => Number.isInteger(n) && n >= minimum && n <= maximum,
    ) && new Set(model.points).size === model.points.length
  );
}

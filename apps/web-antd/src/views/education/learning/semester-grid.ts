export interface SemesterGridVisual {
  kind: 'semester-grid';
  mode: 'addition' | 'numbers';
  hidden: [number, number][];
  marked?: number;
}
export function semesterAxes(mode: SemesterGridVisual['mode']) {
  const start = mode === 'numbers' ? 1 : 0;
  return Array.from(
    { length: mode === 'numbers' ? 10 : 11 },
    (_, i) => start + i,
  );
}
export function semesterCell(
  mode: SemesterGridVisual['mode'],
  row: number,
  column: number,
) {
  const start = mode === 'numbers' ? 1 : 0;
  const last = 10;
  if (
    !Number.isInteger(row) ||
    !Number.isInteger(column) ||
    row < start ||
    row > last ||
    column < start ||
    column > last
  )
    return null;
  return {
    value: row + column - (mode === 'numbers' ? 1 : 0),
    expression: `${row}+${column}`,
  };
}
export function semesterFrequency(
  mode: SemesterGridVisual['mode'],
  value: number,
): number {
  const axes = semesterAxes(mode);
  return axes.reduce(
    (count, row) =>
      count +
      axes.filter((column) => semesterCell(mode, row, column)?.value === value)
        .length,
    0,
  );
}
export function isSemesterGridVisual(
  value: unknown,
): value is SemesterGridVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  if (
    model.kind !== 'semester-grid' ||
    (model.mode !== 'numbers' && model.mode !== 'addition') ||
    !Object.keys(model).every((key) =>
      ['hidden', 'kind', 'marked', 'mode'].includes(key),
    ) ||
    !Array.isArray(model.hidden) ||
    model.hidden.length > 12
  )
    return false;
  const mode = model.mode;
  if (
    !model.hidden.every(
      (position) =>
        Array.isArray(position) &&
        position.length === 2 &&
        typeof position[0] === 'number' &&
        typeof position[1] === 'number' &&
        semesterCell(mode, position[0], position[1]) !== null,
    ) ||
    new Set(model.hidden.map((position) => JSON.stringify(position))).size !==
      model.hidden.length
  )
    return false;
  return (
    model.marked === undefined ||
    (typeof model.marked === 'number' &&
      Number.isInteger(model.marked) &&
      semesterFrequency(mode, model.marked) > 0)
  );
}

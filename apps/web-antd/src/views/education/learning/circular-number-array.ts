export interface CircularNumberArrayVisual {
  kind: 'circular-number-array';
  start: 20 | 40;
  /** Four rings, ten clockwise sectors. Coordinates are zero-based. */
  hidden: [number, number][];
}
export function isCircularNumberArrayVisual(
  value: unknown,
): value is CircularNumberArrayVisual {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const p = value as Record<string, unknown>;
  return (
    Object.keys(p).length === 3 &&
    p.kind === 'circular-number-array' &&
    (p.start === 20 || p.start === 40) &&
    Array.isArray(p.hidden) &&
    p.hidden.length <= 4 &&
    p.hidden.every(
      (cell) =>
        Array.isArray(cell) &&
        cell.length === 2 &&
        cell.every((item) => Number.isInteger(item)) &&
        cell[0] >= 0 &&
        cell[0] < 4 &&
        cell[1] >= 0 &&
        cell[1] < 10,
    ) &&
    new Set(p.hidden.map((cell) => cell.join(','))).size === p.hidden.length
  );
}
export function circularNumberCells(visual: CircularNumberArrayVisual) {
  if (!isCircularNumberArrayVisual(visual))
    throw new RangeError('Invalid circular number array');
  return Array.from({ length: 40 }, (_, index) => {
    const ring = Math.floor(index / 10);
    const sector = index % 10;
    const hiddenIndex = visual.hidden.findIndex(
      ([r, s]) => r === ring && s === sector,
    );
    return {
      ring,
      sector,
      value: visual.start + index,
      known: hiddenIndex === -1,
      letter:
        hiddenIndex === -1 ? null : String.fromCodePoint(75 + hiddenIndex),
    };
  });
}
/** Same-ring clockwise successor does not carry into the next ring. */
export function circularNeighbor(
  ring: number,
  sector: number,
  direction: 'clockwise' | 'outward',
): [number, number] | null {
  if (
    !Number.isInteger(ring) ||
    !Number.isInteger(sector) ||
    ring < 0 ||
    ring > 3 ||
    sector < 0 ||
    sector > 9
  )
    throw new RangeError('Invalid circular position');
  if (direction === 'clockwise') return [ring, (sector + 1) % 10];
  return ring === 3 ? null : [ring + 1, sector];
}

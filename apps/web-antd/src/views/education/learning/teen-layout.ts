export interface TeenLayoutVisual {
  kind: 'teen-layout';
  display: 'frame' | 'rooms' | 'triangle';
  variant: 'main' | 'review';
}
export function isTeenLayoutVisual(value: unknown): value is TeenLayoutVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const m = value as Record<string, unknown>;
  return (
    Object.keys(m).length === 3 &&
    m.kind === 'teen-layout' &&
    typeof m.display === 'string' &&
    ['frame', 'rooms', 'triangle'].includes(m.display) &&
    typeof m.variant === 'string' &&
    ['main', 'review'].includes(m.variant)
  );
}
export function teenLayoutPoints(model: TeenLayoutVisual) {
  const rows = model.variant === 'main' ? 5 : 4;
  if (model.display === 'rooms') return [];
  return Array.from({ length: rows }, (_, row) => {
    const columns = model.display === 'triangle' ? row + 1 : 5;
    return Array.from({ length: columns }, (_, column) => ({
      row: row + 1,
      column: column + 1,
      x:
        model.display === 'triangle'
          ? 180 + (column - row / 2) * 24
          : 132 + column * 24,
      y: 40 + row * 24,
    })).filter(
      (p) =>
        model.display === 'triangle' ||
        row === 0 ||
        row === rows - 1 ||
        p.column === 1 ||
        p.column === 5,
    );
  }).flat();
}
export type TeenGuest = 'A' | 'B' | 'C' | 'D';
export function teenGuestRoom(
  variant: TeenLayoutVisual['variant'],
  guest: TeenGuest,
) {
  const rooms =
    variant === 'main'
      ? { A: 7, B: 9, C: 11, D: 17 }
      : { A: 3, B: 6, C: 16, D: 18 };
  return rooms[guest];
}
export function teenRooms(variant: TeenLayoutVisual['variant']) {
  const anchors =
    variant === 'main' ? [1, 2, 5, 10, 12, 15] : [1, 4, 8, 10, 11, 14, 19];
  return Array.from({ length: 19 }, (_, index) => {
    const number = index + 1;
    const upper = number > 10;
    const column = upper ? number - 10 : number;
    const guests: TeenGuest[] = ['A', 'B', 'C', 'D'];
    return {
      number,
      row: upper ? 'upper' : 'lower',
      column,
      x: 16 + (column - 1) * 32,
      y: upper ? 30 : 112,
      visible: anchors.includes(number),
      guest: guests.find((g) => teenGuestRoom(variant, g) === number),
    };
  });
}

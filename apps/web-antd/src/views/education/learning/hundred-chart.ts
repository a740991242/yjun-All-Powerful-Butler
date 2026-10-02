/** Ten numbers per row, 1–100. Horizontal moves do not wrap across rows. */
export function hundredPosition(value: number) {
  if (!Number.isInteger(value) || value < 1 || value > 100)
    throw new Error('Invalid hundred-chart position');
  const row = Math.floor((value - 1) / 10) + 1;
  const column = ((value - 1) % 10) + 1;
  return {
    value,
    row,
    column,
    left: column > 1 ? value - 1 : null,
    right: column < 10 ? value + 1 : null,
    up: row > 1 ? value - 10 : null,
    down: row < 10 ? value + 10 : null,
  };
}

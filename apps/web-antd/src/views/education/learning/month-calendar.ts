export interface MonthCalendarVisual {
  kind: 'month-calendar';
  year: number;
  month: number;
}
export function isMonthCalendarVisual(
  value: unknown,
): value is MonthCalendarVisual {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const d = value as Record<string, unknown>;
  return (
    Object.keys(d).length === 3 &&
    d.kind === 'month-calendar' &&
    typeof d.year === 'number' &&
    Number.isInteger(d.year) &&
    d.year >= 2000 &&
    d.year <= 2100 &&
    typeof d.month === 'number' &&
    Number.isInteger(d.month) &&
    d.month >= 1 &&
    d.month <= 12
  );
}
export function monthCalendarCells(visual: MonthCalendarVisual) {
  if (!isMonthCalendarVisual(visual)) throw new Error('Invalid calendar');
  const start = new Date(
    Date.UTC(visual.year, visual.month - 1, 1),
  ).getUTCDay();
  const count = new Date(Date.UTC(visual.year, visual.month, 0)).getUTCDate();
  return Array.from({ length: Math.ceil((start + count) / 7) * 7 }, (_, i) =>
    i >= start && i < start + count ? i - start + 1 : null,
  );
}

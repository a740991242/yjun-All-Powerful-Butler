export function day(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('dates.invalidDate');
  const stamp = Date.parse(value);
  if (
    !Number.isFinite(stamp) ||
    new Date(stamp).toISOString().slice(0, 10) !== value
  )
    throw new Error('dates.invalidDate');
  return stamp;
}
export function dateDifference(start: string, end: string) {
  return (day(end) - day(start)) / 86_400_000;
}
export interface HolidayData {
  years: number[];
  days: Record<string, 'off' | 'work'>;
  source: string;
  updatedAt: string;
}
export function validateHolidays(value: unknown): HolidayData {
  if (!value || typeof value !== 'object')
    throw new Error('dates.invalidImport');
  const data = value as Record<string, unknown>;
  if (
    !Array.isArray(data.years) ||
    data.years.length > 30 ||
    !data.years.every((y) => Number.isInteger(y) && y >= 1900 && y <= 2200) ||
    new Set(data.years).size !== data.years.length ||
    !data.days ||
    typeof data.days !== 'object' ||
    Array.isArray(data.days) ||
    typeof data.source !== 'string' ||
    !data.source.startsWith('https://') ||
    typeof data.updatedAt !== 'string'
  )
    throw new Error('dates.invalidImport');
  day(data.updatedAt);
  const entries = Object.entries(data.days);
  if (entries.length > 5000) throw new Error('dates.invalidImport');
  for (const [date, kind] of entries) {
    day(date);
    if (
      !data.years.includes(Number(date.slice(0, 4))) ||
      !['off', 'work'].includes(String(kind))
    )
      throw new Error('dates.invalidImport');
  }
  return {
    years: [...data.years],
    days: Object.fromEntries(entries) as HolidayData['days'],
    source: data.source,
    updatedAt: data.updatedAt,
  };
}
export function workdays(
  start: string,
  end: string,
  includeStart: boolean,
  includeEnd: boolean,
  mode: 'holidays' | 'weekdays',
  calendar: HolidayData,
) {
  const first = day(start);
  const last = day(end);
  if (last < first || last - first > 3660 * 86_400_000)
    throw new Error('dates.range');
  if (mode === 'holidays')
    for (
      let year = new Date(first).getUTCFullYear();
      year <= new Date(last).getUTCFullYear();
      year++
    )
      if (!calendar.years.includes(year)) throw new Error('dates.uncovered');
  let count = 0;
  for (let stamp = first; stamp <= last; stamp += 86_400_000) {
    if ((stamp === first && !includeStart) || (stamp === last && !includeEnd))
      continue;
    const date = new Date(stamp);
    const key = date.toISOString().slice(0, 10);
    const override = mode === 'holidays' ? calendar.days[key] : undefined;
    const isWork = override
      ? override === 'work'
      : ![0, 6].includes(date.getUTCDay());
    if (isWork) count++;
  }
  return count;
}
export interface FamilyEvent {
  id: string;
  title: string;
  date: string;
  kind: 'anniversary' | 'birthday' | 'other';
  annual: boolean;
  leap: 'feb28' | 'mar1';
  note: string;
}
export function validateEvents(value: unknown): FamilyEvent[] {
  if (!Array.isArray(value) || value.length > 500)
    throw new Error('dates.invalidImport');
  const seen = new Set<string>();
  return value.map((item) => {
    if (!item || typeof item !== 'object')
      throw new Error('dates.invalidImport');
    const row = item as Record<string, unknown>;
    if (
      typeof row.id !== 'string' ||
      !row.id ||
      seen.has(row.id) ||
      typeof row.title !== 'string' ||
      !row.title.trim() ||
      row.title.length > 200 ||
      typeof row.date !== 'string' ||
      !['anniversary', 'birthday', 'other'].includes(String(row.kind)) ||
      typeof row.annual !== 'boolean' ||
      !['feb28', 'mar1'].includes(String(row.leap)) ||
      typeof row.note !== 'string' ||
      row.note.length > 1000
    )
      throw new Error('dates.invalidImport');
    day(row.date);
    seen.add(row.id);
    return {
      id: row.id,
      title: row.title,
      date: row.date,
      kind: row.kind as FamilyEvent['kind'],
      annual: row.annual,
      leap: row.leap as FamilyEvent['leap'],
      note: row.note,
    };
  });
}
export function occurrence(event: FamilyEvent, today: string) {
  day(today);
  day(event.date);
  if (!event.annual)
    return { date: event.date, days: dateDifference(today, event.date) };
  let year = Math.max(
    Number(today.slice(0, 4)),
    Number(event.date.slice(0, 4)),
  );
  for (let i = 0; i < 2; i++, year++) {
    let date = `${year}${event.date.slice(4)}`;
    if (event.date.endsWith('-02-29')) {
      const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
      if (!leap) date = `${year}-${event.leap === 'feb28' ? '02-28' : '03-01'}`;
    }
    if (date >= today && date >= event.date)
      return { date, days: dateDifference(today, date) };
  }
  throw new Error('dates.invalidDate');
}

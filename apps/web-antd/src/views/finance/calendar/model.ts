import { day } from '../../life-tools/dates/model';
export interface CalendarEvent {
  id: string;
  code: string;
  title: string;
  date: string;
  kind: 'exdiv' | 'personal' | 'report';
  status: 'confirmed' | 'expected';
  source: string;
  updatedAt: string;
  note: string;
}
export function sourceUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      ['http:', 'https:'].includes(url.protocol) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}
export function validateCalendar(value: unknown): CalendarEvent[] {
  if (!Array.isArray(value) || value.length > 1000)
    throw new Error('investmentCalendar.invalid');
  const seen = new Set<string>();
  return value.map((item) => {
    if (!item || typeof item !== 'object')
      throw new Error('investmentCalendar.invalid');
    const row = item as Record<string, unknown>;
    if (
      typeof row.id !== 'string' ||
      !row.id ||
      row.id.length > 150 ||
      seen.has(row.id) ||
      typeof row.code !== 'string' ||
      !/^\d{0,6}$/.test(row.code) ||
      typeof row.title !== 'string' ||
      !row.title.trim() ||
      row.title.length > 200 ||
      typeof row.date !== 'string' ||
      !['exdiv', 'personal', 'report'].includes(String(row.kind)) ||
      !['confirmed', 'expected'].includes(String(row.status)) ||
      typeof row.source !== 'string' ||
      (row.source !== '' && !sourceUrl(row.source)) ||
      (row.kind !== 'personal' && row.source === '') ||
      typeof row.updatedAt !== 'string' ||
      typeof row.note !== 'string' ||
      row.note.length > 2000
    )
      throw new Error('investmentCalendar.invalid');
    day(row.date);
    day(row.updatedAt);
    seen.add(row.id);
    return {
      id: row.id,
      code: row.code,
      title: row.title,
      date: row.date,
      kind: row.kind as CalendarEvent['kind'],
      status: row.status as CalendarEvent['status'],
      source: row.source,
      updatedAt: row.updatedAt,
      note: row.note,
    };
  });
}

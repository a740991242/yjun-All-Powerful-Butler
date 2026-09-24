import { expect, it } from 'vitest';

import holidays from './holidays.json';
import {
  dateDifference,
  occurrence,
  validateEvents,
  validateHolidays,
  workdays,
} from './model';
it('uses calendar days without DST and rejects rollover dates', () => {
  expect(dateDifference('2026-03-07', '2026-03-09')).toBe(2);
  expect(() => dateDifference('2026-02-30', '2026-03-01')).toThrow(
    'dates.invalidDate',
  );
});
it('counts official holidays, weekend makeup days and endpoints', () => {
  const calendar = validateHolidays(holidays);
  expect(
    workdays('2026-01-01', '2026-01-04', true, true, 'holidays', calendar),
  ).toBe(1);
  expect(
    workdays('2026-01-01', '2026-01-04', true, true, 'weekdays', calendar),
  ).toBe(2);
  expect(
    workdays('2026-01-04', '2026-01-04', false, true, 'holidays', calendar),
  ).toBe(0);
  expect(() =>
    workdays('2026-12-31', '2027-01-02', true, true, 'holidays', calendar),
  ).toThrow('dates.uncovered');
  expect(() =>
    validateHolidays({ ...holidays, days: { '2027-01-01': 'off' } }),
  ).toThrow('dates.invalidImport');
});
it('handles annual leap birthdays, today, past and future originals', () => {
  const event = {
    id: 'a',
    title: 'birthday',
    date: '2024-02-29',
    annual: true,
    kind: 'birthday' as const,
    leap: 'feb28' as const,
    note: '',
  };
  expect(occurrence(event, '2026-02-28')).toEqual({
    date: '2026-02-28',
    days: 0,
  });
  expect(occurrence({ ...event, leap: 'mar1' }, '2026-02-28')).toEqual({
    date: '2026-03-01',
    days: 1,
  });
  expect(occurrence(event, '2026-03-01').date).toBe('2027-02-28');
  expect(occurrence({ ...event, date: '2028-02-29' }, '2026-03-01').date).toBe(
    '2028-02-29',
  );
  expect(occurrence({ ...event, annual: false }, '2024-03-01').days).toBe(-1);
  expect(() => validateEvents([event, event])).toThrow('dates.invalidImport');
});

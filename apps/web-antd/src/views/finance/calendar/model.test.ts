import { expect, it } from 'vitest';

import data from '../../../../public/data/finance/calendar.json';
import { validateCalendar } from './model';
it('validates published event provenance and rejects executable links and impossible dates', () => {
  expect(validateCalendar(data.events)).toHaveLength(2);
  const event = data.events[0];
  expect(() =>
    validateCalendar([{ ...event, source: 'javascript:alert(1)' }]),
  ).toThrow('investmentCalendar.invalid');
  expect(() => validateCalendar([{ ...event, source: '' }])).toThrow(
    'investmentCalendar.invalid',
  );
  expect(() => validateCalendar([{ ...event, date: '2026-02-30' }])).toThrow(
    'dates.invalidDate',
  );
  expect(() => validateCalendar([event, event])).toThrow(
    'investmentCalendar.invalid',
  );
});

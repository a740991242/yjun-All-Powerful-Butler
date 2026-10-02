import { expect, it } from 'vitest';

import { clockHands, clockPoint, isClockVisual } from './clock';
it('positions the short hand midway at half past, including twelve to one', () => {
  expect(clockHands({ kind: 'clock', hour: 8, minute: 0 })).toEqual({
    hour: 240,
    minute: 0,
  });
  expect(clockHands({ kind: 'clock', hour: 8, minute: 30 })).toEqual({
    hour: 255,
    minute: 180,
  });
  expect(clockHands({ kind: 'clock', hour: 12, minute: 30 })).toEqual({
    hour: 15,
    minute: 180,
  });
  expect(clockPoint(0, 82)).toEqual({ x: 120, y: 38 });
  expect(clockPoint(180, 82).y).toBe(202);
});
it('accepts only original whole/half clock snapshots and rejects answer fields', () => {
  for (let hour = 1; hour <= 12; hour++)
    for (const minute of [0, 30])
      expect(isClockVisual({ kind: 'clock', hour, minute })).toBe(true);
  for (const invalid of [
    { hour: 0, minute: 0 },
    { hour: 13, minute: 0 },
    { hour: 1.5, minute: 0 },
    { hour: 8, minute: 15 },
    { hour: 8, minute: 60 },
    { hour: 8, minute: 0, answer: '8:00' },
  ])
    expect(isClockVisual({ kind: 'clock', ...invalid })).toBe(false);
});

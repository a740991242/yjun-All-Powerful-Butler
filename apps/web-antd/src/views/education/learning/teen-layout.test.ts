import { expect, it } from 'vitest';

import {
  isTeenLayoutVisual,
  teenGuestRoom,
  teenLayoutPoints,
  teenRooms,
} from './teen-layout';
it('accepts only known three-field diagrams, rejecting injected geometry and hidden answers', () => {
  for (const display of ['triangle', 'frame', 'rooms'])
    for (const variant of ['main', 'review'])
      expect(
        isTeenLayoutVisual({ kind: 'teen-layout', display, variant }),
      ).toBe(true);
  for (const value of [
    null,
    [],
    {},
    { kind: 'teen-layout', display: 'other', variant: 'main' },
    { kind: 'teen-layout', display: 'rooms', variant: 'other' },
    { kind: 'teen-layout', display: 'rooms', variant: 'main', answer: 7 },
    {
      kind: 'teen-layout',
      display: { toString: () => 'rooms' },
      variant: 'main',
    },
  ])
    expect(isTeenLayoutVisual(value)).toBe(false);
});
it('counts corners once and keeps every point inside its native canvas', () => {
  for (const [display, variant, rows] of [
    ['triangle', 'main', [1, 2, 3, 4, 5]],
    ['triangle', 'review', [1, 2, 3, 4]],
    ['frame', 'main', [5, 2, 2, 2, 5]],
    ['frame', 'review', [5, 2, 2, 5]],
  ] as const) {
    const points = teenLayoutPoints({ kind: 'teen-layout', display, variant });
    expect(new Set(points.map((p) => `${p.x},${p.y}`)).size).toBe(
      points.length,
    );
    expect(
      rows.map((_, i) => points.filter((p) => p.row === i + 1).length),
    ).toEqual(rows);
    expect(
      points.every((p) => p.x >= 8 && p.x <= 352 && p.y >= 8 && p.y <= 212),
    ).toBe(true);
  }
});
it('models nineteen continuous rooms without exposing the four hidden guest numbers', () => {
  for (const variant of ['main', 'review'] as const) {
    const rooms = teenRooms(variant);
    expect(rooms.map((r) => r.number)).toEqual(
      Array.from({ length: 19 }, (_, i) => i + 1),
    );
    expect(rooms.filter((r) => r.row === 'lower')).toHaveLength(10);
    expect(rooms.filter((r) => r.row === 'upper')).toHaveLength(9);
    expect(rooms.filter((r) => r.visible)).toHaveLength(
      variant === 'main' ? 6 : 7,
    );
    expect(rooms.filter((r) => r.guest)).toHaveLength(4);
    for (const room of rooms) {
      expect(
        room.x >= 1 && room.x + 28 <= 359 && room.y >= 1 && room.y + 64 <= 219,
      ).toBe(true);
      if (room.guest) {
        expect(room.visible).toBe(false);
        expect(room.number).toBe(teenGuestRoom(variant, room.guest));
      }
    }
    rooms[0]!.visible = false;
    expect(teenRooms(variant)[0]!.visible).toBe(true);
  }
});

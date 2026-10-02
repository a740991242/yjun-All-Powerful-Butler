import { expect, it } from 'vitest';

import { findTextbook, textbooks } from './textbooks';

it('uses four distinct official six-three resources and rejects unknown route combinations', () => {
  expect(textbooks.map((item) => item.resourceId).toSorted()).toEqual([
    '1211001101241',
    '1211001102241',
    '1221001101241',
    '1221001102241',
  ]);
  expect(findTextbook('chinese', 'pep-2024', 'upper')?.units).toHaveLength(10);
  expect(findTextbook('chinese', 'pep-2024', 'lower')?.units).toHaveLength(9);
  expect(findTextbook('math', 'pep-2024', 'upper')?.units).toHaveLength(7);
  expect(findTextbook('math', 'pep-2024', 'lower')?.units).toHaveLength(8);
  expect(findTextbook('math', 'old', 'upper')).toBeUndefined();
  expect(findTextbook(['math'], 'pep-2024', 'upper')).toBeUndefined();
});
it('keeps gardens, reading activities and references separate from numbered lessons', () => {
  for (const volume of ['upper', 'lower']) {
    const book = findTextbook('chinese', 'pep-2024', volume)!;
    const items = book.units.flatMap((unit) => unit.items);
    expect(items.filter((item) => item.kind === 'garden')).toHaveLength(8);
    expect(items.filter((item) => item.kind === 'reading')).toHaveLength(1);
    expect(
      items.filter((item) => item.kind === 'reference').length,
    ).toBeGreaterThanOrEqual(3);
    expect(new Set(items.map((item) => item.id)).size).toBe(items.length);
  }
  const lower = findTextbook('math', 'pep-2024', 'lower')!;
  expect(
    lower.units.find((unit) => unit.id === 'shopping')?.items[0],
  ).toMatchObject({
    title: '欢乐购物街',
    page: 77,
    kind: 'activity',
  });
  expect(lower.units.find((unit) => unit.id === 'u5')?.title).toBe(
    '100以内的笔算加、减法',
  );
});

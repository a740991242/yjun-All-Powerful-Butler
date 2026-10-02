import { expect, it } from 'vitest';

import { fold } from '../learning/fold';
import {
  lowerCharacters,
  lowerRadicals,
  strokeNames,
  upperCharacters,
  upperRadicals,
} from './characters';
import { textbooks } from './textbooks';

it('matches the revised official recognition totals and upper writing total', () => {
  const sum = (items: typeof upperCharacters, kind: 'recognize' | 'write') =>
    fold(
      Object.values(items),
      0,
      (total, scope) => total + [...scope[kind]].length,
    );
  expect(sum(upperCharacters, 'recognize')).toBe(280);
  expect(sum(upperCharacters, 'write')).toBe(100);
  expect(sum(lowerCharacters, 'recognize')).toBe(410);
  expect(sum(lowerCharacters, 'write')).toBe(200);
  for (const [volume, scope] of [
    ['upper', upperCharacters],
    ['lower', lowerCharacters],
  ] as const) {
    const official = textbooks.find(
      (item) => item.subject === 'chinese' && item.volume === volume,
    )!;
    const ids = new Set(
      official.units.flatMap((unit) => unit.items.map((item) => item.id)),
    );
    expect(Object.keys(scope).every((id) => ids.has(id))).toBe(true);
  }
});
it('keeps contextual readings separate and explicitly marks the unread writing page', () => {
  expect(upperCharacters['u8-3']?.additionalReadings).toBe('数长');
  expect(lowerCharacters['u3-3']?.additionalReadings).toBe('乐得');
  for (const [id, write] of [
    ['u1-1', '春冬吹花飞入'],
    ['u1-2', '什么古胡双言'],
    ['u1-3', '青清晴苗请生'],
    ['u1-4', '字红动万无明'],
  ])
    expect(lowerCharacters[id!]!).toMatchObject({ write, writeVerified: true });
  expect(lowerCharacters['u2-3']).toMatchObject({
    write: '告会京的北广',
    writeVerified: true,
  });
  expect(lowerCharacters['u2-1']).toMatchObject({
    write: '共产党太阳光',
    writeVerified: true,
  });
  expect(lowerCharacters['u2-2']).toMatchObject({
    write: '井江方主住后',
    writeVerified: true,
  });
  expect(lowerCharacters['u8-1']?.writeVerified).toBe(true);
  expect(strokeNames).toHaveLength(32);
  expect(new Set(strokeNames).size).toBe(32);
  expect(upperRadicals).toHaveLength(29);
  expect(lowerRadicals).toHaveLength(34);
});

it('matches the reread lower table page 117 and corrects three transcriptions without altering historical snapshots', () => {
  for (const [id, write] of [
    ['u3-1', '走说自河让己'],
    ['u3-2', '从们他好叫回'],
    ['u3-3', '快当画乐书毛'],
    ['u3-4', '止斤寸丁千元'],
    ['u6-2', '玩眼泪它贝气'],
    ['u7-2', '灯车站课坐老师'],
  ])
    expect(lowerCharacters[id!]!).toMatchObject({ write, writeVerified: true });
  expect(lowerCharacters['u3-4']!.recognize).toBe('母页止斤寸丁千全元');
  expect(Object.values(lowerCharacters).every((x) => x.writeVerified)).toBe(
    true,
  );
});

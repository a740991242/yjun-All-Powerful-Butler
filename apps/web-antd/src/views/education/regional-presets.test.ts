import type { RegionalApplicationQuery } from './regional-application';
import type {
  RegionalPresetData,
  RegionalPresetEditions,
} from './regional-presets';

import { expect, it } from 'vitest';

import {
  regionalActionPath,
  regionalApplicationPlan,
} from './regional-application';
import { regionalEditionEvidence } from './regional-editions';
import { regionalProvinces } from './regional-locations';
import {
  emptyRegionalEditions,
  findRegionalPreset,
  parseRegionalPresets,
  readRegionalPresets,
  REGIONAL_PRESETS_KEY,
  regionalPresetActions,
  regionalPresetScope,
  removeRegionalPreset,
  saveRegionalPreset,
  writeRegionalPresets,
} from './regional-presets';

const query: RegionalApplicationQuery = {
  province: 'jiangsu',
  city: '',
  school: '',
  academicYear: '2026-2027',
  stage: 'primary',
  grade: 'p1',
  subject: 'math',
  volume: 'upper',
  schoolSystem: 'six-three',
};
const editions: RegionalPresetEditions = {
  chinese: 'pep-2024',
  math: 'bnu-2024',
  ethics: 'pep-2024',
};
const empty = (): RegionalPresetData => ({ schemaVersion: 1, entries: [] });
it('supports a personal available course set in each navigation area without manufacturing regional evidence', () => {
  const evidence = regionalEditionEvidence();
  for (const province of regionalProvinces) {
    const location = { ...query, province };
    const before = regionalApplicationPlan(location);
    const data = saveRegionalPreset(empty(), location, editions);
    expect(findRegionalPreset(data, location)?.editions).toEqual(editions);
    expect(
      regionalPresetActions(location, editions).map((action) =>
        regionalActionPath(action),
      ),
    ).toEqual([
      '/education/primary/p1/chinese/pep-2024/upper',
      '/education/primary/p1/math/bnu-2024/upper',
      '/education/primary/p1/ethics/pep-2024/upper',
    ]);
    expect(regionalApplicationPlan(location)).toEqual(before);
  }
  expect(regionalEditionEvidence()).toEqual(evidence);
});
it('matches exact province, city, school, year, volume and school system without province fallback', () => {
  const data = saveRegionalPreset(empty(), query, editions);
  for (const change of [
    { province: 'guangdong' },
    { city: 'suzhou' },
    { city: 'suzhou', school: 'wujiang-choudu-primary' },
    { academicYear: '2025-2026' },
    { volume: 'lower' as const },
    { schoolSystem: 'unknown' as const },
    { schoolSystem: 'five-four' as const },
    { stage: 'junior' },
    { grade: 'p2' },
  ])
    expect(findRegionalPreset(data, { ...query, ...change })).toBeUndefined();
  const scoped = { ...query, city: 'suzhou', school: 'wujiang-choudu-primary' };
  const next = saveRegionalPreset(data, scoped, {
    ...editions,
    math: 'sujiao',
  });
  expect(findRegionalPreset(next, query)?.editions.math).toBe('bnu-2024');
  expect(findRegionalPreset(next, scoped)?.editions.math).toBe('sujiao');
  expect(
    findRegionalPreset(next, { ...scoped, province: 'guangdong' }),
  ).toBeUndefined();
});
it('updates and removes only the current scope and clones records rather than exposing mutable settings', () => {
  const other = { ...query, province: 'beijing' };
  const first = saveRegionalPreset(
    saveRegionalPreset(empty(), query, editions),
    other,
    { ...editions, math: 'pep-2024' },
  );
  const changed = saveRegionalPreset(first, query, {
    ...editions,
    math: 'sujiao',
  });
  expect(first.entries).toHaveLength(2);
  expect(findRegionalPreset(first, query)?.editions.math).toBe('bnu-2024');
  const selected = findRegionalPreset(changed, query)!;
  selected.editions.math = 'keep';
  expect(findRegionalPreset(changed, query)?.editions.math).toBe('sujiao');
  const removed = removeRegionalPreset(changed, query);
  expect(removed.entries).toHaveLength(1);
  expect(findRegionalPreset(removed, other)?.editions.math).toBe('pep-2024');
  expect(findRegionalPreset(removed, query)).toBeUndefined();
});
it('keeps omitted subjects unchanged and never applies English or an unavailable volume', () => {
  const mathOnly = { ...emptyRegionalEditions(), math: 'sujiao' as const };
  expect(regionalPresetActions(query, mathOnly)).toEqual([
    { subject: 'math', edition: 'sujiao', volume: 'upper' },
  ]);
  expect(
    regionalPresetActions({ ...query, volume: 'lower' }, editions).map(
      (a) => a.subject,
    ),
  ).toEqual(['chinese', 'ethics']);
  expect(() =>
    saveRegionalPreset(empty(), { ...query, volume: 'lower' }, editions),
  ).toThrow('regionalPresetUnavailable');
  expect(() =>
    saveRegionalPreset(empty(), query, emptyRegionalEditions()),
  ).toThrow('regionalPresetUnavailable');
  for (const schoolSystem of ['unknown', 'five-four'] as const) {
    expect(regionalPresetScope({ ...query, schoolSystem })).toBeUndefined();
    expect(regionalPresetActions({ ...query, schoolSystem }, editions)).toEqual(
      [],
    );
  }
});
it('persists and reloads one isolated key without touching records, math preferences or other locations', () => {
  const values = new Map([
    ['butler-grade-one-math-edition-v1', 'sujiao'],
    ['learner-backup', 'unchanged'],
  ]);
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
  expect(readRegionalPresets(storage)).toEqual(empty());
  const data = saveRegionalPreset(empty(), query, editions);
  writeRegionalPresets(storage, data);
  expect(readRegionalPresets(storage)).toEqual(data);
  expect(values.get('learner-backup')).toBe('unchanged');
  expect(values.get('butler-grade-one-math-edition-v1')).toBe('sujiao');
  expect([...values.keys()]).toEqual([
    'butler-grade-one-math-edition-v1',
    'learner-backup',
    REGIONAL_PRESETS_KEY,
  ]);
});
it('rejects corrupt, duplicate, unsupported, stale-location and oversized stored data without writing it', () => {
  const data = saveRegionalPreset(empty(), query, editions);
  const row = data.entries[0]!;
  const bad = [
    '',
    'null',
    JSON.stringify({ ...data, schemaVersion: 2 }),
    JSON.stringify({ ...data, extra: true }),
    JSON.stringify({ ...data, entries: [row, row] }),
    JSON.stringify({
      ...data,
      entries: [{ ...row, editions: { ...editions, english: 'pep-2024' } }],
    }),
    JSON.stringify({
      ...data,
      entries: [{ ...row, editions: { ...editions, chinese: 'sujiao' } }],
    }),
    JSON.stringify({
      ...data,
      entries: [{ ...row, editions: emptyRegionalEditions() }],
    }),
    JSON.stringify({
      ...data,
      entries: [
        {
          ...row,
          scope: { ...row.scope, province: 'guangdong', city: 'suzhou' },
        },
      ],
    }),
    JSON.stringify({
      ...data,
      entries: [{ ...row, scope: { ...row.scope, school: 'invented-school' } }],
    }),
    JSON.stringify({
      ...data,
      entries: [{ ...row, scope: { ...row.scope, academicYear: '2030-2031' } }],
    }),
    JSON.stringify({
      ...data,
      entries: Array.from({ length: 257 }, () => row),
    }),
    ' '.repeat(256_001),
  ];
  for (const raw of bad) {
    expect(() => parseRegionalPresets(raw)).toThrow(Error);
    let stored = raw;
    expect(() => readRegionalPresets({ getItem: () => stored })).toThrow(Error);
    expect(stored).toBe(raw);
    stored = raw;
  }
});
it('preserves the prior serialized set when storage writes fail and can retry', () => {
  const first = saveRegionalPreset(empty(), query, editions);
  let stored = JSON.stringify(first);
  let blocked = true;
  const storage = {
    getItem: () => stored,
    setItem: (_key: string, value: string) => {
      if (blocked) throw new Error('Quota');
      stored = value;
    },
  };
  const next = saveRegionalPreset(first, query, {
    ...editions,
    math: 'sujiao',
  });
  expect(() => writeRegionalPresets(storage, next)).toThrow('Quota');
  expect(readRegionalPresets(storage)).toEqual(first);
  blocked = false;
  writeRegionalPresets(storage, next);
  expect(readRegionalPresets(storage)).toEqual(next);
  expect(() =>
    readRegionalPresets({
      getItem: () => {
        throw new Error('Denied');
      },
    }),
  ).toThrow('Denied');
});

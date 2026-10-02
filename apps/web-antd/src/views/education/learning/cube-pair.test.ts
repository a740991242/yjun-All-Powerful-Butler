import { expect, it } from 'vitest';

import { sujiaoUpperCubePairLesson as lesson } from '../content/sujiao-upper-cube-pair';
import { exportBackup, parseBackup } from './backup';
import {
  cubePairCanvas,
  cubePairData,
  cubePairJoin,
  cubePairOptions,
  isCubePairVisual,
} from './cube-pair';
import { createSession } from './engine';

it('checks all fifteen whole-group pairs, including equal counts with an impossible outline', () => {
  expect(cubePairOptions('main')).toHaveLength(15);
  expect(
    cubePairOptions('main')
      .filter((p) => p.valid)
      .map((p) => p.id),
  ).toEqual(['AE', 'BF', 'CD']);
  expect(
    cubePairOptions('review')
      .filter((p) => p.valid)
      .map((p) => p.id),
  ).toEqual(['AE', 'BF']);
  for (const variant of ['main', 'review'] as const) {
    const data = cubePairData(variant);
    for (const option of cubePairOptions(variant)) {
      const joined = cubePairJoin(variant, option.first, option.second);
      expect(cubePairJoin(variant, option.second, option.first) !== null).toBe(
        option.valid,
      );
      if (!joined) continue;
      expect(joined.map((p) => p.length)).toEqual([
        data.groups.find((g) => g.id === option.first)!.cells.length,
        data.groups.find((g) => g.id === option.second)!.cells.length,
      ]);
      const all = joined.flat().map((p) => p.join(','));
      expect(new Set(all).size).toBe(6);
      expect(all.toSorted()).toEqual(
        data.target.map((p) => p.join(',')).toSorted(),
      );
      // Rigid turns preserve every within-group pairwise squared distance.
      for (const [index, id] of [option.first, option.second].entries()) {
        const distances = (cells: number[][]) =>
          cells
            .flatMap((a, i) =>
              cells
                .slice(i + 1)
                .map((b) => (a[0]! - b[0]!) ** 2 + (a[1]! - b[1]!) ** 2),
            )
            .toSorted((a, b) => a - b);
        expect(distances(joined[index]!)).toEqual(
          distances(data.groups.find((g) => g.id === id)!.cells),
        );
      }
    }
    for (const group of [...data.groups, { id: 'target', cells: data.target }])
      for (const cube of cubePairCanvas([group.cells])) {
        expect(cube.x).toBeGreaterThan(2);
        expect(cube.x + 49).toBeLessThan(238);
        expect(cube.y - 9).toBeGreaterThan(2);
        expect(cube.y + 40).toBeLessThan(198);
      }
  }
  expect(cubePairJoin('main', 'A', 'A')).toBeNull();
  expect(() => cubePairJoin('main', 'unknown', 'A')).toThrow(
    'Missing required',
  );
});

it('rejects extra, unknown and impossible diagrams in snapshots without changing storage schema', () => {
  const model = { kind: 'cube-pair', variant: 'main', display: 'join-cd' };
  expect(isCubePairVisual(model)).toBe(true);
  for (const bad of [
    null,
    [],
    { ...model, variant: 'review' },
    { ...model, variant: ['main'] },
    { ...model, answer: ['AE'] },
    { ...model, depth: 2 },
    { ...model, display: 'unknown' },
    { kind: 'cube-pair', variant: 'main' },
  ])
    expect(isCubePairVisual(bad)).toBe(false);
  const now = '2026-10-02T10:00:00.000Z';
  const s = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  const data = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [s],
  };
  expect(parseBackup(exportBackup(data, now)).data.sessions[0]).toEqual(s);
  const q = s.questions.find((q) => q.visual?.kind === 'cube-pair')!;
  for (const bad of [
    { ...model, variant: 'review' },
    { ...model, answer: ['AE'] },
    { ...model, display: ['candidates'] },
  ]) {
    const forged = structuredClone(data);
    Object.assign(
      forged.sessions[0]!.questions.find((x) => x.id === q.id)!,
      { visual: bad },
    );
    expect(() => parseBackup(exportBackup(forged, now))).toThrow(
      'educationLearning.invalidRecord',
    );
  }
});

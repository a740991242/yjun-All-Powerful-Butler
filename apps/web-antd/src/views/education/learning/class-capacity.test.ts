import { expect, it } from 'vitest';

import { sujiaoPracticalProblemsDraft as lesson } from '../content/sujiao-practical-problems';
import { exportBackup, parseBackup } from './backup';
import { classCapacityFacts, isClassCapacityVisual } from './class-capacity';
import { createSession } from './engine';
import { initialLibrary } from './storage';

it('keeps only known team counts and room capacities, with fresh data for each reading', () => {
  for (const variant of ['main', 'review'] as const) {
    expect(isClassCapacityVisual({ kind: 'class-capacity', variant })).toBe(
      true,
    );
    const facts = classCapacityFacts(variant);
    expect(facts.classes.map((row) => [row.first, row.second])).toEqual(
      variant === 'main'
        ? [
            [12, 20],
            [13, 10],
            [18, 20],
          ]
        : [
            [14, 20],
            [15, 10],
            [10, 30],
          ],
    );
    expect(facts.rooms.map((room) => room.capacity)).toEqual(
      variant === 'main' ? [40, 32, 24] : [42, 36, 26],
    );
    for (const row of facts.classes) {
      expect(Object.keys(row).toSorted()).toEqual(['first', 'id', 'second']);
      expect(row.first % 10 === 0 || row.second % 10 === 0).toBe(true);
    }
    for (const room of facts.rooms)
      expect(Object.keys(room).toSorted()).toEqual(['capacity', 'id']);
    facts.classes[0]!.first = 99;
    facts.rooms[0]!.capacity = 0;
    expect(classCapacityFacts(variant).classes[0]!.first).not.toBe(99);
    expect(classCapacityFacts(variant).rooms[0]!.capacity).toBeGreaterThan(0);
  }
});

it('distinguishes individually sufficient rooms from a simultaneous one-room-per-class assignment', () => {
  const permutations = [
    [0, 1, 2],
    [0, 2, 1],
    [1, 0, 2],
    [1, 2, 0],
    [2, 0, 1],
    [2, 1, 0],
  ];
  for (const variant of ['main', 'review'] as const) {
    const { classes, rooms } = classCapacityFacts(variant);
    const totals = classes.map((row) => row.first + row.second);
    expect(totals).toEqual(variant === 'main' ? [32, 23, 38] : [34, 25, 40]);
    expect(rooms.every((room) => room.capacity >= totals[1]!)).toBe(true);
    const feasible = permutations.filter((assignment) =>
      assignment.every(
        (roomIndex, classIndex) =>
          rooms[roomIndex]!.capacity >= totals[classIndex]!,
      ),
    );
    expect(feasible).toEqual([[1, 2, 0]]);
    // Everyone individually fits in X, but that does not allow sharing X simultaneously.
    expect(totals.every((total) => rooms[0]!.capacity >= total)).toBe(true);
  }
});

it('rejects embedded answers and malformed variants, and preserves a readonly visual in backups', () => {
  for (const invalid of [
    null,
    [],
    { kind: 'class-capacity' },
    { kind: 'class-capacity', variant: ['main'] },
    { kind: 'class-capacity', variant: 'other' },
    { kind: 'class-capacity', variant: 'main', totals: [32, 23, 38] },
    { kind: 'class-capacity', variant: 'main', assignment: ['Y', 'Z', 'X'] },
  ])
    expect(isClassCapacityVisual(invalid)).toBe(false);
  const library = initialLibrary('容量模型核验');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  session.questions[0]!.visual = { kind: 'class-capacity', variant: 'main' };
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
  const bad = JSON.parse(exportBackup(library));
  bad.data.sessions[0].questions[0].visual.totals = [32, 23, 38];
  expect(() => parseBackup(JSON.stringify(bad))).toThrow(Error);
  delete bad.data.sessions[0].questions[0].visual.totals;
  bad.data.sessions[0].questions[0].rule = {
    kind: 'class-capacity',
    variant: 'main',
  };
  expect(() => parseBackup(JSON.stringify(bad))).toThrow(Error);
});

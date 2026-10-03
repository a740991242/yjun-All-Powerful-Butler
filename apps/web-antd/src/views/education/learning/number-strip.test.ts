import { expect, it } from 'vitest';

import { bnuFinalNumberPracticeLesson as lesson } from '../content/bnu-final-practice';
import { exportBackup, parseBackup } from './backup';
import { createSession } from './engine';
import { isNumberStripVisual } from './number-strip';
import { required } from './required';
import { sparseArray } from './sparse-array';
import { initialLibrary } from './storage';

const model = {
  kind: 'number-strip' as const,
  values: [10, 8, null, null, 2, null],
};
it('preserves given numbers and blank positions without including computed answers', () => {
  expect(isNumberStripVisual(model)).toBe(true);
  expect(isNumberStripVisual({ kind: 'number-strip', values: [0, null] })).toBe(
    true,
  );
  for (const bad of [
    null,
    [],
    { ...model, values: [null, null] },
    { ...model, values: [1] },
    { ...model, values: Array.from({ length: 13 }, () => 1) },
    { ...model, values: sparseArray(6) },
    { ...model, values: [1, '2'] },
    { ...model, values: [1, -1] },
    { ...model, values: [1, 100] },
    { ...model, values: [1, 1.5] },
    { ...model, answers: [6, 4, 0] },
  ])
    expect(isNumberStripVisual(bad)).toBe(false);
});
it('preserves original blank rows in backups and rejects injected answers or damaged snapshots', () => {
  const library = initialLibrary('隔离数列核对');
  const session = createSession(
    lesson,
    'bnu-math-p1-upper-2024',
    library.activeProfileId,
  );
  library.sessions.push(session);
  const index = session.questions.findIndex((q) =>
    q.id.endsWith('-descending'),
  );
  expect(required(session.questions[index]).visual).toEqual(model);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(
    JSON.parse(JSON.stringify(session)),
  );
  for (const visual of [
    { ...model, answers: [6, 4, 0] },
    { ...model, values: [10, null, '6'] },
    { ...model, values: [null, null] },
  ]) {
    const bad = JSON.parse(exportBackup(library));
    bad.data.sessions[0].questions[index].visual = visual;
    expect(() => parseBackup(JSON.stringify(bad))).toThrow(
      'educationLearning.invalidBackup',
    );
  }
});

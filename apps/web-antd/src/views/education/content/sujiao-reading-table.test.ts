import { expect, it } from 'vitest';

import { exportBackup, isLibraryState, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoFinalExplorationLesson as lesson } from './sujiao-final-exploration';
import { sujiaoReadingTasks } from './sujiao-reading-table';

it('separates daily winners from three-day comparison and refuses unrecorded ability claims', () => {
  for (const [review, expected, lookup, combined] of [
    [false, ['second', 'second', 'first'], 3, 'second'],
    [true, ['first', 'second', 'first'], 5, 'first'],
  ] as const) {
    const tasks = sujiaoReadingTasks(review);
    expect(tasks).toHaveLength(8);
    const q = (suffix: string) =>
      tasks.find(
        (q) => q.id === `${lesson.id}-${review ? 'r' : 'q'}-reading-${suffix}`,
      )!;
    for (const [i, winner] of expected.entries())
      expect(evaluate(q(`day-${i}`).rule, winner)).toBe(true);
    expect(evaluate(q('lookup').rule, lookup)).toBe(true);
    expect(evaluate(q('every-day').rule, 'yes')).toBe(false);
    expect(evaluate(q('combined').rule, combined)).toBe(true);
    expect(evaluate(q('unit').rule, 'page-number')).toBe(false);
    expect(evaluate(q('ability').rule, 'known')).toBe(false);
    expect(evaluate(q('ability').rule, 'unknown')).toBe(true);
  }
});
it('preserves old exploration sessions and actual first table mistakes through backup', () => {
  const state = initialLibrary('读表');
  const old = createSession(
    {
      ...lesson,
      version: 1,
      questions: lesson.questions.filter((q) => !q.id.includes('-reading')),
    },
    'sujiao-math-p1-upper-2024',
    state.activeProfileId,
  );
  const session = createSession(
    lesson,
    'sujiao-math-p1-upper-2024',
    state.activeProfileId,
  );
  const index = session.questions.findIndex(
    (q) => q.id === `${lesson.id}-q-reading-lookup`,
  );
  const q = session.questions[index]!;
  session.responses[index]!.draft = 4;
  session.responses[index] = submitResponse(q, session.responses[index]!);
  session.responses[index]!.draft = 3;
  session.responses[index] = submitResponse(q, session.responses[index]!);
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  state.sessions.push(old, session);
  expect(parseBackup(exportBackup(state)).data).toEqual(state);
  const invalid = structuredClone(state);
  Object.assign(invalid.sessions[1]!.questions[index]!.visual!, {
    totals: [13, 15],
  });
  expect(isLibraryState(invalid)).toBe(false);
  expect(old.questions.some((q) => q.visual?.kind === 'reading-table')).toBe(
    false,
  );
});

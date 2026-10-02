import { expect, it } from 'vitest';

import { exportBackup, isLibraryState, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoFinalBuildingLesson as lesson } from './sujiao-final-building';
import { sujiaoBeadTasks } from './sujiao-hidden-beads';
it('separates two categories, each concealed group and the combined count', () => {
  for (const [review, b, total, parts] of [
    [false, 5, 7, [2, 3]],
    [true, 7, 9, [3, 4]],
  ] as const) {
    const tasks = sujiaoBeadTasks(review);
    const q = (suffix: string) =>
      tasks.find((q) => q.id.endsWith(`-beads-${suffix}`))!;
    expect(evaluate(q('a').rule, 2)).toBe(true);
    expect(evaluate(q('b').rule, b)).toBe(true);
    expect(evaluate(q('b').rule, total)).toBe(false);
    expect(evaluate(q('all').rule, total)).toBe(true);
    expect(evaluate(q('parts').rule, [...parts])).toBe(true);
    expect(evaluate(q('parts').rule, [b, b])).toBe(false);
    expect(evaluate(q('uncertain').rule, 'yes')).toBe(false);
  }
});
it('keeps first single-group mistakes and refuses exposed hidden-answer fields in backups', () => {
  const state = initialLibrary('珠串');
  const old = createSession(
    {
      ...lesson,
      version: 1,
      questions: lesson.questions.filter((q) => !q.id.includes('-beads')),
    },
    'sujiao-math-p1-upper-2024',
    state.activeProfileId,
  );
  const session = createSession(
    lesson,
    'sujiao-math-p1-upper-2024',
    state.activeProfileId,
  );
  const index = session.questions.findIndex((q) => q.id.endsWith('-q-beads-b'));
  const q = session.questions[index]!;
  session.responses[index]!.draft = 3;
  session.responses[index] = submitResponse(q, session.responses[index]!);
  session.responses[index]!.draft = 5;
  session.responses[index] = submitResponse(q, session.responses[index]!);
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  state.sessions.push(old, session);
  expect(parseBackup(exportBackup(state)).data).toEqual(state);
  const bad = structuredClone(state);
  Object.assign(bad.sessions[1]!.questions[index]!.visual!, { answer: [2, 5] });
  expect(isLibraryState(bad)).toBe(false);
});

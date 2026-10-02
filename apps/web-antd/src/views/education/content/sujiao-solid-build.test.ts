import { expect, it } from 'vitest';

import { exportBackup, isLibraryState, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoFinalShapesLesson as lesson } from './sujiao-final-shapes';
import { sujiaoBuildTasks } from './sujiao-solid-build';
it('distinguishes faces, whole works and zero sphere counts', () => {
  for (const review of [false, true]) {
    const tasks = sujiaoBuildTasks(review);
    const q = (suffix: string) =>
      tasks.find((q) => q.id.endsWith(`-build-${suffix}`))!;
    expect(tasks).toHaveLength(7);
    expect(evaluate(q('total').rule, 9)).toBe(true);
    expect(evaluate(q('total').rule, 10)).toBe(false);
    expect(evaluate(q('face').rule, 'many')).toBe(false);
    expect(evaluate(q('whole').rule, 'yes')).toBe(false);
    expect(evaluate(q('sphere').rule, review ? 0 : 1)).toBe(true);
  }
});
it('retains first wrong piece counts and original nine-part snapshots', () => {
  const state = initialLibrary('组合');
  const old = createSession(
    {
      ...lesson,
      version: 1,
      questions: lesson.questions.filter(
        (q) => !q.id.includes('-build-') && !q.id.endsWith('-manual-composite'),
      ),
    },
    'sujiao-math-p1-upper-2024',
    state.activeProfileId,
  );
  const session = createSession(
    lesson,
    'sujiao-math-p1-upper-2024',
    state.activeProfileId,
  );
  const index = session.questions.findIndex((q) =>
    q.id.endsWith('-q-build-cylinder'),
  );
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
  Object.assign(bad.sessions[1]!.questions[index]!.visual!, { depth: 2 });
  expect(isLibraryState(bad)).toBe(false);
});

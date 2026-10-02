import { expect, it } from 'vitest';

import { exportBackup, isLibraryState, parseBackup } from '../learning/backup';
import { isClockVisual } from '../learning/clock';
import { createSession, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoEverydayTimeLesson as lesson } from './sujiao-time';
it('connects whole/half hours to verified activities without elapsed-time claims', () => {
  expect(lesson.page).toBe(85);
  expect(lesson.review.notes).toContain('2025年7月第2次印刷');
  expect(lesson.questions.filter((q) => q.rule.kind !== 'manual')).toHaveLength(
    9,
  );
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    4,
  );
  expect(lesson.reviewQuestions).toHaveLength(9);
  for (const question of [...lesson.questions, ...lesson.reviewQuestions!])
    if (question.visual) expect(isClockVisual(question.visual)).toBe(true);
  expect(lesson.parentTip).toContain('不扩展到任意分钟');
  expect(lesson.questions.find((q) => q.id.endsWith('-context'))?.rule).toEqual(
    { kind: 'choice', value: 'no' },
  );
});
it('preserves first confusion, original clock snapshot and retry in backups', () => {
  const state = initialLibrary('测试');
  const session = createSession(
    lesson,
    'sujiao-math-p1-upper-2024',
    state.activeProfileId,
  );
  const index = session.questions.findIndex((q) => q.id.endsWith('-q-whole'));
  const q = session.questions[index]!;
  const response = session.responses[index]!;
  response.draft = 12;
  session.responses[index] = submitResponse(q, response);
  session.responses[index]!.draft = 8;
  session.responses[index] = submitResponse(q, session.responses[index]!);
  state.sessions.push(session);
  expect(session.responses[index]!.submissions.map((r) => r.correct)).toEqual([
    false,
    true,
  ]);
  expect(parseBackup(exportBackup(state)).data).toEqual(state);
  const broken = structuredClone(state);
  Object.assign(broken.sessions[0]!.questions[index]!.visual!, { minute: 15 });
  expect(isLibraryState(broken)).toBe(false);
});

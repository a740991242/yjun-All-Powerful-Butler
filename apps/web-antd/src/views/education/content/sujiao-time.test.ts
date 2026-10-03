import { expect, it } from 'vitest';

import { exportBackup, isLibraryState, parseBackup } from '../learning/backup';
import { isClockVisual } from '../learning/clock';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoEverydayTimeLesson as lesson } from './sujiao-time';
it('connects whole/half hours to verified activities without elapsed-time claims', () => {
  expect(lesson.page).toBe(85);
  expect(lesson.review.notes).toContain('2025年7月第2次印刷');
  expect(lesson.questions.filter((q) => q.rule.kind !== 'manual')).toHaveLength(
    14,
  );
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    5,
  );
  expect(lesson.reviewQuestions).toHaveLength(14);
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

it('covers all four source activities independently and changes review times without inventing school schedules', () => {
  const facts = [
    { hour: 8, minute: 0 },
    { hour: 8, minute: 30 },
    { hour: 9, minute: 0 },
    { hour: 12, minute: 0 },
  ];
  for (const [index, fact] of facts.entries()) {
    const knowledge = `sj-upper-everyday-time-activity-${index}`;
    const q = lesson.questions.find((q) => q.knowledge === knowledge)!;
    const r = lesson.reviewQuestions!.find((q) => q.knowledge === knowledge)!;
    expect(q.visual).toEqual({ kind: 'clock', ...fact });
    expect(r.visual).not.toEqual(q.visual);
    expect(q.prompt).toContain('不代表');
    expect(r.prompt).toContain('本站原创');
    const value = `${fact.hour}时${fact.minute ? '半' : ''}`;
    expect(evaluate(q.rule, value)).toBe(true);
    if (fact.minute) expect(evaluate(q.rule, '6时')).toBe(false);
    expect(evaluate(q.rule, '12时')).toBe(index === 3);
  }
  const order = lesson.questions.find((q) =>
    q.knowledge.endsWith('activity-order'),
  )!;
  expect(evaluate(order.rule, ['0', '1', '2', '3'])).toBe(true);
  expect(evaluate(order.rule, ['1', '0', '2', '3'])).toBe(false);
  const actual = lesson.questions.find((q) =>
    q.knowledge.endsWith('actual-source-four'),
  )!;
  expect(actual.rule).toEqual({ kind: 'manual' });
  expect(actual.prompt).toContain('四幅均处理');
  expect(lesson.parentTip).toContain('仅属原书示例');
});
it('preserves v1 clocks alongside v2 activities, partial sequence and first mistakes', () => {
  const state = initialLibrary('测试');
  const old = createSession(
    {
      ...lesson,
      version: 1,
      questions: lesson.questions.slice(0, 13),
      reviewQuestions: lesson.reviewQuestions!.slice(0, 9),
      steps: lesson.steps.slice(0, 4),
    },
    'sujiao-math-p1-upper-2024',
    state.activeProfileId,
    { seed: 1 },
  );
  const current = createSession(
    lesson,
    'sujiao-math-p1-upper-2024',
    state.activeProfileId,
    { seed: 2 },
  );
  const i = current.questions.findIndex((q) =>
    q.knowledge.endsWith('activity-1'),
  );
  current.responses[i] = submitResponse(current.questions[i]!, {
    ...current.responses[i]!,
    draft: '6时',
  });
  current.responses[i] = submitResponse(current.questions[i]!, {
    ...current.responses[i]!,
    draft: '8时半',
  });
  const order = current.questions.findIndex((q) =>
    q.knowledge.endsWith('activity-order'),
  );
  current.responses[order]!.draft = ['0', '1'];
  const actual = current.questions.findIndex((q) =>
    q.knowledge.endsWith('actual-source-four'),
  );
  expect(current.responses[actual]!.submissions).toEqual([]);
  current.responses[actual] = submitResponse(current.questions[actual]!, {
    ...current.responses[actual]!,
    draft: 'confirmed',
  });
  expect(current.responses[actual]!.submissions[0]!.correct).toBeNull();
  state.sessions.push(old, current);
  const restored = parseBackup(exportBackup(state)).data;
  expect(restored).toEqual(state);
  expect(restored.sessions[0]!.questions).toHaveLength(13);
  expect(restored.sessions[1]!.questions).toHaveLength(19);
  expect(current.responses[i]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
});

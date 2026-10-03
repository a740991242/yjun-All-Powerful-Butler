import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoFinalNumbersLesson as lesson } from './sujiao-final-numbers';
it('keeps ten in the chosen category but excludes it from strictly greater than ten', () => {
  for (const questions of [lesson.questions, lesson.reviewQuestions!]) {
    const category = questions.find((q) => q.id.endsWith('-category'))!;
    const strict = questions.find((q) => q.id.endsWith('-strict'))!;
    if (category.rule.kind !== 'set' || strict.rule.kind !== 'set')
      throw new Error('not multiple selection');
    expect(category.rule.values).toContain('10');
    expect(strict.rule.values).not.toContain('10');
    expect(evaluate(category.rule, strict.rule.values)).toBe(false);
    expect(evaluate(strict.rule, category.rule.values)).toBe(false);
    expect(evaluate(strict.rule, [...strict.rule.values].toReversed())).toBe(
      true,
    );
  }
  expect(lesson.parentTip).toContain('多种合理规则');
  expect(lesson.questions.filter((q) => q.rule.kind !== 'manual')).toHaveLength(
    13,
  );
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    8,
  );
});
it('restores partial composition and immutable first floor-count error after retry', () => {
  const state = initialLibrary('测试');
  const session = createSession(
    lesson,
    'sujiao-math-p1-upper-2024',
    state.activeProfileId,
  );
  const composition = session.questions.findIndex((q) =>
    q.id.endsWith('-q-composition'),
  );
  session.responses[composition]!.draft = [1, null];
  const floor = session.questions.findIndex((q) =>
    q.id.endsWith('-q-floor-change'),
  );
  const q = session.questions[floor]!;
  const response = session.responses[floor]!;
  response.draft = 6;
  session.responses[floor] = submitResponse(q, response);
  session.responses[floor]!.draft = 5;
  session.responses[floor] = submitResponse(q, session.responses[floor]!);
  expect(session.responses[floor]!.submissions.map((r) => r.correct)).toEqual([
    false,
    true,
  ]);
  state.sessions.push(session);
  const restored = parseBackup(exportBackup(state)).data.sessions[0]!;
  expect(restored).toEqual(session);
  expect(restored.responses[composition]!.draft).toEqual([1, null]);
  expect(restored.questions[composition]!.visual).toEqual({
    kind: 'place-value',
    value: 17,
  });
});
it('uses a new review order and treats arrangement, movement and reading as different tasks', () => {
  const main = lesson.questions.find((q) => q.id.endsWith('-q-order'))!;
  const review = lesson.reviewQuestions!.find((q) =>
    q.id.endsWith('-r-order'),
  )!;
  expect(main.rule).toEqual({
    kind: 'sequence',
    values: ['0', '5', '10', '13', '19'],
  });
  expect(review.rule).toEqual({
    kind: 'sequence',
    values: ['2', '8', '10', '16', '18'],
  });
  expect(evaluate(main.rule, ['5', '0', '10', '13', '19'])).toBe(false);
  expect(
    lesson.questions.find((q) => q.id.endsWith('-q-ten-ones'))?.rule,
  ).toEqual({ kind: 'steps', values: [10, 1] });
  expect(
    lesson.questions.find((q) => q.id.endsWith('-q-floor-order'))?.rule,
  ).toEqual({ kind: 'steps', values: [12, 17] });
  expect(
    lesson.questions.find((q) => q.id.endsWith('-manual-reflect'))?.rule.kind,
  ).toBe('manual');
});

it('counts descending gaps independently from endpoint labels and keeps all original-page groups manual', () => {
  const q = lesson.questions.find((q) => q.knowledge.endsWith('-floor-down'))!;
  const r = lesson.reviewQuestions!.find((q) =>
    q.knowledge.endsWith('-floor-down'),
  )!;
  expect(evaluate(q.rule, 6)).toBe(true);
  expect(evaluate(q.rule, 7)).toBe(false);
  expect(evaluate(q.rule, 20)).toBe(false);
  expect(evaluate(r.rule, 9)).toBe(true);
  expect(evaluate(r.rule, 10)).toBe(false);
  expect(q.prompt).toContain('本站原创');
  expect(r.prompt).not.toEqual(q.prompt);
  const actual = lesson.questions.filter((q) =>
    q.knowledge.includes('-actual-source-'),
  );
  expect(actual).toHaveLength(4);
  for (const q of actual) expect(q.rule).toEqual({ kind: 'manual' });
  expect(
    actual.find((q) => q.knowledge.endsWith('floor-directions'))!.prompt,
  ).toContain('三问均处理');
  expect(
    actual.find((q) => q.knowledge.endsWith('four-compositions'))!.prompt,
  ).toContain('所有空');
});
it('keeps old sixteen-task sessions, new source work, drafts and mistakes together in schema1 backups', () => {
  const state = initialLibrary('测试');
  const old = createSession(
    {
      ...lesson,
      version: 1,
      questions: lesson.questions.slice(0, 16),
      reviewQuestions: lesson.reviewQuestions!.slice(0, 12),
      steps: lesson.steps.slice(0, 5),
    },
    'sujiao-math-p1-upper-2024',
    state.activeProfileId,
    { seed: 1 },
  );
  const next = createSession(
    lesson,
    'sujiao-math-p1-upper-2024',
    state.activeProfileId,
    { seed: 2 },
  );
  const i = next.questions.findIndex((q) =>
    q.knowledge.endsWith('-floor-down'),
  );
  next.responses[i] = submitResponse(next.questions[i]!, {
    ...next.responses[i]!,
    draft: 7,
  });
  next.responses[i] = submitResponse(next.questions[i]!, {
    ...next.responses[i]!,
    draft: 6,
  });
  const actual = next.questions.findIndex((q) =>
    q.knowledge.endsWith('floor-directions'),
  );
  expect(next.responses[actual]!.submissions).toEqual([]);
  next.responses[actual] = submitResponse(next.questions[actual]!, {
    ...next.responses[actual]!,
    draft: 'confirmed',
  });
  expect(next.responses[actual]!.submissions[0]!.correct).toBeNull();
  next.responses[0]!.draft = ['13'];
  state.sessions.push(old, next);
  expect(parseBackup(exportBackup(state)).data).toEqual(state);
  expect(old.questions).toHaveLength(16);
  expect(next.questions).toHaveLength(21);
  expect(next.responses[i]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
});

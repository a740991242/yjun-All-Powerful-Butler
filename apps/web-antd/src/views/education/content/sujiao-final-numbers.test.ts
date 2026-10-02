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
    12,
  );
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    4,
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

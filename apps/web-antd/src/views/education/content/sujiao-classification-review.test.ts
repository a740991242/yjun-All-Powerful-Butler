import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoClassificationReviewDraft as lesson } from './sujiao-classification-review';
it('checks cross-context record corrections with independent expected values and changed review conditions', () => {
  expect(lesson.questions).toHaveLength(20);
  expect(lesson.reviewQuestions).toHaveLength(12);
  const find = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find((q) =>
      q.id.endsWith(`-${key}`),
    )!;
  expect(find('leaf-record').choices![0]!.label).toBe(
    '长条3片、扇形2片、分裂叶形3片',
  );
  expect(find('leaf-record', true).choices![0]!.label).toBe(
    '长条2片、扇形4片、分裂叶形2片',
  );
  expect(find('cup-record').choices![0]!.label).toBe(
    '红色3只、蓝色3只、黄色2只',
  );
  expect(find('cup-record', true).choices![0]!.label).toBe(
    '红色2只、蓝色2只、黄色4只',
  );
  expect(find('activity-missing').rule).toEqual({ kind: 'number', value: 4 });
  expect(find('activity-missing', true).rule).toEqual({
    kind: 'number',
    value: 3,
  });
  expect(find('pool-range').rule).toEqual({ kind: 'number', value: 4 });
  expect(find('pool-range', true).rule).toEqual({ kind: 'number', value: 3 });
  expect(find('month-unknown').rule).toEqual({ kind: 'number', value: 2 });
  expect(find('month-unknown', true).rule).toEqual({
    kind: 'number',
    value: 0,
  });
  expect(find('same-symbol').rule).toEqual({ kind: 'number', value: 3 });
  expect(find('same-symbol', true).rule).toEqual({ kind: 'number', value: 4 });
  for (const q of lesson.reviewQuestions!) {
    const original = lesson.questions.find((o) => o.knowledge === q.knowledge)!;
    expect(original).toBeDefined();
    expect(JSON.stringify([q.prompt, q.visual, q.choices])).not.toBe(
      JSON.stringify([original.prompt, original.visual, original.choices]),
    );
  }
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    6,
  );
  expect(
    lesson.questions.filter((q) => q.rule.kind === 'reflection'),
  ).toHaveLength(2);
});
it('preserves incorrect-record correction and all authored figures through backups without grading physical or open work', () => {
  const library = initialLibrary('分类整理');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const index = session.questions.findIndex((q) =>
    q.id.endsWith('-q-leaf-record'),
  );
  expect(evaluate(session.questions[index]!.rule, 'missing')).toBe(false);
  for (const draft of ['missing', 'good']) {
    session.responses[index]!.draft = draft;
    session.responses[index] = submitResponse(
      session.questions[index]!,
      session.responses[index]!,
    );
  }
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
  const reflection = session.questions.findIndex(
    (q) => q.rule.kind === 'reflection',
  );
  session.responses[reflection]!.draft =
    '我还没有实际做植物涂色，准备先按植物和动物核对。';
  session.responses[reflection] = submitResponse(
    session.questions[reflection]!,
    session.responses[reflection]!,
  );
  expect(session.responses[reflection]!.submissions[0]!.correct).toBeNull();
  expect(
    session.responses
      .filter((_, i) => session.questions[i]!.rule.kind === 'manual')
      .every((r) => r.submissions.length === 0),
  ).toBe(true);
});

import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoQuantityApplicationsDraft as lesson } from './sujiao-quantity-applications';
it('checks independent whole-bar, total, difference, part, same-context and common-reference answers', () => {
  const main: Answer[] = [
    39,
    22,
    'B-total',
    46,
    6,
    10,
    6,
    8,
    14,
    [54, 23],
    'yellow',
    7,
  ];
  const review: Answer[] = [
    49,
    29,
    'B-total',
    68,
    8,
    18,
    9,
    9,
    18,
    [58, 34],
    'yellow',
    8,
  ];
  expect(lesson.questions).toHaveLength(21);
  expect(lesson.reviewQuestions).toHaveLength(12);
  lesson.questions
    .slice(0, 12)
    .forEach((q, i) => expect(evaluate(q.rule, main[i]!)).toBe(true));
  lesson.reviewQuestions!.forEach((q, i) => {
    expect(evaluate(q.rule, review[i]!)).toBe(true);
    expect(q.prompt).not.toBe(lesson.questions[i]!.prompt);
    expect(q.knowledge).toBe(lesson.questions[i]!.knowledge);
  });
  expect(evaluate(lesson.questions[0]!.rule, 7)).toBe(false);
  expect(evaluate(lesson.questions[2]!.rule, 'difference')).toBe(false);
  expect(evaluate(lesson.questions[5]!.rule, 30)).toBe(false);
  expect(evaluate(lesson.questions[9]!.rule, [54, 47])).toBe(false);
  expect(evaluate(lesson.questions[10]!.rule, 'red')).toBe(false);
});
it('retains difference-for-total and changed-base mistakes, partial answers and open question text', () => {
  const library = initialLibrary('同情境');
  const s = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  library.sessions.push(s);
  const i = s.questions.findIndex((q) => q.id.endsWith('-q-bar-more'));
  for (const draft of [7, 39]) {
    s.responses[i]!.draft = draft;
    s.responses[i] = submitResponse(s.questions[i]!, s.responses[i]!);
  }
  expect(s.responses[i]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  const parts = s.questions.findIndex((q) =>
    q.id.endsWith('-q-shared-reference'),
  );
  s.responses[parts]!.draft = [54, null];
  expect(
    parseBackup(exportBackup(library)).data.sessions[0]!.responses[parts]!
      .draft,
  ).toEqual([54, null]);
  for (const draft of [
    [54, 47],
    [54, 23],
  ]) {
    s.responses[parts]!.draft = draft;
    s.responses[parts] = submitResponse(
      s.questions[parts]!,
      s.responses[parts]!,
    );
  }
  expect(s.responses[parts]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  const open = s.questions.findIndex((q) => q.id.endsWith('-own-question'));
  s.responses[open]!.draft = '我问绘画与书法相差几幅，用26减20。';
  s.responses[open] = submitResponse(s.questions[open]!, s.responses[open]!);
  expect(s.responses[open]!.submissions[0]!.correct).toBeNull();
  expect(
    s.responses
      .filter((_, j) => s.questions[j]!.rule.kind === 'manual')
      .every((r) => r.submissions.length === 0),
  ).toBe(true);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(s);
});

it('keeps old snapshots and separately records three evaluations without confirming actual question-making', () => {
  expect(lesson.version).toBe(2);
  const manual = lesson.questions.find((q) => q.id.endsWith('-manual-3'))!;
  expect(manual.rule.kind).toBe('manual');
  const evaluations = lesson.questions.filter((q) =>
    q.id.includes('-evaluation-'),
  );
  expect(evaluations.map((q) => q.id.split('-evaluation-')[1])).toEqual([
    'understanding',
    'application',
    'representation',
  ]);
  const library = initialLibrary('过程评价');
  const oldLesson = {
    ...lesson,
    version: 1,
    questions: lesson.questions.filter(
      (q) => q.id !== manual.id && !q.id.includes('-evaluation-'),
    ),
  };
  const old = createSession(
    oldLesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const current = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  library.sessions.push(old, current);
  for (const q of evaluations) {
    expect(q.rule.kind).toBe('reflection');
    const i = current.questions.findIndex((item) => item.id === q.id);
    current.responses[i]!.draft = '还没有实际摆图和交流，下次准备先读关系。';
    current.responses[i] = submitResponse(
      current.questions[i]!,
      current.responses[i]!,
    );
    expect(current.responses[i]!.submissions[0]!.correct).toBeNull();
  }
  expect(
    current.responses[current.questions.findIndex((q) => q.id === manual.id)]!
      .submissions,
  ).toHaveLength(0);
  const restored = parseBackup(exportBackup(library)).data.sessions;
  expect(restored[0]).toEqual(old);
  expect(restored[0]!.questions).toHaveLength(17);
  expect(restored[1]).toEqual(current);
  expect(restored[1]!.questions).toHaveLength(21);
});

import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoFinalParadeDraft as lesson } from './sujiao-final-parade';
import { sujiaoLowerLessons } from './sujiao-lower';
it('keeps the distance premise aligned with changed review labels without rewriting version-one snapshots', () => {
  const published = sujiaoLowerLessons.find((item) => item.id === lesson.id)!;
  expect(published.version).toBe(2);
  const main = published.questions.find((q) =>
    q.knowledge.endsWith('-distance-only'),
  )!;
  const review = published.reviewQuestions!.find((q) =>
    q.knowledge.endsWith('-distance-only'),
  )!;
  expect(main.prompt).toBe(
    '主图一直向右行驶。B、C都离P较远，只凭距离远就能断定哪张最早吗？',
  );
  expect(review.prompt).toBe(
    '新图一直向左行驶。A、C都离P较远，只凭距离远就能断定哪张最早吗？',
  );
  expect(evaluate(review.rule, 'yes')).toBe(false);
  expect(evaluate(review.rule, 'no')).toBe(true);
  const state = initialLibrary('历史花车');
  const old = structuredClone(published);
  old.version = 1;
  old.reviewQuestions!.find((q) => q.id === review.id)!.prompt =
    '新图一直向左行驶。B、C都离P较远，只凭距离远就能断定哪张最早吗？';
  const historical = createSession(
    old,
    'sujiao-math-p1-lower-9787574312951',
    state.activeProfileId,
    { mode: 'review', questions: old.reviewQuestions! },
  );
  const current = createSession(
    published,
    historical.bookId,
    state.activeProfileId,
    { mode: 'review', questions: published.reviewQuestions! },
  );
  state.sessions.push(historical, current);
  const restored = parseBackup(exportBackup(state)).data.sessions;
  expect(restored).toEqual([historical, current]);
  expect(restored[0]!.lessonVersion).toBe(1);
  expect(restored[1]!.lessonVersion).toBe(2);
  expect(
    restored[0]!.questions.find((q) => q.id === review.id)!.prompt,
  ).toContain('B、C都');
  expect(
    restored[1]!.questions.find((q) => q.id === review.id)!.prompt,
  ).toContain('A、C都');
});
it('changes direction and labels under review without predicting speed or confirming actual source observation', () => {
  const main: Answer[] = [
    'BAC',
    'B',
    'C',
    'A',
    'no',
    'no',
    'no',
    'no',
    1,
    'no',
  ];
  const review: Answer[] = [
    'CBA',
    'C',
    'A',
    'B',
    'no',
    'no',
    'no',
    'no',
    1,
    'no',
  ];
  expect(lesson.questions).toHaveLength(17);
  expect(lesson.reviewQuestions).toHaveLength(10);
  lesson.questions
    .slice(0, 10)
    .forEach((q, i) => expect(evaluate(q.rule, main[i]!)).toBe(true));
  lesson.reviewQuestions!.forEach((q, i) => {
    expect(evaluate(q.rule, review[i]!)).toBe(true);
    expect(q.knowledge).toBe(lesson.questions[i]!.knowledge);
    if (i < 4) expect(evaluate(q.rule, main[i]!)).toBe(false);
  });
  expect(evaluate(lesson.questions[0]!.rule, 'ABC')).toBe(false);
  expect(evaluate(lesson.questions[8]!.rule, 3)).toBe(false);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    4,
  );
});
it('round-trips true float diagrams, wrong history and plans without checking off manual source or simulation tasks', () => {
  const lib = initialLibrary('花车');
  const s = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    lib.activeProfileId,
  );
  const i = s.questions.findIndex((q) => q.knowledge.endsWith('-order'));
  for (const answer of ['ABC', 'BAC']) {
    s.responses[i]!.draft = answer;
    s.responses[i] = submitResponse(s.questions[i]!, s.responses[i]!);
  }
  expect(s.responses[i]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  for (const q of s.questions.filter((q) => q.rule.kind === 'reflection')) {
    const k = s.questions.findIndex((item) => item.id === q.id);
    s.responses[k]!.draft = '原图暂未看，实际模拟还没做，计划下一步核对。';
    s.responses[k] = submitResponse(q, s.responses[k]!);
    expect(s.responses[k]!.submissions[0]!.correct).toBeNull();
  }
  expect(
    s.responses.every(
      (r, k) =>
        s.questions[k]!.rule.kind !== 'manual' || r.submissions.length === 0,
    ),
  ).toBe(true);
  lib.sessions.push(s);
  expect(parseBackup(exportBackup(lib)).data.sessions[0]).toEqual(s);
  const bad = JSON.parse(exportBackup(lib));
  bad.data.sessions[0].questions[i].visual.answer = 'BAC';
  expect(() => parseBackup(JSON.stringify(bad))).toThrow(
    'educationLearning.invalidBackup',
  );
});

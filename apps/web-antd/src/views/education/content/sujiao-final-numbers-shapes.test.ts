import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoFinalNumbersShapesDraft as lesson } from './sujiao-final-numbers-shapes';
it('lists all strict interval integers, every composition, five names and changed assembly conditions', () => {
  const main: Answer[] = [
    [71, 72, 73, 74, 75, 76, 77, 78, 79],
    ...Array.from({ length: 9 }, (_, i) => [7, i + 1]),
    'square',
    'triangle',
    'circle',
    'rectangle',
    'parallelogram',
    'rectangle',
    'rectangle',
    'square',
    'good',
    'good',
    'good',
  ];
  const review: Answer[] = [
    [51, 52, 53, 54, 55, 56, 57, 58, 59],
    ...Array.from({ length: 9 }, (_, i) => [5, i + 1]),
    'parallelogram',
    'circle',
    'square',
    'triangle',
    'rectangle',
    'rectangle',
    'square',
    'triangle',
    'good',
    'good',
    'good',
  ];
  expect(lesson.questions).toHaveLength(30);
  expect(lesson.reviewQuestions).toHaveLength(21);
  lesson.questions
    .slice(0, 21)
    .forEach((q, i) => expect(evaluate(q.rule, main[i]!)).toBe(true));
  lesson.reviewQuestions!.forEach((q, i) => {
    expect(evaluate(q.rule, review[i]!)).toBe(true);
    expect(q.knowledge).toBe(lesson.questions[i]!.knowledge);
  });
  expect(
    evaluate(lesson.questions[0]!.rule, [70, 71, 72, 73, 74, 75, 76, 77, 78]),
  ).toBe(false);
  expect(evaluate(lesson.questions[1]!.rule, [71, 1])).toBe(false);
  for (const i of [0, 1, 10, 16, 17])
    expect(evaluate(lesson.reviewQuestions![i]!.rule, main[i]!)).toBe(false);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    6,
  );
});
it('preserves nine-value drafts, wrong history, actual task independence and unscored records through strict backups', () => {
  const library = initialLibrary('数与形');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const i = session.questions.findIndex((q) =>
    q.knowledge.endsWith('-all-between'),
  );
  for (const answer of [
    [70, 71, 72, 73, 74, 75, 76, 77, 78],
    [71, 72, 73, 74, 75, 76, 77, 78, 79],
  ]) {
    session.responses[i]!.draft = answer;
    session.responses[i] = submitResponse(
      session.questions[i]!,
      session.responses[i]!,
    );
  }
  expect(session.responses[i]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  const j = session.questions.findIndex((q) =>
    q.knowledge.endsWith('-composition-8'),
  );
  session.responses[j]!.draft = [7, null];
  for (const q of session.questions.filter(
    (q) => q.rule.kind === 'reflection',
  )) {
    const k = session.questions.findIndex((item) => item.id === q.id);
    session.responses[k]!.draft = '实际还未剪拼，打算之后做。';
    session.responses[k] = submitResponse(q, session.responses[k]!);
    expect(session.responses[k]!.submissions[0]!.correct).toBeNull();
  }
  expect(
    session.responses.every(
      (r, k) =>
        session.questions[k]!.rule.kind !== 'manual' ||
        r.submissions.length === 0,
    ),
  ).toBe(true);
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
  const bad = JSON.parse(exportBackup(library));
  const join = session.questions.findIndex((q) =>
    q.knowledge.endsWith('-join-1'),
  );
  bad.data.sessions[0].questions[join].visual.answer = 'rectangle';
  expect(() => parseBackup(JSON.stringify(bad))).toThrow(
    'educationLearning.invalidBackup',
  );
});

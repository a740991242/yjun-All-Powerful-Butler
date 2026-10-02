import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoFinalEmbeddedDraft as lesson } from './sujiao-final-embedded';
it('separates three counts from six selected contours and rechecks changed figures rather than retaining old answers', () => {
  const main: Answer[] = [
    10,
    6,
    12,
    'square',
    'square',
    'rectangle',
    'triangle',
    'triangle',
    'parallelogram',
    'good',
    'good',
    'good',
  ];
  const review: Answer[] = [
    8,
    12,
    14,
    'rectangle',
    'triangle',
    'square',
    'parallelogram',
    'triangle',
    'rectangle',
    'good',
    'good',
    'good',
  ];
  expect(lesson.questions).toHaveLength(19);
  expect(lesson.reviewQuestions).toHaveLength(12);
  lesson.questions
    .slice(0, 12)
    .forEach((q, i) => expect(evaluate(q.rule, main[i]!)).toBe(true));
  lesson.reviewQuestions!.forEach((q, i) => {
    expect(evaluate(q.rule, review[i]!)).toBe(true);
    expect(q.knowledge).toBe(lesson.questions[i]!.knowledge);
  });
  for (const i of [0, 1, 2, 3, 4, 5, 6, 8])
    expect(evaluate(lesson.reviewQuestions![i]!.rule, main[i]!)).toBe(false);
  expect(evaluate(lesson.questions[1]!.rule, 3)).toBe(false);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    4,
  );
});
it('backs up contour diagrams and honest unperformed work while retaining wrong count history', () => {
  const lib = initialLibrary('找图形');
  const s = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    lib.activeProfileId,
  );
  const i = s.questions.findIndex((q) => q.knowledge.endsWith('-count-0'));
  for (const answer of [5, 10]) {
    s.responses[i]!.draft = answer;
    s.responses[i] = submitResponse(s.questions[i]!, s.responses[i]!);
  }
  expect(s.responses[i]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  for (const q of s.questions.filter((q) => q.rule.kind === 'reflection')) {
    const k = s.questions.findIndex((item) => item.id === q.id);
    s.responses[k]!.draft = '实际描画和原图还没做，计划以后核对。';
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
  bad.data.sessions[0].questions[i].visual.answer = 10;
  expect(() => parseBackup(JSON.stringify(bad))).toThrow(
    'educationLearning.invalidBackup',
  );
});

import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoFinalFourShapesDraft as lesson } from './sujiao-final-four-shapes';
it('keeps four targets, true curves, missing material, seams and simultaneous-piece counts distinct under changed review data', () => {
  const main: Answer[] = [
    'square',
    'rectangle',
    'parallelogram',
    'circle',
    2,
    4,
    0,
    ['G', 'H', 'I', 'J'],
    10,
    'good',
    'good',
    'good',
  ];
  const review: Answer[] = [
    'square',
    'rectangle',
    'parallelogram',
    'gap',
    1,
    3,
    2,
    ['B', 'D', 'H', 'J'],
    10,
    'good',
    'good',
    'good',
  ];
  expect(lesson.questions).toHaveLength(20);
  expect(lesson.reviewQuestions).toHaveLength(12);
  lesson.questions
    .slice(0, 12)
    .forEach((q, i) => expect(evaluate(q.rule, main[i]!)).toBe(true));
  lesson.reviewQuestions!.forEach((q, i) => {
    expect(evaluate(q.rule, review[i]!)).toBe(true);
    expect(q.knowledge).toBe(lesson.questions[i]!.knowledge);
  });
  for (const i of [3, 4, 5, 6, 7])
    expect(evaluate(lesson.reviewQuestions![i]!.rule, main[i]!)).toBe(false);
  expect(evaluate(lesson.questions[2]!.rule, 'triangle')).toBe(false);
  expect(evaluate(lesson.questions[8]!.rule, 8)).toBe(false);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    5,
  );
});
it('round-trips curved diagrams, wrong attempts and unscored planned-work records without confirming real assemblies', () => {
  const library = initialLibrary('选四种图形');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const i = session.questions.findIndex((q) =>
    q.knowledge.endsWith('-circle-complete'),
  );
  for (const answer of ['gap', 'circle']) {
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
    q.knowledge.endsWith('-select-curved'),
  );
  session.responses[j]!.draft = ['G', 'H'];
  for (const q of session.questions.filter(
    (q) => q.rule.kind === 'reflection',
  )) {
    const k = session.questions.findIndex((item) => item.id === q.id);
    session.responses[k]!.draft = '还未准备真实曲边材料，想下次实际拼。';
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
  bad.data.sessions[0].questions[i].visual.answer = 'circle';
  expect(() => parseBackup(JSON.stringify(bad))).toThrow(
    'educationLearning.invalidBackup',
  );
});

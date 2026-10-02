import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import {
  finalSortingCards,
  sujiaoFinalClassificationReviewDraft as lesson,
} from './sujiao-final-classification-review';

it('changes original card categories and proportions in review, keeping criteria, counts and total distinct', () => {
  expect(lesson.questions).toHaveLength(24);
  expect(lesson.reviewQuestions).toHaveLength(12);
  const main = [
    ['A', 'D'],
    ['B', 'E'],
    ['C', 'F'],
    ['C', 'E', 'F'],
    ['A', 'B', 'E', 'F'],
    ['A', 'C', 'F'],
    2,
    2,
    2,
    4,
    'good',
    'good',
  ];
  const review = [
    ['B'],
    ['A', 'D', 'E'],
    ['C', 'F'],
    ['A', 'C', 'E', 'F'],
    ['B', 'C', 'E'],
    ['B', 'D'],
    1,
    3,
    2,
    3,
    'good',
    'good',
  ];
  lesson.questions
    .slice(0, 12)
    .forEach((q, i) => expect(evaluate(q.rule, main[i]!)).toBe(true));
  lesson.reviewQuestions!.forEach((q, i) => {
    expect(evaluate(q.rule, review[i]!)).toBe(true);
    expect(q.knowledge).toBe(lesson.questions[i]!.knowledge);
  });
  expect(evaluate(lesson.questions[0]!.rule, ['A'])).toBe(false);
  expect(evaluate(lesson.questions[4]!.rule, ['A', 'C', 'F'])).toBe(false);
  expect(evaluate(lesson.reviewQuestions![0]!.rule, ['A', 'D'])).toBe(false);
  expect(evaluate(lesson.reviewQuestions![6]!.rule, 2)).toBe(false);
  for (const changed of [false, true]) {
    const cards = finalSortingCards(changed);
    expect(new Set(cards.signs.map((c) => c.id)).size).toBe(6);
    expect(new Set(cards.clothes.map((c) => c.id)).size).toBe(6);
    expect(
      cards.clothes.filter((c) => c.upper).length +
        cards.clothes.filter((c) => !c.upper).length,
    ).toBe(6);
  }
});
it('keeps all seven independent evaluations plus strengths and questions unscored through backups, without confirming planned work', () => {
  const library = initialLibrary('期末回顾');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const index = session.questions.findIndex((q) =>
    q.knowledge.endsWith('-sign-triangle'),
  );
  for (const answer of [['A'], ['A', 'D']]) {
    session.responses[index]!.draft = answer;
    session.responses[index] = submitResponse(
      session.questions[index]!,
      session.responses[index]!,
    );
  }
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  const evaluations = session.questions.filter(
    (q) => q.rule.kind === 'reflection',
  );
  expect(evaluations).toHaveLength(9);
  for (const q of evaluations) {
    const i = session.questions.findIndex((item) => item.id === q.id);
    session.responses[i]!.draft =
      `${q.knowledge}：未实际做，想下次请教，这是计划。`;
    session.responses[i] = submitResponse(q, session.responses[i]!);
    expect(session.responses[i]!.submissions[0]!.correct).toBeNull();
  }
  expect(
    session.questions.filter((q) => q.rule.kind === 'manual'),
  ).toHaveLength(3);
  expect(
    session.responses.every(
      (r, i) =>
        session.questions[i]!.rule.kind !== 'manual' ||
        r.submissions.length === 0,
    ),
  ).toBe(true);
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
});

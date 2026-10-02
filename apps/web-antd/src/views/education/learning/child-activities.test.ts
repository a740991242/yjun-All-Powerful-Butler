import { expect, it } from 'vitest';

import { sujiaoChildActivitiesDraft as lesson } from '../content/sujiao-child-activities';
import { exportBackup, parseBackup } from './backup';
import {
  activityChildren,
  childActivitiesModel,
  isChildActivitiesVisual,
} from './child-activities';
import { createSession, evaluate, submitResponse } from './engine';
import { initialLibrary } from './storage';
it('limits original fixed variants without allowing arbitrary children or answer fields', () => {
  for (const review of [false, true])
    expect(isChildActivitiesVisual(childActivitiesModel(review))).toBe(true);
  for (const value of [
    null,
    [],
    { kind: 'child-activities', variant: ['main'] },
    { kind: 'child-activities', variant: 'unknown' },
    { ...childActivitiesModel(false), answer: 12 },
    { ...childActivitiesModel(false), children: activityChildren(false) },
  ])
    expect(isChildActivitiesVisual(value)).toBe(false);
});
it('separates actual activity from shirt colour and changes actual distribution and selected positions in review', () => {
  const main = activityChildren(false);
  const review = activityChildren(true);
  expect(main.filter((c) => c.activity === 'run').map((c) => c.id)).toEqual([
    'A',
    'E',
    'H',
    'L',
  ]);
  expect(review.filter((c) => c.activity === 'run').map((c) => c.id)).toEqual([
    'C',
    'F',
    'J',
  ]);
  expect(
    ['run', 'football', 'rope', 'hoop'].map(
      (activity) => main.filter((c) => c.activity === activity).length,
    ),
  ).toEqual([4, 3, 3, 2]);
  expect(
    ['run', 'football', 'rope', 'hoop'].map(
      (activity) => review.filter((c) => c.activity === activity).length,
    ),
  ).toEqual([3, 2, 4, 3]);
  expect(
    ['red', 'blue', 'green'].map(
      (color) => main.filter((c) => c.color === color).length,
    ),
  ).toEqual([5, 4, 3]);
  expect(
    ['red', 'blue', 'green'].map(
      (color) => review.filter((c) => c.color === color).length,
    ),
  ).toEqual([3, 3, 6]);
  expect(
    lesson.questions.find((q) => q.id.endsWith('-q-activity-most'))!.rule,
  ).toEqual({ kind: 'set', values: ['run'] });
  expect(
    lesson.reviewQuestions!.find((q) => q.id.endsWith('-r-activity-most'))!
      .rule,
  ).toEqual({ kind: 'set', values: ['rope'] });
  const selected = lesson.questions.find((q) =>
    q.id.endsWith('-q-activity-run-select'),
  )!;
  expect(evaluate(selected.rule, ['A'])).toBe(false);
  expect(evaluate(selected.rule, ['A', 'E', 'H', 'L', 'B'])).toBe(false);
  expect(lesson.questions).toHaveLength(25);
  expect(lesson.reviewQuestions).toHaveLength(20);
  for (const q of lesson.reviewQuestions!) {
    const main = lesson.questions.find((o) => o.knowledge === q.knowledge)!;
    expect(main).toBeDefined();
    expect(JSON.stringify([q.prompt, q.visual, q.choices])).not.toBe(
      JSON.stringify([main.prompt, main.visual, main.choices]),
    );
  }
});
it('preserves missing-member errors before correction and strict original activity figures in backups', () => {
  const library = initialLibrary('儿童活动分类');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const index = session.questions.findIndex((q) =>
    q.id.endsWith('-q-activity-run-select'),
  );
  for (const draft of [['A'], ['A', 'E', 'H', 'L']]) {
    session.responses[index]!.draft = draft;
    session.responses[index] = submitResponse(
      session.questions[index]!,
      session.responses[index]!,
    );
  }
  expect(session.responses[index]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
  const bad = structuredClone(library);
  const q = bad.sessions[0]!.questions.find(
    (q) => q.visual?.kind === 'child-activities',
  )!;
  if (q.visual?.kind !== 'child-activities')
    throw new Error('missing children');
  Object.assign(q.visual, { answer: 12 });
  expect(() => parseBackup(exportBackup(bad))).toThrow(Error);
});

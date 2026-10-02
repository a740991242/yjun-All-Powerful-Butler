import { expect, it } from 'vitest';

import {
  animalCards,
  classificationModel,
  sujiaoClassificationDraft as lesson,
} from '../content/sujiao-classification';
import { exportBackup, parseBackup } from './backup';
import { isClassificationRecordVisual } from './classification-record';
import { createSession, evaluate, submitResponse } from './engine';
import { fold } from './fold';
import { sparseArray } from './sparse-array';
import { initialLibrary } from './storage';
it('bounds complete labelled one-to-one records and rejects duplicate groups, sparse rows and extra answer fields', () => {
  const visual = classificationModel('fly', false);
  expect(isClassificationRecordVisual(visual)).toBe(true);
  expect(
    isClassificationRecordVisual({
      ...visual,
      rows: [
        { label: '有', mark: 'square', count: 4 },
        { label: '无', mark: 'square', count: 0 },
      ],
    }),
  ).toBe(true);
  for (const rows of [
    [],
    sparseArray(2),
    [
      { label: 'A', mark: 'circle', count: 1 },
      { label: 'A', mark: 'triangle', count: 2 },
    ],
    [
      { label: 'A', mark: 'circle', count: 0 },
      { label: 'B', mark: 'triangle', count: 0 },
    ],
    [
      { label: 'A', mark: 'circle', count: 20 },
      { label: 'B', mark: 'triangle', count: 20 },
    ],
    [
      { label: 'A', mark: 'circle', count: 1.5 },
      { label: 'B', mark: 'triangle', count: 2 },
    ],
    [
      { label: '', mark: 'circle', count: 1 },
      { label: 'B', mark: 'triangle', count: 2 },
    ],
    [
      { label: 'A', mark: 'star', count: 1 },
      { label: 'B', mark: 'triangle', count: 2 },
    ],
  ])
    expect(isClassificationRecordVisual({ ...visual, rows })).toBe(false);
  expect(isClassificationRecordVisual({ ...visual, answer: 6 })).toBe(false);
});
it('changes actual grouping, counts and ratios between criteria and review without changing total when only the criterion changes', () => {
  expect(classificationModel('fly', false).rows.map((r) => r.count)).toEqual([
    3, 3,
  ]);
  expect(classificationModel('water', false).rows.map((r) => r.count)).toEqual([
    2, 4,
  ]);
  expect(classificationModel('fly', true).rows.map((r) => r.count)).toEqual([
    2, 5,
  ]);
  expect(classificationModel('water', true).rows.map((r) => r.count)).toEqual([
    3, 4,
  ]);
  expect(
    classificationModel('fly', false, true).rows.map((r) => r.mark),
  ).toEqual(['circle', 'circle']);
  for (const review of [false, true])
    for (const criterion of ['fly', 'water'] as const) {
      const v = classificationModel(criterion, review);
      expect(isClassificationRecordVisual(v)).toBe(true);
      expect(fold(v.rows, 0, (n, r) => n + r.count)).toBe(
        animalCards(review).length,
      );
    }
  expect(lesson.questions).toHaveLength(24);
  expect(lesson.reviewQuestions).toHaveLength(20);
  for (const review of lesson.reviewQuestions!) {
    const original = lesson.questions.find(
      (q) => q.knowledge === review.knowledge,
    )!;
    if (review.visual) expect(review.visual).not.toEqual(original.visual);
    else
      expect(
        review.prompt !== original.prompt ||
          JSON.stringify(review.choices) !== JSON.stringify(original.choices),
      ).toBe(true);
  }
});
it('preserves missing-member errors before correction and strict symbol records through backups', () => {
  const library = initialLibrary('分类');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const index = session.questions.findIndex((q) =>
    q.id.endsWith('-fly-select'),
  );
  expect(evaluate(session.questions[index]!.rule, ['A'])).toBe(false);
  for (const answer of [['A'], ['A', 'D', 'F']]) {
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
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
  const bad = structuredClone(library);
  const count = bad.sessions[0]!.questions.find(
    (q) => q.visual?.kind === 'classification-record',
  )!;
  if (count.visual?.kind !== 'classification-record')
    throw new Error('missing record');
  count.visual.rows[0]!.count = -1;
  expect(() => parseBackup(exportBackup(bad))).toThrow(Error);
});

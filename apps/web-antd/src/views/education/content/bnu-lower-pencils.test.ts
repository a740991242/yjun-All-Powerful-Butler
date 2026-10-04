import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { bnuLowerAncientCountLesson } from './bnu-lower';
import { bnuLowerPencilsLesson as lesson } from './bnu-lower-pencils';
import { bnuLowerPencilsAudit as audit } from './bnu-lower-pencils-audit';

it('checks all source quantities and four distinct methods against independent answers', () => {
  const answers = [
    12,
    7,
    15,
    9,
    5,
    [11, 10, 9, 8, 7, 6, 5],
    [2, 3, 5],
    [2, 5, 10, 5],
    [5, 5],
    '原有12',
    '12支与7支',
    6,
    [5, 4, 10, 6],
    [5, 1, 6],
    6,
    8,
    8,
    8,
    11,
    [5, 2, 8],
    14,
    5,
    9,
    8,
    17,
    '剩余9个',
  ];
  const objective = lesson.questions.filter(
    (q) => !['manual', 'reflection'].includes(q.rule.kind),
  );
  expect(objective).toHaveLength(26);
  for (const [index, q] of objective.entries()) {
    expect(evaluate(q.rule, required(answers[index])), q.id).toBe(true);
    if (q.rule.kind === 'choice')
      for (const c of required(q.choices).filter(
        (c) => c.id !== answers[index],
      ))
        expect(evaluate(q.rule, c.id), q.id).toBe(false);
  }
  const find = (suffix: string) =>
    required(lesson.questions.find((q) => q.id.endsWith(suffix)));
  expect(evaluate(find('-break-ten').rule, [2, 5, 5])).toBe(false);
  expect(evaluate(find('-subtract-parts').rule, [10, 2, 10, 5])).toBe(false);
  expect(evaluate(find('-one-by-one').rule, [12, 11, 10, 9, 8, 7, 6])).toBe(
    false,
  );
  expect(evaluate(find('-pine-eaten').rule, 9)).toBe(false);
  expect(lesson.steps).toHaveLength(9);
  expect(lesson.questions).toHaveLength(39);
});
it('changes the underlying quantities for five reviews and preserves all original practical tasks', () => {
  const answers = [5, [3, 2, 5], [3, 5, 10, 5], [5, 5], 9];
  const review = required(lesson.reviewQuestions);
  expect(review).toHaveLength(5);
  for (const [i, q] of review.entries())
    expect(evaluate(q.rule, required(answers[i])), q.id).toBe(true);
  expect(evaluate(required(review[1]).rule, [2, 3, 5])).toBe(false);
  expect(evaluate(required(review[2]).rule, [2, 5, 10, 5])).toBe(false);
  expect(evaluate(required(review[4]).rule, 8)).toBe(false);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    11,
  );
  const records = lesson.questions.filter((q) => q.rule.kind === 'reflection');
  expect(records).toHaveLength(2);
  for (const q of records)
    expect(evaluate(q.rule, '尚未摆棒，准备再试')).toBeNull();
  expect(lesson.steps[7]?.text).toContain('14−5=9');
  expect(lesson.steps[8]?.text).toContain('17−9=8');
});
it('retains seven-position partial answers and a misconception retry without rewriting old history or confirming real work', () => {
  const library = initialLibrary('减法');
  const old = createSession(
    bnuLowerAncientCountLesson,
    'bnu-math-p1-lower-2024',
    library.activeProfileId,
  );
  const session = createSession(
    lesson,
    'bnu-math-p1-lower-2024',
    library.activeProfileId,
  );
  session.phase = 'practice';
  library.sessions = [old, session];
  const index = session.questions.findIndex(
    (q) => q.id === 'bnu-lower-buy-pencils-one-by-one',
  );
  required(session.responses[index]).draft = [
    11,
    null,
    null,
    null,
    null,
    null,
    null,
  ];
  expect(parseBackup(exportBackup(library)).data.sessions).toEqual(
    library.sessions,
  );
  required(session.responses[index]).draft = [12, 11, 10, 9, 8, 7, 6];
  session.responses[index] = submitResponse(
    required(session.questions[index]),
    required(session.responses[index]),
  );
  required(session.responses[index]).draft = [11, 10, 9, 8, 7, 6, 5];
  session.responses[index] = submitResponse(
    required(session.questions[index]),
    required(session.responses[index]),
  );
  expect(
    required(session.responses[index]).submissions.map((s) => s.correct),
  ).toEqual([false, true]);
  expect(statistics(session).manual).toBe(0);
  expect(parseBackup(exportBackup(library)).data.sessions).toEqual(
    library.sessions,
  );
});

it('maps every main task and each original activity without claiming the rest of unit three is complete', () => {
  const represented = new Set<string>();
  expect(audit.activities).toHaveLength(11);
  expect(audit.activities.filter((a) => a.page === 27)).toHaveLength(5);
  expect(audit.activities.filter((a) => a.page === 28)).toHaveLength(6);
  for (const a of audit.activities) {
    expect(a.lesson).toBe(lesson.id);
    for (const n of a.steps) expect(lesson.steps[n - 1]).toBeDefined();
    for (const [kind, ids] of [
      ['objective', a.objective],
      ['manual', a.manual],
      ['reflection', a.records],
    ] as const) {
      for (const suffix of ids) {
        const id = `${lesson.id}-${suffix}`;
        const q = required(lesson.questions.find((q) => q.id === id));
        expect(
          kind === 'objective'
            ? !['manual', 'reflection'].includes(q.rule.kind)
            : q.rule.kind === kind,
        ).toBe(true);
        represented.add(id);
      }
    }
  }
  expect([...represented].toSorted()).toEqual(
    lesson.questions.map((q) => q.id).toSorted(),
  );
  expect(audit.scope).toContain('后续仍制作中');
  expect(audit.finalTeacherReview).toBe('not-verified');
});

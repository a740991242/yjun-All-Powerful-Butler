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
import { bnuLowerComplementLesson as lesson } from './bnu-lower-complement';
import { bnuLowerComplementAudit as audit } from './bnu-lower-complement-audit';
it('checks all original results and specified processes independently, with temporal and variable ranges intact', () => {
  const answers = [
    8,
    9,
    7,
    [0, 14],
    [4, 5, 9],
    [4, 1, 10, 9],
    [4, 1, 9],
    [9, 9],
    8,
    9,
    7,
    5,
    6,
    [9, 8, 7, 6, 5],
    '原数14',
    4,
    3,
    [10, 3],
    [3, 4, 7],
    [10, 1],
    [1, 4, 5],
    [10, 2],
    [2, 5, 7],
    [10, 5],
    [5, 3, 8],
    4,
    5,
    6,
    6,
    7,
    8,
    10,
    9,
    8,
    '每次多1',
    '每次少1',
    11,
    8,
    3,
    '不能，还需要总量与变化条件',
    7,
    '剩余8个',
  ];
  const objective = lesson.questions.filter(
    (q) => !['manual', 'reflection'].includes(q.rule.kind),
  );
  expect(objective).toHaveLength(42);
  for (const [i, q] of objective.entries())
    expect(evaluate(q.rule, required(answers[i])), q.id).toBe(true);
  const q = (suffix: string) =>
    required(lesson.questions.find((q) => q.id === `${lesson.id}-${suffix}`));
  expect(evaluate(q('line').rule, [1, 4, 9])).toBe(false);
  expect(evaluate(q('ducks-hidden').rule, 19)).toBe(false);
  expect(evaluate(q('ducks-unknown').rule, '能，一定3只')).toBe(false);
  expect(evaluate(q('apples-eight').rule, '拿走8个')).toBe(false);
  expect(lesson.steps).toHaveLength(9);
  expect(lesson.questions).toHaveLength(55);
});
it('accepts every ordered pair including two sevens and distinguishes decomposition from explaining an algorithm', () => {
  for (const [suffix, target] of [
    ['free-pair', 14],
    ['decompose-0', 13],
    ['decompose-1', 11],
    ['decompose-2', 12],
    ['decompose-3', 15],
  ] as const) {
    const rule = required(
      lesson.questions.find((q) => q.id === `${lesson.id}-${suffix}`),
    ).rule;
    for (let a = 0; a <= target; a++)
      for (let b = 0; b <= target; b++)
        expect(evaluate(rule, [a, b]), `${suffix}/${a}/${b}`).toBe(
          a + b === target,
        );
  }
  const free = required(
    lesson.questions.find((q) => q.id === `${lesson.id}-free-pair`),
  );
  expect(evaluate(free.rule, [7, 7])).toBe(true);
  expect(lesson.steps[5]?.text).toContain('不能仅据合对便断言已解释方法');
});
it('changes review conditions and keeps real cooperation and three records separate from scores', () => {
  const answers = [[0, 15], [5, 4, 9], [5, 1, 10, 9], [9, 8, 7, 6, 5], 5];
  const review = required(lesson.reviewQuestions);
  expect(review).toHaveLength(5);
  for (const [i, q] of review.entries())
    expect(evaluate(q.rule, required(answers[i])), q.id).toBe(true);
  expect(evaluate(required(review[0]).rule, [0, 14])).toBe(false);
  expect(evaluate(required(review[1]).rule, [4, 5, 9])).toBe(false);
  expect(evaluate(required(review[2]).rule, [4, 1, 10, 9])).toBe(false);
  expect(evaluate(required(review[4]).rule, 3)).toBe(false);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    10,
  );
  const records = lesson.questions.filter((q) => q.rule.kind === 'reflection');
  expect(records).toHaveLength(3);
  for (const q of records)
    expect(evaluate(q.rule, '未合作，准备下次尝试')).toBeNull();
});
it('backs up a real zero and unfinished partner, then preserves an error and valid same-number retry with old history', () => {
  const library = initialLibrary('凑数');
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
  const i = session.questions.findIndex(
    (q) => q.id === `${lesson.id}-free-pair`,
  );
  required(session.responses[i]).draft = [0, null];
  expect(parseBackup(exportBackup(library)).data.sessions).toEqual(
    library.sessions,
  );
  required(session.responses[i]).draft = [7, 6];
  session.responses[i] = submitResponse(
    required(session.questions[i]),
    required(session.responses[i]),
  );
  required(session.responses[i]).draft = [7, 7];
  session.responses[i] = submitResponse(
    required(session.questions[i]),
    required(session.responses[i]),
  );
  expect(
    required(session.responses[i]).submissions.map((s) => s.correct),
  ).toEqual([false, true]);
  expect(statistics(session).manual).toBe(0);
  expect(parseBackup(exportBackup(library)).data.sessions).toEqual(
    library.sessions,
  );
});
it('maps every main task to nine source activities without declaring later lessons complete', () => {
  const represented = new Set<string>();
  expect(audit.activities).toHaveLength(9);
  expect(audit.activities.filter((a) => a.page === 31)).toHaveLength(4);
  for (const a of audit.activities) {
    expect(a.lesson).toBe(lesson.id);
    for (const n of a.steps) expect(lesson.steps[n - 1]).toBeDefined();
    for (const [kind, ids] of [
      ['objective', a.objective],
      ['manual', a.manual],
      ['reflection', a.records],
    ] as const)
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
  expect([...represented].toSorted()).toEqual(
    lesson.questions.map((q) => q.id).toSorted(),
  );
  expect(audit.scope).toContain('仍待制作');
});

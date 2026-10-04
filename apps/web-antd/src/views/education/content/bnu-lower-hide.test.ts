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
import { bnuLowerHideLesson as lesson } from './bnu-lower-hide';
import { bnuLowerHideAudit as audit } from './bnu-lower-hide-audit';
it('checks the full source range, exchange meaning and every numerical answer independently', () => {
  const answers = [
    14,
    13,
    8,
    5,
    1,
    '13−8',
    [1, 3, 4, 13],
    [0, 13, 13],
    [3, 2, 5],
    [3, 5, 10, 5],
    1,
    10,
    [0, 5, 5, 5],
    8,
    5,
    [7, 2, 8],
    [8, 8],
    6,
    7,
    11,
    4,
    7,
    13,
    7,
    6,
    4,
    9,
    6,
    8,
    7,
    5,
    2,
    3,
  ];
  const objective = lesson.questions.filter(
    (q) => !['manual', 'reflection'].includes(q.rule.kind),
  );
  expect(objective).toHaveLength(33);
  for (const [i, q] of objective.entries())
    expect(evaluate(q.rule, required(answers[i])), q.id).toBe(true);
  const q = (suffix: string) =>
    required(lesson.questions.find((q) => q.id === `${lesson.id}-${suffix}`));
  expect(evaluate(q('hidden').rule, 6)).toBe(false);
  expect(evaluate(q('scope').rule, '14−8')).toBe(false);
  expect(evaluate(q('exchange').rule, [1, 13, 23])).toBe(false);
  expect(evaluate(q('initial-counter').rule, [1, 3, 13, 4])).toBe(false);
  expect(evaluate(q('line-parts').rule, [2, 7, 8])).toBe(false);
  expect(lesson.questions).toHaveLength(46);
  expect(lesson.steps).toHaveLength(9);
});
it('changes the underlying conditions in every review and keeps real tasks and three records independent', () => {
  const answers = [5, [4, 1, 5], [4, 5, 10, 5], [1, 4, 5, 14], 8];
  const reviews = required(lesson.reviewQuestions);
  expect(reviews).toHaveLength(5);
  for (const [i, q] of reviews.entries())
    expect(evaluate(q.rule, required(answers[i])), q.id).toBe(true);
  expect(evaluate(required(reviews[1]).rule, [3, 2, 5])).toBe(false);
  expect(evaluate(required(reviews[2]).rule, [3, 5, 10, 5])).toBe(false);
  expect(evaluate(required(reviews[3]).rule, [1, 3, 4, 13])).toBe(false);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    10,
  );
  const records = lesson.questions.filter((q) => q.rule.kind === 'reflection');
  expect(records).toHaveLength(3);
  for (const q of records)
    expect(evaluate(q.rule, '未操作，准备以后试')).toBeNull();
  expect(lesson.parentTip).toContain('不能用14减8');
  expect(lesson.steps[6]?.text).toContain('若去掉右边也可11−4=7');
});
it('saves a partial counter draft, real zero and mistaken exchange retry alongside unchanged old snapshots', () => {
  const library = initialLibrary('捉迷藏');
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
    (q) => q.id === `${lesson.id}-exchange`,
  );
  required(session.responses[index]).draft = [0, null, null];
  expect(parseBackup(exportBackup(library)).data.sessions).toEqual(
    library.sessions,
  );
  required(session.responses[index]).draft = [1, 13, 23];
  session.responses[index] = submitResponse(
    required(session.questions[index]),
    required(session.responses[index]),
  );
  required(session.responses[index]).draft = [0, 13, 13];
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

it('corresponds every main task to actual source activities without completing later content', () => {
  const represented = new Set<string>();
  expect(audit.activities).toHaveLength(9);
  expect(audit.activities.filter((a) => a.page === 29)).toHaveLength(4);
  expect(audit.activities.filter((a) => a.page === 30)).toHaveLength(5);
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
  expect(audit.scope).toContain('仍待制作');
});

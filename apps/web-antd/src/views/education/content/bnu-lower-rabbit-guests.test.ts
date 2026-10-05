import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { bnuWholeTenLine } from '../learning/bnu-whole-ten-line';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { bnuLowerFillGameLesson } from './bnu-lower-fill-game';
import { bnuLowerRabbitGuestsLesson as lesson } from './bnu-lower-rabbit-guests';
import { bnuLowerRabbitGuestsAudit as audit } from './bnu-lower-rabbit-guests-audit';
import { bnuLowerRabbitGuestsSource as source } from './bnu-lower-rabbit-guests-source';

const q = (suffix: string) =>
  required(lesson.questions.find((x) => x.id === `${lesson.id}-${suffix}`));
it('independently checks all thirty-one objectives, complete methods, terms, times, arrows and true zero', () => {
  const answers: [string, Answer][] = [
    ['plate-groups', [2, 3, 5]],
    ['add-values', [20, 30, 50]],
    ['add-forward', [30, 40, 50]],
    ['add-tens', [2, 3, 5]],
    ['add-related', [5, 50]],
    ['add-beads', 5],
    ['sub-values', [50, 40, 10]],
    ['sub-backward', [40, 30, 20, 10]],
    ['sub-tens', [5, 4, 1]],
    ['sub-related', [1, 10]],
    ['sub-target', '背走的果子个数'],
    ['add-name-20', '加数'],
    ['add-name-30', '加数'],
    ['sum-name', '和'],
    ['minuend-name', '被减数'],
    ['subtrahend-name', '减数'],
    ['difference-name', '差'],
    ['stick-add-bundles', [4, 2, 6]],
    ['stick-add', [40, 20, 60]],
    ['stick-sub-bundles', [4, 2, 2]],
    ['stick-sub', [40, 20, 20]],
    ['stick-after', [60, 20, 40]],
    ['stick-unit', '根'],
    ['line-add', [30, 50, 80]],
    ['line-sub', [90, 30, 60]],
    ['line-directions', '加50向右，减30向左'],
    ['peach-values', [40, 30, 50]],
    ['peach-pair-totals', [70, 90, 80]],
    ['peach-pair-differences', [10, 10, 20]],
    ['peach-most', '毛毛'],
    ['site-zero', 0],
  ];
  expect(answers).toHaveLength(31);
  expect(
    lesson.questions
      .filter((x) => !['manual', 'reflection'].includes(x.rule.kind))
      .map((x) => x.id)
      .toSorted(),
  ).toEqual(answers.map(([id]) => q(id).id).toSorted());
  for (const [id, answer] of answers)
    expect(evaluate(q(id).rule, answer), id).toBe(true);
  for (const [id, answer] of [
    ['sub-values', [50, 10, 40]],
    ['add-beads', 50],
    ['stick-sub', [60, 20, 40]],
    ['stick-after', [40, 20, 20]],
    ['line-add', [20, 50, 70]],
    ['line-sub', [50, 30, 20]],
    ['peach-pair-totals', [120, 90, 80]],
    ['site-zero', 1],
  ] as [string, Answer][])
    expect(evaluate(q(id).rule, answer), id).toBe(false);
  for (const [scene, original] of [
    ['add', source.numberLines[0]],
    ['subtract', source.numberLines[1]],
  ] as const)
    expect(
      bnuWholeTenLine({ kind: 'bnu-whole-ten-line', scene, variant: 'main' }),
    ).toEqual({
      ticks: original.labels,
      start: original.start,
      jump: original.jump,
      end: original.end,
      operation: original.operation,
    });
  expect(q('stick-sub').prompt).toContain('拿走前');
  expect(q('stick-after').prompt).toContain('已经拿走');
});
it('covers all six source activities and forty-seven tasks while preserving real work and open questions', () => {
  expect(lesson.steps).toHaveLength(10);
  expect(lesson.questions).toHaveLength(47);
  expect(audit.activities.map((a) => [a.page, a.sourceActivity])).toEqual(
    source.activities.map((a) => [a.page, a.key]),
  );
  const ids: string[] = [];
  for (const a of audit.activities) {
    for (const n of a.steps) expect(lesson.steps[n - 1]).toBeDefined();
    for (const [kind, names] of [
      ['objective', a.objective],
      ['manual', a.manual],
      ['reflection', a.records],
    ] as const)
      for (const name of names) {
        const task = q(name);
        expect(
          kind === 'objective'
            ? !['manual', 'reflection'].includes(task.rule.kind)
            : task.rule.kind === kind,
        ).toBe(true);
        ids.push(task.id);
      }
  }
  expect(ids.toSorted()).toEqual(lesson.questions.map((x) => x.id).toSorted());
  expect(lesson.questions.filter((x) => x.rule.kind === 'manual')).toHaveLength(
    13,
  );
  expect(
    lesson.questions.filter((x) => x.rule.kind === 'reflection'),
  ).toHaveLength(3);
  for (const task of lesson.questions.filter((x) =>
    ['manual', 'reflection'].includes(x.rule.kind),
  ))
    expect(
      evaluate(
        task.rule,
        task.rule.kind === 'manual'
          ? 'confirmed'
          : '自己的问题：三人一共摘120个，是超本课范围的拓展。',
      ),
    ).toBeNull();
  expect(q('own-question-record').prompt).toContain('不截为100');
  expect(source.status).toBe('source-checked');
  expect(audit.finalTeacherReview).toBe('not-verified');
});
it('checks all nine separately changed reviews instead of copying old main answers', () => {
  const answers: [string, Answer, Answer][] = [
    ['review-add', [30, 40, 70], [20, 30, 50]],
    ['review-forward', [40, 50, 60, 70], [30, 40, 50]],
    ['review-taken', [80, 50, 30], [50, 40, 10]],
    ['review-stick-add', [30, 40, 70], [40, 20, 60]],
    ['review-stick-after', [80, 30, 50], [60, 20, 40]],
    ['review-line-add', [20, 50, 70], [30, 50, 80]],
    ['review-line-sub', [100, 40, 60], [90, 30, 60]],
    ['review-peach-pair', [60, 50, 70], [70, 90, 80]],
    ['review-name', '差', '加数'],
  ];
  expect(lesson.reviewQuestions).toHaveLength(9);
  for (const [suffix, answer, old] of answers) {
    const task = required(
      lesson.reviewQuestions?.find((x) => x.id === `${lesson.id}-${suffix}`),
    );
    expect(evaluate(task.rule, answer), suffix).toBe(true);
    if (
      Array.isArray(old) &&
      Array.isArray(answer) &&
      old.length !== answer.length
    )
      expect(() => evaluate(task.rule, old), suffix).toThrow(
        'educationLearning.answerRequired',
      );
    else expect(evaluate(task.rule, old), suffix).toBe(false);
  }
});
it('restores partial drafts and true zero, keeps retry history and prior game snapshots, and rejects extra line answers', () => {
  const library = initialLibrary('整十数');
  const old = createSession(
    bnuLowerFillGameLesson,
    'bnu-math-p1-lower-2024',
    library.activeProfileId,
  );
  const snapshot = structuredClone(old);
  const session = createSession(
    lesson,
    'bnu-math-p1-lower-2024',
    library.activeProfileId,
  );
  library.sessions = [old, session];
  const index = session.questions.findIndex(
    (x) => x.id === `${lesson.id}-sub-backward`,
  );
  required(session.responses[index]).draft = [40, null, null, null];
  expect(parseBackup(exportBackup(library)).data.sessions[1]).toEqual(session);
  for (const draft of [
    [40, 30, 20, 0],
    [40, 30, 20, 10],
  ])
    session.responses[index] = submitResponse(
      required(session.questions[index]),
      { ...required(session.responses[index]), draft },
    );
  const zero = session.questions.findIndex(
    (x) => x.id === `${lesson.id}-site-zero`,
  );
  session.responses[zero] = submitResponse(required(session.questions[zero]), {
    ...required(session.responses[zero]),
    draft: 0,
  });
  const restored = parseBackup(exportBackup(library)).data;
  expect(restored.sessions[0]).toEqual(snapshot);
  expect(restored.sessions[1]).toEqual(session);
  expect(
    required(restored.sessions[1]).responses[index]?.submissions.map(
      (x) => x.correct,
    ),
  ).toEqual([false, true]);
  expect(
    required(restored.sessions[1]).responses[zero]?.submissions[0]?.correct,
  ).toBe(true);
  const line = session.questions.findIndex(
    (x) => x.visual?.kind === 'bnu-whole-ten-line',
  );
  const invalid = JSON.parse(exportBackup(library));
  invalid.data.sessions[1].questions[line].visual.end = 80;
  expect(() => parseBackup(JSON.stringify(invalid))).toThrow(
    'educationLearning.invalidBackup',
  );
});

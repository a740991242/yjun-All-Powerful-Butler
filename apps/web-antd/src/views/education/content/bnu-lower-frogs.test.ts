import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { bnuTwoJumpLine } from '../learning/bnu-two-jump-line';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { bnuLowerFrogsLesson as lesson } from './bnu-lower-frogs';
import { bnuLowerFrogsAudit as audit } from './bnu-lower-frogs-audit';
import { bnuLowerFrogsSource as source } from './bnu-lower-frogs-source';
import { bnuLowerPineconesLesson } from './bnu-lower-pinecones';

const q = (suffix: string) =>
  required(lesson.questions.find((x) => x.id === `${lesson.id}-${suffix}`));
it('independently checks all 32 objective tasks, all source exercises and units', () => {
  const answers: [string, Answer][] = [
    ['frog-values', [65, 32]],
    ['add-values', [65, 32, 97]],
    ['add-sequential', [95, 97]],
    ['add-tens', [60, 30, 90]],
    ['add-ones', [5, 2, 7]],
    ['add-combine', [90, 7, 97]],
    ['add-counter-digits', [6, 5, 3, 2, 9, 7]],
    ['add-beads', 16],
    ['sub-values', [65, 32, 33]],
    ['sub-sequential', [35, 33]],
    ['sub-tens', [60, 30, 30]],
    ['sub-ones', [5, 2, 3]],
    ['sub-combine', [30, 3, 33]],
    ['sub-counter-digits', [6, 5, 3, 2, 3, 3]],
    ['sub-beads', 6],
    ['comparison-meaning', '两条已吃量的比较差'],
    ['discussion-four', [39, 53, 34, 88]],
    ['same-place', '十位和十位、个位和个位分别计算'],
    ['counter-46', [46, 23, 69]],
    ['counter-37', [37, 25, 12]],
    ['counter-45', [45, 24, 21]],
    ['counter-56', [56, 42, 98]],
    ['line-add-points', [37, 30, 67, 2, 69]],
    ['line-add-combined', [37, 32, 69]],
    ['line-sub-points', [76, 40, 36, 3, 33]],
    ['line-sub-combined', [76, 43, 33]],
    ['line-final', '第二段箭头的终点'],
    ['piano-values', [36, 52, 88]],
    ['piano-unit', '个'],
    ['bus-values', [23, 12, 11]],
    ['bus-meaning', '原人数减下车人数'],
    ['site-zero', 0],
  ];
  expect(answers).toHaveLength(32);
  expect(
    lesson.questions
      .filter((x) => !['manual', 'reflection'].includes(x.rule.kind))
      .map((x) => x.id)
      .toSorted(),
  ).toEqual(answers.map(([id]) => q(id).id).toSorted());
  for (const [id, answer] of answers)
    expect(evaluate(q(id).rule, answer), id).toBe(true);
  for (const [id, answer] of [
    ['add-sequential', [95, 95]],
    ['add-beads', 97],
    ['sub-beads', 33],
    ['line-add-points', [37, 30, 67, 2, 67]],
    ['line-sub-combined', [26, 43, 33]],
    ['piano-values', [36, 52, 89]],
    ['bus-values', [23, 12, 35]],
    ['site-zero', 1],
  ] as [string, Answer][])
    expect(evaluate(q(id).rule, answer), id).toBe(false);
  for (const [scene, original] of [
    ['add', source.numberLines[0]],
    ['subtract', source.numberLines[1]],
  ] as const) {
    const model = bnuTwoJumpLine({
      kind: 'bnu-two-jump-line',
      scene,
      variant: 'main',
    });
    expect(model.ticks).toEqual(original.labels);
    expect(model.segments).toEqual([
      {
        from: original.start,
        to: original.intermediate,
        jump: original.firstJump,
      },
      {
        from: original.intermediate,
        to: original.end,
        jump: original.secondJump,
      },
    ]);
    expect(model.ticks).not.toContain(original.end);
  }
});
it('maps all seven original activities and keeps seventeen real tasks and three open records honest', () => {
  expect(lesson.steps).toHaveLength(10);
  expect(lesson.questions).toHaveLength(52);
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
    17,
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
        task.rule.kind === 'manual' ? 'confirmed' : '自己的实际方法与计划',
      ),
    ).toBeNull();
  expect(source.status).toBe('source-checked');
  expect(audit.finalTeacherReview).toBe('not-verified');
});
it('checks nine new reviews and rejects copied original answers', () => {
  const answers: [string, Answer, Answer][] = [
    ['review-add', [42, 25, 67], [65, 32, 97]],
    ['review-add-sequential', [62, 67], [95, 97]],
    ['review-sub', [87, 34, 53], [65, 32, 33]],
    ['review-sub-sequential', [57, 53], [35, 33]],
    ['review-counters', [78, 22, 33, 99], [69, 12, 21, 98]],
    ['review-line-add', [47, 20, 67, 4, 71], [37, 30, 67, 2, 69]],
    ['review-line-sub', [76, 30, 46, 2, 44], [76, 40, 36, 3, 33]],
    ['review-piano', [24, 53, 77], [36, 52, 88]],
    ['review-bus', [34, 12, 22], [23, 12, 11]],
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
      expect(() => evaluate(task.rule, old)).toThrow(
        'educationLearning.answerRequired',
      );
    else expect(evaluate(task.rule, old), suffix).toBe(false);
  }
});
it('preserves six-value partial drafts, correct zero, retry history and old snapshots under schema1', () => {
  const library = initialLibrary('青蛙');
  const old = createSession(
    bnuLowerPineconesLesson,
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
    (x) => x.id === `${lesson.id}-add-counter-digits`,
  );
  required(session.responses[index]).draft = [6, null, null, null, null, null];
  expect(parseBackup(exportBackup(library)).data.sessions[1]).toEqual(session);
  for (const draft of [
    [6, 5, 3, 2, 9, 0],
    [6, 5, 3, 2, 9, 7],
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
  const arrow = session.questions.findIndex(
    (x) => x.visual?.kind === 'bnu-two-jump-line',
  );
  const invalid = JSON.parse(exportBackup(library));
  invalid.data.sessions[1].questions[arrow].visual.end = 69;
  expect(() => parseBackup(JSON.stringify(invalid))).toThrow(
    'educationLearning.invalidBackup',
  );
});

import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { bnuPineconeLine } from '../learning/bnu-pinecone-line';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { bnuLowerPineconesLesson as lesson } from './bnu-lower-pinecones';
import { bnuLowerPineconesAudit as audit } from './bnu-lower-pinecones-audit';
import { bnuLowerPineconesSource as source } from './bnu-lower-pinecones-source';
import { bnuLowerRabbitGuestsLesson } from './bnu-lower-rabbit-guests';

const q = (suffix: string) =>
  required(lesson.questions.find((x) => x.id === `${lesson.id}-${suffix}`));
it('independently checks all 28 objective tasks, all source exercises and units', () => {
  const answers: [string, Answer][] = [
    ['picked', [45, 3, 30]],
    ['add-values', [45, 3, 48]],
    ['add-count', [46, 47, 48]],
    ['add-ones', [5, 3, 8]],
    ['add-tens', [4, 4]],
    ['add-related', [8, 48]],
    ['sub-values', [45, 30, 15]],
    ['sub-count', [35, 25, 15]],
    ['sub-tens', [4, 3, 1]],
    ['sub-ones', 5],
    ['sub-related', [10, 15]],
    ['compare-meaning', '妈妈比爸爸多采多少个'],
    ['interpret-sub', [45, 3, 42]],
    ['interpret-add', [45, 30, 75]],
    ['stick-32', [32, 5, 37]],
    ['stick-75', [75, 40, 35]],
    ['stick-78', [78, 6, 72]],
    ['stick-68', [68, 30, 98]],
    ['line-add', [22, 3, 25]],
    ['line-sub', [89, 30, 59]],
    ['line-directions', '左向右三格加3，右向左三格减30'],
    ['eight-top', [69, 55, 44, 77]],
    ['eight-bottom', [65, 86, 4, 72]],
    ['swans', [55, 20, 75]],
    ['swans-meaning', '把原数和新来数相加'],
    ['dinosaurs', [25, 2, 23]],
    ['dinosaurs-unit', '米'],
    ['site-zero', 0],
  ];
  expect(answers).toHaveLength(28);
  expect(
    lesson.questions
      .filter((x) => !['manual', 'reflection'].includes(x.rule.kind))
      .map((x) => x.id)
      .toSorted(),
  ).toEqual(answers.map(([id]) => q(id).id).toSorted());
  for (const [id, answer] of answers)
    expect(evaluate(q(id).rule, answer), id).toBe(true);
  for (const [id, answer] of [
    ['sub-values', [45, 3, 42]],
    ['sub-count', [44, 43, 42]],
    ['line-add', [21, 3, 24]],
    ['line-sub', [49, 30, 19]],
    ['eight-bottom', [65, 86, 40, 72]],
    ['swans', [55, 20, 35]],
    ['dinosaurs', [25, 2, 27]],
    ['dinosaurs-unit', '只'],
    ['site-zero', 1],
  ] as [string, Answer][])
    expect(evaluate(q(id).rule, answer), id).toBe(false);
  for (const [scene, original] of [
    ['add', source.numberLines[0]],
    ['subtract', source.numberLines[1]],
  ] as const)
    expect(
      bnuPineconeLine({ kind: 'bnu-pinecone-line', scene, variant: 'main' }),
    ).toEqual({
      ticks: original.labels,
      start: original.start,
      jump: original.jump,
      end: original.end,
      operation: original.operation,
    });
});
it('maps all eight original activities and keeps eighteen real tasks and three open records honest', () => {
  expect(lesson.steps).toHaveLength(10);
  expect(lesson.questions).toHaveLength(49);
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
    18,
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
    ['review-add', [52, 4, 56], [45, 3, 48]],
    ['review-count', [53, 54, 55, 56], [46, 47, 48]],
    ['review-sub', [67, 40, 27], [45, 30, 15]],
    ['review-interpret', [67, 4, 63], [45, 3, 42]],
    ['review-sticks', [48, 42, 53, 97], [37, 35, 72, 98]],
    ['review-line-add', [23, 2, 25], [22, 3, 25]],
    ['review-line-sub', [99, 20, 79], [89, 30, 59]],
    ['review-swans', [43, 20, 63], [55, 20, 75]],
    ['review-dinosaurs', [32, 5, 27], [25, 2, 23]],
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
it('preserves four-value partial drafts, correct zero, retry history and old snapshots under schema1', () => {
  const library = initialLibrary('采松果');
  const old = createSession(
    bnuLowerRabbitGuestsLesson,
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
    (x) => x.id === `${lesson.id}-eight-bottom`,
  );
  required(session.responses[index]).draft = [65, null, null, null];
  expect(parseBackup(exportBackup(library)).data.sessions[1]).toEqual(session);
  for (const draft of [
    [65, 86, 40, 72],
    [65, 86, 4, 72],
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
    (x) => x.visual?.kind === 'bnu-pinecone-line',
  );
  const invalid = JSON.parse(exportBackup(library));
  invalid.data.sessions[1].questions[arrow].visual.end = 25;
  expect(() => parseBackup(JSON.stringify(invalid))).toThrow(
    'educationLearning.invalidBackup',
  );
});

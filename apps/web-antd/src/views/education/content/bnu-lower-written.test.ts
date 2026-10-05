import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { bnuLowerFrogsLesson } from './bnu-lower-frogs';
import { bnuLowerWrittenLesson as lesson } from './bnu-lower-written';
import { bnuLowerWrittenAudit as audit } from './bnu-lower-written-audit';
import { bnuLowerWrittenSource as source } from './bnu-lower-written-source';

const q = (suffix: string) =>
  required(lesson.questions.find((x) => x.id === `${lesson.id}-${suffix}`));
it('independently checks every objective, all four written exercises and both cross matches', () => {
  const answers: [string, Answer][] = [
    ['rod-add-values', [12, 31, 43]],
    ['rod-add-digits', [1, 2, 3, 1, 4, 3]],
    ['rod-orientation', '十位横筹表示十，个位纵筹表示一'],
    ['add-ones', [2, 1, 3]],
    ['add-missing-tens', 4],
    ['add-stage-meaning', '个位已算、十位未填'],
    ['add-tens', [1, 3, 4]],
    ['add-complete', [12, 31, 43]],
    ['alignment', '个位对个位、十位对十位'],
    ['rod-sub-values', [34, 22, 12]],
    ['sub-counter-digits', [3, 4, 2, 2, 1, 2]],
    ['sub-beads', 3],
    ['sub-ones', [4, 2, 2]],
    ['sub-tens', [3, 2, 1]],
    ['sub-blanks', [1, 2]],
    ['matching-a', 'D'],
    ['matching-b', 'C'],
    ['matching-values', [23, 21, 44, 33, 21, 12]],
    ['practice-digits', [7, 6, 3, 1, 9, 9, 5, 7]],
    ['practice-results', [76, 31, 99, 57]],
    ['water-conditions', [48, 36, 1, 36]],
    ['water-result', [48, 36, 12]],
    ['water-unit', '瓶'],
    ['site-zero', 0],
  ];
  expect(
    lesson.questions
      .filter((x) => !['manual', 'reflection'].includes(x.rule.kind))
      .map((x) => x.id)
      .toSorted(),
  ).toEqual(answers.map(([id]) => q(id).id).toSorted());
  for (const [id, answer] of answers)
    expect(evaluate(q(id).rule, answer), id).toBe(true);
  for (const [id, answer] of [
    ['add-missing-tens', 0],
    ['sub-beads', 12],
    ['matching-a', 'C'],
    ['matching-b', 'D'],
    ['practice-digits', [7, 6, 3, 1, 9, 9, 5, 0]],
    ['water-result', [48, 36, 84]],
    ['water-unit', '人'],
    ['site-zero', 1],
  ] as [string, Answer][])
    expect(evaluate(q(id).rule, answer), id).toBe(false);
  const sparse: Answer = Array.from({ length: 8 }, () => null);
  sparse[0] = 7;
  Reflect.deleteProperty(sparse, '1');
  expect(Object.hasOwn(sparse, 1)).toBe(false);
  expect(() => evaluate(q('practice-digits').rule, sparse)).toThrow(
    'educationLearning.answerRequired',
  );
});
it('maps all six source activities and keeps twelve actual tasks and three records separate', () => {
  expect(lesson.steps).toHaveLength(10);
  expect(lesson.questions).toHaveLength(39);
  expect(audit.activities.map((a) => [a.page, a.sourceActivity])).toEqual(
    source.activities.map((a) => [a.page, a.key]),
  );
  const mapped: string[] = [];
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
        mapped.push(task.id);
      }
  }
  expect(mapped.toSorted()).toEqual(
    lesson.questions.map((x) => x.id).toSorted(),
  );
  expect(lesson.questions.filter((x) => x.rule.kind === 'manual')).toHaveLength(
    12,
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
          : '我的实际方法，下一次计划另记',
      ),
    ).toBeNull();
  expect(source.status).toBe('source-checked');
  expect(audit.finalTeacherReview).toBe('not-verified');
});
it('checks eight changed-condition reviews and rejects original answers', () => {
  const answers: [string, Answer, Answer][] = [
    ['review-add-rods', [21, 13, 34], [12, 31, 43]],
    ['review-add-stage', 3, 4],
    ['review-sub', [2, 1], [1, 2]],
    ['review-sub-rods', [34, 13, 21], [34, 22, 12]],
    ['review-matching-a', 'C', 'D'],
    ['review-matching-b', 'D', 'C'],
    ['review-practice', [6, 5, 4, 3, 8, 8, 5, 4], [7, 6, 3, 1, 9, 9, 5, 7]],
    ['review-water', [53, 31, 22], [48, 36, 12]],
  ];
  expect(lesson.reviewQuestions).toHaveLength(8);
  for (const [suffix, answer, old] of answers) {
    const task = required(
      lesson.reviewQuestions?.find((x) => x.id === `${lesson.id}-${suffix}`),
    );
    expect(evaluate(task.rule, answer), suffix).toBe(true);
    expect(evaluate(task.rule, old), suffix).toBe(false);
  }
});
it('preserves eight-value partial drafts, true zero, retry submissions and older immutable snapshots', () => {
  const library = initialLibrary('算一算');
  const old = createSession(
    bnuLowerFrogsLesson,
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
    (x) => x.id === `${lesson.id}-practice-digits`,
  );
  required(session.responses[index]).draft = [
    7,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ];
  expect(parseBackup(exportBackup(library)).data.sessions[1]).toEqual(session);
  for (const draft of [
    [7, 6, 3, 1, 9, 9, 5, 0],
    [7, 6, 3, 1, 9, 9, 5, 7],
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
  const invalid = JSON.parse(exportBackup(library));
  invalid.data.sessions[1].questions[index].visual.answers = [76, 31, 99, 57];
  expect(() => parseBackup(JSON.stringify(invalid))).toThrow(
    'educationLearning.invalidBackup',
  );
});

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { bnuLowerBook } from './bnu-lower';
import { bnuLowerSubtractionHarvestLesson as lesson } from './bnu-lower-subtraction-harvest';
import { bnuLowerSubtractionHarvestAudit as audit } from './bnu-lower-subtraction-harvest-audit';
import { bnuLowerSubtractionTableLesson } from './bnu-lower-subtraction-table';

const q = (suffix: string) =>
  required(
    lesson.questions.find((item) => item.id === `${lesson.id}-${suffix}`),
  );

it('maps every task to all three page-41 source activities without claiming later review pages', () => {
  const represented = new Set<string>();
  expect(audit.activities).toHaveLength(3);
  for (const activity of audit.activities) {
    expect(activity.page).toBe(41);
    for (const step of activity.steps)
      expect(lesson.steps[step - 1]).toBeDefined();
    for (const [kind, ids] of [
      ['objective', activity.objective],
      ['manual', activity.manual],
      ['reflection', activity.records],
    ] as const)
      for (const suffix of ids) {
        const item = q(suffix);
        expect(
          kind === 'objective'
            ? !['manual', 'reflection'].includes(item.rule.kind)
            : item.rule.kind === kind,
        ).toBe(true);
        represented.add(item.id);
      }
  }
  expect([...represented].toSorted()).toEqual(
    lesson.questions.map((item) => item.id).toSorted(),
  );
});
it('independently checks every objective condition and separates two splitting methods from exchanging units', () => {
  const answers: [string, number | number[] | string][] = [
    ['plant-counts', [13, 6, 7]],
    ['reverse-difference', 7],
    ['unit', '种'],
    ['shared-species', '不能，需要两人的具体名单'],
    ['split-part', [3, 3, 10, 7]],
    ['split-whole', [10, 3, 4, 7]],
    ['counter-initial', [1, 3, 13]],
    ['counter-exchange', [0, 13, 13]],
    ['counter-remaining', 7],
    ['glove-example', 7],
    ['parking', [13, 6, 7]],
    ['zero-empty', 0],
    ['unknown', '不能，还需小宁认识的种数'],
    ['twenty-path', [5, 4, 20, 16]],
    ['twenty-split', [5, 11, 16]],
  ];
  expect(
    lesson.questions.filter(
      (item) => !['manual', 'reflection'].includes(item.rule.kind),
    ),
  ).toHaveLength(15);
  for (const [suffix, answer] of answers)
    expect(evaluate(q(suffix).rule, answer), suffix).toBe(true);
  expect(evaluate(q('shared-species').rule, '能，必定6种')).toBe(false);
  expect(evaluate(q('split-whole').rule, [3, 3, 10, 7])).toBe(false);
  expect(evaluate(q('counter-exchange').rule, [1, 13, 23])).toBe(false);
  expect(evaluate(q('unknown').rule, '能，缺失就当0')).toBe(false);
  expect(() => evaluate(q('zero-empty').rule, null)).toThrow(
    'educationLearning.answerRequired',
  );
  expect(lesson.steps[4]!.text).toContain('25已经超过20');
});
it('keeps actual activities and future/open records ungraded, with genuinely changed review conditions', () => {
  expect(lesson.questions).toHaveLength(28);
  expect(lesson.steps).toHaveLength(5);
  const manual = lesson.questions.filter((item) => item.rule.kind === 'manual');
  const reflection = lesson.questions.filter(
    (item) => item.rule.kind === 'reflection',
  );
  expect(manual).toHaveLength(9);
  expect(reflection).toHaveLength(4);
  for (const item of manual)
    expect(evaluate(item.rule, 'confirmed')).toBeNull();
  for (const item of reflection)
    expect(evaluate(item.rule, '未实际做，未来计划另记')).toBeNull();
  expect(q('actual-hats').prompt).toContain('允许不同合理问题');
  const review = required(lesson.reviewQuestions);
  const answers = [
    9,
    [6, 1, 10, 9],
    6,
    [1, 2, 12],
    '不能，可能是不同的两组数量',
  ];
  expect(review).toHaveLength(5);
  for (const [i, item] of review.entries()) {
    expect(evaluate(item.rule, required(answers[i]))).toBe(true);
    expect(
      lesson.questions.some(
        (old) => old.id === item.id || old.prompt === item.prompt,
      ),
    ).toBe(false);
  }
});
it('preserves partial true-zero exchange, mistake history and the old table snapshot with the registered course preserving historical evidence', () => {
  const library = initialLibrary('收获');
  const old = createSession(
    bnuLowerSubtractionTableLesson,
    bnuLowerBook.id,
    library.activeProfileId,
  );
  const snapshot = structuredClone(old);
  const session = createSession(
    lesson,
    bnuLowerBook.id,
    library.activeProfileId,
  );
  library.sessions = [old, session];
  const i = session.questions.findIndex(
    (item) => item.id === `${lesson.id}-counter-exchange`,
  );
  session.responses[i]!.draft = [0, null, null];
  expect(parseBackup(exportBackup(library)).data).toEqual(library);
  for (const answer of [
    [1, 13, 23],
    [0, 13, 13],
  ]) {
    session.responses[i]!.draft = answer;
    session.responses[i] = submitResponse(
      session.questions[i]!,
      session.responses[i]!,
    );
  }
  const restored = parseBackup(exportBackup(library)).data;
  expect(restored.sessions[0]).toEqual(snapshot);
  expect(
    restored.sessions[1]!.responses[i]!.submissions.map((item) => item.correct),
  ).toEqual([false, true]);
  expect(
    bnuLowerBook.units
      .flatMap(({ lessons }) => lessons)
      .some((item) => item.id === lesson.id),
  ).toBe(true);
});

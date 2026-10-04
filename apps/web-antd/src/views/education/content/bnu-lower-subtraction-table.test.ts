import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { bnuLowerCountrysideLesson } from './bnu-lower-countryside';
import { bnuLowerSubtractionTableLesson as lesson } from './bnu-lower-subtraction-table';
import { bnuLowerSubtractionTableAudit as audit } from './bnu-lower-subtraction-table-audit';

const q = (suffix: string) =>
  required(
    lesson.questions.find((item) => item.id === `${lesson.id}-${suffix}`),
  );
it('checks all seventeen cards, nineteen missing expressions and all forty-five calculations independently', () => {
  expect(evaluate(q('card-results-1').rule, [7, 7, 8, 9, 7, 8, 8, 7, 9])).toBe(
    true,
  );
  expect(evaluate(q('card-results-2').rule, [5, 6, 3, 6, 7, 7, 9, 8])).toBe(
    true,
  );
  for (const [suffix, values] of [
    ['find-result-seven', ['1', '2', '5', '8', '14', '15']],
    ['find-whole-twelve', ['5', '11', '16', '17']],
    ['find-subtract-nine', ['2', '3', '4', '6', '9', '13', '15']],
  ] as const)
    expect(evaluate(q(suffix).rule, [...values])).toBe(true);
  expect(
    evaluate(q('find-result-seven').rule, ['1', '2', '5', '8', '14']),
  ).toBe(false);
  const missing = [
    [10, 4],
    [10, 5],
    [10, 7],
    [10, 8],
    [11, 3],
    [11, 6],
    [11, 7],
    [11, 9],
    [12, 5],
    [12, 8],
    [12, 9],
    [13, 6],
    [13, 7],
    [14, 6],
    [14, 7],
    [15, 7],
    [15, 9],
    [16, 7],
    [17, 9],
  ];
  missing.forEach((values, i) =>
    expect(
      evaluate(q(`blank-${String.fromCodePoint(97 + i)}`).rule, values),
    ).toBe(true),
  );
  const rows = [
    [9, 8, 7, 6, 5, 4, 3, 2, 1],
    [9, 8, 7, 6, 5, 4, 3, 2],
    [9, 8, 7, 6, 5, 4, 3],
    [9, 8, 7, 6, 5, 4],
    [9, 8, 7, 6, 5],
    [9, 8, 7, 6],
    [9, 8, 7],
    [9, 8],
    [9],
  ];
  expect(rows.flat()).toHaveLength(45);
  rows.forEach((values, i) =>
    expect(evaluate(q(`row-${10 + i}`).rule, values)).toBe(true),
  );
  expect(evaluate(q('blank-a').rule, [10, 6])).toBe(false);
  expect(evaluate(q('row-10').rule, [1, 2, 3, 4, 5, 6, 7, 8, 9])).toBe(false);
  expect(
    lesson.questions.filter(
      (item) => !['manual', 'reflection'].includes(item.rule.kind),
    ),
  ).toHaveLength(40);
  expect(lesson.questions).toHaveLength(53);
  expect(lesson.steps).toHaveLength(8);
});
it('distinguishes horizontal, vertical, both named diagonals, zero and unknown conditions', () => {
  for (const [suffix, answer] of [
    ['horizontal', [9, 8, 7]],
    ['vertical', [9, 9, 9]],
    ['diagonal-left', [7, 8, 9]],
    ['diagonal-right', [9, 8, 7]],
  ] as const)
    expect(evaluate(q(suffix).rule, [...answer])).toBe(true);
  expect(evaluate(q('diagonal-right').rule, [7, 8, 9])).toBe(false);
  expect(evaluate(q('outside').rule, '不在这张表的范围')).toBe(true);
  expect(evaluate(q('outside').rule, '得数一定0')).toBe(false);
  expect(evaluate(q('zero-complete').rule, 0)).toBe(true);
  expect(() => evaluate(q('zero-complete').rule, null)).toThrow(
    'educationLearning.answerRequired',
  );
  expect(evaluate(q('unknown').rule, '不能，还需要减数或得数')).toBe(true);
  expect(evaluate(q('unknown').rule, '能，一律12−0')).toBe(false);
});
it('keeps paper-card sorting, full paper table and actual exchange separate from ungraded reflections', () => {
  const manual = lesson.questions.filter((item) => item.rule.kind === 'manual');
  const reflection = lesson.questions.filter(
    (item) => item.rule.kind === 'reflection',
  );
  expect(manual).toHaveLength(10);
  expect(reflection).toHaveLength(3);
  for (const item of manual)
    expect(evaluate(item.rule, 'confirmed')).toBeNull();
  for (const item of reflection)
    expect(evaluate(item.rule, '未实际做，计划另记')).toBeNull();
  expect(lesson.steps[1]!.text).toContain('原题不指定唯一顺序');
});
it('uses five changed-condition reviews without copying main task signatures', () => {
  const review = required(lesson.reviewQuestions);
  const answers = [
    ['A', 'B', 'C'],
    [12, 7],
    10,
    [0, 12],
    '不能，可能有多条式子',
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
  expect(evaluate(review[2]!.rule, 0)).toBe(false);
  expect(evaluate(review[3]!.rule, [12, 0])).toBe(false);
});
it('maps every task to the original activities and preserves partial operands, zero, retries and old history', () => {
  const represented = new Set<string>();
  expect(audit.activities).toHaveLength(5);
  for (const activity of audit.activities) {
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
  const state = initialLibrary('减法表');
  const old = createSession(
    bnuLowerCountrysideLesson,
    'bnu-math-p1-lower-2024',
    state.activeProfileId,
  );
  const snapshot = structuredClone(old);
  const session = createSession(
    lesson,
    'bnu-math-p1-lower-2024',
    state.activeProfileId,
  );
  state.sessions = [old, session];
  const i = session.questions.findIndex(
    (item) => item.id === `${lesson.id}-blank-a`,
  );
  session.responses[i]!.draft = [10, null];
  const z = session.questions.findIndex(
    (item) => item.id === `${lesson.id}-zero-complete`,
  );
  session.responses[z]!.draft = 0;
  expect(parseBackup(exportBackup(state)).data).toEqual(state);
  for (const answer of [
    [10, 6],
    [10, 4],
  ]) {
    session.responses[i]!.draft = answer;
    session.responses[i] = submitResponse(
      session.questions[i]!,
      session.responses[i]!,
    );
  }
  const restored = parseBackup(exportBackup(state)).data;
  expect(restored.sessions[0]).toEqual(snapshot);
  expect(
    restored.sessions[1]!.responses[i]!.submissions.map((item) => item.correct),
  ).toEqual([false, true]);
});

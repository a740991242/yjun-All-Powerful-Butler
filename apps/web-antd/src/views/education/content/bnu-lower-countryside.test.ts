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
import { bnuLowerCountrysideLesson as lesson } from './bnu-lower-countryside';
import { bnuLowerCountrysideAudit as audit } from './bnu-lower-countryside-audit';
import { bnuLowerParachuteLesson } from './bnu-lower-parachute';

const q = (suffix: string) =>
  required(
    lesson.questions.find((item) => item.id === `${lesson.id}-${suffix}`),
  );
it('checks all original counts, target quantities and explicit method paths independently', () => {
  const answers = [
    [11, 5, 6, 8, 7, 5],
    [5, 6, 6],
    0,
    '11−5',
    14,
    '河中水禽和岸上水禽共几只',
    16,
    [12, 2],
    [9, 14, 17],
    5,
    8,
    '小鸭比小松鼠多几只',
    3,
    '不能，还需松鼠数量',
    [12, 3, 9],
    9,
    [11, 4, 7],
    '9支、7个',
    [2, 1, 9],
    [2, 7, 9],
    [1, 3, 7],
    0,
    '不能，需要总数',
  ];
  const objective = lesson.questions.filter(
    (item) => !['manual', 'reflection'].includes(item.rule.kind),
  );
  expect(objective).toHaveLength(23);
  for (const [i, item] of objective.entries())
    expect(evaluate(item.rule, required(answers[i])), item.id).toBe(true);
  expect(lesson.questions).toHaveLength(38);
  expect(lesson.steps).toHaveLength(8);
  expect(evaluate(q('six-groups').rule, [11, 6, 6, 8, 7, 5])).toBe(false);
  expect(evaluate(q('bird-comparison').rule, [5, 16, 16])).toBe(false);
  expect(evaluate(q('addition-meaning').rule, '两组小鸟共几只')).toBe(false);
  expect(evaluate(q('subtraction-meaning').rule, '9只鸭游走后还剩几只')).toBe(
    false,
  );
  expect(evaluate(q('units').rule, '9个、7支')).toBe(false);
  expect(evaluate(q('pencil-to-ten').rule, [1, 2, 9])).toBe(false);
});
it('separates complete zero conditions, unknown counts, actual tasks and open original questions', () => {
  expect(evaluate(q('zero-hidden').rule, 0)).toBe(true);
  expect(() => evaluate(q('zero-hidden').rule, null)).toThrow(
    'educationLearning.answerRequired',
  );
  expect(evaluate(q('unknown-total').rule, '能，看不见就是0')).toBe(false);
  expect(evaluate(q('unknown-group').rule, '能，必定5只')).toBe(false);
  expect(q('own-countryside').prompt).toContain('不限本站示例');
  const manual = lesson.questions.filter((item) => item.rule.kind === 'manual');
  const reflection = lesson.questions.filter(
    (item) => item.rule.kind === 'reflection',
  );
  expect(manual).toHaveLength(10);
  expect(reflection).toHaveLength(5);
  for (const item of manual)
    expect(evaluate(item.rule, 'confirmed')).toBeNull();
  for (const item of reflection)
    expect(evaluate(item.rule, '未实际做，计划另记，问题可不同')).toBeNull();
});
it('changes review conditions and the requested part rather than copying main prompts', () => {
  const answers = [[5, 19], '河中水禽和岸上水禽共几只', 8, [7, 13], 5];
  const review = required(lesson.reviewQuestions);
  expect(review).toHaveLength(5);
  for (const [i, item] of review.entries()) {
    expect(evaluate(item.rule, required(answers[i])), item.id).toBe(true);
    expect(
      lesson.questions.some(
        (old) => old.id === item.id || old.prompt === item.prompt,
      ),
    ).toBe(false);
  }
  expect(evaluate(required(review[0]).rule, [6, 16])).toBe(false);
  expect(evaluate(required(review[2]).rule, 5)).toBe(false);
  expect(evaluate(required(review[3]).rule, [7, 11])).toBe(false);
  expect(evaluate(required(review[4]).rule, 9)).toBe(false);
});
it('preserves partial six-group counts, true zero, retry history and the preceding lesson snapshot', () => {
  const library = initialLibrary('田园');
  const old = createSession(
    bnuLowerParachuteLesson,
    'bnu-math-p1-lower-2024',
    library.activeProfileId,
  );
  const snapshot = JSON.parse(JSON.stringify(old));
  const session = createSession(
    lesson,
    'bnu-math-p1-lower-2024',
    library.activeProfileId,
  );
  session.phase = 'practice';
  library.sessions = [old, session];
  const i = session.questions.findIndex(
    (item) => item.id === `${lesson.id}-six-groups`,
  );
  required(session.responses[i]).draft = [11, null, null, null, null, null];
  required(
    session.responses.find(
      (item) => item.questionId === `${lesson.id}-zero-hidden`,
    ),
  ).draft = 0;
  expect(parseBackup(exportBackup(library)).data.sessions).toEqual(
    library.sessions,
  );
  required(session.responses[i]).draft = [11, 6, 6, 8, 7, 5];
  session.responses[i] = submitResponse(
    required(session.questions[i]),
    required(session.responses[i]),
  );
  required(session.responses[i]).draft = [11, 5, 6, 8, 7, 5];
  session.responses[i] = submitResponse(
    required(session.questions[i]),
    required(session.responses[i]),
  );
  expect(
    required(session.responses[i]).submissions.map((item) => item.correct),
  ).toEqual([false, true]);
  expect(statistics(session).manual).toBe(0);
  const restored = parseBackup(exportBackup(library)).data;
  expect(restored.sessions).toEqual(library.sessions);
  expect(restored.sessions[0]).toEqual(snapshot);
});
it('maps every task to the ten original activity scopes without claiming all of unit three', () => {
  const represented = new Set<string>();
  expect(audit.activities).toHaveLength(10);
  for (const item of audit.activities) {
    expect(item.lesson).toBe(lesson.id);
    for (const step of item.steps) expect(lesson.steps[step - 1]).toBeDefined();
    for (const [kind, ids] of [
      ['objective', item.objective],
      ['manual', item.manual],
      ['reflection', item.records],
    ] as const)
      for (const suffix of ids) {
        const current = q(suffix);
        expect(
          kind === 'objective'
            ? !['manual', 'reflection'].includes(current.rule.kind)
            : current.rule.kind === kind,
        ).toBe(true);
        represented.add(current.id);
      }
  }
  expect([...represented].toSorted()).toEqual(
    lesson.questions.map((item) => item.id).toSorted(),
  );
  expect(audit.finalTeacherReview).toBe('not-verified');
  expect(audit.scope).toContain('40页起仍制作中');
});

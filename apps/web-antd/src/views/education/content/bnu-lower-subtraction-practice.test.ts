import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { bnuLowerSubtractionHarvestLesson } from './bnu-lower-subtraction-harvest';
import { bnuLowerSubtractionPracticeLesson as lesson } from './bnu-lower-subtraction-practice';
import { bnuLowerSubtractionPracticeAudit as audit } from './bnu-lower-subtraction-practice-audit';

const q = (suffix: string) =>
  required(
    lesson.questions.find((item) => item.id === `${lesson.id}-${suffix}`),
  );
it('independently checks all original twelve calculations, complete fact families and object meanings', () => {
  const answers: [string, number | number[] | string][] = [
    ['mushrooms', [13, 8, 5]],
    ['peppers', [15, 9, 6]],
    ['circle-meaning', '不是，它只标记原来的一部分'],
    ['line-to-ten', [8, 1, 10, 9]],
    ['line-each', [17, 16, 15, 14, 13, 12, 11, 10, 9]],
    ['row-one', [8, 9, 6, 13]],
    ['row-two', [7, 8, 12, 7]],
    ['row-three', [6, 7, 10, 8]],
    ['furniture', [14, 9, 5]],
    ['furniture-unit', '还缺5张桌子'],
    ['zero-missing', 0],
    ['unknown-furniture', '不能，还需要椅子数量'],
    ['kicks-counts', [5, 7, 13]],
    ['kicks-total-example', 12],
    ['kicks-difference-example', 6],
    ['family-fourteen', [14, 14, 9, 5]],
    ['family-twelve', [12, 12, 8, 4]],
    ['family-thirteen', [13, 13, 7, 6]],
    ['family-order', '合理，两条加法都说明两个部分合整体'],
    ['animals-counts', [10, 6, 2]],
    ['animals-difference', [10, 6, 4]],
    ['animals-addition', [10, 2, 12]],
    ['unknown-animals', '不能，还需大蟹数量'],
  ];
  expect(answers).toHaveLength(23);
  for (const [suffix, answer] of answers)
    expect(evaluate(q(suffix).rule, answer), suffix).toBe(true);
  expect(evaluate(q('furniture').rule, [14, 8, 6])).toBe(false);
  expect(evaluate(q('animals-counts').rule, [10, 6, 3])).toBe(false);
  expect(evaluate(q('animals-addition').rule, [10, 6, 16])).toBe(false);
  expect(
    evaluate(q('line-each').rule, [18, 17, 16, 15, 14, 13, 12, 11, 10]),
  ).toBe(false);
  expect(() => evaluate(q('zero-missing').rule, null)).toThrow(
    'educationLearning.answerRequired',
  );
});
it('accepts every bounded legal pair, including zero, while keeping original open paper scope explicit', () => {
  for (const [suffix, operation, result] of [
    ['free-add-twelve', 'add', 12],
    ['free-subtract-twelve', 'subtract', 12],
    ['free-add-fourteen', 'add', 14],
    ['free-subtract-fourteen', 'subtract', 14],
  ] as const)
    for (let a = 0; a <= 20; a++)
      for (let b = 0; b <= 20; b++)
        expect(evaluate(q(suffix).rule, [a, b])).toBe(
          operation === 'add' ? a + b === result : a - b === result,
        );
  expect(evaluate(q('free-add-twelve').rule, [0, 12])).toBe(true);
  expect(evaluate(q('free-subtract-fourteen').rule, [14, 0])).toBe(true);
  expect(evaluate(q('free-subtract-twelve').rule, [25, 13])).toBe(false);
  expect(lesson.steps[7]!.text).toContain('25−13=12也合理');
  expect(lesson.steps[7]!.text).toContain('三个槽不是总数上限');
});
it('keeps sixteen original actual activities and six open records ungraded and maps every task to source scope', () => {
  expect(lesson.steps).toHaveLength(8);
  expect(lesson.questions).toHaveLength(49);
  expect(
    lesson.questions.filter(
      (item) => !['manual', 'reflection'].includes(item.rule.kind),
    ),
  ).toHaveLength(27);
  const manual = lesson.questions.filter((item) => item.rule.kind === 'manual');
  const records = lesson.questions.filter(
    (item) => item.rule.kind === 'reflection',
  );
  expect(manual).toHaveLength(16);
  expect(records).toHaveLength(6);
  for (const item of manual)
    expect(evaluate(item.rule, 'confirmed')).toBeNull();
  for (const item of records)
    expect(evaluate(item.rule, '未做，未来计划单列')).toBeNull();
  expect(audit.activities).toHaveLength(8);
  const represented = new Set<string>();
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
});
it('uses changed-condition reviews, checks all free review pairs and preserves zero/partial/retry and older snapshots', () => {
  const review = required(lesson.reviewQuestions);
  expect(review).toHaveLength(5);
  const answers = [6, [15, 11, 4], [3, 15], [13, 13, 8, 5], [20, 9]];
  for (const [i, item] of review.entries()) {
    expect(evaluate(item.rule, required(answers[i]))).toBe(true);
    expect(
      lesson.questions.some(
        (old) => old.id === item.id || old.prompt === item.prompt,
      ),
    ).toBe(false);
  }
  for (let a = 0; a <= 20; a++)
    for (let b = 0; b <= 20; b++)
      expect(evaluate(review[4]!.rule, [a, b])).toBe(a - b === 11);
  const state = initialLibrary('应用');
  const old = createSession(
    bnuLowerSubtractionHarvestLesson,
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
    (item) => item.id === `${lesson.id}-free-add-twelve`,
  );
  session.responses[i]!.draft = [0, null];
  expect(parseBackup(exportBackup(state)).data).toEqual(state);
  for (const answer of [
    [6, 5],
    [0, 12],
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

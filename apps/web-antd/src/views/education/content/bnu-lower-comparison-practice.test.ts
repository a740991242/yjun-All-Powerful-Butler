import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { bnuLowerBreedingLesson } from './bnu-lower-breeding';
import { bnuLowerComparisonPracticeLesson as lesson } from './bnu-lower-comparison-practice';
import { bnuLowerComparisonPracticeAudit as audit } from './bnu-lower-comparison-practice-audit';
import { bnuLowerComparisonPracticeSource as source } from './bnu-lower-comparison-practice-source';

const q = (suffix: string) =>
  required(lesson.questions.find((x) => x.id === `${lesson.id}-${suffix}`));
it('independently checks all original comparison conditions and four group-score associations', () => {
  const answers: [string, Answer][] = [
    ['run-reference', 86],
    ['sports-candidates', [88, 12, 76]],
    ['long-jump', 12],
    ['skipping', 76],
    ['not-less', 88],
    ['reverse', '多得多'],
    ['zero-compatible', 0],
    ['threshold', '不能，要结合对象和本题候选'],
    ['age-reference', 37],
    ['age-candidate', 39],
    ['close-not-equal', '不相等，差不多只表示比较接近'],
    ['age-real', '不能，这是题目候选判断'],
    ['score-original', [95, 88, 91, 79]],
    ['sorted-scores', [95, 91, 88, 79]],
    ['top-group', '淘气组'],
    ['second-group', '妙想组'],
    ['last-group', '奇思组'],
    ['comparison-sign', '>'],
  ];
  expect(answers).toHaveLength(18);
  for (const [suffix, answer] of answers)
    expect(evaluate(q(suffix).rule, answer), suffix).toBe(true);
  const wrong: [string, Answer][] = [
    ['long-jump', 88],
    ['long-jump', 76],
    ['skipping', 12],
    ['age-candidate', 50],
    ['age-candidate', 28],
    ['sorted-scores', [79, 88, 91, 95]],
    ['sorted-scores', [95, 88, 91, 79]],
    ['second-group', '笑笑组'],
    ['zero-compatible', 2],
  ];
  for (const [suffix, answer] of wrong)
    expect(evaluate(q(suffix).rule, answer), suffix).toBe(false);
  expect(() => evaluate(q('sorted-scores').rule, [95, 91, 88])).toThrow(
    'educationLearning.answerRequired',
  );
  expect(() => evaluate(q('zero-compatible').rule, null)).toThrow(
    'educationLearning.answerRequired',
  );
  expect(lesson.parentTip).toContain('不设普遍固定差数或比例阈值');
  for (const suffix of [
    'sorted-scores',
    'top-group',
    'second-group',
    'last-group',
  ])
    expect(q(suffix).prompt).toContain('淘气95、笑笑88、妙想91、奇思79');
});
it('maps every main task to all three inspected activities and separates actual actions from records and plans', () => {
  expect(lesson.steps).toHaveLength(5);
  expect(lesson.questions).toHaveLength(27);
  expect(audit.activities.map((x) => [x.page, x.sourceActivity])).toEqual(
    source.activities.map((x) => [x.page, x.key]),
  );
  const mapped: string[] = [];
  for (const item of audit.activities) {
    for (const step of item.steps) expect(lesson.steps[step - 1]).toBeDefined();
    for (const [kind, suffixes] of [
      ['objective', item.objective],
      ['manual', item.manual],
      ['reflection', item.records],
    ] as const)
      for (const suffix of suffixes) {
        const task = q(suffix);
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
  const actual = lesson.questions.filter((x) => x.rule.kind === 'manual');
  const records = lesson.questions.filter((x) => x.rule.kind === 'reflection');
  expect(actual).toHaveLength(5);
  expect(records).toHaveLength(4);
  for (const task of actual)
    expect(evaluate(task.rule, 'confirmed')).toBeNull();
  for (const task of records)
    expect(evaluate(task.rule, '尚未做，计划以后练习')).toBeNull();
  expect(q('plan').explanation).toContain('未来计划不算已经做过');
  expect(q('actual-sports-mark').prompt).toContain('画圈');
  expect(q('actual-sports-mark').prompt).toContain('画勾');
});
it('changes review numbers, group names and the required sorting direction', () => {
  const review = required(lesson.reviewQuestions);
  const answers: Answer[] = [
    [10, 65],
    46,
    [98, 87, 84, 73],
    '丙',
    [73, 84, 87, 98],
  ];
  expect(review).toHaveLength(5);
  for (const [index, task] of review.entries()) {
    expect(evaluate(task.rule, required(answers[index]))).toBe(true);
    expect(
      lesson.questions.some(
        (old) => old.id === task.id || old.prompt === task.prompt,
      ),
    ).toBe(false);
  }
  expect(evaluate(review[0]!.rule, [12, 76])).toBe(false);
  expect(evaluate(review[1]!.rule, 39)).toBe(false);
  expect(evaluate(review[2]!.rule, [95, 91, 88, 79])).toBe(false);
  expect(evaluate(review[4]!.rule, [98, 87, 84, 73])).toBe(false);
});
it('round-trips partial sort, real zero and false-true retry submissions without changing the prior breeding snapshot', () => {
  const library = initialLibrary('比较与排序核对');
  const old = createSession(
    bnuLowerBreedingLesson,
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
  const index = session.questions.findIndex((x) =>
    x.id.endsWith('-sorted-scores'),
  );
  session.responses[index]!.draft = [95, null, null, null];
  expect(parseBackup(exportBackup(library)).data.sessions[1]).toEqual(session);
  for (const draft of [
    [95, 88, 91, 79],
    [95, 91, 88, 79],
  ])
    session.responses[index] = submitResponse(
      required(session.questions[index]),
      { ...required(session.responses[index]), draft },
    );
  const zero = session.questions.findIndex((x) =>
    x.id.endsWith('-zero-compatible'),
  );
  session.responses[zero] = submitResponse(required(session.questions[zero]), {
    ...required(session.responses[zero]),
    draft: 0,
  });
  const restored = parseBackup(exportBackup(library)).data;
  expect(restored.sessions[0]).toEqual(snapshot);
  expect(restored.sessions[1]).toEqual(session);
  expect(
    restored.sessions[1]!.responses[index]!.submissions.map((x) => x.correct),
  ).toEqual([false, true]);
  expect(restored.sessions[1]!.responses[zero]!.draft).toBe(0);
});

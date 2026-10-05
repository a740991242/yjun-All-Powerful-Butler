import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { bnuFillGrid } from '../learning/bnu-fill-grid';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { bnuLowerFillGameLesson as lesson } from './bnu-lower-fill-game';
import { bnuLowerFillGameAudit as audit } from './bnu-lower-fill-game-audit';
import { bnuLowerFillGameSource as source } from './bnu-lower-fill-game-source';
import { bnuLowerNumberPracticeLesson } from './bnu-lower-number-practice';

const q = (suffix: string) =>
  required(lesson.questions.find((x) => x.id === `${lesson.id}-${suffix}`));
it('independently checks twenty objectives, the full original blanks and simultaneous row/column reasoning', () => {
  const answers: [string, Answer][] = [
    ['allowed-three', '1、2、3'],
    ['row-repeat', '不可以，同一行不能重复'],
    ['column-repeat', '不可以，同一列不能重复'],
    ['diagonal', '不禁止，原规则只限制每行和每列'],
    ['three-start', 3],
    ['three-all', [3, 2, 2, 3, 3]],
    ['three-bottom', [3, 2, 1]],
    ['three-check', '三行和三列都检查'],
    ['five-allowed', '1、2、3、4、5'],
    ['five-single', [3, 5, 5]],
    ['five-all', [2, 4, 5, 2, 3, 5, 5]],
    ['row-options', [2, 4]],
    ['column-known', [3, 4, 1]],
    ['intersection', 2],
    ['five-next-all', [4, 5, 2]],
    ['row-two', [1, 3, 5, 2, 4]],
    ['row-only-mistake', '第三列重复4，需要调整'],
    ['givens', '不可以，须保留原给定数'],
    ['trial-adjust', '回看行列条件并调整试填数'],
    ['final-check', '五行和五列逐一检查范围及重复'],
  ];
  expect(answers).toHaveLength(20);
  expect(
    lesson.questions
      .filter((x) => !['manual', 'reflection'].includes(x.rule.kind))
      .map((x) => x.id)
      .toSorted(),
  ).toEqual(answers.map(([id]) => q(id).id).toSorted());
  for (const [id, answer] of answers)
    expect(evaluate(q(id).rule, answer), id).toBe(true);
  for (const [id, answer] of [
    ['three-start', 0],
    ['intersection', 4],
    ['three-all', [3, 2, 3, 2, 3]],
    ['five-all', [4, 2, 5, 2, 3, 5, 5]],
    ['five-next-all', [4, 2, 5]],
  ] as [string, Answer][])
    expect(evaluate(q(id).rule, answer), id).toBe(false);
  expect(() => evaluate(q('five-all').rule, [2, 4, 5])).toThrow(
    'educationLearning.answerRequired',
  );
  expect(lesson.parentTip).toContain('不增小宫格或对角线限制');
  for (const [scene, givens] of [
    ['three', source.three.given],
    ['five', source.five.given],
    ['five-stage', source.five.fewBlanksStage],
    ['five-next', source.five.nextStage],
  ] as const)
    expect(
      bnuFillGrid({ kind: 'bnu-fill-grid', scene, variant: 'main' }).givens,
    ).toEqual(givens);
});
it('covers all five inspected activities and twenty-nine tasks, with actual work and reflections separate', () => {
  expect(lesson.steps).toHaveLength(8);
  expect(lesson.questions).toHaveLength(29);
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
    6,
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
        task.rule.kind === 'reflection' ? '自己的方法' : 'confirmed',
      ),
    ).toBeNull();
  expect(source.status).toBe('source-checked');
  expect(audit.finalTeacherReview).toBe('not-verified');
});
it('checks all eight new reviews, rejecting corresponding old answers where the conditions change', () => {
  const answers: [string, Answer, Answer][] = [
    ['review-three-all', [1, 3, 3, 1, 1], [3, 2, 2, 3, 3]],
    ['review-three-start', 1, 3],
    ['review-five-all', [3, 5, 1, 3, 4, 1, 1], [2, 4, 5, 2, 3, 5, 5]],
    ['review-five-single', [4, 1, 1], [3, 5, 5]],
    ['review-row-options', [3, 5], [2, 4]],
    ['review-intersection', 3, 2],
    ['review-next-all', [5, 1, 3], [4, 5, 2]],
    ['review-check-reason', '第三列会重复5', '第三列重复4，需要调整'],
  ];
  expect(lesson.reviewQuestions).toHaveLength(8);
  for (const [suffix, answer, old] of answers) {
    const task = required(
      lesson.reviewQuestions?.find((x) => x.id === `${lesson.id}-${suffix}`),
    );
    expect(evaluate(task.rule, answer), suffix).toBe(true);
    expect(evaluate(task.rule, old), suffix).toBe(false);
    expect(task.visual?.kind).toBe('bnu-fill-grid');
  }
});
it('strictly restores a real zero plus empty partial draft, retry history and unchanged previous forty-nine-task snapshot', () => {
  const library = initialLibrary('填数游戏');
  const profile = required(library.profiles[0]);
  const old = createSession(
    bnuLowerNumberPracticeLesson,
    'bnu-math-p1-lower-2024',
    profile.id,
  );
  const snapshot = structuredClone(old);
  library.sessions.push(old);
  const session = createSession(lesson, 'bnu-math-p1-lower-2024', profile.id);
  library.sessions.push(session);
  const index = session.questions.findIndex(
    (x) => x.id === `${lesson.id}-five-all`,
  );
  required(session.responses[index]).draft = [
    0,
    null,
    null,
    null,
    null,
    null,
    null,
  ];
  expect(parseBackup(exportBackup(library)).data.sessions[1]).toEqual(session);
  for (const draft of [
    [4, 2, 5, 2, 3, 5, 5],
    [2, 4, 5, 2, 3, 5, 5],
  ])
    session.responses[index] = submitResponse(
      required(session.questions[index]),
      { ...required(session.responses[index]), draft },
    );
  const restored = parseBackup(exportBackup(library)).data;
  expect(restored.sessions[0]).toEqual(snapshot);
  expect(restored.sessions[1]).toEqual(session);
  expect(
    required(restored.sessions[1]).responses[index]?.submissions.map(
      (x) => x.correct,
    ),
  ).toEqual([false, true]);
  for (const key of ['answer', 'givens']) {
    const invalid = JSON.parse(exportBackup(library));
    invalid.data.sessions[1].questions[index].visual[key] = [[5]];
    expect(() => parseBackup(JSON.stringify(invalid))).toThrow(
      'educationLearning.invalidBackup',
    );
  }
});

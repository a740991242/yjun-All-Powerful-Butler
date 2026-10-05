import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { bnuNumberReview } from '../learning/bnu-number-review';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { bnuLowerHarvestLesson } from './bnu-lower-harvest';
import { bnuLowerNumberPracticeLesson as lesson } from './bnu-lower-number-practice';
import { bnuLowerNumberPracticeAudit as audit } from './bnu-lower-number-practice-audit';
import { bnuLowerNumberPracticeSource as source } from './bnu-lower-number-practice-source';

const q = (id: string) =>
  required(lesson.questions.find((x) => x.id === `${lesson.id}-${id}`));
it('independently checks all twenty-nine objectives including raw fifteen units, every blank and complete enumeration', () => {
  const answers: [string, Answer][] = [
    ['objects', [4, 3, 43]],
    ['sticks', [3, 8, 38]],
    ['counter', [2, 5, 25]],
    ['cubes-raw', [2, 15, 35]],
    ['cubes-regrouped', [3, 5, 35]],
    ['cubes-loose', 15],
    ['game-digits', [3, 4]],
    ['game-value', 34],
    ['game-beads', 7],
    ['peach-reference', 38],
    ['peach-selected', 42],
    ['peach-less', 35],
    ['book-selected', 85],
    ['book-only-greater', [85, 99, 40]],
    ['book-only-less', [85, 40]],
    ['book-incomplete', '不能，三个候选都大于36'],
    ['five-up', [30, 40, 50, 55]],
    ['two-up', [24, 30, 34, 36]],
    ['ten-up', [40, 50, 60, 70]],
    ['five-down', [80, 75, 70, 65]],
    ['descending-step', '每次减5'],
    ['beads-remaining', [4, 22, 31, 40]],
    ['beads-all', [4, 13, 22, 31, 40]],
    ['beads-digits', [0, 4, 2, 2, 3, 1, 4, 0]],
    ['beads-zero', 0],
    ['beads-count', 5],
    ['cards-six', [25, 28, 52, 58, 82, 85]],
    ['cards-count', 6],
    ['cards-duplicate', '不能，需要两张2'],
  ];
  expect(answers).toHaveLength(29);
  expect(
    lesson.questions
      .filter((x) => !['manual', 'reflection'].includes(x.rule.kind))
      .map((x) => x.id)
      .toSorted(),
  ).toEqual(answers.map(([id]) => q(id).id).toSorted());
  for (const [id, answer] of answers)
    expect(evaluate(q(id).rule, answer), id).toBe(true);
  for (const [id, answer] of [
    ['cubes-raw', [2, 5, 25]],
    ['cubes-regrouped', [2, 5, 35]],
    ['cubes-loose', 5],
    ['five-down', [90, 95, 100, 105]],
    ['beads-digits', [0, 4, 2, 2, 3, 1, 0, 4]],
    ['cards-six', [25, 28, 52, 58, 85, 82]],
  ] as [string, Answer][])
    expect(evaluate(q(id).rule, answer), id).toBe(false);
  expect(() => evaluate(q('cards-six').rule, [25, 28, 52])).toThrow(
    'educationLearning.answerRequired',
  );
  for (const activity of source.trains) {
    const task = q(activity.key);
    expect(task.visual).toEqual({
      kind: 'bnu-number-review',
      scene: activity.key,
      variant: 'main',
    });
    if (task.visual?.kind !== 'bnu-number-review')
      throw new Error('Missing train');
    const model = bnuNumberReview(task.visual);
    if (model.type !== 'train') throw new Error('Wrong visual');
    expect(model.values).toEqual(activity.given);
  }
});
it('independently exhausts both-rod placements and all ordered two-card selections without losing one-digit four or real zero', () => {
  const placements = Array.from({ length: 5 }, (_, t) => t * 10 + 4 - t);
  expect(q('beads-all').rule).toEqual({ kind: 'steps', values: placements });
  const cards: number[] = [];
  for (const t of [2, 5, 8])
    for (const o of [2, 5, 8]) if (t !== o) cards.push(t * 10 + o);
  expect(q('cards-six').rule).toEqual({
    kind: 'steps',
    values: cards.toSorted((a, b) => a - b),
  });
  expect(lesson.parentTip).toContain('原空次序开放与本站升序分开');
});
it('covers all seven source activities and all tasks while keeping sixteen real activities and four reflections independent', () => {
  expect(lesson.steps).toHaveLength(14);
  expect(lesson.questions).toHaveLength(49);
  expect(audit.activities.map((a) => [a.page, a.sourceActivity])).toEqual(
    source.activities.map((a) => [a.page, a.key]),
  );
  const ids: string[] = [];
  for (const activity of audit.activities) {
    for (const step of activity.steps)
      expect(lesson.steps[step - 1]).toBeDefined();
    for (const [kind, names] of [
      ['objective', activity.objective],
      ['manual', activity.manual],
      ['reflection', activity.records],
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
    16,
  );
  expect(
    lesson.questions.filter((x) => x.rule.kind === 'reflection'),
  ).toHaveLength(4);
  for (const task of lesson.questions.filter((x) => x.rule.kind === 'manual'))
    expect(evaluate(task.rule, 'confirmed')).toBeNull();
  for (const task of lesson.questions.filter(
    (x) => x.rule.kind === 'reflection',
  ))
    expect(evaluate(task.rule, '未做，未来计划另记')).toBeNull();
});
it('checks all ten genuinely changed review conditions independently', () => {
  const answers: Answer[] = [
    [3, 12, 42],
    [3, 2],
    52,
    76,
    [27, 37, 47, 52],
    [43, 49, 53, 55],
    [39, 49, 59, 69],
    [79, 74, 69, 64],
    [3, 12, 21, 30],
    [13, 17, 31, 37, 71, 73],
  ];
  expect(lesson.reviewQuestions).toHaveLength(10);
  for (const [i, task] of (lesson.reviewQuestions || []).entries())
    expect(evaluate(task.rule, required(answers[i]))).toBe(true);
  expect(
    evaluate(required(lesson.reviewQuestions?.[0]).rule, [2, 15, 35]),
  ).toBe(false);
  expect(
    evaluate(
      required(lesson.reviewQuestions?.[9]).rule,
      [25, 28, 52, 58, 82, 85],
    ),
  ).toBe(false);
});
it('preserves partial six/eight fields, real zero, retries, old snapshots and strict visual/old twenty-field limits', () => {
  const library = initialLibrary('百以内巩固');
  const old = createSession(
    bnuLowerHarvestLesson,
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
  const card = session.questions.findIndex((x) => x.id.endsWith('-cards-six'));
  const digits = session.questions.findIndex((x) =>
    x.id.endsWith('-beads-digits'),
  );
  session.responses[card]!.draft = [25, null, null, null, null, null];
  session.responses[digits]!.draft = [
    0,
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
    [25, 28, 52, 58, 85, 82],
    [25, 28, 52, 58, 82, 85],
  ])
    session.responses[card] = submitResponse(
      required(session.questions[card]),
      { ...required(session.responses[card]), draft },
    );
  const zero = session.questions.findIndex((x) => x.id.endsWith('-beads-zero'));
  session.responses[zero] = submitResponse(required(session.questions[zero]), {
    ...required(session.responses[zero]),
    draft: 0,
  });
  const restored = parseBackup(exportBackup(library)).data;
  expect(restored.sessions[0]).toEqual(snapshot);
  expect(restored.sessions[1]).toEqual(session);
  expect(
    restored.sessions[1]!.responses[card]!.submissions.map((x) => x.correct),
  ).toEqual([false, true]);
  const visualIndex = session.questions.findIndex(
    (x) => x.visual?.kind === 'bnu-number-review',
  );
  const invalid = JSON.parse(exportBackup(library));
  invalid.data.sessions[1].questions[visualIndex].visual.answer = 35;
  expect(() => parseBackup(JSON.stringify(invalid))).toThrow(
    'educationLearning.invalidBackup',
  );
  const excess = JSON.parse(exportBackup(library));
  excess.data.sessions[1].questions[card].rule.values = Array.from(
    { length: 21 },
    (_, i) => i,
  );
  expect(() => parseBackup(JSON.stringify(excess))).toThrow(
    'educationLearning.invalidBackup',
  );
});

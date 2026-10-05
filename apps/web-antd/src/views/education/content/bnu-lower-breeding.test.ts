import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { bnuLowerBreedingLesson as lesson } from './bnu-lower-breeding';
import { bnuLowerBreedingAudit as audit } from './bnu-lower-breeding-audit';
import { bnuLowerBreedingSource as source } from './bnu-lower-breeding-source';
import { bnuLowerRedFruitLesson } from './bnu-lower-red-fruit';
const q = (suffix: string) =>
  required(lesson.questions.find((x) => x.id === `${lesson.id}-${suffix}`));
it('independently checks all thirty-two objectives including every comparison direction and full clue sequence', () => {
  const answers: [string, Answer][] = [
    ['given-counts', [100, 22, 92]],
    ['most-three', '鸡'],
    ['least-three', '鹅'],
    ['rabbit-unknown', '不能，须等待数量条件或后页完整线索'],
    ['picture-count', '按标签100只，不用画中件数替换'],
    ['hen-goose', '多得多'],
    ['hen-duck', '多一些'],
    ['duck-hen', '少一些'],
    ['goose-hen', '少得多'],
    ['close-hen-duck', '差不多'],
    ['line-right', '100'],
    ['threshold', '不能，需结合对象和情境'],
    ['sheep-choice', 26],
    ['sheep-actual', '不能，只是题目候选推断'],
    ['rabbit-candidates', [18, 26, 90, 97]],
    ['rabbit-two-left', [90, 97]],
    ['rabbit-before-no', '不能，还需完整回应'],
    ['rabbit-final', 97],
    ['rabbit-order', '因为对90的猜测得到否定'],
    ['original-cards', [50, 98, 38, 10, 51]],
    ['sorted-cards', [10, 38, 50, 51, 98]],
    ['card-count', 5],
    ['fifty-fifty-one', '50在51前，两张不同卡'],
    ['select-minimum', [10, 38, 50, 51, 98]],
    ['insert-first-three', [38, 50, 98]],
    ['insert-all', [10, 38, 50, 51, 98]],
    ['partial-method', '不能，还要加入10和51'],
    ['marked-direction', '逐渐增大'],
    ['near-pair', [50, 51]],
    ['ninety-eight-between', [90, 100]],
    ['label-height', '不能，要看横线上的点位置'],
    ['site-zero', 0],
  ];
  expect(answers).toHaveLength(32);
  for (const [suffix, answer] of answers)
    expect(evaluate(q(suffix).rule, answer), suffix).toBe(true);
  for (const [suffix, answer] of [
    ['given-counts', [100, 92, 22]],
    ['rabbit-final', 90],
    ['rabbit-two-left', [97, 90]],
    ['sorted-cards', [10, 38, 50, 98, 51]],
    ['near-pair', [50, 50]],
    ['site-zero', 10],
  ] as [string, Answer][])
    expect(evaluate(q(suffix).rule, answer)).toBe(false);
  expect(() => evaluate(q('insert-all').rule, [38, 50, 98])).toThrow(
    'educationLearning.answerRequired',
  );
  expect(() => evaluate(q('site-zero').rule, null)).toThrow(
    'educationLearning.answerRequired',
  );
  expect(lesson.parentTip).toContain('不设普遍固定差数或比例阈值');
});
it('maps every task to the seven inspected activities without scoring actual actions or open records', () => {
  expect(lesson.steps).toHaveLength(8);
  expect(lesson.questions).toHaveLength(46);
  expect(audit.activities.map((x) => [x.page, x.sourceActivity])).toEqual(
    source.activities.map((x) => [x.page, x.key]),
  );
  const ids: string[] = [];
  for (const a of audit.activities) {
    for (const step of a.steps) expect(lesson.steps[step - 1]).toBeDefined();
    for (const [kind, suffixes] of [
      ['objective', a.objective],
      ['manual', a.manual],
      ['reflection', a.records],
    ] as const)
      for (const suffix of suffixes) {
        const task = q(suffix);
        expect(
          kind === 'objective'
            ? !['manual', 'reflection'].includes(task.rule.kind)
            : task.rule.kind === kind,
        ).toBe(true);
        ids.push(task.id);
      }
  }
  expect(ids.toSorted()).toEqual(lesson.questions.map((x) => x.id).toSorted());
  const manual = lesson.questions.filter((x) => x.rule.kind === 'manual');
  const records = lesson.questions.filter((x) => x.rule.kind === 'reflection');
  expect(manual).toHaveLength(9);
  expect(records).toHaveLength(5);
  for (const task of manual)
    expect(evaluate(task.rule, 'confirmed')).toBeNull();
  for (const task of records)
    expect(evaluate(task.rule, '尚未做，未来计划另记')).toBeNull();
});
it('changes review cards, directions, candidate set and the number-line reference', () => {
  const review = required(lesson.reviewQuestions);
  const answers: Answer[] = [
    '少得多',
    [12, 39, 40, 41, 90],
    '72',
    [41, 39],
    '不能，20与21仍是不同的数',
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
  expect(evaluate(review[1]!.rule, [10, 38, 50, 51, 98])).toBe(false);
  expect(evaluate(review[2]!.rule, '97')).toBe(false);
  expect(evaluate(review[3]!.rule, [39, 41])).toBe(false);
});
it('round-trips original marks, real zero, partial sorting and retry history while retaining the old red-fruit snapshot', () => {
  const library = initialLibrary('养殖场核对');
  const old = createSession(
    bnuLowerRedFruitLesson,
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
    x.id.endsWith('-sorted-cards'),
  );
  session.responses[index]!.draft = [10, null, null, null, null];
  expect(parseBackup(exportBackup(library)).data.sessions[1]).toEqual(session);
  for (const draft of [
    [10, 38, 50, 98, 51],
    [10, 38, 50, 51, 98],
  ])
    session.responses[index] = submitResponse(
      required(session.questions[index]),
      { ...required(session.responses[index]), draft },
    );
  const zero = session.questions.findIndex((x) => x.id.endsWith('-site-zero'));
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
  const bad = JSON.parse(exportBackup(library));
  const marked = bad.data.sessions[1].questions.find(
    (x: { visual?: { kind: string } }) =>
      x.visual?.kind === 'marked-number-line',
  );
  expect(marked).toBeDefined();
  marked.visual.answer = 0;
  expect(() => parseBackup(JSON.stringify(bad))).toThrow(
    'educationLearning.invalidBackup',
  );
});

import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { bnuLowerInterestingLesson } from './bnu-lower-interesting';
import { bnuLowerRecyclingLesson as lesson } from './bnu-lower-recycling';
import { bnuLowerRecyclingAudit as audit } from './bnu-lower-recycling-audit';
import { bnuLowerRecyclingSource as source } from './bnu-lower-recycling-source';

const q = (suffix: string) =>
  required(lesson.questions.find((x) => x.id === `${lesson.id}-${suffix}`));
it('checks the asked person, all relevant and temporarily unused information, full models, units and check', () => {
  const answers: [string, Answer][] = [
    ['asked', '小佳'],
    ['conditions', [13, 3, 4]],
    ['relevant', '小林13个，小佳比小林多3个'],
    ['unused', '小强比小佳少4个'],
    ['direction', '在13的基础上加3'],
    ['baseline', 13],
    ['one-to-one', 1],
    ['rod-groups', [10, 3, 3]],
    ['circle-groups', [13, 13, 3]],
    ['matched', 13],
    ['extra', 3],
    ['total', 16],
    ['equation', [13, 3, 16]],
    ['unit', '个'],
    ['check', [16, 13, 3]],
    ['check-method', '用16减13，看是不是3'],
    ['changed-ask', 12],
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
    ['total', 12],
    ['total', 29],
    ['matched', 26],
    ['extra', 16],
    ['rod-groups', [1, 3, 3]],
    ['check', [16, 13, 29]],
    ['changed-ask', 16],
    ['unit', '根'],
  ] as [string, Answer][])
    expect(evaluate(q(id).rule, answer), id).toBe(false);
});
it('covers every original activity with actual paper work and open records, without claiming UI or final review', () => {
  expect(lesson.steps).toHaveLength(10);
  expect(lesson.questions).toHaveLength(30);
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
        ids.push(task.id);
        expect(
          kind === 'objective'
            ? !['manual', 'reflection'].includes(task.rule.kind)
            : task.rule.kind === kind,
        ).toBe(true);
      }
  }
  expect(ids.toSorted()).toEqual(lesson.questions.map((x) => x.id).toSorted());
  expect(lesson.questions.filter((x) => x.rule.kind === 'manual')).toHaveLength(
    8,
  );
  expect(
    lesson.questions.filter((x) => x.rule.kind === 'reflection'),
  ).toHaveLength(4);
  for (const task of lesson.questions.filter((x) =>
    ['manual', 'reflection'].includes(x.rule.kind),
  ))
    expect(
      evaluate(
        task.rule,
        task.rule.kind === 'manual' ? 'confirmed' : '自己的真实方法，计划另记',
      ),
    ).toBeNull();
  expect(audit.finalTeacherReview).toBe('not-verified');
});
it('changes quantities and the asked person across all eight reviews', () => {
  const answers: [string, Answer][] = [
    ['total', 19],
    ['circles', [17, 17, 2]],
    ['rods', [10, 7, 2]],
    ['qiang', 14],
    ['needed', '小佳19个，小强比小佳少5个'],
    ['lin', 17],
    ['check', [2, 2]],
    ['extra', 2],
  ];
  expect(lesson.reviewQuestions).toHaveLength(8);
  for (const [id, answer] of answers)
    expect(
      evaluate(
        required(
          lesson.reviewQuestions?.find(
            (x) => x.id === `${lesson.id}-review-${id}`,
          ),
        ).rule,
        answer,
      ),
      id,
    ).toBe(true);
  expect(
    evaluate(
      required(
        lesson.reviewQuestions?.find((x) => x.id.endsWith('review-total')),
      ).rule,
      16,
    ),
  ).toBe(false);
  expect(
    evaluate(
      required(lesson.reviewQuestions?.find((x) => x.id.endsWith('review-lin')))
        .rule,
      21,
    ),
  ).toBe(false);
});
it('restores partial drafts, zero and wrong-then-correct attempts without changing prior snapshots; rejects extra visual fields', () => {
  const library = initialLibrary('回收废品');
  const old = createSession(
    bnuLowerInterestingLesson,
    'bnu-math-p1-lower-2024',
    library.activeProfileId,
  );
  const oldCopy = structuredClone(old);
  const session = createSession(
    lesson,
    'bnu-math-p1-lower-2024',
    library.activeProfileId,
  );
  library.sessions = [old, session];
  const partial = session.questions.findIndex(
    (x) => x.id === q('circle-groups').id,
  );
  required(session.responses[partial]).draft = [13, null, 3];
  const zero = session.questions.findIndex((x) => x.id === q('site-zero').id);
  required(session.responses[zero]).draft = 0;
  expect(parseBackup(exportBackup(library)).data.sessions[1]).toEqual(session);
  const index = session.questions.findIndex((x) => x.id === q('total').id);
  for (const draft of [12, 16])
    session.responses[index] = submitResponse(
      required(session.questions[index]),
      { ...required(session.responses[index]), draft },
    );
  session.responses[zero] = submitResponse(
    required(session.questions[zero]),
    required(session.responses[zero]),
  );
  const restored = parseBackup(exportBackup(library)).data;
  expect(restored.sessions[0]).toEqual(oldCopy);
  expect(restored.sessions[1]).toEqual(session);
  expect(
    required(session.responses[index]).submissions.map((x) => x.correct),
  ).toEqual([false, true]);
  expect(required(session.responses[zero]).submissions[0]?.correct).toBe(true);
  for (const extra of [
    { answer: 16 },
    { matched: 13 },
    { extra: 3 },
    { variant: 'unknown' },
  ]) {
    const invalid = JSON.parse(exportBackup(library));
    Object.assign(invalid.data.sessions[1].questions[partial].visual, extra);
    expect(() => parseBackup(JSON.stringify(invalid))).toThrow(
      'educationLearning.invalidBackup',
    );
  }
});

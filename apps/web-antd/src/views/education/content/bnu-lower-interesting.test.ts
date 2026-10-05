import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { bnuLowerInterestingLesson as lesson } from './bnu-lower-interesting';
import { bnuLowerInterestingAudit as audit } from './bnu-lower-interesting-audit';
import { bnuLowerInterestingSource as source } from './bnu-lower-interesting-source';
import { bnuLowerWrittenLesson } from './bnu-lower-written';

const q = (suffix: string) =>
  required(lesson.questions.find((x) => x.id === `${lesson.id}-${suffix}`));
it('independently checks every objective, all seventeen blanks of both tables and all eight missing addends', () => {
  const answers: [string, Answer][] = [
    ['examples', [33, 55]],
    ['example-digits', [1, 2, 2, 1]],
    ['reverse-meaning', '十位与个位互相交换'],
    ['find44', [22, 22]],
    ['source44-examples', [44, 44]],
    ['repeated-addend', '满足，22互换数位后仍是22'],
    ['find99', [18, 81, 45, 54, 36, 63]],
    ['source99-examples', [99, 99, 99]],
    [
      'addition-all',
      [22, 33, 44, 41, 55, 15, 51, 66, 16, 61, 77, 17, 71, 88, 18, 81, 99],
    ],
    ['addition-increase', 11],
    ['addition-place-increase', [1, 10]],
    [
      'subtraction-all',
      [11, 12, 13, 41, 14, 66, 51, 15, 77, 61, 16, 88, 71, 17, 99, 81, 18],
    ],
    ['subtraction-increase', 1],
    ['subtraction-place-increase', [11, 10]],
    ['eleven-all', [11, 11, 11, 11, 11, 11, 11, 11]],
    ['eleven-places', [1, 1]],
    ['leading-zero', '不能，04表示4，不是两位数'],
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
    ['find44', [40, 4]],
    ['find99', [18, 81, 18, 81, 18, 81]],
    ['addition-increase', 1],
    ['subtraction-increase', 11],
    ['eleven-places', [0, 11]],
    ['site-zero', 1],
  ] as [string, Answer][])
    expect(evaluate(q(id).rule, answer), id).toBe(false);
  for (const answer of [
    [13, 31],
    [31, 13],
    [22, 22],
  ])
    expect(evaluate(q('find44').rule, answer)).toBe(true);
  expect(evaluate(q('find99').rule, [81, 18, 72, 27, 63, 36])).toBe(true);
});
it('maps all six original activities while preserving ten real activities, five open records and unknown final review', () => {
  expect(lesson.steps).toHaveLength(10);
  expect(lesson.questions).toHaveLength(33);
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
    10,
  );
  expect(
    lesson.questions.filter((x) => x.rule.kind === 'reflection'),
  ).toHaveLength(5);
  for (const task of lesson.questions.filter((x) =>
    ['manual', 'reflection'].includes(x.rule.kind),
  ))
    expect(
      evaluate(
        task.rule,
        task.rule.kind === 'manual' ? 'confirmed' : '自己的真实发现；计划另记',
      ),
    ).toBeNull();
  expect(source.status).toBe('source-checked');
  expect(audit.finalTeacherReview).toBe('not-verified');
});
it('checks all eight changed-condition reviews and additional legitimate open answers', () => {
  const answers: [string, Answer][] = [
    ['review-find66', [33, 33]],
    ['review-find77', [16, 61, 25, 52, 34, 43]],
    ['review-addition', [99, 88, 77, 66, 55, 44, 33, 22]],
    ['review-subtraction', [18, 17, 16, 15, 14, 13, 12, 11]],
    ['review-missing', [22, 22, 22, 22, 22, 22, 22, 22]],
    ['review-example', [24, 42, 66]],
    ['review-reverse', 72],
    ['review-changes', [2, 20, 22]],
  ];
  expect(lesson.reviewQuestions).toHaveLength(8);
  for (const [id, answer] of answers)
    expect(
      evaluate(
        required(
          lesson.reviewQuestions?.find((x) => x.id === `${lesson.id}-${id}`),
        ).rule,
        answer,
      ),
      id,
    ).toBe(true);
  const find = (id: string) =>
    required(
      lesson.reviewQuestions?.find((x) => x.id === `${lesson.id}-${id}`),
    );
  expect(evaluate(find('review-find66').rule, [51, 15])).toBe(true);
  expect(evaluate(find('review-find77').rule, [61, 16, 52, 25, 43, 34])).toBe(
    true,
  );
  expect(evaluate(find('review-find66').rule, [22, 22])).toBe(false);
  expect(evaluate(find('review-find77').rule, [18, 81, 45, 54, 36, 63])).toBe(
    false,
  );
  expect(
    evaluate(find('review-missing').rule, [11, 11, 11, 11, 11, 11, 11, 11]),
  ).toBe(false);
});
it('preserves seventeen-field partials, open six-field answers, true zero and immutable prior snapshots', () => {
  const library = initialLibrary('有趣的算式');
  const old = createSession(
    bnuLowerWrittenLesson,
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
    (x) => x.id === `${lesson.id}-addition-all`,
  );
  required(session.responses[index]).draft = [
    22,
    ...Array.from({ length: 16 }, () => null),
  ];
  const pair = session.questions.findIndex(
    (x) => x.id === `${lesson.id}-find99`,
  );
  required(session.responses[pair]).draft = [18, 81, null, null, null, null];
  expect(parseBackup(exportBackup(library)).data.sessions[1]).toEqual(session);
  for (const draft of [
    [22, 33, 44, 41, 55, 15, 51, 66, 16, 61, 77, 17, 71, 88, 18, 81, 0],
    [22, 33, 44, 41, 55, 15, 51, 66, 16, 61, 77, 17, 71, 88, 18, 81, 99],
  ])
    session.responses[index] = submitResponse(
      required(session.questions[index]),
      { ...required(session.responses[index]), draft },
    );
  session.responses[pair] = submitResponse(required(session.questions[pair]), {
    ...required(session.responses[pair]),
    draft: [81, 18, 72, 27, 63, 36],
  });
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
    required(restored.sessions[1]).responses[pair]?.submissions[0]?.correct,
  ).toBe(true);
  expect(
    required(restored.sessions[1]).responses[zero]?.submissions[0]?.correct,
  ).toBe(true);
  for (const key of ['rule', 'visual'] as const) {
    const invalid = JSON.parse(exportBackup(library));
    if (key === 'rule')
      invalid.data.sessions[1].questions[pair].rule.answers = [18, 81];
    else invalid.data.sessions[1].questions[index].visual.answers = [22, 33];
    expect(() => parseBackup(JSON.stringify(invalid))).toThrow(
      'educationLearning.invalidBackup',
    );
  }
});

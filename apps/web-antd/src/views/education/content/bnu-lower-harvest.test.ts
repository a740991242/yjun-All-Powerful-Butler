import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { bnuLowerHarvestLesson as lesson } from './bnu-lower-harvest';
import { bnuLowerHarvestAudit as audit } from './bnu-lower-harvest-audit';
import { bnuLowerHarvestSource as source } from './bnu-lower-harvest-source';
import { bnuLowerHundredChartLesson } from './bnu-lower-hundred-chart';

const q = (suffix: string) =>
  required(
    lesson.questions.find((task) => task.id === `${lesson.id}-${suffix}`),
  );

it('independently checks every main objective, all four records and eight ordered digits', () => {
  const answers: [string, Answer][] = [
    ['counts', [95, 92, 85, 79]],
    ['counter-digits', [9, 5, 9, 2, 8, 5, 7, 9]],
    ['descending', [95, 92, 85, 79]],
    ['most', '冬冬'],
    ['unit', '一分钟'],
    ['age-not-counts', '年龄'],
    ['tens95', 9],
    ['ones95', 5],
    ['beads95', 14],
    ['compare-method', '十位'],
    ['not-health-rule', '不能，只比较题中四条记录'],
    ['site-zero', 0],
    ['eighty-five', 85],
    ['tens85', 8],
    ['ones85', 5],
    ['beads85', 13],
    ['decomposition', [80, 5]],
    ['symbols', [8, 5]],
    ['symbol-count', 13],
    ['symbol-convention', '每长方形代表十，每三角形代表一'],
  ];
  expect(answers).toHaveLength(20);
  const objective = lesson.questions.filter(
    (x) => !['manual', 'reflection'].includes(x.rule.kind),
  );
  expect(objective.map((x) => x.id).toSorted()).toEqual(
    answers.map(([id]) => q(id).id).toSorted(),
  );
  for (const [id, value] of answers)
    expect(evaluate(q(id).rule, value), id).toBe(true);
  for (const [id, value] of [
    ['counts', [6, 9, 12, 18]],
    ['counter-digits', [9, 5, 9, 2, 8, 5, 9, 7]],
    ['descending', [79, 85, 92, 95]],
    ['beads95', 95],
    ['beads85', 85],
    ['decomposition', [8, 5]],
    ['site-zero', 9],
  ] as [string, Answer][])
    expect(evaluate(q(id).rule, value), id).toBe(false);
  expect(() => evaluate(q('counter-digits').rule, [9, 5])).toThrow(
    'educationLearning.answerRequired',
  );
  expect(q('counter-digits').visual).toEqual({
    kind: 'place-counters',
    values: [95, 92, 85, 79],
  });
});
it('covers all source activities and keeps both open representations, actual activity, discussion and plans independent', () => {
  expect(lesson.steps).toHaveLength(6);
  expect(lesson.questions).toHaveLength(36);
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
  const manuals = lesson.questions.filter((x) => x.rule.kind === 'manual');
  const records = lesson.questions.filter((x) => x.rule.kind === 'reflection');
  expect(manuals).toHaveLength(9);
  expect(records).toHaveLength(7);
  for (const task of manuals)
    expect(evaluate(task.rule, 'confirmed')).toBeNull();
  for (const task of records)
    expect(evaluate(task.rule, '尚未做，记录自己的想法')).toBeNull();
  expect(q('own85-a').rule.kind).toBe('reflection');
  expect(q('own85-b').rule.kind).toBe('reflection');
  expect(q('own-question').rule.kind).toBe('reflection');
  expect(q('own-idea').rule.kind).toBe('reflection');
  expect(q('plan').explanation).toContain('未来计划不记成已经');
  expect(lesson.parentTip).toContain('原图未独立写图例');
  expect(lesson.parentTip).toContain('原十个位图与本站共享空百位辅助分开');
});
it('checks all five new review conditions independently without reusing the original records', () => {
  const answers: Answer[] = [
    [94, 89, 87, 76],
    [8, 7, 8, 9, 7, 6, 9, 4],
    18,
    [60, 8],
    '丁',
  ];
  expect(lesson.reviewQuestions).toHaveLength(5);
  for (const [i, task] of (lesson.reviewQuestions || []).entries())
    expect(evaluate(task.rule, required(answers[i]))).toBe(true);
  expect(
    evaluate(required(lesson.reviewQuestions?.[0]).rule, [95, 92, 85, 79]),
  ).toBe(false);
  expect(
    evaluate(
      required(lesson.reviewQuestions?.[1]).rule,
      [9, 5, 9, 2, 8, 5, 7, 9],
    ),
  ).toBe(false);
});
it('preserves eight-field partial drafts, real zero, failed then corrected history, strict old limits and the prior hundred-chart snapshot', () => {
  const library = initialLibrary('百以内收获测试');
  const old = createSession(
    bnuLowerHundredChartLesson,
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
    x.id.endsWith('-counter-digits'),
  );
  session.responses[index]!.draft = [
    9,
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
    [9, 5, 9, 2, 8, 5, 9, 7],
    [9, 5, 9, 2, 8, 5, 7, 9],
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
  const invalid = JSON.parse(exportBackup(library));
  invalid.data.sessions[1].questions[index].visual.values.length = 5;
  expect(() => parseBackup(JSON.stringify(invalid))).toThrow(
    'educationLearning.invalidBackup',
  );
  const excess = JSON.parse(exportBackup(library));
  excess.data.sessions[1].questions[index].rule.values = Array.from(
    { length: 21 },
    (_, i) => i,
  );
  expect(() => parseBackup(JSON.stringify(excess))).toThrow(
    'educationLearning.invalidBackup',
  );
});

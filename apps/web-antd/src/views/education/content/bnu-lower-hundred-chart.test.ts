import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { bnuHundredTable } from '../learning/bnu-hundred-table';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { bnuLowerComparisonPracticeLesson } from './bnu-lower-comparison-practice';
import { bnuLowerHundredChartLesson as lesson } from './bnu-lower-hundred-chart';
import { bnuLowerHundredChartAudit as audit } from './bnu-lower-hundred-chart-audit';
import { bnuLowerHundredChartSource as source } from './bnu-lower-hundred-chart-source';

const q = (suffix: string) =>
  required(
    lesson.questions.find((item) => item.id === `${lesson.id}-${suffix}`),
  );
const values = (suffix: string) => {
  const rule = q(suffix).rule;
  if (rule.kind !== 'steps')
    throw new Error('Expected a complete sequence task');
  return rule.values;
};
it('independently checks all eighty blanks row by row, keeping original givens and never exposing fill answers', () => {
  const given: readonly number[] = source.chart.given;
  const rows = [
    [2, 3, 4, 5, 6, 7, 8, 9],
    [11, 13, 14, 15, 16, 17, 18, 20],
    [21, 22, 24, 25, 26, 27, 29, 30],
    [31, 32, 33, 35, 36, 38, 39, 40],
    [41, 42, 43, 44, 47, 48, 49, 50],
    [51, 52, 53, 54, 57, 58, 59, 60],
    [61, 62, 63, 65, 66, 68, 69, 70],
    [71, 72, 74, 75, 76, 77, 79, 80],
    [81, 83, 84, 85, 86, 87, 88, 90],
    [92, 93, 94, 95, 96, 97, 98, 99],
  ];
  expect(rows.flat()).toHaveLength(80);
  expect(rows.flat().toSorted((a, b) => a - b)).toEqual(
    Array.from({ length: 100 }, (_, i) => i + 1).filter(
      (n) => !given.includes(n),
    ),
  );
  for (const [i, answers] of rows.entries()) {
    const task = q(`row-${i + 1}`);
    expect(evaluate(task.rule, answers)).toBe(true);
    expect(task.visual).toEqual({
      kind: 'bnu-hundred-table',
      scene: 'full',
      variant: 'main',
      row: i + 1,
    });
    expect(task.rule.kind).toBe('steps');
    if (task.rule.kind === 'steps') expect(task.rule.values).toHaveLength(8);
  }
  expect(evaluate(q('row-1').rule, [1, 2, 3, 4, 5, 6, 7, 8])).toBe(false);
  expect(() => evaluate(q('row-1').rule, [2, 3])).toThrow(
    'educationLearning.answerRequired',
  );
});
it('independently checks all twenty-five other objectives, directions, complete fragments and every digit condition', () => {
  const answers: [string, Answer][] = [
    ['minimum', 1],
    ['maximum', 100],
    ['given-count', 20],
    ['blank-count', 80],
    ['hundred-tens-zero', 0],
    ['third-column', [3, 13, 23, 33, 43, 53, 63, 73, 83, 93]],
    ['right-neighbour', 24],
    ['below-neighbour', 33],
    ['row-boundary', '不是，11换到第二行第一列'],
    ['two-diagonals', [45, 43]],
    ['fragment-58', [59, 68, 69, 70, 79]],
    ['fragment-58-centre', 69],
    ['fragment-67', [56, 57, 58, 66, 68, 76, 77, 78]],
    ['fragment-67-neighbours', [68, 77]],
    ['ones-zero', [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]],
    ['ones-seven', [7, 17, 27, 37, 47, 57, 67, 77, 87, 97]],
    ['equal-digits-full', [11, 22, 33, 44, 55, 66, 77, 88, 99, 100]],
    ['equal-digits-two', [11, 22, 33, 44, 55, 66, 77, 88, 99]],
    ['ones-one-less', [10, 21, 32, 43, 54, 65, 76, 87, 98]],
    ['colour-overlap', '个位0，且十个位相同'],
    ['line-two', [36, 38, 40]],
    ['line-ten', [50, 60, 90, 100]],
    ['practice-one', [29, 37, 39, 47, 48]],
    ['practice-two', [30, 32, 41, 50, 52]],
    ['practice-three', [74, 75, 76, 84, 86, 94, 95, 96]],
  ];
  expect(answers).toHaveLength(25);
  for (const [suffix, answer] of answers)
    expect(evaluate(q(suffix).rule, answer), suffix).toBe(true);
  const wrong: [string, Answer][] = [
    ['two-diagonals', [45, 45]],
    ['line-two', [35, 36, 37]],
    ['line-ten', [80, 90, 100, 110]],
    ['fragment-67-neighbours', [77, 68]],
    ['practice-three', [85, 86, 87, 95, 97, 105, 106, 107]],
    ['ones-zero', [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]],
    ['hundred-tens-zero', 10],
  ];
  for (const [suffix, answer] of wrong)
    expect(evaluate(q(suffix).rule, answer), suffix).toBe(false);
  for (let n = 1; n <= 100; n++) {
    const ones = n % 10;
    const tens = Math.floor(n / 10) % 10;
    expect(values('ones-zero').includes(n)).toBe(ones === 0);
    expect(values('ones-seven').includes(n)).toBe(ones === 7);
    expect(values('equal-digits-full').includes(n)).toBe(tens === ones);
    expect(values('equal-digits-two').includes(n)).toBe(
      n >= 10 && n <= 99 && tens === ones,
    );
    expect(values('ones-one-less').includes(n)).toBe(ones === tens - 1);
  }
});
it('maps all fifty-six main tasks to the seven inspected activities and separates actual activity, reflection and plans', () => {
  expect(lesson.steps).toHaveLength(8);
  expect(lesson.questions).toHaveLength(56);
  expect(audit.activities.map((a) => [a.page, a.sourceActivity])).toEqual(
    source.activities.map((a) => [a.page, a.key]),
  );
  const ids: string[] = [];
  for (const a of audit.activities) {
    for (const s of a.steps) expect(lesson.steps[s - 1]).toBeDefined();
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
  expect(ids.toSorted()).toEqual(lesson.questions.map((a) => a.id).toSorted());
  const manual = lesson.questions.filter((a) => a.rule.kind === 'manual');
  const records = lesson.questions.filter((a) => a.rule.kind === 'reflection');
  expect(manual).toHaveLength(15);
  expect(records).toHaveLength(6);
  for (const task of manual)
    expect(evaluate(task.rule, 'confirmed')).toBeNull();
  for (const task of records)
    expect(evaluate(task.rule, '尚未做，未来计划另记')).toBeNull();
});
it('uses new givens, anchors, centre, number-line start and reversed digit condition in review', () => {
  const review = required(lesson.reviewQuestions);
  const answers: Answer[] = [
    [11, 12, 14, 15, 16, 17, 19, 20],
    [49, 58, 59, 60, 69],
    [65, 66, 67, 75, 77, 85, 86, 87],
    [47, 49, 51],
    [12, 23, 34, 45, 56, 67, 78, 89],
  ];
  expect(review).toHaveLength(5);
  for (const [i, task] of review.entries()) {
    expect(evaluate(task.rule, required(answers[i]))).toBe(true);
    expect(
      lesson.questions.some(
        (old) => old.id === task.id || old.prompt === task.prompt,
      ),
    ).toBe(false);
  }
  expect(evaluate(review[0]!.rule, [11, 13, 14, 15, 16, 17, 18, 20])).toBe(
    false,
  );
  expect(evaluate(review[1]!.rule, [59, 68, 69, 70, 79])).toBe(false);
});
it('round-trips row letters, partial nulls, real zero and retry history while preserving the previous lesson snapshot', () => {
  const library = initialLibrary('完整百数表核对');
  const old = createSession(
    bnuLowerComparisonPracticeLesson,
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
  const rowIndex = session.questions.findIndex((item) =>
    item.id.endsWith('-row-1'),
  );
  session.responses[rowIndex]!.draft = [
    2,
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
    [1, 2, 3, 4, 5, 6, 7, 8],
    [2, 3, 4, 5, 6, 7, 8, 9],
  ])
    session.responses[rowIndex] = submitResponse(
      required(session.questions[rowIndex]),
      {
        ...required(session.responses[rowIndex]),
        draft,
      },
    );
  const z = session.questions.findIndex((x) =>
    x.id.endsWith('-hundred-tens-zero'),
  );
  session.responses[z] = submitResponse(required(session.questions[z]), {
    ...required(session.responses[z]),
    draft: 0,
  });
  const restored = parseBackup(exportBackup(library)).data;
  expect(restored.sessions[0]).toEqual(snapshot);
  expect(restored.sessions[1]).toEqual(session);
  expect(
    restored.sessions[1]!.responses[rowIndex]!.submissions.map(
      (s) => s.correct,
    ),
  ).toEqual([false, true]);
  const bad = JSON.parse(exportBackup(library));
  bad.data.sessions[1].questions[rowIndex].visual.answer = 80;
  expect(() => parseBackup(JSON.stringify(bad))).toThrow(
    'educationLearning.invalidBackup',
  );
  const tooMany = JSON.parse(exportBackup(library));
  tooMany.data.sessions[1].questions[rowIndex].rule.values = Array.from(
    { length: 21 },
    (_, i) => i,
  );
  expect(() => parseBackup(JSON.stringify(tooMany))).toThrow(
    'educationLearning.invalidBackup',
  );
  expect(
    bnuHundredTable({
      kind: 'bnu-hundred-table',
      scene: 'full',
      variant: 'main',
      row: 1,
    })[0]
      ?.cells.filter((c) => c.label !== null)
      .every((c) => c.value === null),
  ).toBe(true);
});

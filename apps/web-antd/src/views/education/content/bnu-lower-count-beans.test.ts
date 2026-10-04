import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { isDigitCounterVisual } from '../learning/digit-counter';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import {
  counterPlaces,
  isPlaceCountersVisual,
} from '../learning/place-counters';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { bnuLowerCountBeansLesson as lesson } from './bnu-lower-count-beans';
import { bnuLowerCountBeansAudit as audit } from './bnu-lower-count-beans-audit';
import { bnuLowerCountBeansSource as source } from './bnu-lower-count-beans-source';
import { bnuLowerCountHundredLesson } from './bnu-lower-count-hundred';
const q = (suffix: string) =>
  required(lesson.questions.find((x) => x.id === `${lesson.id}-${suffix}`));
it('independently checks all thirty-four fixed objectives without replacing personal estimates or actual activities', () => {
  const answers: [string, number | number[] | string][] = [
    ['estimate-cases', [50, 28, 20, 22]],
    ['estimate-order', '先留下估计，再完整数'],
    ['estimate-personal', '不能，自己的实际数量未确定'],
    ['estimate-direction', '第一估多，第二估少'],
    ['estimate-close', '不能，不能由一个例子定所有情境'],
    ['read-pair', [28, 22]],
    ['twenty-eight-parts', [2, 8, 28]],
    ['twenty-eight-beads', 10],
    ['two-twos', [20, 2, 22]],
    ['beads-and-value', '不是，要按每颗珠所在数位读'],
    ['near-hundred', [97, 98, 99, 100]],
    ['hundred-parts', [1, 0, 0]],
    ['hundred-beads', 1],
    ['hundred-value', 100],
    ['zero-tens', 0],
    ['unknown-counter', '不能，未给珠数不等于空计数器'],
    ['forty-two-parts', [4, 2, 42]],
    ['make-thirty-four', [3, 4, 34]],
    ['same-forty-two', '不能，它们是同一个42的两种表示'],
    ['changed-places', [4, 3, 43]],
    ['twenty-six-parts', [2, 6, 26]],
    ['two-bundles', '不能，目前只有20根，还缺6根'],
    ['twenty-six-beads', 8],
    ['life-read-values', [27, 99]],
    ['life-twenty-seven', [2, 7, 27]],
    ['life-ninety-nine', [9, 9, 99]],
    ['mission-unit', '不是，这是任务序次'],
    ['historical-example', '不能，原教材例句不是当前更新记录'],
    ['page-hundred', '不能，页码是该页编号'],
    ['door-hundred', '不能，门牌号不是人数'],
    ['label-hundred', '不能，标示数量不说明当前剩余'],
    ['same-hundred', '不同，要结合对象分清编号与数量'],
    ['unknown-pages', '不能，总页数没有给出'],
    ['read-hundred', '一百'],
  ];
  expect(answers).toHaveLength(34);
  for (const [suffix, answer] of answers)
    expect(evaluate(q(suffix).rule, answer), suffix).toBe(true);
  const wrong: [string, number | number[]][] = [
    ['estimate-cases', [50, 50, 20, 20]],
    ['twenty-eight-beads', 28],
    ['hundred-beads', 100],
    ['hundred-value', 1],
    ['read-pair', [22, 28]],
    ['two-twos', [2, 2, 4]],
    ['near-hundred', [97, 98, 99, 1]],
    ['changed-places', [3, 4, 34]],
  ];
  for (const [suffix, answer] of wrong)
    expect(evaluate(q(suffix).rule, answer)).toBe(false);
  expect(() => evaluate(q('zero-tens').rule, null)).toThrow(
    'educationLearning.answerRequired',
  );
});
it('checks every number from zero through one hundred and strict dense diagram fields while preserving the old counter contract', () => {
  for (let value = 0; value <= 100; value++) {
    const places = counterPlaces(value);
    expect(places.hundreds * 100 + places.tens * 10 + places.ones).toBe(value);
    expect(places.hundreds).toBe(value === 100 ? 1 : 0);
    expect(places.tens).toBe(Math.floor(value / 10) % 10);
    expect(places.ones).toBe(value % 10);
    expect(
      isPlaceCountersVisual({ kind: 'place-counters', values: [value] }),
    ).toBe(true);
  }
  expect([97, 98, 99, 100].map((value) => counterPlaces(value))).toEqual([
    { hundreds: 0, tens: 9, ones: 7 },
    { hundreds: 0, tens: 9, ones: 8 },
    { hundreds: 0, tens: 9, ones: 9 },
    { hundreds: 1, tens: 0, ones: 0 },
  ]);
  for (const value of [
    null,
    [],
    { kind: 'place-counters', values: [] },
    { kind: 'place-counters', values: [1, 2, 3, 4, 5] },
    { kind: 'place-counters', values: [-1] },
    { kind: 'place-counters', values: [101] },
    { kind: 'place-counters', values: [1.5] },
    { kind: 'place-counters', values: [Number.NaN] },
    { kind: 'place-counters', values: ['100'] },
    { kind: 'place-counters', values: Array.from({ length: 2 }, () => null) },
    { kind: 'place-counters', values: [100], answer: 100 },
  ])
    expect(isPlaceCountersVisual(value)).toBe(false);
  const sparse: number[] = [];
  sparse.length = 2;
  sparse[1] = 100;
  expect(
    isPlaceCountersVisual({ kind: 'place-counters', values: sparse }),
  ).toBe(false);
  expect(
    isDigitCounterVisual({ kind: 'digit-counter', tens: 9, ones: 9 }),
  ).toBe(true);
  expect(
    isDigitCounterVisual({ kind: 'digit-counter', tens: 10, ones: 0 }),
  ).toBe(false);
  expect(() => counterPlaces(101)).toThrow('educationLearning.invalidRecord');
});
it('maps all fifty-seven tasks to seven original activities and leaves sixteen actual tasks plus seven records ungraded', () => {
  expect(lesson.steps).toHaveLength(8);
  expect(lesson.questions).toHaveLength(57);
  expect(audit.activities.map((x) => [x.page, x.sourceActivity])).toEqual(
    source.activities.map((x) => [x.page, x.key]),
  );
  const actual = lesson.questions.filter((x) => x.rule.kind === 'manual');
  const records = lesson.questions.filter((x) => x.rule.kind === 'reflection');
  expect(actual).toHaveLength(16);
  expect(records).toHaveLength(7);
  for (const item of actual)
    expect(evaluate(item.rule, 'confirmed')).toBeNull();
  for (const item of records)
    expect(evaluate(item.rule, '未做，计划另记')).toBeNull();
  const covered = new Set<string>();
  for (const activity of audit.activities) {
    for (const step of activity.steps)
      expect(lesson.steps[step - 1]).toBeDefined();
    for (const [kind, suffixes] of [
      ['objective', activity.objective],
      ['manual', activity.manual],
      ['reflection', activity.records],
    ] as const)
      for (const suffix of suffixes) {
        const item = q(suffix);
        expect(
          kind === 'objective'
            ? !['manual', 'reflection'].includes(item.rule.kind)
            : item.rule.kind === kind,
        ).toBe(true);
        covered.add(item.id);
      }
  }
  expect([...covered].toSorted()).toEqual(
    lesson.questions.map((x) => x.id).toSorted(),
  );
});
it('changes review quantities, direction and conditions and preserves zero, partial sequence, retries and old snapshots in strict backup', () => {
  const review = required(lesson.reviewQuestions);
  expect(review).toHaveLength(5);
  const answers = [
    [3, 6, 36],
    [8, 0, 80],
    [99, 98, 97, 96],
    '先估20后数32，这次估少了',
    '不能，需要查看当前剩余',
  ];
  for (const [i, item] of review.entries()) {
    expect(evaluate(item.rule, required(answers[i]))).toBe(true);
    expect(
      lesson.questions.some(
        (old) => old.id === item.id || old.prompt === item.prompt,
      ),
    ).toBe(false);
  }
  expect(evaluate(review[0]!.rule, [2, 8, 28])).toBe(false);
  expect(evaluate(review[2]!.rule, [97, 98, 99, 100])).toBe(false);
  const library = initialLibrary('数豆子');
  const old = createSession(
    bnuLowerCountHundredLesson,
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
    (x) => x.id === `${lesson.id}-near-hundred`,
  );
  session.responses[index]!.draft = [97, null, null, null];
  expect(parseBackup(exportBackup(library)).data).toEqual(library);
  for (const answer of [
    [97, 98, 99, 1],
    [97, 98, 99, 100],
  ]) {
    session.responses[index]!.draft = answer;
    session.responses[index] = submitResponse(
      session.questions[index]!,
      session.responses[index]!,
    );
  }
  const zeroIndex = session.questions.findIndex(
    (x) => x.id === `${lesson.id}-zero-tens`,
  );
  session.responses[zeroIndex]!.draft = 0;
  session.responses[zeroIndex] = submitResponse(
    session.questions[zeroIndex]!,
    session.responses[zeroIndex]!,
  );
  const restored = parseBackup(exportBackup(library)).data;
  expect(restored.sessions[0]).toEqual(snapshot);
  expect(restored.sessions[1]).toEqual(session);
  expect(
    restored.sessions[1]!.responses[index]!.submissions.map((x) => x.correct),
  ).toEqual([false, true]);
  const bad = JSON.parse(exportBackup(library));
  const diagram = bad.data.sessions[1].questions.find(
    (x: { visual?: unknown }) => x.visual,
  )?.visual;
  expect(diagram).toBeDefined();
  diagram.answer = 28;
  expect(() => parseBackup(JSON.stringify(bad))).toThrow(
    'educationLearning.invalidBackup',
  );
});

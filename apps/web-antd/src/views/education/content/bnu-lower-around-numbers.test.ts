import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  aroundNumberMarkers,
  isBnuAroundNumbersVisual,
} from '../learning/bnu-around-numbers';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { bnuLowerAroundNumbersLesson as lesson } from './bnu-lower-around-numbers';
import { bnuLowerAroundNumbersAudit as audit } from './bnu-lower-around-numbers-audit';
import { bnuLowerSubtractionPracticeLesson } from './bnu-lower-subtraction-practice';
const q = (suffix: string) =>
  required(
    lesson.questions.find((item) => item.id === `${lesson.id}-${suffix}`),
  );
it('independently checks every fixed objective without treating original examples as personal quantities', () => {
  const answers: [string, number | number[] | string][] = [
    ['pile', '不能，需要数或对应比较'],
    ['unknown-pile', '不能，这是不同对象，数量未知'],
    ['after-twenty', [21, 22, 23]],
    ['after-twenty-nine', [30, 31, 32]],
    ['new-start', [29, 30, 31]],
    ['group-twos', [31, 0, 62]],
    ['group-fives', [12, 2, 62]],
    ['odd-pair', [32, 1, 65]],
    ['zero-remainder', 0],
    ['keep-remainder', '不准确，余下2个也要数进去'],
    ['circle-count', 62],
    ['circle-rows', [6, 10, 2, 62]],
    ['circle-meaning', '没有，一行表示十，每圆仍一'],
    ['triangle-markers', [7, 5, 12]],
    ['triangle-value', 75],
    ['triangle-convention', '不一定，先说明约定'],
    ['changed-convention', 12],
    ['triangle-groups', [70, 5, 75]],
    ['life-numbers', [32, 36, 36, 92, 94]],
    ['life-units', '32个棋子、36支蜡笔、36名同学、跳绳92次'],
    ['rounds', '不一样，分别是92次和94次'],
    ['future-round', '不能，要实际观察记录下一轮'],
    ['own-class', '不能，需自己的实际信息'],
    ['plan-or-actual', '不是，这是未来计划'],
    ['own-total', '不能，对象和范围不同'],
    ['zero-box', 0],
    ['unknown-box', '不能，未检查不等于没有'],
    ['method-choice', '逐一或合理分组都可，记清余数和符号约定'],
  ];
  expect(answers).toHaveLength(28);
  for (const [suffix, answer] of answers)
    expect(evaluate(q(suffix).rule, answer), suffix).toBe(true);
  expect(evaluate(q('group-fives').rule, [12, 0, 60])).toBe(false);
  expect(evaluate(q('circle-count').rule, 60)).toBe(false);
  expect(evaluate(q('triangle-value').rule, 12)).toBe(false);
  expect(evaluate(q('changed-convention').rule, 75)).toBe(false);
  expect(evaluate(q('life-numbers').rule, [32, 36, 36, 94, 92])).toBe(false);
  expect(() => evaluate(q('zero-box').rule, null)).toThrow(
    'educationLearning.answerRequired',
  );
});
it('checks every original marker, strict fixed visual contracts and all four picture bounds', () => {
  for (const [scene, variant, count, large, small] of [
    ['circles', 'main', 62, 0, 0],
    ['circles', 'review', 43, 0, 0],
    ['triangles', 'main', 12, 7, 5],
    ['triangles', 'review', 14, 6, 8],
  ] as const) {
    const visual = { kind: 'bnu-around-numbers' as const, scene, variant };
    expect(isBnuAroundNumbersVisual(visual)).toBe(true);
    const markers = aroundNumberMarkers(visual);
    expect(markers).toHaveLength(count);
    expect(new Set(markers.map((item) => item.index)).size).toBe(count);
    if (scene === 'circles') {
      const rowCounts = [...new Set(markers.map((item) => item.y))].map(
        (y) => markers.filter((item) => item.y === y).length,
      );
      expect(rowCounts).toEqual(
        variant === 'main' ? [10, 10, 10, 10, 10, 10, 2] : [10, 10, 10, 10, 3],
      );
    } else {
      expect(markers.filter((item) => item.size === 18)).toHaveLength(large);
      expect(markers.filter((item) => item.size === 9)).toHaveLength(small);
    }
    for (const marker of markers) {
      expect(marker.x - marker.size).toBeGreaterThanOrEqual(0);
      expect(marker.x + marker.size).toBeLessThanOrEqual(420);
      expect(marker.y - marker.size).toBeGreaterThanOrEqual(0);
      expect(marker.y + marker.size).toBeLessThanOrEqual(
        scene === 'circles' ? 280 : 155,
      );
    }
  }
  for (const value of [
    null,
    [],
    { kind: 'bnu-around-numbers', scene: 'circles' },
    { kind: 'bnu-around-numbers', scene: 'unknown', variant: 'main' },
    { kind: 'bnu-around-numbers', scene: 'circles', variant: 'old' },
    {
      kind: 'bnu-around-numbers',
      scene: 'circles',
      variant: 'main',
      answer: 62,
    },
  ])
    expect(isBnuAroundNumbersVisual(value)).toBe(false);
});
it('maps all fifty tasks to seven source activities while actual work and personal records stay ungraded', () => {
  expect(lesson.steps).toHaveLength(8);
  expect(lesson.questions).toHaveLength(50);
  expect(audit.activities).toHaveLength(7);
  const manual = lesson.questions.filter((item) => item.rule.kind === 'manual');
  const records = lesson.questions.filter(
    (item) => item.rule.kind === 'reflection',
  );
  expect(manual).toHaveLength(14);
  expect(records).toHaveLength(8);
  for (const item of manual)
    expect(evaluate(item.rule, 'confirmed')).toBeNull();
  for (const item of records)
    expect(evaluate(item.rule, '未做，后续计划单列')).toBeNull();
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
it('uses changed conditions and preserves zero, partial drafts, retries, diagrams and old snapshots under strict backup', () => {
  const review = required(lesson.reviewQuestions);
  expect(review).toHaveLength(5);
  const answers = [
    [40, 41, 42],
    43,
    [6, 8, 14, 68],
    [9, 2, 47],
    '不能，需要先知道符号约定',
  ];
  for (const [i, item] of review.entries()) {
    expect(evaluate(item.rule, required(answers[i]))).toBe(true);
    expect(
      lesson.questions.some(
        (old) => old.prompt === item.prompt || old.id === item.id,
      ),
    ).toBe(false);
  }
  expect(evaluate(review[1]!.rule, 62)).toBe(false);
  expect(evaluate(review[2]!.rule, [7, 5, 12, 75])).toBe(false);
  const state = initialLibrary('表示');
  const old = createSession(
    bnuLowerSubtractionPracticeLesson,
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
  const index = session.questions.findIndex(
    (item) => item.id === `${lesson.id}-group-fives`,
  );
  session.responses[index]!.draft = [0, null, null];
  expect(parseBackup(exportBackup(state)).data).toEqual(state);
  for (const answer of [
    [12, 0, 60],
    [12, 2, 62],
  ]) {
    session.responses[index]!.draft = answer;
    session.responses[index] = submitResponse(
      session.questions[index]!,
      session.responses[index]!,
    );
  }
  const restored = parseBackup(exportBackup(state)).data;
  expect(restored.sessions[0]).toEqual(snapshot);
  expect(restored.sessions[1]).toEqual(session);
  expect(
    restored.sessions[1]!.responses[index]!.submissions.map(
      (item) => item.correct,
    ),
  ).toEqual([false, true]);
  const bad = JSON.parse(exportBackup(state));
  const visual = bad.data.sessions[1].questions.find(
    (item: { visual?: unknown }) => item.visual,
  )?.visual;
  expect(visual).toBeDefined();
  visual.answer = 62;
  expect(() => parseBackup(JSON.stringify(bad))).toThrow(
    'educationLearning.invalidBackup',
  );
});

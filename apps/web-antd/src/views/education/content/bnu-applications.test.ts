import type { Answer, Lesson } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate } from '../learning/engine';
import { required } from '../learning/required';
import {
  bnuDifferenceLesson,
  bnuHiddenLesson,
  bnuTwoStepLesson,
} from './bnu-applications';

function question(lesson: Lesson, suffix: string) {
  return required(
    lesson.questions.find((item) => item.id === `${lesson.id}-${suffix}`),
  );
}
function checkFields(lesson: Lesson, cases: Array<[string, number[]]>) {
  for (const [suffix, answer] of cases) {
    const rule = question(lesson, suffix).rule;
    expect(evaluate(rule, answer)).toBe(true);
    for (let field = 0; field < answer.length; field++) {
      const wrong = [...answer];
      wrong[field] = required(wrong[field]) + 1;
      expect(evaluate(rule, wrong)).toBe(false);
    }
    const partial: Array<null | number> = [...answer];
    partial[0] = null;
    expect(() => evaluate(rule, partial)).toThrow(
      'educationLearning.answerRequired',
    );
  }
}
it('uses each current intermediate amount in all six independent two-step calculations and bus stories', () => {
  checkFields(bnuTwoStepLesson, [
    ['bus-up', [5, 8]],
    ['bus-down', [3, 2]],
    ['terminal', [2, 0]],
    ['calc-a', [2, 7]],
    ['calc-b', [3, 0]],
    ['calc-c', [6, 7]],
    ['calc-d', [9, 10]],
    ['calc-e', [3, 10]],
    ['calc-f', [8, 2]],
    ['three-groups', [6, 9]],
  ]);
  for (const [suffix, answer] of [
    ['q1', 0],
    ['choir', 9],
    ['rows', 9],
    ['hide', 7],
    ['double-count', '不能'],
    ['current', '第一次剩下的3张'],
    ['unknown', '不能'],
    ['static', '不能'],
  ] as const)
    expect(evaluate(question(bnuTwoStepLesson, suffix).rule, answer)).toBe(
      true,
    );
  expect(evaluate(question(bnuTwoStepLesson, 'bus-down').rule, [3, 7])).toBe(
    false,
  );
  expect(evaluate(question(bnuTwoStepLesson, 'rows').rule, 18)).toBe(false);
});
it('changes both sides for a transfer, only one side for new cards, and distinguishes weight from counts', () => {
  checkFields(bnuDifferenceLesson, [
    ['move', [4, 4]],
    ['overmove', [3, 5]],
    ['added-total', [5, 5]],
    ['four', [3, 2, 2, 2]],
    ['blocks', [5, 5]],
  ]);
  for (const [suffix, answer] of [
    ['q1', 0],
    ['gap', 2],
    ['add', 2],
    ['move-count', 1],
    ['planes', 4],
    ['weight', '不能'],
    ['invariant', 8],
    ['new-total', 10],
    ['odd', '不能'],
  ] as const)
    expect(evaluate(question(bnuDifferenceLesson, suffix).rule, answer)).toBe(
      true,
    );
  expect(evaluate(question(bnuDifferenceLesson, 'move-count').rule, 2)).toBe(
    false,
  );
  expect(evaluate(question(bnuDifferenceLesson, 'move').rule, [5, 4])).toBe(
    false,
  );
  expect(evaluate(question(bnuDifferenceLesson, 'weight').rule, '能')).toBe(
    false,
  );
});
it('counts cumulative hiding rather than only the latest change and never assumes an unknown total is zero', () => {
  checkFields(bnuHiddenLesson, [['stages', [3, 3, 6]]]);
  for (const [suffix, answer] of [
    ['q1', 0],
    ['whole', 6],
    ['partial', '第二次新遮的3张'],
    ['complement', 6],
    ['unknown', '不能'],
    ['zero', '不能'],
    ['picture', 6],
    ['first-visible', 5],
    ['reverse', 2],
    ['changed-total', '不能'],
  ] as const)
    expect(evaluate(question(bnuHiddenLesson, suffix).rule, answer)).toBe(true);
  expect(evaluate(question(bnuHiddenLesson, 'stages').rule, [3, 3, 3])).toBe(
    false,
  );
  const rule = question(bnuHiddenLesson, 'methods').rule;
  const all = ['减可见', '补总量', '合两次'];
  expect(evaluate(rule, all)).toBe(true);
  for (const absent of all)
    expect(
      evaluate(
        rule,
        all.filter((item) => item !== absent),
      ),
    ).toBe(false);
  expect(evaluate(rule, [...all, '仅第二次'])).toBe(false);
});
it('keeps partial zero drafts and unscored actual/reflection responses separate in each complete snapshot', () => {
  const now = '2026-10-03T00:00:00.000Z';
  for (const [lesson, count, manuals, steps, suffix, draft] of [
    [bnuTwoStepLesson, 27, 7, 6, 'terminal', [0, null]],
    [bnuDifferenceLesson, 22, 6, 6, 'move', [0, null]],
    [bnuHiddenLesson, 20, 6, 5, 'stages', [0, null, 0]],
  ] as const) {
    expect(lesson.questions).toHaveLength(count);
    expect(lesson.steps).toHaveLength(steps);
    const manual = lesson.questions.filter(
      (item) => item.rule.kind === 'manual',
    );
    expect(manual).toHaveLength(manuals);
    for (const item of manual)
      expect(evaluate(item.rule, 'confirmed')).toBeNull();
    const open = lesson.questions.filter(
      (item) => item.rule.kind === 'reflection',
    );
    expect(open).toHaveLength(2);
    for (const item of open)
      expect(evaluate(item.rule, '实际方法或未来计划')).toBeNull();
    const session = createSession(lesson, 'bnu-math-p1-upper-2024', 'child', {
      seed: 57,
      now,
    });
    required(
      session.responses.find(
        (item) => item.questionId === `${lesson.id}-${suffix}`,
      ),
    ).draft = [...draft];
    const data = {
      schemaVersion: 1 as const,
      profiles: [{ id: 'child', nickname: '隔离验收', createdAt: now }],
      activeProfileId: 'child',
      sessions: [session],
    };
    expect(parseBackup(exportBackup(data, now)).data).toEqual(
      JSON.parse(JSON.stringify(data)),
    );
  }
});
it('provides four changed review conditions per lesson without exceeding the taught arithmetic range', () => {
  const cases: Array<[Lesson, Answer[]]> = [
    [bnuTwoStepLesson, [[5, 7], [5, 0], [2, 8], '不能']],
    [bnuDifferenceLesson, [4, [4, 4], [5, 5, 10], [4, 3, 3, 1]]],
    [bnuHiddenLesson, [5, [2, 3, 5], 4, '本次新增']],
  ];
  for (const [lesson, answers] of cases) {
    const fresh = required(lesson.reviewQuestions);
    expect(fresh).toHaveLength(4);
    fresh.forEach((item, index) => {
      expect(evaluate(item.rule, required(answers[index]))).toBe(true);
      expect(
        lesson.questions.some(
          (old) => old.prompt === item.prompt || old.id === item.id,
        ),
      ).toBe(false);
    });
  }
});

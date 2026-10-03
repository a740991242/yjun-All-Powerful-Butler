import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate } from '../learning/engine';
import { required } from '../learning/required';
import { bnuUpperBook } from './bnu';
import {
  bnuSchoolGamesLesson as games,
  bnuSchoolHarvestLesson as harvest,
} from './bnu-school-activities';

it('separates groups, objects, changed instructions and unknown strength', () => {
  const question = (suffix: string) =>
    required(games.questions.find((q) => q.id.endsWith(suffix)));
  expect(evaluate(question('q1').rule, 3)).toBe(true);
  expect(evaluate(question('q2').rule, '一样多')).toBe(true);
  expect(evaluate(question('q3').rule, '不能确定')).toBe(true);
  expect(evaluate(question('q3').rule, '能确定')).toBe(false);
  expect(evaluate(question('q5').rule, 3)).toBe(true);
  expect(evaluate(question('q6').rule, 1)).toBe(true);
  expect(evaluate(question('q7').rule, 2)).toBe(true);
  expect(evaluate(question('q7').rule, 6)).toBe(false);
  expect(evaluate(question('q8').rule, 6)).toBe(true);
  expect(evaluate(question('q8').rule, 2)).toBe(false);
  expect(() => evaluate(question('q6').rule, null)).toThrow(
    'educationLearning.answerRequired',
  );
  const changed = required(
    games.reviewQuestions?.find((q) => q.id.endsWith('r4')),
  );
  expect(evaluate(changed.rule, '蓝色方片')).toBe(true);
  expect(evaluate(changed.rule, '黄色圆片')).toBe(false);
});

it('requires comparison evidence without inferring weight from size or completion from plans', () => {
  const question = (suffix: string) =>
    required(harvest.questions.find((q) => q.id.endsWith(suffix)));
  for (const [suffix, value] of [
    ['q1', '不能确定'],
    ['q2', '甲纸条'],
    ['q3', '一端'],
    ['q4', '不能确定'],
    ['q5', '甲'],
    ['q6', '不能确定'],
    ['q7', '还未实际观察'],
    ['q8', '跳过，保留问题'],
  ] as const)
    expect(evaluate(question(suffix).rule, value)).toBe(true);
  expect(evaluate(question('q4').rule, '能确定')).toBe(false);
  expect(evaluate(question('q5').rule, '乙')).toBe(false);
  const changed = required(
    harvest.reviewQuestions?.find((q) => q.id.endsWith('r3')),
  );
  expect(evaluate(changed.rule, '乙')).toBe(true);
  expect(evaluate(changed.rule, '甲')).toBe(false);
});

it('keeps original activity snapshots and does not manufacture actual confirmations', () => {
  const now = '2026-10-03T00:00:00.000Z';
  const sessions = [games, harvest].map((lesson) =>
    createSession(lesson, bnuUpperBook.id, 'child', { seed: 17, now }),
  );
  expect(games.questions).toHaveLength(18);
  expect(harvest.questions).toHaveLength(13);
  expect(
    new Set([...games.questions, ...harvest.questions].map((q) => q.id)).size,
  ).toBe(31);
  for (const session of sessions) {
    expect(session.responses.every((r) => r.submissions.length === 0)).toBe(
      true,
    );
    for (const question of session.questions.filter(
      (q) => q.rule.kind === 'manual',
    ))
      expect(evaluate(question.rule, 'confirmed')).toBeNull();
    for (const question of session.questions.filter(
      (q) => q.rule.kind === 'reflection',
    ))
      expect(evaluate(question.rule, '还有问题想核对')).toBeNull();
  }
  const partial = required(
    sessions[0]?.responses.find((r) => r.questionId.endsWith('q6')),
  );
  partial.draft = 0;
  const data = {
    schemaVersion: 1 as const,
    profiles: [{ id: 'child', nickname: '隔离测试', createdAt: now }],
    activeProfileId: 'child',
    sessions,
  };
  expect(parseBackup(exportBackup(data, now)).data).toEqual(
    JSON.parse(JSON.stringify(data)),
  );
});

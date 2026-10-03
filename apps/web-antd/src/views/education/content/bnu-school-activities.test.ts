import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
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
  expect(games.questions).toHaveLength(20);
  expect(harvest.questions).toHaveLength(13);
  expect(
    new Set([...games.questions, ...harvest.questions].map((q) => q.id)).size,
  ).toBe(33);
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

it('preserves all seven cards when changing grouping and keeps the six-card example separate', () => {
  const before = required(games.steps[2]?.visual);
  const after = required(games.steps[3]?.visual);
  expect(before.kind).toBe('count-groups');
  expect(after.kind).toBe('count-groups');
  if (before.kind !== 'count-groups' || after.kind !== 'count-groups')
    throw new Error('Missing regrouping diagrams');
  expect(before.groups.reduce((sum, count) => sum + count, 0)).toBe(7);
  expect(after.groups.reduce((sum, count) => sum + count, 0)).toBe(7);
  expect(after.groups.filter((count) => count === 3)).toHaveLength(2);
  expect(after.groups.filter((count) => count < 3)).toEqual([1]);
  const question = (suffix: string) =>
    required(games.questions.find((q) => q.id.endsWith(suffix)));
  expect(evaluate(question('regroup-total').rule, 7)).toBe(true);
  expect(evaluate(question('regroup-total').rule, 6)).toBe(false);
  expect(evaluate(question('regroup-leftover').rule, 1)).toBe(true);
  expect(evaluate(question('regroup-leftover').rule, 3)).toBe(false);
  expect(question('q7').prompt).toContain('另取一批6张卡');
  expect(question('q7').visual).toEqual({
    kind: 'count-groups',
    groups: [3, 3],
  });
  expect(evaluate(question('q7').rule, 2)).toBe(true);
  expect(evaluate(question('q8').rule, 6)).toBe(true);
  expect(games.version).toBe(2);
});

it('restores a version-one six-card answer without rewriting its saved question or adding new tasks', () => {
  const now = '2026-10-03T00:00:00.000Z';
  const oldLesson = {
    ...games,
    version: 1,
    questions: games.questions
      .filter((q) => !q.id.includes('-regroup-'))
      .map((q) =>
        q.id.endsWith('-q7')
          ? { ...q, prompt: '图中每组3张，共有几组？只填组数。' }
          : q,
      ),
  };
  const session = createSession(oldLesson, bnuUpperBook.id, 'child', {
    seed: 17,
    now,
  });
  const index = session.responses.findIndex((r) =>
    r.questionId.endsWith('-q8'),
  );
  const response = required(session.responses[index]);
  response.draft = 6;
  session.responses[index] = submitResponse(
    required(session.questions.find((q) => q.id === response.questionId)),
    response,
    now,
  );
  const data = {
    schemaVersion: 1 as const,
    profiles: [{ id: 'child', nickname: '旧记录测试', createdAt: now }],
    activeProfileId: 'child',
    sessions: [session],
  };
  const restored = required(
    parseBackup(exportBackup(data, now)).data.sessions[0],
  );
  expect(restored.lessonVersion).toBe(1);
  expect(restored.questions).toHaveLength(18);
  expect(restored.questions.find((q) => q.id.endsWith('-q7'))?.prompt).toBe(
    '图中每组3张，共有几组？只填组数。',
  );
  expect(restored.questions.some((q) => q.id.includes('-regroup-'))).toBe(
    false,
  );
  expect(restored.responses[index]?.submissions[0]).toMatchObject({
    answer: 6,
    correct: true,
  });
});

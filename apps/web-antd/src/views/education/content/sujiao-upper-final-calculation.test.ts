import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import {
  finalCalculationBoard,
  sujiaoUpperFinalCalculationLesson as lesson,
} from './sujiao-upper-final-calculation';
it('covers all twelve independent basic operations and all six two-stage chains with changed review and zero boundaries', () => {
  const main = finalCalculationBoard(false);
  const review = finalCalculationBoard(true);
  expect(main.basic.map((c) => c.label)).toEqual([
    '3+7',
    '6+3',
    '8−0',
    '1+8',
    '4+6',
    '4+5',
    '7−4',
    '5+3',
    '6−1',
    '10−4',
    '2+4',
    '10−5',
  ]);
  expect(main.basic.map((c) => c.value)).toEqual([
    10, 9, 8, 9, 10, 9, 3, 8, 5, 6, 6, 5,
  ]);
  expect(main.chains.map((c) => [c.label, c.intermediate, c.value])).toEqual([
    ['9+1+2', 10, 12],
    ['13+3−6', 16, 10],
    ['12−2+9', 10, 19],
    ['2+8−6', 10, 4],
    ['3+3+3', 6, 9],
    ['8−4−4', 4, 0],
  ]);
  expect(review.basic.map((c) => c.value)).toEqual([
    10, 9, 9, 9, 10, 9, 3, 8, 5, 6, 6, 5,
  ]);
  expect(review.chains.map((c) => [c.intermediate, c.value])).toEqual([
    [10, 13],
    [18, 10],
    [10, 17],
    [10, 3],
    [4, 6],
    [4, 0],
  ]);
  for (const variant of [false, true]) {
    const board = finalCalculationBoard(variant);
    const qs = variant ? lesson.reviewQuestions! : lesson.questions;
    for (let row = 0; row < 3; row++) {
      const q = qs.find(
        (q) => q.knowledge === `${lesson.id}-basic-row-${row}`,
      )!;
      const values = board.basic
        .slice(row * 4, row * 4 + 4)
        .map((c) => c.value);
      expect(evaluate(q.rule, values)).toBe(true);
      expect(() => evaluate(q.rule, [...values.slice(0, 3), null])).toThrow(
        'educationLearning.answerRequired',
      );
      for (const cell of board.basic.slice(row * 4, row * 4 + 4))
        expect(q.prompt).toContain(cell.label);
    }
    for (const [i, c] of board.chains.entries()) {
      const q = qs.find((q) => q.knowledge === `${lesson.id}-chain-${i}`)!;
      expect(q.prompt).toContain(c.label);
      expect(evaluate(q.rule, [c.intermediate, c.value])).toBe(true);
      expect(() => evaluate(q.rule, [null, c.value])).toThrow(
        'educationLearning.answerRequired',
      );
      expect(evaluate(q.rule, [c.intermediate + 1, c.value])).toBe(false);
      expect(() => evaluate(q.rule, [c.value])).toThrow(
        'educationLearning.answerRequired',
      );
      if (c.intermediate !== c.value)
        expect(evaluate(q.rule, [c.value, c.intermediate])).toBe(false);
    }
  }
  expect(lesson.questions).toHaveLength(15);
  expect(lesson.reviewQuestions).toHaveLength(11);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    3,
  );
  for (let i = 0; i < 12; i++)
    expect(main.basic[i]?.label).not.toEqual(review.basic[i]?.label);
  for (let i = 0; i < 6; i++)
    expect(main.chains[i]?.label).not.toEqual(review.chains[i]?.label);
});
it('keeps zero/null partial drafts, wrong intermediate history and physical evidence separate in v1 backup', () => {
  const now = '2026-10-02T10:00:00.000Z';
  const s = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  s.phase = 'practice';
  const index = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-chain-5`,
  );
  s.responses[index]!.draft = [null, 0];
  const data = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [s],
  };
  expect(
    parseBackup(exportBackup(data, now)).data.sessions[0]!.responses[index]!
      .draft,
  ).toEqual([null, 0]);
  s.responses[index] = submitResponse(
    s.questions[index]!,
    { ...s.responses[index]!, draft: [0, 0] },
    now,
  );
  for (const [i, q] of s.questions.entries()) {
    if (q.rule.kind === 'manual') continue;
    const draft = (() => {
      if (q.rule.kind === 'steps') return q.rule.values;
      if (q.rule.kind === 'choice') return q.rule.value;
      if (q.rule.kind === 'reflection')
        return '隔离测试：实际完整纸笔和操作尚未做，未来计划另记。';
      throw new Error('Unexpected rule');
    })();
    s.responses[i] = submitResponse(q, { ...s.responses[i]!, draft }, now);
  }
  expect(s.responses[index]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  expect(statistics(s).finalCorrect).toBe(11);
  expect(statistics(s).manual).toBe(0);
  expect(
    s.responses[s.questions.findIndex((q) => q.rule.kind === 'reflection')]!
      .submissions[0]!.correct,
  ).toBeNull();
  expect(parseBackup(exportBackup(data, now)).data.sessions[0]).toEqual(s);
});

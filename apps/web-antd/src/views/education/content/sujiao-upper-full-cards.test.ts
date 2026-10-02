import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { sujiaoBooks } from './sujiao';
import { sujiaoUpperFullCardsLesson as lesson } from './sujiao-upper-full-cards';

it('covers all 72 bounded cards exactly once and reviews by recovering the missing operand', () => {
  expect(sujiaoBooks[0]!.units.find((u) => u.id === 'u2')!.lessons).toContain(
    lesson,
  );
  expect(lesson.questions).toHaveLength(19);
  expect(lesson.reviewQuestions).toHaveLength(14);
  for (const kind of ['add', 'subtract']) {
    const keys = lesson.questions.filter((q) =>
      q.knowledge.includes(`${kind}-chunk-`),
    );
    expect(keys).toHaveLength(4);
    const actual: string[] = [];
    for (const q of keys) {
      const symbol = kind === 'add' ? '＋' : '－';
      const cards = [
        ...q.prompt.matchAll(new RegExp(`(\\d)${symbol}(\\d)`, 'g')),
      ];
      expect(cards).toHaveLength(9);
      if (q.rule.kind !== 'steps') throw new Error('Missing steps');
      expect(q.rule.values).toEqual(
        cards.map((m) =>
          kind === 'add'
            ? Number(m[1]) + Number(m[2])
            : Number(m[1]) - Number(m[2]),
        ),
      );
      actual.push(...cards.map((m) => `${m[1]},${m[2]}`));
      const review = lesson.reviewQuestions!.find(
        (r) => r.knowledge === q.knowledge,
      )!;
      const inverse = [
        ...review.prompt.matchAll(new RegExp(`(\\d)${symbol}□＝(\\d)`, 'g')),
      ];
      expect(inverse).toHaveLength(9);
      if (review.rule.kind !== 'steps')
        throw new Error('Missing inverse steps');
      expect(review.rule.values).toEqual(
        inverse.map((m) =>
          kind === 'add'
            ? Number(m[2]) - Number(m[1])
            : Number(m[1]) - Number(m[2]),
        ),
      );
      expect(evaluate(review.rule, q.rule.values)).toBe(false);
    }
    const expected: string[] = [];
    for (let a = 1; a <= 9; a++)
      for (let b = 1; b <= 9; b++) {
        if (kind === 'add' ? a + b <= 9 : a >= 2 && a - b >= 1)
          expected.push(`${a},${b}`);
      }
    expect(new Set(actual).size).toBe(36);
    expect(actual.toSorted()).toEqual(expected.toSorted());
  }
  expect(
    lesson.questions.find((q) => q.knowledge.endsWith('add-result-groups'))!
      .rule,
  ).toEqual({ kind: 'steps', values: [1, 2, 3, 4, 5, 6, 7, 8] });
  expect(
    lesson.questions.find((q) =>
      q.knowledge.endsWith('subtract-result-groups'),
    )!.rule,
  ).toEqual({ kind: 'steps', values: [8, 7, 6, 5, 4, 3, 2, 1] });
  expect(
    lesson.questions.find((q) => q.knowledge.endsWith('zero-arithmetic'))!.rule,
  ).toEqual({ kind: 'steps', values: [8, 8, 8, 0] });
  for (const tasks of [lesson.questions, lesson.reviewQuestions!])
    for (const q of tasks) {
      if (q.rule.kind === 'choice')
        expect(q.choices!.filter((c) => evaluate(q.rule, c.id))).toHaveLength(
          1,
        );
      if (q.rule.kind === 'set') {
        expect(evaluate(q.rule, q.rule.values)).toBe(true);
        expect(
          evaluate(
            q.rule,
            q.choices!.map((c) => c.id),
          ),
        ).toBe(false);
      }
    }
  expect(
    lesson.questions
      .filter((q) => q.rule.kind === 'manual')
      .map((q) => q.knowledge),
  ).toEqual(
    [
      'actual-add-table',
      'actual-subtract-table',
      'actual-zero-operations',
      'actual-draw-cards',
      'actual-own-method',
    ].map((key) => `${lesson.id}-${key}`),
  );
});

it('keeps nine-field partial drafts and mistake history while leaving actual tables and games unconfirmed', () => {
  const now = '2026-10-02T09:00:00.000Z';
  const s = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  s.phase = 'practice';
  const index = s.questions.findIndex((q) =>
    q.knowledge.endsWith('add-chunk-0'),
  );
  s.responses[index]!.draft = [2, null, null, 5, null, null, null, null, 3];
  const data = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [s],
  };
  expect(
    parseBackup(exportBackup(data, now)).data.sessions[0]!.responses[index]!
      .draft,
  ).toEqual(s.responses[index]!.draft);
  s.responses[index] = submitResponse(
    s.questions[index]!,
    { ...s.responses[index]!, draft: Array.from({ length: 9 }, () => 1) },
    now,
  );
  for (const [i, q] of s.questions.entries()) {
    if (q.rule.kind === 'manual') continue;
    const answer = (() => {
      if (q.rule.kind === 'steps' || q.rule.kind === 'set')
        return q.rule.values;
      if (q.rule.kind === 'choice') return q.rule.value;
      throw new Error('Unexpected rule');
    })();
    s.responses[i] = submitResponse(
      q,
      { ...s.responses[i]!, draft: answer },
      now,
    );
  }
  expect(s.responses[index]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  expect(statistics(s).manual).toBe(0);
  expect(statistics(s).finalCorrect).toBe(14);
  expect(parseBackup(exportBackup(data, now)).data.sessions[0]).toEqual(s);
});

import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { newReviewQuestions } from '../learning/review';
import { initialLibrary } from '../learning/storage';
import { mathBooks } from './math';
import { upperTenPartitionLesson as lesson } from './math-upper-ten-partition';
const book = () => required(mathBooks.find((b) => b.volume === 'upper'));
const q = (suffix: string) =>
  required(lesson.questions.find((q) => q.id === `${lesson.id}-${suffix}`));
function pairs(n: number) {
  const result: string[] = [];
  for (let a = 1; a < n; a++)
    for (let b = 1; b < n; b++) if (a + b === n) result.push(`${a}和${b}`);
  return result;
}
function cards(values: number[], total: number) {
  const result = new Set<string>();
  for (let i = 0; i < values.length; i++)
    for (let j = i + 1; j < values.length; j++) {
      const a = required(values[i]);
      const b = required(values[j]);
      if (a + b === total) result.add(`${Math.min(a, b)}和${Math.max(a, b)}`);
    }
  return [...result];
}
describe('complete six-to-ten partitions and actual distinct cards', () => {
  it('independently enumerates every positive ordered partition and every missing part including the ninth field', () => {
    for (let n = 6; n <= 10; n++) {
      const values = pairs(n);
      expect(values).toHaveLength(n - 1);
      expect(evaluate(q(`pairs${n}`).rule, values)).toBe(true);
      expect(evaluate(q(`pairs${n}`).rule, values.slice(1))).toBe(false);
      expect(evaluate(q(`pairs${n}`).rule, [...values, `0和${n}`])).toBe(false);
      expect(evaluate(q(`pairs${n}`).rule, [...values, `${n}和0`])).toBe(false);
      const parts = Array.from({ length: n - 1 }, (_, i) => n - (i + 1));
      expect(evaluate(q(`parts${n}`).rule, parts)).toBe(true);
      expect(() => evaluate(q(`parts${n}`).rule, parts.slice(0, -1))).toThrow(
        'educationLearning.answerRequired',
      );
      expect(evaluate(q(`parts${n}`).rule, [...parts].toReversed())).toBe(
        false,
      );
    }
    expect(evaluate(q('frames40').rule, [6 - 3, 2 + 4, 7 - 3, 2 + 5])).toBe(
      true,
    );
    expect(evaluate(q('frames41').rule, [3 + 5, 2 + 7, 8 - 2, 9 - 5])).toBe(
      true,
    );
    expect(evaluate(q('flowers').rule, [4 + 2, 8 - 5, 9 - 3, 9 - 4])).toBe(
      true,
    );
    const a = 9 - 3;
    const b = 7 - 5;
    const c = 8 - 4;
    expect(evaluate(q('network').rule, [a, b, c, 3 + b, 5 + c])).toBe(true);
    expect(evaluate(q('network').rule, [9, 7, 8, 16, 15])).toBe(false);
  });
  it('takes two distinct physical indices, deduplicates swaps, and changes eligibility when the second 5 is removed', () => {
    const cases: [string, number[], number][] = [
      ['cards6', [1, 2, 3, 3, 4, 5, 6, 7, 8], 6],
      ['cards8', [2, 6, 1, 9, 4, 3, 7, 2, 5, 4, 8, 1], 8],
      ['cards9', [6, 1, 7, 8, 3, 2, 4, 1, 9, 4, 5, 3], 9],
      ['cards10', [0, 1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10], 10],
      ['single5', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 10],
    ];
    for (const [key, values, total] of cases) {
      const legal = cards(values, total);
      expect(evaluate(q(key).rule, legal)).toBe(true);
      expect(evaluate(q(key).rule, legal.slice(1))).toBe(false);
      expect(evaluate(q(key).rule, [...legal, '6和6'])).toBe(false);
    }
    expect(cards([0, 1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10], 10)).toContain('5和5');
    const one = cards([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 10);
    expect(one).not.toContain('5和5');
    expect(evaluate(q('single5').rule, [...one, '5和5'])).toBe(false);
    expect(evaluate(q('cards6').rule, ['1和5', '2和4'])).toBe(false);
  });
  it('keeps quantity, ordinal, direction, hidden and unknown conditions separate and preserves old records through strict backup', () => {
    const labels = [...'ABCDEFGH'];
    expect(evaluate(q('right6').rule, labels.slice(-6))).toBe(true);
    expect(evaluate(q('right6').rule, [required(labels[2])])).toBe(false);
    expect(evaluate(q('left7').rule, required(labels[6]))).toBe(true);
    const fish = [5, 6, 7, 8, 9, 4, 3, 2];
    expect(
      evaluate(q('ordinal').rule, [
        fish.length,
        required(fish[5]),
        fish.indexOf(6) + 1,
      ]),
    ).toBe(true);
    expect(evaluate(q('ordinal').rule, [8, 6, 6])).toBe(false);
    expect(evaluate(q('forward').rule, [5, 6, 9])).toBe(true);
    expect(evaluate(q('countdown').rule, [10, 9, 7, 4, 3, 2])).toBe(true);
    expect(evaluate(q('sequence').rule, [7, 9])).toBe(true);
    expect(evaluate(q('hidden').rule, [2, 6 - 2, 6])).toBe(true);
    expect(evaluate(q('unknown').rule, '无法确定')).toBe(true);
    expect(evaluate(q('unknown').rule, '0张')).toBe(false);
    const unit = required(book().units.find((u) => u.id === 'u2'));
    expect(unit.lessons.slice(0, 7).map((l) => l.id)).toEqual([
      'mu-ten',
      'mu-ten-sequence',
      'mu-ten-compare',
      'mu-ten-partition',
      'mu-ten-addsub',
      'mu-story',
      'mu-chain',
    ]);
    expect(unit.lessons[7]).toEqual(lesson);
    const state = initialLibrary('完整分合');
    const old = createSession(
      required(unit.lessons[0]),
      book().id,
      state.activeProfileId,
      { seed: 1 },
    );
    state.sessions.push(old);
    const snapshot = JSON.stringify(old);
    const s = createSession(lesson, book().id, state.activeProfileId, {
      seed: 2,
    });
    required(
      s.responses[s.questions.findIndex((q) => q.id.endsWith('-hidden'))],
    ).draft = [2, null, 0];
    for (const [index, question] of s.questions.entries()) {
      if (!['manual', 'reflection'].includes(question.rule.kind)) continue;
      required(s.responses[index]).draft =
        question.rule.kind === 'manual'
          ? 'confirmed'
          : '真实活动未做，计划另记。';
      s.responses[index] = submitResponse(
        question,
        required(s.responses[index]),
      );
      expect(s.responses[index]?.submissions[0]?.correct).toBeNull();
    }
    expect(s.questions).toHaveLength(38);
    expect(s.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(9);
    expect(
      s.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(2);
    expect(s.activities).toEqual([]);
    state.sessions.push(s);
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
    expect(JSON.stringify(state.sessions[0])).toBe(snapshot);
  });
  it('keeps the original mistake and creates changed-order, changed-card and changed-network reviews once', () => {
    const s = createSession(lesson, book().id, 'child', { seed: 3 });
    const index = s.questions.findIndex((q) => q.id.endsWith('-hidden'));
    required(s.responses[index]).draft = [2, 0, 2];
    s.responses[index] = submitResponse(
      required(s.questions[index]),
      required(s.responses[index]),
    );
    const snapshot = JSON.stringify(s);
    const fresh = newReviewQuestions(lesson, s, [s]);
    expect(fresh).toHaveLength(4);
    const answers = [
      pairs(7),
      [1, 2, 3, 4, 5, 6, 7],
      cards([0, 1, 2, 3, 4, 4, 5, 6, 7, 8], 8),
      [8 - 2, 9 - 4, 2 + 9 - 4],
    ];
    answers.forEach((value, index) =>
      expect(evaluate(required(fresh[index]).rule, value)).toBe(true),
    );
    expect(evaluate(required(fresh[1]).rule, [7, 6, 5, 4, 3, 2, 1])).toBe(
      false,
    );
    const r = createSession(lesson, book().id, 'child', {
      mode: 'review',
      originalSessionId: s.id,
      questions: fresh,
    });
    expect(newReviewQuestions(lesson, s, [s, r])).toEqual([]);
    expect(JSON.stringify(s)).toBe(snapshot);
  });
});

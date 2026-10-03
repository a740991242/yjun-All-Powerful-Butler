import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { required } from '../learning/required';
import { newReviewQuestions } from '../learning/review';
import { initialLibrary } from '../learning/storage';
import { mathBooks } from './math';
import { upperFiveOrganizeLesson as lesson } from './math-upper-five-organize';

const book = () => required(mathBooks.find((b) => b.volume === 'upper'));
const q = (n: number) =>
  required(lesson.questions.find((q) => q.id === `mu-five-organize-q${n}`));
function allPairs(total: number) {
  const pairs: string[] = [];
  for (let left = 1; left < total; left += 1)
    for (let right = 1; right < total; right += 1)
      if (left + right === total) pairs.push(`${left}和${right}`);
  return pairs;
}
describe('five-number source-scoped organizing course', () => {
  it('independently verifies all compared quantities, all nonempty ordered pairs and both sides of each equality', () => {
    expect(evaluate(q(1).rule, [2, 1, 3, 5])).toBe(true);
    for (const n of [2, 3, 4]) {
      const v = required(q(n).visual);
      if (v.kind !== 'comparison-rows') throw new Error('pair rows expected');
      const [a, b] = v.counts;
      let sign = '=';
      if (a > b) sign = '>';
      if (a < b) sign = '<';
      expect(evaluate(q(n).rule, sign)).toBe(true);
    }
    expect(evaluate(q(5).rule, '5个松果')).toBe(true);
    expect(evaluate(q(6).rule, allPairs(5))).toBe(true);
    expect(evaluate(q(7).rule, allPairs(4))).toBe(true);
    expect(
      evaluate(
        q(8).rule,
        [1, 2, 3].map((removed) => 5 - removed),
      ),
    ).toBe(true);
    for (let a = 0; a <= 4; a += 1)
      for (let b = 0; b <= 4; b += 1)
        expect(evaluate(q(9).rule, [a, b])).toBe(a > 0 && b > 0 && a + b === 4);
    expect(evaluate(q(10).rule, [4, 1, 4 - 1])).toBe(true);
    expect(evaluate(q(11).rule, [4 - 2, 4 - 2])).toBe(true);
    expect(
      evaluate(
        q(12).rule,
        [4, 3, 2, 1].map((v) => v + 1),
      ),
    ).toBe(true);
    expect(
      evaluate(
        q(13).rule,
        [4, 3, 2, 1].map((v) => 5 - v),
      ),
    ).toBe(true);
    expect(evaluate(q(14).rule, [3 + 2, 4 + 1])).toBe(true);
    expect(evaluate(q(15).rule, [5 - 2, 4 - 1])).toBe(true);
    ['<', allPairs(3), [3, 2, 1], [4, 4]].forEach((value, index) =>
      expect(
        evaluate(required(lesson.reviewQuestions?.[index]).rule, value),
      ).toBe(true),
    );
  });
  it('rejects incomplete pair enumeration, forbidden empty groups, a counted starting value, reversed comparisons and cumulative rows', () => {
    expect(evaluate(q(3).rule, '<')).toBe(false);
    expect(evaluate(q(4).rule, '>')).toBe(false);
    expect(evaluate(q(5).rule, '4个松果')).toBe(false);
    expect(evaluate(q(6).rule, ['1和4'])).toBe(false);
    expect(evaluate(q(7).rule, [...allPairs(4), '4和0'])).toBe(false);
    expect(evaluate(q(8).rule, [5, 4, 3])).toBe(false);
    expect(() => evaluate(q(10).rule, [4, null, 3])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(evaluate(q(10).rule, [3, 1, 4])).toBe(false);
    expect(evaluate(q(12).rule, [5, 6, 7, 8])).toBe(false);
    expect(evaluate(q(14).rule, [5, 4])).toBe(false);
    expect(evaluate(q(15).rule, [5, 5])).toBe(false);
  });
  it('appends to the existing unit, preserves old snapshots and stores actual activities and reflections as ungraded', () => {
    const unit = required(book().units.find((u) => u.id === 'u1'));
    expect(unit.lessons.slice(0, 8).map((l) => l.id)).toEqual([
      'mu-five',
      'mu-five-sequence',
      'mu-five-compare',
      'mu-five-partition',
      'mu-five-add',
      'mu-five-sub',
      'mu-zero',
      'mu-ordinal',
    ]);
    expect(unit.lessons[8]?.id).toBe(lesson.id);
    const state = initialLibrary('五内整理');
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
    const index = s.questions.findIndex((q) => q.id === 'mu-five-organize-q10');
    required(s.responses[index]).draft = [4, null, 3];
    for (const [i, question] of s.questions.entries()) {
      if (
        question.rule.kind !== 'manual' &&
        question.rule.kind !== 'reflection'
      )
        continue;
      required(s.responses[i]).draft =
        question.rule.kind === 'manual'
          ? 'confirmed'
          : '实际原页未做，与网页和未来计划分开。';
      s.responses[i] = submitResponse(question, required(s.responses[i]));
      expect(s.responses[i]?.submissions[0]?.correct).toBeNull();
    }
    expect(statistics(s).accuracy).toBeNull();
    expect(s.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(7);
    expect(
      s.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(2);
    state.sessions.push(s);
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
    expect(JSON.stringify(state.sessions[0])).toBe(snapshot);
  });
  it('offers four different source-scoped variants after a real complete-enumeration error and exhausts reuse', () => {
    const s = createSession(lesson, book().id, 'child', { seed: 3 });
    const index = s.questions.findIndex((q) => q.id === 'mu-five-organize-q6');
    required(s.responses[index]).draft = ['1和4'];
    s.responses[index] = submitResponse(
      required(s.questions[index]),
      required(s.responses[index]),
    );
    const before = JSON.stringify(s);
    const fresh = newReviewQuestions(lesson, s, [s]);
    expect(fresh.map((q) => q.id)).toEqual(
      required(lesson.reviewQuestions).map((q) => q.id),
    );
    const r = createSession(lesson, book().id, 'child', {
      mode: 'review',
      originalSessionId: s.id,
      questions: fresh,
    });
    expect(newReviewQuestions(lesson, s, [s, r])).toEqual([]);
    expect(JSON.stringify(s)).toBe(before);
  });
});

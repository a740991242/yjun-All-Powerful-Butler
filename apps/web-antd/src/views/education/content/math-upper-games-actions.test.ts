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
import { upperGamesActionsLesson as lesson } from './math-upper-games-actions';

const book = () => required(mathBooks.find((b) => b.volume === 'upper'));
const q = (n: number) =>
  required(lesson.questions.find((q) => q.id === `mu-games-actions-q${n}`));
function group(total: number, size: number) {
  let full = 0;
  let rest = total;
  while (rest >= size) {
    rest -= size;
    full += 1;
  }
  return [full, rest];
}
function matching(a: number, b: number) {
  let pairs = 0;
  while (a > 0 && b > 0) {
    a -= 1;
    b -= 1;
    pairs += 1;
  }
  return [pairs, a, b];
}
describe('upper introductory games: rules, own direction, matching and materials', () => {
  it('independently counts full groups, roles, one-to-one pairs and material categories', () => {
    expect(evaluate(q(1).rule, group(8, 3))).toBe(true);
    expect(evaluate(q(2).rule, group(9, 3))).toBe(true);
    expect(evaluate(q(5).rule, [4, 4 + 2])).toBe(true);
    expect(evaluate(q(7).rule, [4 - 3, 4 + 3])).toBe(true);
    for (const n of [10, 11, 12]) {
      const diagram = required(q(n).visual);
      if (diagram.kind !== 'comparison-rows')
        throw new Error('pair rows required');
      expect(evaluate(q(n).rule, matching(...diagram.counts))).toBe(true);
      expect(diagram.counts.every((v) => Number.isInteger(v) && v >= 0)).toBe(
        true,
      );
    }
    const materials = [
      'cylinder',
      'cylinder',
      'yellow-triangle',
      'yellow-triangle',
      'yellow-triangle',
      'red-triangle',
    ];
    expect(
      evaluate(q(13).rule, [
        materials.filter((m) => m === 'cylinder').length,
        materials.filter((m) => m === 'yellow-triangle').length,
        materials.filter((m) => m === 'red-triangle').length,
        materials.filter((m) => m.endsWith('triangle')).length,
        materials.length,
      ]),
    ).toBe(true);
    expect(
      evaluate(required(lesson.reviewQuestions?.[0]).rule, group(7, 3)),
    ).toBe(true);
    expect(
      evaluate(required(lesson.reviewQuestions?.[1]).rule, matching(4, 6)),
    ).toBe(true);
  });
  it('checks rule switching, own direction and a speaker-excluding origin rather than a row-end origin', () => {
    expect(evaluate(q(3).rule, '双脚动作')).toBe(true);
    expect(evaluate(q(4).rule, '单脚动作')).toBe(true);
    expect(evaluate(q(6).rule, '同一平地，合理一致的姿势')).toBe(true);
    expect(evaluate(q(8).rule, '左耳')).toBe(true);
    expect(evaluate(q(9).rule, '右脚')).toBe(true);
    const row = ['A', 'B', 'C', 'D'];
    const fromSpeaker = required(row[row.indexOf('D') - 3]);
    expect(evaluate(q(14).rule, fromSpeaker)).toBe(true);
    expect(evaluate(q(15).rule, required(row[2]))).toBe(true);
    expect(evaluate(q(16).rule, '圆柱')).toBe(true);
    expect(evaluate(q(17).rule, '右脚')).toBe(true);
    expect(evaluate(q(18).rule, '不能，需要独立实际记录')).toBe(true);
    expect(evaluate(required(lesson.reviewQuestions?.[2]).rule, '左耳')).toBe(
      true,
    );
    const changed = ['D', 'A', 'C', 'B'];
    expect(
      evaluate(
        required(lesson.reviewQuestions?.[3]).rule,
        required(changed[changed.indexOf('B') - 2]),
      ),
    ).toBe(true);
  });
  it('rejects unfinished groups as full, leftover-category swapping, double-counting and stale direction rules', () => {
    expect(evaluate(q(1).rule, [3, 2])).toBe(false);
    expect(() => evaluate(q(2).rule, [3, null])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(evaluate(q(5).rule, [6, 4])).toBe(false);
    expect(evaluate(q(9).rule, '左脚')).toBe(false);
    expect(evaluate(q(10).rule, [5, 0, 1])).toBe(false);
    expect(evaluate(q(11).rule, [5, 1, 0])).toBe(false);
    expect(evaluate(q(12).rule, [6, 0, 1])).toBe(false);
    expect(evaluate(q(13).rule, [2, 3, 1, 4, 10])).toBe(false);
    expect(evaluate(q(14).rule, 'B')).toBe(false);
    expect(evaluate(q(14).rule, 'C')).toBe(false);
    expect(evaluate(q(16).rule, '圆片')).toBe(false);
    expect(evaluate(q(17).rule, '左脚')).toBe(false);
    expect(
      evaluate(required(lesson.reviewQuestions?.[1]).rule, [5, 0, 1]),
    ).toBe(false);
  });
  it('keeps zero drafts and old introductory snapshots; actual activities and reflections do not score', () => {
    const state = initialLibrary('游戏核验');
    const games = required(book().units.find((u) => u.id === 'games'));
    expect(games.lessons.slice(0, 4).map((l) => l.id)).toEqual([
      'mu-count',
      'mu-compare',
      'mu-partition',
      'mu-games-campus',
    ]);
    expect(games.lessons[4]?.id).toBe(lesson.id);
    const old = createSession(
      required(games.lessons[0]),
      book().id,
      state.activeProfileId,
      { seed: 1 },
    );
    state.sessions.push(old);
    const before = JSON.stringify(old);
    const s = createSession(lesson, book().id, state.activeProfileId, {
      seed: 2,
    });
    const index = s.questions.findIndex((q) => q.id === 'mu-games-actions-q12');
    required(s.responses[index]).draft = [null, 0, 0];
    for (const [i, question] of s.questions.entries()) {
      if (
        question.rule.kind !== 'manual' &&
        question.rule.kind !== 'reflection'
      )
        continue;
      required(s.responses[i]).draft =
        question.rule.kind === 'manual'
          ? 'confirmed'
          : '实际活动未做，纸面替代与计划分开。';
      s.responses[i] = submitResponse(question, required(s.responses[i]));
      expect(s.responses[i]?.submissions[0]?.correct).toBeNull();
    }
    expect(statistics(s).accuracy).toBeNull();
    expect(s.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(8);
    expect(
      s.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(2);
    state.sessions.push(s);
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
    expect(JSON.stringify(state.sessions[0])).toBe(before);
  });
  it('creates four distinct new variants after a real leftover error, preserving error history and exhausting reuse', () => {
    const s = createSession(lesson, book().id, 'child', { seed: 3 });
    const index = s.questions.findIndex((q) => q.id === 'mu-games-actions-q11');
    required(s.responses[index]).draft = [5, 1, 0];
    s.responses[index] = submitResponse(
      required(s.questions[index]),
      required(s.responses[index]),
    );
    const before = JSON.stringify(s);
    const fresh = newReviewQuestions(lesson, s, [s]);
    expect(fresh.map((q) => q.id)).toEqual(
      required(lesson.reviewQuestions).map((q) => q.id),
    );
    const review = createSession(lesson, book().id, 'child', {
      mode: 'review',
      originalSessionId: s.id,
      questions: fresh,
    });
    expect(newReviewQuestions(lesson, s, [s, review])).toEqual([]);
    expect(JSON.stringify(s)).toBe(before);
  });
});

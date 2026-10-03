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
import { oralGroupsLesson as lesson } from './math-oral-groups';

const book = () => required(mathBooks.find((b) => b.volume === 'lower'));
const q = (n: number) =>
  required(lesson.questions.find((q) => q.id === `ml-oral-groups-q${n}`));
describe('whole groups, remainder and transporting all items', () => {
  it('checks all authored results, full subtraction chains and changed reviews independently', () => {
    const answers = [
      [23, 17, 11, 5],
      [4, 5],
      '不能，5张还不足6张',
      [24, 29],
      5,
      [5, 0, 5],
      [28, 22, 16, 10, 4, 5, 4, 6],
      [3, 4, 4, 0],
      21,
      [19, 11, 3, 0, 4],
      [4, 3],
      ['4满袋，余5张', '至少5袋，最后一袋可只有5张'],
      [58, 52, 46, 40, 34],
      [0, 0, 0],
      '不能确定，缺少总张数',
      3,
    ];
    answers.forEach((a, i) => expect(evaluate(q(i + 1).rule, a)).toBe(true));
    [
      [24, 17, 10, 3, 4, 3, 5],
      [4, 0, 4],
      [13, 7, 1, 0, 4],
      [3, 3, 21, 24],
    ].forEach((a, i) =>
      expect(evaluate(required(lesson.reviewQuestions?.[i]).rule, a)).toBe(
        true,
      ),
    );
    for (const [total, size, groups, rest, containers] of [
      [29, 6, 4, 5, 5],
      [35, 7, 5, 0, 5],
      [34, 6, 5, 4, 6],
      [28, 8, 3, 4, 4],
      [28, 7, 4, 0, 4],
      [23, 5, 4, 3, 5],
      [0, 5, 0, 0, 0],
      [31, 7, 4, 3, 5],
      [32, 8, 4, 0, 4],
      [24, 7, 3, 3, 4],
    ]) {
      expect(Math.floor(required(total) / required(size))).toBe(groups);
      expect(required(total) % required(size)).toBe(rest);
      expect(Math.ceil(required(total) / required(size))).toBe(containers);
      expect(required(groups) * required(size) + required(rest)).toBe(total);
    }
    for (const [total, capacity, chain] of [
      [27, 8, [19, 11, 3, 0]],
      [19, 6, [13, 7, 1, 0]],
    ] as const) {
      let current: number = total;
      for (const remaining of chain) {
        const moved = Math.min(current, capacity);
        current -= moved;
        expect(current).toBe(remaining);
        expect(moved).toBeGreaterThan(0);
      }
    }
  });
  it('rejects mixing units, adding empty bags, treating leftovers as complete work, and unknown as zero', () => {
    expect(evaluate(q(1).rule, [23, 23, 23, 23])).toBe(false);
    expect(evaluate(q(2).rule, [5, 0])).toBe(false);
    expect(evaluate(q(2).rule, [24, 5])).toBe(false);
    expect(evaluate(q(4).rule, [4, 9])).toBe(false);
    expect(evaluate(q(5).rule, 4)).toBe(false);
    expect(evaluate(q(6).rule, [5, 0, 6])).toBe(false);
    expect(evaluate(q(8).rule, [3, 4, 0, 4])).toBe(false);
    expect(evaluate(q(9).rule, 3)).toBe(false);
    expect(evaluate(q(10).rule, [19, 11, 3, -5, 4])).toBe(false);
    expect(evaluate(q(11).rule, [5, 0])).toBe(false);
    expect(evaluate(q(13).rule, [58, 52, 46, 40, 0])).toBe(false);
    expect(evaluate(q(14).rule, [0, 0, 1])).toBe(false);
    expect(evaluate(q(15).rule, '确定0袋')).toBe(false);
    expect(evaluate(q(16).rule, 4)).toBe(false);
    expect(() => evaluate(q(14).rule, [0, null, 0])).toThrow(
      'educationLearning.answerRequired',
    );
  });
  it('preserves an old oral-course snapshot, eight-field partial draft and unscored activity records through backup', () => {
    const state = initialLibrary('整组核验');
    const original = required(
      book()
        .units.flatMap((u) => u.lessons)
        .find((l) => l.id === 'ml-oral-add'),
    );
    const old = createSession(
      { ...original, version: 1, questions: original.questions.slice(0, 6) },
      book().id,
      state.activeProfileId,
      { seed: 1 },
    );
    state.sessions.push(old);
    const before = JSON.stringify(old);
    const s = createSession(lesson, book().id, state.activeProfileId, {
      seed: 2,
    });
    const index = s.questions.findIndex((q) => q.id === 'ml-oral-groups-q7');
    required(s.responses[index]).draft = [28, null, 16, 10, 4, 5, 4, 6];
    for (const [i, question] of s.questions.entries()) {
      if (
        question.rule.kind !== 'manual' &&
        question.rule.kind !== 'reflection'
      )
        continue;
      required(s.responses[i]).draft =
        question.rule.kind === 'manual'
          ? 'confirmed'
          : '实际任务未做，记录问题与计划。';
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
    expect(JSON.stringify(state.sessions[0])).toBe(before);
    const copy = structuredClone(state);
    required(required(copy.sessions[1]).responses[index]).draft = [28, 0];
    expect(
      parseBackup(exportBackup(copy)).data.sessions[1]?.responses[index]?.draft,
    ).toEqual([28, 0]);
    expect(() => evaluate(q(7).rule, [28, 0])).toThrow(
      'educationLearning.answerRequired',
    );
  });
  it('registers the full new lesson and sends only its fresh variants after a real specialty error', () => {
    const pool = required(
      book().specialties?.find((l) => l.id === 'ms-lower-calculation'),
    );
    expect(pool.version).toBe(10);
    expect(
      book()
        .units.flatMap((u) => u.lessons)
        .some((l) => l.id === lesson.id),
    ).toBe(true);
    const s = createSession(pool, book().id, 'child', { seed: 5 });
    const index = s.questions.findIndex((q) => q.id === 'ml-oral-groups-q5');
    required(s.responses[index]).draft = 4;
    s.responses[index] = submitResponse(
      required(s.questions[index]),
      required(s.responses[index]),
    );
    const fresh = newReviewQuestions(pool, s, [s]);
    expect(fresh.map((q) => q.id)).toEqual(
      required(lesson.reviewQuestions).map((q) => q.id),
    );
    const review = createSession(pool, book().id, 'child', {
      mode: 'review',
      originalSessionId: s.id,
      questions: fresh,
    });
    expect(newReviewQuestions(pool, s, [s, review])).toEqual([]);
  });
});

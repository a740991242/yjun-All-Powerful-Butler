import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { newReviewQuestions } from '../learning/review';
import { initialLibrary } from '../learning/storage';
import { mathBooks } from './math';
import { upperTenUnitSummaryLesson as lesson } from './math-upper-ten-unit-summary';

const book = () => required(mathBooks.find((b) => b.volume === 'upper'));
const q = (suffix: string) =>
  required(lesson.questions.find((q) => q.id === `${lesson.id}-${suffix}`));
const positions = (grid: number[]) =>
  Array.from({ length: 9 }, (_, n) => grid.indexOf(n + 1) + 1);
const minimum = (bound: number) =>
  required(Array.from({ length: 11 }, (_, n) => n).find((n) => n > bound));

describe('six-to-ten unit summary and independent original activities', () => {
  it('computes all six chains and comparisons and requires the least strictly greater integer', () => {
    const chains = [
      [6 + 3, 6 + 3 - 4, 8 - 6, 8 - 6 - 2],
      [8 + 2, 8 + 2 - 5, 10 - 6, 10 - 6 + 5],
      [3 + 3, 3 + 3 + 3, 9 - 2, 9 - 2 - 2],
    ];
    chains.forEach((answer, n) =>
      expect(
        evaluate(q(`mixed65${String.fromCodePoint(97 + n)}`).rule, answer),
      ).toBe(true),
    );
    expect(evaluate(q('mixed65a').rule, [5, 5, 0, 0])).toBe(false);
    const pairs = [
      [3 + 6, 9],
      [10 - 4, 8],
      [2 + 4, 7],
      [9 - 3, 5],
      [7 + 3, 9],
      [9 + 0, 9],
    ];
    for (const [index, pair] of pairs.entries()) {
      const [left, right] = pair.map((value) => required(value));
      let sign = '=';
      if (required(left) < required(right)) sign = '<';
      else if (required(left) > required(right)) sign = '>';
      expect(evaluate(q(`compare${index + 1}`).rule, sign)).toBe(true);
      for (const wrong of ['<', '=', '>'].filter((s) => s !== sign))
        expect(evaluate(q(`compare${index + 1}`).rule, wrong)).toBe(false);
    }
    expect(
      evaluate(
        q('minimum').rule,
        [2, 5, 6, 8].map((value) => minimum(value)),
      ),
    ).toBe(true);
    expect(evaluate(q('minimum').rule, [4, 7, 8, 10])).toBe(false);
    expect(evaluate(q('minimum').rule, [2, 5, 6, 8])).toBe(false);
  });
  it('finds actual numbered positions, filters unrelated objects and checks hidden/combined quantities and map examples', () => {
    const grids = [
      [1, 2, 9, 4, 3, 8, 5, 6, 7],
      [3, 4, 5, 2, 1, 6, 9, 8, 7],
    ];
    for (const [index, grid] of grids.entries()) {
      expect(evaluate(q(`grid${index + 1}`).rule, positions(grid))).toBe(true);
      expect(evaluate(q(`grid${index + 1}`).rule, grid)).toBe(false);
      expect(
        evaluate(
          q(`grid${index + 1}`).rule,
          Array.from({ length: 9 }, (_, n) => n + 1),
        ),
      ).toBe(false);
    }
    expect(evaluate(q('pandas').rule, [7, 3, 7 + 3])).toBe(true);
    expect(evaluate(q('pandas').rule, [7, 3, 7 + 3 + 3])).toBe(false);
    expect(evaluate(q('pandaInfo').rule, ['左7只熊猫', '右3只熊猫'])).toBe(
      true,
    );
    expect(
      evaluate(q('pandaInfo').rule, ['左7只熊猫', '右3只熊猫', '旁边3只鸟']),
    ).toBe(false);
    expect(evaluate(q('bottles').rule, [10, 4, 10 - 4])).toBe(true);
    expect(evaluate(q('monkeys').rule, [6, 2, 6 + 2])).toBe(true);
    expect(evaluate(q('dragonflies').rule, [4, 3, 4 + 3])).toBe(true);
    expect(evaluate(q('snails').rule, [9, 4, 9 - 4])).toBe(true);
    expect(
      evaluate(q('mapExamples').rule, [
        9 + 1,
        10 - 9,
        10 - 1,
        3 + 4,
        3 + 4 + 3,
        9 - 5,
        9 - 5 + 4,
      ]),
    ).toBe(true);
    expect(evaluate(q('growthFour').rule, [2 + 8, 8 + 2, 10 - 2, 10 - 8])).toBe(
      true,
    );
    expect(q('m6').prompt).toContain('不替原题擅加一次限制');
    expect(q('dragonflies').prompt).toContain('原图另实际点数');
    expect(q('snails').prompt).toContain('原图另按实际读数');
  });
  it('preserves old unit courses, partially filled zero and independently confirmed actual activities in strict backup', () => {
    const unit = required(book().units.find((u) => u.id === 'u2'));
    expect(unit.lessons.slice(0, 11).map((l) => l.id)).toEqual([
      'mu-ten',
      'mu-ten-sequence',
      'mu-ten-compare',
      'mu-ten-partition',
      'mu-ten-addsub',
      'mu-story',
      'mu-chain',
      'mu-ten-full-partition',
      'mu-ten-relations',
      'mu-ten-applications',
      'mu-ten-full-cards',
    ]);
    expect(unit.lessons[11]).toEqual(lesson);
    const state = initialLibrary('单元回顾');
    const old = createSession(
      required(unit.lessons[0]),
      book().id,
      state.activeProfileId,
      { seed: 1 },
    );
    const snapshot = JSON.stringify(old);
    state.sessions.push(old);
    const session = createSession(lesson, book().id, state.activeProfileId, {
      seed: 2,
    });
    const index = session.questions.findIndex((q) =>
      q.id.endsWith('-mixed65a'),
    );
    required(session.responses[index]).draft = [9, null, 2, 0];
    expect(() => evaluate(q('mixed65a').rule, [9, null, 2, 0])).toThrow(
      'educationLearning.answerRequired',
    );
    for (const [index, question] of session.questions.entries()) {
      if (!['manual', 'reflection'].includes(question.rule.kind)) continue;
      required(session.responses[index]).draft =
        question.rule.kind === 'manual'
          ? 'confirmed'
          : '实际纸笔未做，未来计划另外记录。';
      session.responses[index] = submitResponse(
        question,
        required(session.responses[index]),
      );
      expect(session.responses[index]?.submissions[0]?.correct).toBeNull();
    }
    expect(session.questions).toHaveLength(31);
    expect(
      session.questions.filter((q) => q.rule.kind === 'manual'),
    ).toHaveLength(8);
    expect(
      session.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(3);
    expect(session.activities).toEqual([]);
    state.sessions.push(session);
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
    expect(JSON.stringify(state.sessions[0])).toBe(snapshot);
  });
  it('changes all review conditions and positions without mutating mistakes or repeating exhausted review questions', () => {
    const session = createSession(lesson, book().id, 'child', { seed: 3 });
    const index = session.questions.findIndex((q) =>
      q.id.endsWith('-mixed65a'),
    );
    required(session.responses[index]).draft = [5, 5, 0, 0];
    session.responses[index] = submitResponse(
      required(session.questions[index]),
      required(session.responses[index]),
    );
    const snapshot = JSON.stringify(session);
    const fresh = newReviewQuestions(lesson, session, [session]);
    expect(fresh).toHaveLength(4);
    const answers = [
      [5 + 4, 5 + 4 - 9, 10 - 7, 10 - 7 + 3],
      [4, 7].map((value) => minimum(value)),
      positions([9, 8, 7, 6, 5, 4, 3, 2, 1]),
      ['总8只兔', '可见3只兔'],
    ];
    answers.forEach((answer, index) =>
      expect(evaluate(required(fresh[index]).rule, answer)).toBe(true),
    );
    expect(
      evaluate(required(fresh[2]).rule, positions([1, 2, 9, 4, 3, 8, 5, 6, 7])),
    ).toBe(false);
    expect(
      evaluate(required(fresh[3]).rule, [
        '总8只兔',
        '可见3只兔',
        '旁边2个萝卜',
      ]),
    ).toBe(false);
    const review = createSession(lesson, book().id, 'child', {
      mode: 'review',
      originalSessionId: session.id,
      questions: fresh,
    });
    expect(newReviewQuestions(lesson, session, [session, review])).toEqual([]);
    expect(JSON.stringify(session)).toBe(snapshot);
  });
});

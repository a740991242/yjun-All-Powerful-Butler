import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { newReviewQuestions } from '../learning/review';
import { initialLibrary } from '../learning/storage';
import { mathBooks } from './math';
import { upperFiveMethodsLesson as lesson } from './math-upper-five-methods';

const book = () => required(mathBooks.find((b) => b.volume === 'upper'));
const q = (suffix: string) =>
  required(lesson.questions.find((q) => q.id === `${lesson.id}-${suffix}`));
describe('five-within meanings, methods and complete original activities', () => {
  it('separates count-all/count-on/partition, checks swapping and every independent arithmetic row', () => {
    expect(
      evaluate(
        q('countAll').rule,
        Array.from({ length: 5 }, (_, n) => n + 1),
      ),
    ).toBe(true);
    expect(evaluate(q('countOn').rule, [3 + 1, 3 + 2, 3 + 2])).toBe(true);
    expect(evaluate(q('countOn').rule, [3, 4, 4])).toBe(false);
    expect(evaluate(q('partition').rule, [3, 2, 3 + 2])).toBe(true);
    expect(evaluate(q('flowerSwap').rule, [1, 3, 1 + 3, 3, 1, 3 + 1])).toBe(
      true,
    );
    expect(evaluate(q('sticks').rule, [1 + 1, 2 + 1, 2 + 3])).toBe(true);
    const answers = [1 + 2, 2 + 3, 2 + 2, 1 + 4, 3 - 1, 5 - 2, 4 - 2, 5 - 1];
    expect(evaluate(q('rows').rule, answers)).toBe(true);
    expect(evaluate(q('rows').rule, [3, 5, 4, 5, 2, 2, 2, 4])).toBe(false);
    expect(() => evaluate(q('rows').rule, answers.slice(0, 7))).toThrow(
      'educationLearning.answerRequired',
    );
    for (const [key, sign] of [
      ['addSign', '+'],
      ['birdAddSign', '+'],
      ['minusSign', '−'],
      ['birdSubSign', '−'],
    ]) {
      expect(evaluate(q(required(key)).rule, required(sign))).toBe(true);
      expect(evaluate(q(required(key)).rule, sign === '+' ? '−' : '+')).toBe(
        false,
      );
    }
    expect(evaluate(q('addMeaning').rule, '合并或添后的总数')).toBe(true);
    expect(evaluate(q('addMeaning').rule, '只新增的数')).toBe(false);
    expect(evaluate(q('minusMeaning').rule, '从原有去掉一部分后剩下')).toBe(
      true,
    );
    expect(evaluate(q('minusMeaning').rule, '原有的数')).toBe(false);
  });
  it('checks every static and changing story, original/removed/remaining units and complete equation families', () => {
    const additions: [string, number, number][] = [
      ['balloons', 3, 1],
      ['squirrels', 3, 2],
      ['cars', 2, 2],
      ['crow', 4, 1],
      ['fish', 4, 1],
      ['birdAdd', 2, 3],
      ['crab', 2, 3],
    ];
    for (const [key, a, b] of additions)
      expect(evaluate(q(key).rule, [a, b, a + b])).toBe(true);
    const subtractions: [string, number, number][] = [
      ['wheat', 5, 4],
      ['birdSub', 5, 2],
    ];
    for (const [key, a, b] of subtractions)
      expect(evaluate(q(key).rule, [a, b, a - b])).toBe(true);
    expect(evaluate(q('peaches').rule, [3, 1, 3 + 1, 4])).toBe(true);
    expect(evaluate(q('bananas').rule, [4, 1, 4 - 1, 3])).toBe(true);
    expect(evaluate(q('balloonSub').rule, [4, 1, 4 - 1, 4 - 1 + 1])).toBe(true);
    expect(evaluate(q('balloonSub').rule, [3, 1, 4, 4])).toBe(false);
    expect(evaluate(q('cucumbers').rule, [5, 2, 5 - 2, 5 - 2 + 2])).toBe(true);
    expect(evaluate(q('rabbits').rule, [3, 1, 3 + 1, 1, 3, 1 + 3])).toBe(true);
    expect(q('rabbits').prompt).toContain('同一批');
    expect(q('crab').prompt).toContain('同一时刻');
    expect(q('m2').prompt).toContain('用自己的话');
    expect(q('m4').prompt).toContain('全部八算式');
  });
  it('preserves eleven old courses and snapshots, partial zeros and manual/reflection null in strict backup', () => {
    const unit = required(book().units.find((u) => u.id === 'u1'));
    expect(unit.lessons.slice(0, 11).map((l) => l.id)).toEqual([
      'mu-five',
      'mu-five-sequence',
      'mu-five-compare',
      'mu-five-partition',
      'mu-five-add',
      'mu-five-sub',
      'mu-zero',
      'mu-ordinal',
      'mu-five-organize',
      'mu-five-observe',
      'mu-five-summary',
    ]);
    expect(unit.lessons[11]).toEqual(lesson);
    const state = initialLibrary('方法与图题');
    const old = createSession(
      required(unit.lessons[6]),
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
      q.id.endsWith('-balloonSub'),
    );
    required(session.responses[index]).draft = [4, null, 0, 4];
    expect(() => evaluate(q('balloonSub').rule, [4, null, 0, 4])).toThrow(
      'educationLearning.answerRequired',
    );
    for (const [index, question] of session.questions.entries()) {
      if (!['manual', 'reflection'].includes(question.rule.kind)) continue;
      required(session.responses[index]).draft =
        question.rule.kind === 'manual'
          ? 'confirmed'
          : '实际纸笔未做，下一步计划另记。';
      session.responses[index] = submitResponse(
        question,
        required(session.responses[index]),
      );
      expect(session.responses[index]?.submissions[0]?.correct).toBeNull();
    }
    expect(session.questions).toHaveLength(34);
    expect(
      session.questions.filter((q) => q.rule.kind === 'manual'),
    ).toHaveLength(6);
    expect(
      session.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(2);
    expect(session.activities).toEqual([]);
    state.sessions.push(session);
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
    expect(JSON.stringify(state.sessions[0])).toBe(snapshot);
  });
  it('changes review starting points, contexts and quantities without overwriting original mistakes', () => {
    const session = createSession(lesson, book().id, 'child', { seed: 3 });
    const index = session.questions.findIndex((q) => q.id.endsWith('-countOn'));
    required(session.responses[index]).draft = [3, 4, 4];
    session.responses[index] = submitResponse(
      required(session.questions[index]),
      required(session.responses[index]),
    );
    const snapshot = JSON.stringify(session);
    const fresh = newReviewQuestions(lesson, session, [session]);
    expect(fresh).toHaveLength(4);
    const answers = [
      [2 + 1, 2 + 2, 2 + 3, 2 + 3],
      [5, 1, 5 - 1, 1, 4, 1 + 4],
      ['原5个杯子', '拿走2个杯子'],
      [3, 2, 3 + 2, 2, 3, 2 + 3],
    ];
    answers.forEach((answer, index) =>
      expect(evaluate(required(fresh[index]).rule, answer)).toBe(true),
    );
    expect(evaluate(required(fresh[0]).rule, [4, 5, 5, 5])).toBe(false);
    expect(
      evaluate(required(fresh[2]).rule, [
        '原5个杯子',
        '拿走2个杯子',
        '旁边2朵花',
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

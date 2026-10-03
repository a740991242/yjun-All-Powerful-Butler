import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { newReviewQuestions } from '../learning/review';
import { initialLibrary } from '../learning/storage';
import { mathBooks } from './math';
import { upperTenApplicationsLesson as lesson } from './math-upper-ten-applications';
const book = () => required(mathBooks.find((b) => b.volume === 'upper'));
const q = (suffix: string) =>
  required(lesson.questions.find((q) => q.id === `${lesson.id}-${suffix}`));
function chain(start: number, changes: number[]) {
  const values = [start];
  let current = start;
  for (const n of changes) {
    current += n;
    values.push(current);
  }
  return values;
}
describe('six-to-ten applications with every intermediate stage', () => {
  it('checks quantities, requested units and relevant information rather than adding every visible number', () => {
    const rows: [string, number[]][] = [
      ['rabbit', [4, 2, 4 + 2]],
      ['penguinAdd', [5, 2, 5 + 2]],
      ['frog', [7, 2, 7 - 2, 2 + (7 - 2)]],
      ['penguinSub', [6, 2, 6 - 2, 2 + (6 - 2)]],
      ['bear', [5, 1, 5 + 1, 6, 2, 6 - 2]],
      ['fish', [3, 3, 3 + 3]],
      ['fruit', [7, 3, 7 - 3]],
      ['hidden', [6, 3, 6 - 3]],
      ['vases', [2, 5, 2 + 5]],
      ['deer', [9, 3, 9 - 3]],
      ['eggs', [6, 3, 6 + 3]],
      ['chicks', [8, 4, 8 - 4]],
      ['water', [9, 4, 9 - 4]],
      ['compare', [8, 5, 8 - 5, 8 - 5]],
      ['pears', [6, 3, 6 + 3]],
    ];
    for (const [key, values] of rows)
      expect(evaluate(q(key).rule, values)).toBe(true);
    const relevant = ['原有9只鹿', '跑走3只鹿'];
    expect(evaluate(q('deerInfo').rule, relevant)).toBe(true);
    for (const extra of ['另有6朵蘑菇', '另有8只鹅'])
      expect(evaluate(q('deerInfo').rule, [...relevant, extra])).toBe(false);
    expect(evaluate(q('deer').rule, [9, 3, 9 + 6 + 8 - 3])).toBe(false);
    expect(evaluate(q('chicks').rule, [8, 4, 8 + 2 - 4])).toBe(false);
    expect(evaluate(q('hidden').rule, [6, 3, 0])).toBe(false);
  });
  it('independently computes each time change, every independent linked row, all six mixed equations and all five shared-line constraints', () => {
    const cases: [string, number, number[]][] = [
      ['add59', 5, [2, 1]],
      ['sub59', 8, [-2, -2]],
      ['geeseAddSub', 4, [3, -2]],
      ['geeseSubAdd', 4, [-2, 3]],
      ['ducks', 6, [3, -4]],
      ['birds', 9, [-3, -3]],
      ['cars', 4, [-2, 4]],
    ];
    for (const [key, start, changes] of cases)
      expect(evaluate(q(key).rule, chain(start, changes).slice(1))).toBe(true);
    expect(evaluate(q('geeseSubAdd').rule, [7, 5])).toBe(false);
    expect(() => evaluate(q('add59').rule, [8])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(evaluate(q('sticks59').rule, [1, 4 + 3, 4 + 3 + 1])).toBe(true);
    expect(evaluate(q('stars59').rule, [10 - 3, 2, 10 - 3 - 2])).toBe(true);
    const linked: [string, number, number, number][] = [
      ['linked61a', 2 + 3, 5 + 4, 2 + 3 + 4],
      ['linked61b', 8 - 3, 5 - 2, 8 - 3 - 2],
      ['linked61c', 4 + 2, 6 - 4, 4 + 2 - 4],
    ];
    for (const [key, first, second, last] of linked)
      expect(evaluate(q(key).rule, [first, second, first, last])).toBe(true);
    expect(evaluate(q('clothes').rule, [6, 2, 1, 6 + 2, 6 + 2 + 1])).toBe(true);
    expect(
      evaluate(q('repeatAdd').rule, chain(0, [2, 2, 2, 2, 2]).slice(1)),
    ).toBe(true);
    expect(
      evaluate(q('repeatSub').rule, chain(9, [-2, -2, -2, -2]).slice(1)),
    ).toBe(true);
    expect(evaluate(q('arrow61a').rule, chain(5 + 3, [-2, 4, -5, 3]))).toBe(
      true,
    );
    expect(evaluate(q('arrow61b').rule, chain(8 - 6, [2, 5, -3, -4]))).toBe(
      true,
    );
    for (const [key, a, b, c, d, e, f] of [
      ['mixed62a', 1, 4, 5, 10, -1, -4],
      ['mixed62b', 2, 4, 4, 10, -4, -4],
      ['mixed62c', 7, 2, -5, 7, -5, 2],
    ] as const)
      expect(evaluate(q(key).rule, [a + b, a + b + c, d + e, d + e + f])).toBe(
        true,
      );
    expect(evaluate(q('banana').rule, [10 - 3, 2, 10 - 3 - 2])).toBe(true);
    const a = 10 - 2 - 1;
    const b = 10 - 2 - 5;
    const c = 10 - 3 - 2;
    const d = 10 - 1 - 3;
    const e = 10 - 1 - c;
    expect(evaluate(q('lines10').rule, [a, b, c, d, e])).toBe(true);
    expect([a + 2 + 1, b + 2 + 5, 3 + 2 + c, 1 + d + 3, 1 + e + c]).toEqual([
      10, 10, 10, 10, 10,
    ]);
    expect(evaluate(q('lines10').rule, [a, b, c, d, 5])).toBe(false);
    expect(
      evaluate(q('cultureNumbers').rule, [10 - 1, 6 - 5, 9 - 4, 10 - 4]),
    ).toBe(true);
  });
  it('preserves the original nine unit lessons and strict partial/zero/reflection backups without auto-confirming physical activities', () => {
    const unit = required(book().units.find((u) => u.id === 'u2'));
    expect(unit.lessons.slice(0, 9).map((l) => l.id)).toEqual([
      'mu-ten',
      'mu-ten-sequence',
      'mu-ten-compare',
      'mu-ten-partition',
      'mu-ten-addsub',
      'mu-story',
      'mu-chain',
      'mu-ten-full-partition',
      'mu-ten-relations',
    ]);
    expect(unit.lessons[9]).toEqual(lesson);
    const state = initialLibrary('应用和中间量');
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
      s.responses[s.questions.findIndex((q) => q.id.endsWith('-stars59'))],
    ).draft = [7, null, 0];
    for (const [index, question] of s.questions.entries()) {
      if (!['manual', 'reflection'].includes(question.rule.kind)) continue;
      required(s.responses[index]).draft =
        question.rule.kind === 'manual'
          ? 'confirmed'
          : '本次未真实讲故事或操作，计划另记。';
      s.responses[index] = submitResponse(
        question,
        required(s.responses[index]),
      );
      expect(s.responses[index]?.submissions[0]?.correct).toBeNull();
    }
    expect(s.questions).toHaveLength(49);
    expect(s.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(8);
    expect(
      s.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(2);
    expect(s.activities).toEqual([]);
    state.sessions.push(s);
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
    expect(JSON.stringify(state.sessions[0])).toBe(snapshot);
  });
  it('keeps mistakes and creates changed-condition reviews with required true zero and newly filtered information', () => {
    const s = createSession(lesson, book().id, 'child', { seed: 3 });
    const index = s.questions.findIndex((q) => q.id.endsWith('-stars59'));
    required(s.responses[index]).draft = [10, 3, 7];
    s.responses[index] = submitResponse(
      required(s.questions[index]),
      required(s.responses[index]),
    );
    const snapshot = JSON.stringify(s);
    const fresh = newReviewQuestions(lesson, s, [s]);
    expect(fresh).toHaveLength(4);
    const answers = [
      chain(8, [-3, 2]).slice(1),
      chain(7, [2, -9]).slice(1),
      chain(3 + 4, [-2, 3, -8]),
      ['原7只小鸭', '走2只小鸭'],
    ];
    answers.forEach((v, i) =>
      expect(evaluate(required(fresh[i]).rule, v)).toBe(true),
    );
    expect(evaluate(required(fresh[0]).rule, [7, 5])).toBe(false);
    expect(() => evaluate(required(fresh[1]).rule, [9, null])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(
      evaluate(required(fresh[3]).rule, [
        '原7只小鸭',
        '走2只小鸭',
        '另3只成年鸭',
      ]),
    ).toBe(false);
    const r = createSession(lesson, book().id, 'child', {
      mode: 'review',
      originalSessionId: s.id,
      questions: fresh,
    });
    expect(newReviewQuestions(lesson, s, [s, r])).toEqual([]);
    expect(JSON.stringify(s)).toBe(snapshot);
  });
});

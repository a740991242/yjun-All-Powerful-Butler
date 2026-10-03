import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { newReviewQuestions } from '../learning/review';
import { initialLibrary } from '../learning/storage';
import { mathBooks } from './math';
import { upperTenRelationsLesson as lesson } from './math-upper-ten-relations';
const book = () => required(mathBooks.find((b) => b.volume === 'upper'));
const q = (suffix: string) =>
  required(lesson.questions.find((q) => q.id === `${lesson.id}-${suffix}`));
function result(term: string) {
  const m = required(term.match(/^(\d+)([+−])(\d+)$/));
  const a = Number(m[1]);
  const b = Number(m[3]);
  return m[2] === '+' ? a + b : a - b;
}
function distinctDifferences(max: number, difference: number) {
  const values: string[] = [];
  for (let a = 0; a <= max; a++)
    for (let b = 0; b < a; b++)
      if (a - b === difference) values.push(`${a}−${b}`);
  return values;
}
describe('complete six-to-ten relations and independent rows', () => {
  it('independently exhausts all 70 distinct nonzero addition/subtraction relations and rejects cumulative or swapped results', () => {
    const expected = new Set<string>();
    const actual: string[] = [];
    for (let a = 1; a <= 10; a++)
      for (let b = 1; b <= 10; b++) {
        if (a + b >= 6 && a + b <= 10) expected.add(`${a}+${b}`);
        if (a >= 6 && a <= 10 && b < a) expected.add(`${a}−${b}`);
      }
    for (const question of lesson.questions.filter((q) =>
      q.id.includes('-family'),
    )) {
      const terms = question.prompt.match(/\d+[+−]\d+/g) || [];
      actual.push(...terms);
      const values = terms.map((value) => result(value));
      expect(evaluate(question.rule, values)).toBe(true);
      expect(
        evaluate(
          question.rule,
          values.map((n) => n + 1),
        ),
      ).toBe(false);
    }
    expect(expected.size).toBe(70);
    expect(actual).toHaveLength(70);
    expect(new Set(actual)).toEqual(expected);
    expect(evaluate(q('family6-3').rule, [6, 3])).toBe(true);
    expect(() => evaluate(q('family6-3').rule, [6, 6, 3, 3])).toThrow(
      'educationLearning.answerRequired',
    );
  });
  it('computes every arrow/matching/mixed row and center-minus separately, checks both equal sides and enumerates physical-card differences', () => {
    const rows: [string, string[]][] = [
      ['arrows47a', ['6+1', '5+0', '5+2', '4+3', '4+2']],
      ['arrows47b', ['4+1', '3+4', '3+3', '3+2', '3+1']],
      ['match48a', ['6−5', '2+4', '5−3', '7−7']],
      ['match48b', ['7−6', '7−1', '4+3', '6−4']],
      ['mixed52a', ['5+2', '9−7', '1+8', '9−3']],
      ['mixed52b', ['8−4', '3+6', '7−4', '0+6']],
      ['rows56', ['8+2', '6+4', '7+3', '10−0', '10−8', '10−9']],
      [
        'ten57',
        [
          '10−5',
          '10−3',
          '10−8',
          '10−1',
          '10−7',
          '10−2',
          '10−4',
          '10−6',
          '10−9',
        ],
      ],
    ];
    for (const [key, terms] of rows)
      expect(
        evaluate(
          q(key).rule,
          terms.map((value) => result(value)),
        ),
      ).toBe(true);
    const wheels: [number, number[]][] = [
      [6, [5, 0, 2, 4, 6, 1, 3]],
      [7, [5, 7, 0, 2, 4, 6, 1, 3]],
      [8, [6, 4, 2, 0, 7, 5, 3, 1]],
      [9, [4, 2, 0, 9, 7, 5, 3, 1, 8, 6]],
    ];
    for (const [center, removed] of wheels) {
      expect(
        evaluate(
          q(`wheel${center}`).rule,
          removed.map((n) => center - n),
        ),
      ).toBe(true);
      let value = center;
      const cumulative = removed.map((n) => (value -= n));
      expect(evaluate(q(`wheel${center}`).rule, cumulative)).toBe(false);
    }
    expect(
      evaluate(q('equal49').rule, [3 + 4, 3 + 4 - 2, 6 - 2, 7 - (6 - 2)]),
    ).toBe(true);
    expect(evaluate(q('equal49').rule, [7, 7, 4, 4])).toBe(false);
    expect(evaluate(q('missing52').rule, [8 - 7, 9 - 5])).toBe(true);
    const values = distinctDifferences(7, 3);
    expect(evaluate(q('cardsDiff').rule, values)).toBe(true);
    expect(evaluate(q('cardsDiff').rule, values.slice(1))).toBe(false);
    expect(evaluate(q('cardsDiff').rule, [...values, '3−3'])).toBe(false);
  });
  it('retains the eight original unit lessons, actual zero versus missing fields, manual/reflection null and old sessions in strict backup', () => {
    const unit = required(book().units.find((u) => u.id === 'u2'));
    expect(unit.lessons.slice(0, 8).map((l) => l.id)).toEqual([
      'mu-ten',
      'mu-ten-sequence',
      'mu-ten-compare',
      'mu-ten-partition',
      'mu-ten-addsub',
      'mu-story',
      'mu-chain',
      'mu-ten-full-partition',
    ]);
    expect(unit.lessons[8]).toEqual(lesson);
    const state = initialLibrary('成套算式');
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
    const index = s.questions.findIndex((q) => q.id.endsWith('-wheel6'));
    required(s.responses[index]).draft = [1, null, 4, 2, 0, 5, 3];
    expect(() => evaluate(q('wheel6').rule, [1, null, 4, 2, 0, 5, 3])).toThrow(
      'educationLearning.answerRequired',
    );
    for (const [index, question] of s.questions.entries()) {
      if (!['manual', 'reflection'].includes(question.rule.kind)) continue;
      required(s.responses[index]).draft =
        question.rule.kind === 'manual'
          ? 'confirmed'
          : '实际任务未做，未来计划另记。';
      s.responses[index] = submitResponse(
        question,
        required(s.responses[index]),
      );
      expect(s.responses[index]?.submissions[0]?.correct).toBeNull();
    }
    expect(s.questions).toHaveLength(42);
    expect(s.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(6);
    expect(
      s.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(2);
    expect(s.activities).toEqual([]);
    state.sessions.push(s);
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
    expect(JSON.stringify(state.sessions[0])).toBe(snapshot);
  });
  it('keeps the mistake unchanged and changes relation order, wheel center, equal sides and card difference in new reviews', () => {
    const s = createSession(lesson, book().id, 'child', { seed: 3 });
    const index = s.questions.findIndex((q) => q.id.endsWith('-wheel6'));
    required(s.responses[index]).draft = [6, 6, 6, 6, 6, 6, 6];
    s.responses[index] = submitResponse(
      required(s.questions[index]),
      required(s.responses[index]),
    );
    const snapshot = JSON.stringify(s);
    const fresh = newReviewQuestions(lesson, s, [s]);
    expect(fresh).toHaveLength(4);
    const answers = [
      [7 - 6, 6 + 1, 7 - 1, 1 + 6],
      [8 - 8, 8 - 0, 8 - 3, 8 - 5],
      [2 + 6, 2 + 6 - 3, 7 - 2, 9 - (7 - 2)],
      distinctDifferences(6, 2),
    ];
    answers.forEach((v, i) =>
      expect(evaluate(required(fresh[i]).rule, v)).toBe(true),
    );
    expect(evaluate(required(fresh[0]).rule, [7, 7, 6, 1])).toBe(false);
    const r = createSession(lesson, book().id, 'child', {
      mode: 'review',
      originalSessionId: s.id,
      questions: fresh,
    });
    expect(newReviewQuestions(lesson, s, [s, r])).toEqual([]);
    expect(JSON.stringify(s)).toBe(snapshot);
  });
});

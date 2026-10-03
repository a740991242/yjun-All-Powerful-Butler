import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { newReviewQuestions } from '../learning/review';
import { initialLibrary } from '../learning/storage';
import { mathBooks } from './math';
import { upperTenFullCardsLesson as lesson } from './math-upper-ten-full-cards';

const book = () => required(mathBooks.find((b) => b.volume === 'upper'));
const q = (suffix: string) =>
  required(lesson.questions.find((q) => q.id === `${lesson.id}-${suffix}`));
function compute(term: string) {
  const match = required(term.match(/^(\d+)([+−])(\d+)$/));
  return match[2] === '+'
    ? Number(match[1]) + Number(match[3])
    : Number(match[1]) - Number(match[3]);
}

describe('complete 132 ten-within equation cards', () => {
  it('independently enumerates every legal addition and subtraction including zero exactly once', () => {
    const additions = new Set<string>();
    const subtractions = new Set<string>();
    for (let a = 0; a <= 10; a++)
      for (let b = 0; b <= 10; b++) {
        if (a + b <= 10) additions.add(`${a}+${b}`);
        if (a >= b) subtractions.add(`${a}−${b}`);
      }
    for (const [prefix, expected] of [
      ['add', additions],
      ['sub', subtractions],
    ] as const) {
      const actual: string[] = [];
      for (let n = 0; n <= 10; n++) {
        const question = q(`${prefix}${n}`);
        const terms = question.prompt.match(/\d+[+−]\d+/g) || [];
        expect(terms).toHaveLength(n + 1);
        actual.push(...terms);
        expect(
          evaluate(
            question.rule,
            terms.map((value) => compute(value)),
          ),
        ).toBe(true);
        expect(
          evaluate(
            question.rule,
            terms.map((term) => compute(term) + 1),
          ),
        ).toBe(false);
      }
      expect(actual).toHaveLength(66);
      expect(new Set(actual)).toEqual(expected);
    }
    expect(
      evaluate(
        q('sub10').rule,
        Array.from({ length: 11 }, (_, n) => n),
      ),
    ).toBe(false);
    let left = 10;
    expect(
      evaluate(
        q('sub10').rule,
        Array.from({ length: 11 }, (_, n) => (left -= n)),
      ),
    ).toBe(false);
  });
  it('checks all eleven first and last entries without confusing zeros with absent fields', () => {
    const numbers = Array.from({ length: 11 }, (_, n) => n);
    for (const key of ['addFirst', 'subFirst', 'addLast']) {
      expect(evaluate(q(key).rule, numbers)).toBe(true);
      expect(evaluate(q(key).rule, [...numbers].toReversed())).toBe(false);
      expect(() => evaluate(q(key).rule, numbers.slice(0, 10))).toThrow(
        'educationLearning.answerRequired',
      );
    }
    expect(
      evaluate(
        q('subLast').rule,
        numbers.map(() => 0),
      ),
    ).toBe(true);
    expect(evaluate(q('subLast').rule, numbers)).toBe(false);
    expect(evaluate(q('add0').rule, [0])).toBe(true);
    expect(evaluate(q('sub0').rule, [0])).toBe(true);
    expect(() => evaluate(q('sub0').rule, [null])).toThrow(
      'educationLearning.answerRequired',
    );
  });
  it('retains old lessons and snapshots, eleven partially filled fields and manual/reflection null in strict backup', () => {
    const unit = required(book().units.find((u) => u.id === 'u2'));
    expect(unit.lessons.slice(0, 10).map((l) => l.id)).toEqual([
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
    ]);
    expect(unit.lessons[10]).toEqual(lesson);
    const state = initialLibrary('完整算式');
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
    const index = session.questions.findIndex((q) => q.id.endsWith('-sub10'));
    const partial = [10, null, 8, 7, 6, 5, 4, 3, 2, 1, 0];
    required(session.responses[index]).draft = partial;
    expect(() => evaluate(q('sub10').rule, partial)).toThrow(
      'educationLearning.answerRequired',
    );
    for (const [index, question] of session.questions.entries()) {
      if (!['manual', 'reflection'].includes(question.rule.kind)) continue;
      required(session.responses[index]).draft =
        question.rule.kind === 'manual'
          ? 'confirmed'
          : '未完成实际任务，未来计划另记。';
      session.responses[index] = submitResponse(
        question,
        required(session.responses[index]),
      );
      expect(session.responses[index]?.submissions[0]?.correct).toBeNull();
    }
    expect(session.questions).toHaveLength(32);
    expect(
      session.questions.filter((q) => q.rule.kind === 'manual'),
    ).toHaveLength(4);
    expect(
      session.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(2);
    expect(session.activities).toEqual([]);
    state.sessions.push(session);
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
    expect(JSON.stringify(state.sessions[0])).toBe(snapshot);
  });
  it('changes ordering and terms in reviews, retains original errors and exhausts fresh questions', () => {
    const session = createSession(lesson, book().id, 'child', { seed: 3 });
    const index = session.questions.findIndex((q) => q.id.endsWith('-sub10'));
    required(session.responses[index]).draft = Array.from(
      { length: 11 },
      () => 10,
    );
    session.responses[index] = submitResponse(
      required(session.questions[index]),
      required(session.responses[index]),
    );
    const snapshot = JSON.stringify(session);
    const fresh = newReviewQuestions(lesson, session, [session]);
    expect(fresh).toHaveLength(4);
    const terms = [
      Array.from({ length: 8 }, (_, n) => `${n}+${7 - n}`),
      Array.from({ length: 9 }, (_, n) => `8−${8 - n}`),
      ['10−10', '0+10', '10−0', '0−0'],
      ['6+0', '0+6', '6−0', '6−6'],
    ];
    terms.forEach((terms, index) =>
      expect(
        evaluate(
          required(fresh[index]).rule,
          terms.map((value) => compute(value)),
        ),
      ).toBe(true),
    );
    expect(
      evaluate(
        required(fresh[1]).rule,
        Array.from({ length: 9 }, (_, n) => 8 - n),
      ),
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

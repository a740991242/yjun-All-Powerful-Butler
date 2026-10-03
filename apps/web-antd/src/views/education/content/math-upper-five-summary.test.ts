import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { newReviewQuestions } from '../learning/review';
import { initialLibrary } from '../learning/storage';
import { mathBooks } from './math';
import { upperFiveSummaryLesson as lesson } from './math-upper-five-summary';

const book = () => required(mathBooks.find((b) => b.volume === 'upper'));
const q = (suffix: string) =>
  required(lesson.questions.find((q) => q.id === `mu-five-summary-${suffix}`));
describe('complete five-number zero and organizing tasks', () => {
  it('covers every allowed addition and subtraction once and independently computes all 42 answers', () => {
    const expectedAdd: string[] = [];
    const expectedSub: string[] = [];
    for (let a = 0; a <= 5; a += 1)
      for (let b = 0; b <= 5; b += 1) {
        if (a + b <= 5) expectedAdd.push(`${a}+${b}`);
        if (a >= b) expectedSub.push(`${a}−${b}`);
      }
    const actual: Record<string, string[]> = { add: [], sub: [] };
    for (const prefix of ['add', 'sub'])
      for (let n = 0; n <= 5; n += 1) {
        const question = q(`${prefix}${n}`);
        const terms = [...question.prompt.matchAll(/(\d)([+−])(\d)/g)];
        required(actual[prefix]).push(...terms.map((m) => m[0]));
        const answers = terms.map((m) =>
          m[2] === '+'
            ? Number(m[1]) + Number(m[3])
            : Number(m[1]) - Number(m[3]),
        );
        expect(terms).toHaveLength(n + 1);
        expect(evaluate(question.rule, answers)).toBe(true);
        expect(
          evaluate(
            question.rule,
            answers.map((n) => n + 1),
          ),
        ).toBe(false);
      }
    expect(actual.add?.toSorted()).toEqual(expectedAdd.toSorted());
    expect(actual.sub?.toSorted()).toEqual(expectedSub.toSorted());
    expect(new Set(actual.add).size).toBe(21);
    expect(new Set(actual.sub).size).toBe(21);
    for (const n of [5, 4, 3])
      expect(evaluate(q(`zero${n}`).rule, [0 + n, n + 0, n - 0, n - n])).toBe(
        true,
      );
    expect(evaluate(q('sub5').rule, [5, 4, 2, 0, -4, -9])).toBe(false);
    expect(evaluate(q('addLast').rule, [0, 1, 2, 3, 4, 5])).toBe(true);
    expect(evaluate(q('subLast').rule, [0, 0, 0, 0, 0, 0])).toBe(true);
    expect(evaluate(q('addLast').rule, [0, 0, 0, 0, 0, 0])).toBe(false);
  });
  it('independently verifies the twelve practice calculations, open inequalities, count differences and stories', () => {
    const calculations = [
      [1 - 0, 2 + 3, 0 + 0, 5 - 3],
      [3 - 2, 2 - 2, 4 - 3, 4 - 1],
      [1 + 3, 3 + 1, 0 + 2, 5 - 5],
    ];
    calculations.forEach((values, i) =>
      expect(evaluate(q(`calc${i + 1}`).rule, values)).toBe(true),
    );
    const predicates = {
      gt3: (n: number) => n > 3,
      lt5: (n: number) => n < 5,
      below4: (n: number) => n < 4,
      above2: (n: number) => n > 2,
    };
    for (const [suffix, accepts] of Object.entries(predicates)) {
      const values = [0, 1, 2, 3, 4, 5]
        .filter((value) => accepts(value))
        .map((value) => value.toString());
      expect(evaluate(q(suffix).rule, values)).toBe(true);
      expect(evaluate(q(suffix).rule, values.slice(1))).toBe(false);
      let boundary = '2';
      if (suffix === 'gt3') boundary = '3';
      else if (suffix === 'lt5') boundary = '5';
      else if (suffix === 'below4') boundary = '4';
      expect(evaluate(q(suffix).rule, [...values, boundary])).toBe(false);
    }
    expect(evaluate(q('sequence').rule, [1, 3, 5])).toBe(true);
    expect(evaluate(q('comparison').rule, [5, 3, 5 - 3, 5 - 3])).toBe(true);
    expect(evaluate(q('stories').rule, [2 + 1, 5 - 4])).toBe(true);
    expect(
      evaluate(q('meaning').rule, '空量和起点都可用0，含义按情境说明'),
    ).toBe(true);
    expect(evaluate(q('meaning').rule, '尺上0表示尺子不存在')).toBe(false);
    expect(() => evaluate(q('zero5').rule, [5, null, 5, 0])).toThrow(
      'educationLearning.answerRequired',
    );
  });
  it('preserves previous course snapshots, zero and partial drafts and keeps every real activity and reflection ungraded', () => {
    const unit = required(book().units.find((u) => u.id === 'u1'));
    expect(unit.lessons.slice(0, 10).map((l) => l.id)).toEqual([
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
    ]);
    expect(unit.lessons[10]).toEqual(lesson);
    const state = initialLibrary('五内完整整理');
    const old = createSession(
      required(unit.lessons[6]),
      book().id,
      state.activeProfileId,
      { seed: 1 },
    );
    state.sessions.push(old);
    const snapshot = JSON.stringify(old);
    const s = createSession(lesson, book().id, state.activeProfileId, {
      seed: 2,
    });
    const index = s.questions.findIndex((q) => q.id.endsWith('-zero5'));
    required(s.responses[index]).draft = [5, null, 5, 0];
    for (const [index, question] of s.questions.entries()) {
      if (!['manual', 'reflection'].includes(question.rule.kind)) continue;
      required(s.responses[index]).draft =
        question.rule.kind === 'manual'
          ? 'confirmed'
          : '原页与纸卡未做，计划另记。';
      s.responses[index] = submitResponse(
        question,
        required(s.responses[index]),
      );
      expect(s.responses[index]?.submissions[0]?.correct).toBeNull();
    }
    expect(s.questions).toHaveLength(38);
    expect(s.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(8);
    expect(
      s.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(2);
    expect(s.activities).toEqual([]);
    state.sessions.push(s);
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
    expect(JSON.stringify(state.sessions[0])).toBe(snapshot);
  });
  it('offers changed conditions after a real ordering mistake and exhausts variants without overwriting the original', () => {
    const s = createSession(lesson, book().id, 'child', { seed: 3 });
    const index = s.questions.findIndex((q) => q.id.endsWith('-sub5'));
    required(s.responses[index]).draft = [0, 1, 2, 3, 4, 5];
    s.responses[index] = submitResponse(
      required(s.questions[index]),
      required(s.responses[index]),
    );
    const snapshot = JSON.stringify(s);
    const fresh = newReviewQuestions(lesson, s, [s]);
    expect(fresh).toHaveLength(4);
    const answers = [
      [2, 2, 2, 0],
      [0, 1, 2, 3],
      [0, 1, 2, 3, 4, 5].filter((n) => n > 1).map((value) => value.toString()),
      [4, 0],
    ];
    answers.forEach((value, index) =>
      expect(evaluate(required(fresh[index]).rule, value)).toBe(true),
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

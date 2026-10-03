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
import { writtenOrganizeLesson as lesson } from './math-written-organize';

const book = () => required(mathBooks.find((b) => b.volume === 'lower'));
const q = (n: number) =>
  required(lesson.questions.find((q) => q.id === `ml-written-organize-q${n}`));
describe('independent calculation, strict boundaries and actual autonomous organization', () => {
  it('independently checks all main and changed review results', () => {
    const answers = [
      [43, 15, 49, 35, 53, 17, 69, 23, 70, 46, 65, 13],
      [45, 37, 8, 74, 54, 20, 45, 28, 17, 72, 63, 9],
      [32, 87, 45, 8, 22, 41],
      ['57+8', '86−22', '31+20'],
      ['62−19', '34+9'],
      '两组都不属于',
      [62, 27, 45, 26, 67, 49],
      ['98−36', '75−13', '89−27', '80−18'],
      87,
      '不能确定，缺少是否重复的信息',
      15,
      [49, 41],
      [18, 21, 19, 20],
      [28, 0],
    ];
    answers.forEach((a, i) => expect(evaluate(q(i + 1).rule, a)).toBe(true));
    [
      [49, 13, 83, 29],
      [39, 83, 56, 12, 27, 43],
      [64, 27, 64, 40],
      [22, 25, 23, 24],
    ].forEach((a, i) =>
      expect(evaluate(required(lesson.reviewQuestions?.[i]).rule, a)).toBe(
        true,
      ),
    );
    expect(
      evaluate(q(1).rule, [43, 29, 49, 42, 53, 35, 69, 46, 70, 58, 65, 39]),
    ).toBe(false);
    expect(evaluate(q(3).rule, [32, 59, 86, 8, 0, 0])).toBe(false);
    expect(evaluate(q(7).rule, [62, 51, 45, 54, 67, 23])).toBe(false);
    expect(evaluate(q(6).rule, '大于50')).toBe(false);
    expect(evaluate(q(10).rule, '一定是87人')).toBe(false);
    expect(() => evaluate(q(14).rule, [28, null])).toThrow(
      'educationLearning.answerRequired',
    );
  });
  it('checks every candidate against a complete pair, and excludes equality from both strict bins', () => {
    const pairs = required(q(8).choices)
      .filter((c) => {
        const [a, b] = c.id.split('−').map(Number);
        return required(a) - required(b) === 62;
      })
      .map((c) => c.id);
    expect(q(8).rule).toEqual({ kind: 'set', values: pairs });
    expect(evaluate(q(4).rule, ['57+8', '86−22', '31+20', '25+25'])).toBe(
      false,
    );
    expect(evaluate(q(5).rule, ['62−19', '34+9', '71−21'])).toBe(false);
  });
  it('preserves the original course snapshot, partial card draft, real activity and reflection boundaries', () => {
    const state = initialLibrary('整理探索核验');
    const original = required(
      book()
        .units.flatMap((u) => u.lessons)
        .find((l) => l.id === 'ml-written-add'),
    );
    const old = createSession(original, book().id, state.activeProfileId, {
      seed: 3,
    });
    state.sessions.push(old);
    const oldSnapshot = JSON.stringify(old);
    const s = createSession(lesson, book().id, state.activeProfileId, {
      seed: 4,
    });
    const index = s.questions.findIndex(
      (q) => q.id === 'ml-written-organize-q13',
    );
    required(s.responses[index]).draft = [18, null, 19, 20];
    for (const [i, q] of s.questions.entries()) {
      if (q.rule.kind !== 'manual' && q.rule.kind !== 'reflection') continue;
      required(s.responses[i]).draft =
        q.rule.kind === 'manual'
          ? 'confirmed'
          : '实际材料与交流未做，记录疑问。';
      s.responses[i] = submitResponse(q, required(s.responses[i]));
      expect(s.responses[i]?.submissions[0]?.correct).toBeNull();
    }
    expect(statistics(s).accuracy).toBeNull();
    expect(s.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(8);
    expect(
      s.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(3);
    state.sessions.push(s);
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
    expect(JSON.stringify(state.sessions[0])).toBe(oldSnapshot);
    for (const corrupt of [
      (copy: typeof state) => {
        required(required(copy.sessions[1]).responses[index]).draft = [18, 19];
      },
      (copy: typeof state) => {
        const visual = required(
          required(copy.sessions[1]).questions[index],
        ).visual;
        if (visual?.kind === 'card-equation') visual.values = [22, 23, 24, 25];
      },
    ]) {
      const copy = structuredClone(state);
      corrupt(copy);
      expect(() => exportBackup(copy)).toThrow(
        'educationLearning.invalidRecord',
      );
    }
  });
  it('selects only the fresh organizing variants after an actual specialty mistake', () => {
    const pool = required(
      book().specialties?.find((l) => l.id === 'ms-lower-calculation'),
    );
    expect(pool.version).toBe(10);
    const s = createSession(pool, book().id, 'child', { seed: 5 });
    const index = s.questions.findIndex(
      (q) => q.id === 'ml-written-organize-q13',
    );
    required(s.responses[index]).draft = [18, 19, 20, 21];
    s.responses[index] = submitResponse(
      required(s.questions[index]),
      required(s.responses[index]),
    );
    const fresh = newReviewQuestions(pool, s, [s]);
    expect(fresh.map((q) => q.id)).toEqual(
      required(lesson.reviewQuestions).map((q) => q.id),
    );
    const r = createSession(pool, book().id, 'child', {
      mode: 'review',
      originalSessionId: s.id,
      questions: fresh,
    });
    expect(newReviewQuestions(pool, s, [s, r])).toEqual([]);
  });
});

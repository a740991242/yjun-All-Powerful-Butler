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
import { writtenCorrectLesson as lesson } from './math-written-correct';

const book = () => required(mathBooks.find((b) => b.volume === 'lower'));
const q = (n: number) =>
  required(lesson.questions.find((q) => q.id === `ml-written-correct-q${n}`));
describe('source-scoped written error correction and missing digits', () => {
  it('independently checks each corrected result, reason and all four changed reviews', () => {
    const answers = [
      [3, 8, 83],
      '漏掉个位进来的1个十',
      80,
      '个位0没有写进结果',
      40,
      '一位数应对个位',
      [5, 10, 3, 3, 33],
      '退位后仍用了原来的6个十',
      [6, 15, 3, 7, 37],
      [3, 3],
      [8, 8, 0],
      [3, 3],
      [2, 5, 0],
    ];
    answers.forEach((a, i) => expect(evaluate(q(i + 1).rule, a)).toBe(true));
    [[7], [5, 2], [8, 7, 0], [3, 5, 0]].forEach((a, i) =>
      expect(evaluate(required(lesson.reviewQuestions?.[i]).rule, a)).toBe(
        true,
      ),
    );
    expect(evaluate(q(7).rule, [6, 10, 4, 3, 43])).toBe(false);
    expect(evaluate(q(9).rule, [7, 15, 4, 3, 43])).toBe(false);
    expect(evaluate(q(4).rule, '8和80表示同一数')).toBe(false);
    const registered = required(
      book()
        .units.flatMap((u) => u.lessons)
        .find((l) => l.id === lesson.id),
    );
    expect(registered.questions).toEqual(lesson.questions);
  });
  it('retains every legal missing-digit combination instead of independent field choices or one fixed example', () => {
    for (let c = 0; c <= 9; c++) {
      const a = 88 + c;
      expect(evaluate(q(11).rule, [Math.floor(a / 10), a % 10, c])).toBe(true);
    }
    for (let a = 2; a <= 9; a++)
      expect(evaluate(q(13).rule, [a, 5, a - 2])).toBe(true);
    expect(evaluate(q(11).rule, [9, 8, 0])).toBe(false);
    expect(evaluate(q(13).rule, [2, 5, 7])).toBe(false);
    expect(() => evaluate(q(11).rule, [8, 8, null])).toThrow(
      'educationLearning.answerRequired',
    );
  });
  it('persists partial zero and two attempts, and refuses corrupt rules, mismatched pictures and drafts', () => {
    const state = initialLibrary('竖式缺位核验');
    const original = required(
      book()
        .units.flatMap((u) => u.lessons)
        .find((l) => l.id === 'ml-written-sub'),
    );
    const old = createSession(original, book().id, state.activeProfileId, {
      seed: 3,
    });
    state.sessions.push(old);
    const snapshot = JSON.stringify(old);
    const s = createSession(lesson, book().id, state.activeProfileId, {
      seed: 4,
    });
    const index = s.questions.findIndex(
      (q) => q.id === 'ml-written-correct-q11',
    );
    required(s.responses[index]).draft = [8, 8, 0];
    s.responses[index] = submitResponse(
      required(s.questions[index]),
      required(s.responses[index]),
    );
    required(s.responses[index]).draft = [9, 7, 9];
    s.responses[index] = submitResponse(
      required(s.questions[index]),
      required(s.responses[index]),
    );
    const partial = s.questions.findIndex(
      (q) => q.id === 'ml-written-correct-q13',
    );
    required(s.responses[partial]).draft = [2, null, 0];
    state.sessions.push(s);
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
    expect(JSON.stringify(state.sessions[0])).toBe(snapshot);
    for (const corrupt of [
      (copy: typeof state) => {
        required(required(copy.sessions[1]).responses[partial]).draft = [
          '2',
          '5',
          '0',
        ];
      },
      (copy: typeof state) => {
        required(required(copy.sessions[1]).responses[partial]).draft = [2, 0];
      },
      (copy: typeof state) => {
        const visual = required(
          required(copy.sessions[1]).questions[index],
        ).visual;
        if (visual?.kind === 'column-digits') visual.result = [5, 8];
      },
      (copy: typeof state) => {
        const rule = required(required(copy.sessions[1]).questions[index]).rule;
        if (rule.kind === 'column-digits') rule.operator = '+';
      },
    ]) {
      const copy = structuredClone(state);
      corrupt(copy);
      expect(() => parseBackup(exportBackup(copy))).toThrow(
        'educationLearning.invalidRecord',
      );
    }
  });
  it('keeps six actual activities and two reflections outside objective accuracy', () => {
    const s = createSession(lesson, book().id, 'child', { seed: 5 });
    for (const [i, q] of s.questions.entries()) {
      if (q.rule.kind !== 'manual' && q.rule.kind !== 'reflection') continue;
      required(s.responses[i]).draft =
        q.rule.kind === 'manual' ? 'confirmed' : '真实活动尚未进行，保留疑问。';
      s.responses[i] = submitResponse(q, required(s.responses[i]));
      expect(s.responses[i]?.submissions[0]?.correct).toBeNull();
    }
    expect(statistics(s).accuracy).toBeNull();
    expect(s.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(6);
    expect(
      s.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(2);
  });
  it('selects new missing-digit tasks for an actual specialty mistake and then exhausts them', () => {
    const specialty = required(
      book().specialties?.find((l) => l.id === 'ms-lower-calculation'),
    );
    expect(specialty.version).toBe(10);
    const s = createSession(specialty, book().id, 'child', { seed: 6 });
    const index = s.questions.findIndex(
      (q) => q.id === 'ml-written-correct-q11',
    );
    required(s.responses[index]).draft = [9, 8, 0];
    s.responses[index] = submitResponse(
      required(s.questions[index]),
      required(s.responses[index]),
    );
    const fresh = newReviewQuestions(specialty, s, [s]);
    expect(fresh.map((q) => q.id)).toEqual(
      required(lesson.reviewQuestions).map((q) => q.id),
    );
    const r = createSession(specialty, book().id, 'child', {
      mode: 'review',
      originalSessionId: s.id,
      questions: fresh,
    });
    expect(newReviewQuestions(specialty, s, [s, r])).toEqual([]);
  });
});

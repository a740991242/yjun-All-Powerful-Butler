import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { finalPlaneCards } from '../learning/final-plane-cards';
import { required } from '../learning/required';
import { newReviewQuestions } from '../learning/review';
import { isShapeJoinState, joinedShape } from '../learning/shape-join';
import { initialLibrary } from '../learning/storage';
import { mathBooks } from './math';
import { lowerFinalShapesLesson as lesson } from './math-lower-final-shapes';
const book = () => required(mathBooks.find((b) => b.volume === 'lower'));
const q = (n: number) =>
  required(lesson.questions.find((q) => q.id === `ml-final-shapes-q${n}`));
describe('lower final complete plane classification and real assembly boundaries', () => {
  it('checks twelve objectives, all letters, whole/pieces distinction and changed review inventory', () => {
    const answers = [
      [3, 1, 2, 4, 2, 12],
      [3, 4, 7],
      ['D', 'J'],
      ['长方形', '正方形', '三角形', '圆', '平行四边形'],
      [4 + 4 + 4, 4 + 4 + 4 - 9],
      [4, 1],
      '完整外轮廓',
      ['5张三角形', '1张正方形', '1张平行四边形'],
      ['正方形', '较大三角形', '平行四边形'],
      '保持不变',
      [12, 0],
      '不能',
    ];
    answers.forEach((a, i) => expect(evaluate(q(i + 1).rule, a)).toBe(true));
    const order = [
      'rectangle',
      'square',
      'triangle',
      'circle',
      'parallelogram',
    ];
    for (const variant of ['main', 'review'] as const) {
      const cards = finalPlaneCards({ kind: 'final-plane-cards', variant });
      const counts = order.map(
        (shape) => cards.filter((c) => c.shape === shape).length,
      );
      expect(new Set(cards.map((c) => c.label)).size).toBe(cards.length);
      const question =
        variant === 'main' ? q(1) : required(lesson.reviewQuestions?.[0]);
      expect(evaluate(question.rule, [...counts, cards.length])).toBe(true);
      expect(counts.reduce((a, b) => a + b, 0)).toBe(cards.length);
    }
    [[2, 2, 3, 5, 1, 13], ['F'], [2 + 2 + 2 + 2 + 2, 10 - 7], '4条'].forEach(
      (a, i) =>
        expect(evaluate(required(lesson.reviewQuestions?.[i]).rule, a)).toBe(
          true,
        ),
    );
    const possible = new Set<string>();
    for (let ax = 0; ax <= 4; ax++)
      for (let ay = 0; ay <= 2; ay++)
        for (let at = 0; at < 4; at++)
          for (let bx = 0; bx <= 4; bx++)
            for (let by = 0; by <= 2; by++)
              for (let bt = 0; bt < 4; bt++) {
                const state = {
                  selected: 0,
                  pieces: [
                    { x: ax, y: ay, turn: at },
                    { x: bx, y: by, turn: bt },
                  ],
                };
                if (!isShapeJoinState(state)) continue;
                const result = joinedShape(state);
                if (result) possible.add(result);
              }
    expect(possible).toEqual(new Set(['parallelogram', 'square', 'triangle']));
  });
  it('rejects adding frames/seams, mixing circle and sphere, partial categories or unsupported arbitrary assembly', () => {
    expect(evaluate(q(1).rule, [3, 1, 2, 4, 2, 13])).toBe(false);
    expect(evaluate(q(2).rule, [3, 4, 12])).toBe(false);
    expect(evaluate(q(3).rule, ['D'])).toBe(false);
    expect(evaluate(q(3).rule, ['D', 'J', 'E'])).toBe(false);
    expect(evaluate(q(4).rule, ['圆', '球'])).toBe(false);
    expect(evaluate(q(5).rule, [3, 0])).toBe(false);
    expect(evaluate(q(6).rule, [1, 4])).toBe(false);
    expect(evaluate(q(7).rule, '只看内部拼缝')).toBe(false);
    expect(
      evaluate(q(9).rule, ['正方形', '较大三角形', '平行四边形', '圆']),
    ).toBe(false);
    expect(evaluate(q(11).rule, [12, 4])).toBe(false);
    expect(() => evaluate(q(11).rule, [12, null])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(evaluate(q(12).rule, '能')).toBe(false);
    expect(
      evaluate(required(lesson.reviewQuestions?.[0]).rule, [3, 1, 2, 4, 2, 12]),
    ).toBe(false);
    expect(
      evaluate(required(lesson.reviewQuestions?.[1]).rule, ['D', 'J']),
    ).toBe(false);
  });
  it('keeps old plane sessions, partial zero and two fixed diagram variants in strict backups', () => {
    const state = initialLibrary('图形核验');
    const oldLesson = required(
      book()
        .units.flatMap((u) => u.lessons)
        .find((l) => l.id === 'ml-flat-join'),
    );
    const old = createSession(oldLesson, book().id, state.activeProfileId, {
      seed: 1,
    });
    state.sessions.push(old);
    const before = JSON.stringify(old);
    const s = createSession(lesson, book().id, state.activeProfileId, {
      seed: 2,
    });
    const index = s.questions.findIndex((q) => q.id === 'ml-final-shapes-q11');
    required(s.responses[index]).draft = [null, 0];
    for (const [i, question] of s.questions.entries()) {
      if (
        question.rule.kind !== 'manual' &&
        question.rule.kind !== 'reflection'
      )
        continue;
      required(s.responses[i]).draft =
        question.rule.kind === 'manual'
          ? 'confirmed'
          : '真实拼组未做，计划另列。';
      s.responses[i] = submitResponse(question, required(s.responses[i]));
      expect(s.responses[i]?.submissions[0]?.correct).toBeNull();
    }
    expect(statistics(s).accuracy).toBeNull();
    expect(s.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(6);
    expect(
      s.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(2);
    state.sessions.push(s);
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
    expect(JSON.stringify(state.sessions[0])).toBe(before);
    const corrupt = JSON.parse(exportBackup(state));
    const diagram = corrupt.data.sessions[1].questions.find(
      (q: { id: string }) => q.id === 'ml-final-shapes-q1',
    ).visual;
    diagram.answer = 12;
    expect(() => parseBackup(JSON.stringify(corrupt))).toThrow(
      'educationLearning.invalidBackup',
    );
    const reviewSession = createSession(
      lesson,
      book().id,
      state.activeProfileId,
      {
        questions: required(lesson.reviewQuestions),
        mode: 'review',
        originalSessionId: s.id,
      },
    );
    state.sessions.push(reviewSession);
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
  });
  it('registers the exact course and preserves versioned specialty snapshots while offering four new variants', () => {
    expect(
      book()
        .units.flatMap((u) => u.lessons)
        .some((l) => l.id === lesson.id),
    ).toBe(true);
    const pool = required(
      book().specialties?.find((l) => l.id === 'ms-lower-shapes'),
    );
    expect(pool.version).toBe(4);
    const s = createSession(pool, book().id, 'child', { seed: 5 });
    const index = s.questions.findIndex((q) => q.id === 'ml-final-shapes-q1');
    required(s.responses[index]).draft = [3, 1, 2, 4, 2, 13];
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

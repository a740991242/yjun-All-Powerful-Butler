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
import { seatNeighbour, seatPosition } from '../learning/seat-grid';
import { initialLibrary } from '../learning/storage';
import { mathBooks } from './math';
import { upperGamesCampusLesson as lesson } from './math-upper-games-campus';
const book = () => required(mathBooks.find((b) => b.volume === 'upper'));
const q = (n: number) =>
  required(lesson.questions.find((q) => q.id === `mu-games-campus-q${n}`));
describe('upper mathematics games: campus facts and personal reference direction', () => {
  it('checks quantities, labels and all personal directions independently from the explicit seat rows', () => {
    const diagram = required(q(1).visual);
    if (diagram.kind !== 'seat-grid') throw new Error('seat-grid expected');
    const position = required(seatPosition(diagram, 'E'));
    expect(
      evaluate(q(1).rule, [
        position.row,
        position.column,
        diagram.rows.flat().length,
      ]),
    ).toBe(true);
    expect(evaluate(q(2).rule, [5, 2])).toBe(true);
    expect(evaluate(q(3).rule, '班级编号')).toBe(true);
    for (const [n, direction] of [
      [4, 'front'],
      [5, 'rear'],
      [6, 'left'],
      [7, 'right'],
    ] as const)
      expect(
        evaluate(q(n).rule, required(seatNeighbour(diagram, 'E', direction))),
      ).toBe(true);
    const fromF = required(seatPosition(diagram, 'F'));
    const row = required(diagram.rows[fromF.row - 1]);
    expect(evaluate(q(8).rule, required(row[fromF.column - 3]))).toBe(true);
    expect(evaluate(q(9).rule, required(row[fromF.column - 2]))).toBe(true);
    expect(evaluate(q(10).rule, '长方形')).toBe(true);
    expect(evaluate(q(11).rule, [9, 0])).toBe(true);
    expect(evaluate(q(12).rule, '实际询问或观察核对，暂记未知')).toBe(true);
    [[2, 2, 9], 'I', 'I', [4, 3]].forEach((a, i) =>
      expect(evaluate(required(lesson.reviewQuestions?.[i]).rule, a)).toBe(
        true,
      ),
    );
  });
  it('rejects total/ordinal swapping, own versus row-end origin, observer reversal and missing zero', () => {
    expect(evaluate(q(2).rule, [2, 5])).toBe(false);
    expect(evaluate(q(3).rule, '一年级肯定只有4个班')).toBe(false);
    expect(evaluate(q(6).rule, 'F')).toBe(false);
    expect(evaluate(q(7).rule, 'D')).toBe(false);
    expect(evaluate(q(8).rule, 'E')).toBe(false);
    expect(evaluate(q(9).rule, 'F')).toBe(false);
    expect(evaluate(q(10).rule, '长方体')).toBe(false);
    expect(() => evaluate(q(11).rule, [9, null])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(evaluate(q(12).rule, '直接把教材示例当本校情况')).toBe(false);
    expect(evaluate(required(lesson.reviewQuestions?.[1]).rule, 'D')).toBe(
      false,
    );
  });
  it('keeps original games snapshots and partial zero while treating actual observations and preference as ungraded', () => {
    const state = initialLibrary('校园核验');
    const original = required(
      book()
        .units.flatMap((u) => u.lessons)
        .find((l) => l.id === 'mu-count'),
    );
    const old = createSession(original, book().id, state.activeProfileId, {
      seed: 1,
    });
    state.sessions.push(old);
    const before = JSON.stringify(old);
    const s = createSession(lesson, book().id, state.activeProfileId, {
      seed: 2,
    });
    const index = s.questions.findIndex((q) => q.id === 'mu-games-campus-q11');
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
          : '实际学校信息未知，纸面模拟与计划另列。';
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
  });
  it('preserves the original games order and issues four new cross-topic variants after a real mistake', () => {
    const games = required(book().units.find((u) => u.id === 'games'));
    expect(games.lessons.slice(0, 3).map((l) => l.id)).toEqual([
      'mu-count',
      'mu-compare',
      'mu-partition',
    ]);
    expect(games.lessons[3]?.id).toBe(lesson.id);
    const s = createSession(lesson, book().id, 'child', { seed: 3 });
    const index = s.questions.findIndex((q) => q.id === 'mu-games-campus-q8');
    required(s.responses[index]).draft = 'E';
    s.responses[index] = submitResponse(
      required(s.questions[index]),
      required(s.responses[index]),
    );
    const fresh = newReviewQuestions(lesson, s, [s]);
    expect(fresh.map((q) => q.id)).toEqual(
      required(lesson.reviewQuestions).map((q) => q.id),
    );
    const r = createSession(lesson, book().id, 'child', {
      mode: 'review',
      originalSessionId: s.id,
      questions: fresh,
    });
    expect(newReviewQuestions(lesson, s, [s, r])).toEqual([]);
  });
});

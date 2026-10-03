import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { newReviewQuestions } from '../learning/review';
import { initialLibrary } from '../learning/storage';
import { mathBooks } from './math';
import { upperFiveObserveLesson as lesson } from './math-upper-five-observe';

const book = () => required(mathBooks.find((b) => b.volume === 'upper'));
const q = (n: number) =>
  required(lesson.questions.find((q) => q.id === `mu-five-observe-q${n}`));

describe('five-number quantity, ordinal and hidden-information course', () => {
  it('independently counts queue ranges, removal and hidden positions instead of adding ordinal labels', () => {
    const labels = ['A', 'B', 'C', 'D', 'E'];
    for (const [n, name] of [
      [2, 'B'],
      [3, 'E'],
    ] as const) {
      const index = labels.indexOf(name);
      const before = labels.slice(0, index);
      const after = labels.slice(index + 1);
      expect(
        evaluate(q(n).rule, [labels.length, before.length, after.length]),
      ).toBe(true);
      expect(
        evaluate(q(n).rule, [labels.length, before.length + 1, after.length]),
      ).toBe(false);
      expect(q(n).visual).toEqual({ kind: 'queue', labels, front: 'left' });
    }
    expect(evaluate(q(1).rule, [3, 3, 3])).toBe(true);
    expect(evaluate(q(4).rule, labels.slice(0, 4))).toBe(true);
    expect(evaluate(q(4).rule, ['D'])).toBe(false);
    expect(evaluate(q(5).rule, required(labels[3]))).toBe(true);
    expect(evaluate(q(6).rule, required([...labels].toReversed()[1]))).toBe(
      true,
    );
    expect(evaluate(q(6).rule, 'B')).toBe(false);
    const remaining = labels.filter((name) => name !== labels[3]);
    expect(
      evaluate(q(7).rule, [remaining.length, remaining.indexOf('E') + 1]),
    ).toBe(true);
    expect(evaluate(q(7).rule, [4, 5])).toBe(false);
    const visible = [1, 2, 5];
    const hidden = [1, 2, 3, 4, 5].filter(
      (position) => !visible.includes(position),
    );
    expect(
      evaluate(q(8).rule, [
        hidden.length,
        visible.length,
        visible.length + hidden.length,
      ]),
    ).toBe(true);
    expect(evaluate(q(8).rule, [3 + 4, 3, 5])).toBe(false);
    expect(evaluate(q(9).rule, [3 - 1, 3 - 2])).toBe(true);
    for (const n of [10, 11]) {
      expect(evaluate(q(n).rule, '不能确定')).toBe(true);
      expect(evaluate(q(n).rule, n === 10 ? '0颗' : '0人')).toBe(false);
    }
    expect(evaluate(q(12).rule, '不能断定')).toBe(true);
    expect(evaluate(q(12).rule, '能，都是3')).toBe(false);
  });
  it('checks every equal split and all legal comparison values, including zero and excluding discarded items', () => {
    const equalSplits = [];
    for (let left = 0; left <= 5; left += 1)
      for (let right = 0; right <= 5; right += 1)
        if (left + right === 5 && left === right)
          equalSplits.push([left, right]);
    expect(equalSplits).toEqual([]);
    expect(evaluate(q(13).rule, '不能')).toBe(true);
    expect(evaluate(q(13).rule, '能')).toBe(false);
    for (let left = 0; left <= 4; left += 1)
      for (let right = 0; right <= 4; right += 1)
        expect(evaluate(q(14).rule, [left, right])).toBe(
          left + right === 4 && left === right,
        );
    expect(evaluate(q(15).rule, '2和2')).toBe(true);
    expect(evaluate(q(15).rule, '1和3')).toBe(false);
    const domain = [0, 1, 2, 3, 4, 5];
    const less = domain.filter((n) => n < 4).map((value) => value.toString());
    expect(evaluate(q(16).rule, less)).toBe(true);
    expect(evaluate(q(16).rule, ['1', '2', '3'])).toBe(false);
    expect(evaluate(q(16).rule, [...less, '4'])).toBe(false);
    expect(evaluate(q(17).rule, [required(domain.find((n) => n > 4)), 4])).toBe(
      true,
    );
    expect(evaluate(q(18).rule, [4 - 3, 5 - 4])).toBe(true);
    const signs = [
      [4, 3],
      [3, 4],
      [4, 5],
      [5, 4],
    ]
      .map(([a, b]) => (required(a) > required(b) ? '>' : '<'))
      .join('、');
    expect(evaluate(q(19).rule, signs)).toBe(true);
    expect(evaluate(q(20).rule, '两边人数不同')).toBe(true);
    expect(evaluate(q(20).rule, '改成同人数就保证力量一样')).toBe(false);
    expect(() => evaluate(q(3).rule, [5, 4, null])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(evaluate(q(3).rule, [5, 4, 0])).toBe(true);
  });
  it('appends without replacing the previous nine courses and preserves zero, null, historical snapshots and ungraded work', () => {
    const unit = required(book().units.find((unit) => unit.id === 'u1'));
    expect(unit.lessons.slice(0, 9).map((l) => l.id)).toEqual([
      'mu-five',
      'mu-five-sequence',
      'mu-five-compare',
      'mu-five-partition',
      'mu-five-add',
      'mu-five-sub',
      'mu-zero',
      'mu-ordinal',
      'mu-five-organize',
    ]);
    expect(unit.lessons[9]).toEqual(lesson);
    const state = initialLibrary('数量与顺序');
    const old = createSession(
      required(unit.lessons[7]),
      book().id,
      state.activeProfileId,
      { seed: 1 },
    );
    state.sessions.push(old);
    const oldSnapshot = JSON.stringify(old);
    const session = createSession(lesson, book().id, state.activeProfileId, {
      seed: 2,
    });
    expect(session.activities).toEqual([]);
    const index = session.questions.findIndex((q) => q.id.endsWith('-q3'));
    required(session.responses[index]).draft = [5, null, 0];
    for (const [index, question] of session.questions.entries()) {
      if (!['manual', 'reflection'].includes(question.rule.kind)) continue;
      required(session.responses[index]).draft =
        question.rule.kind === 'manual'
          ? 'confirmed'
          : '真实活动未做，不冒确认；未来计划另记。';
      session.responses[index] = submitResponse(
        question,
        required(session.responses[index]),
      );
      expect(session.responses[index]?.submissions[0]?.correct).toBeNull();
    }
    expect(
      session.questions.filter((q) => q.rule.kind === 'manual'),
    ).toHaveLength(7);
    expect(
      session.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(2);
    expect(session.questions).toHaveLength(29);
    state.sessions.push(session);
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
    expect(JSON.stringify(state.sessions[0])).toBe(oldSnapshot);
  });
  it('provides independently checked new conditions after a real mistake and exhausts reuse without changing the original', () => {
    const session = createSession(lesson, book().id, 'child', { seed: 3 });
    const index = session.questions.findIndex((q) => q.id.endsWith('-q4'));
    required(session.responses[index]).draft = ['D'];
    session.responses[index] = submitResponse(
      required(session.questions[index]),
      required(session.responses[index]),
    );
    const snapshot = JSON.stringify(session);
    const fresh = newReviewQuestions(lesson, session, [session]);
    expect(fresh).toHaveLength(4);
    const queue = ['A', 'B', 'C', 'D'].toReversed();
    const position = queue.indexOf('C');
    const values = [
      [queue.length, position, queue.length - position - 1],
      [0, 1, 2, 3, 4, 5].filter((n) => n < 3).map((value) => value.toString()),
      [4 - 1, 1],
      ['A', 'B', 'C', 'D', 'E'].toReversed()[3],
    ];
    values.forEach((value, index) =>
      expect(evaluate(required(fresh[index]).rule, required(value))).toBe(true),
    );
    const review = createSession(lesson, book().id, 'child', {
      mode: 'review',
      originalSessionId: session.id,
      questions: fresh,
    });
    expect(newReviewQuestions(lesson, session, [session, review])).toEqual([]);
    expect(JSON.stringify(session)).toBe(snapshot);
  });
});

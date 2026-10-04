import type { Response } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { twentyPracticeLessons } from './math-twenty-practice';
import { twentyDescriptionQuestions } from './math-twenty-representation-practice';

it('checks every description independently and restores all three missing cards in both complete sequences', () => {
  for (const review of [false, true]) {
    const start = review ? 13 : 12;
    const qs = twentyDescriptionQuestions(review);
    expect(qs).toHaveLength(7);
    const expected = [
      start + 1,
      start,
      start + 5,
      start + 4,
      start + 6,
      start + 3,
    ];
    for (let i = 0; i < 6; i++) {
      const q = required(qs[i]);
      for (let n = 0; n <= 20; n++)
        expect(evaluate(q.rule, String(n))).toBe(n === expected[i]);
      expect(q.choices?.map((c) => Number(c.id))).toEqual(
        Array.from({ length: 7 }, (_, n) => start + n),
      );
    }
    const q = required(qs[6]);
    expect(q.visual?.kind).toBe('number-strip');
    if (q.visual?.kind !== 'number-strip') throw new Error('Missing strip');
    let answerIndex = 0;
    const values = q.visual.values.map((n, i) => {
      if (n !== null) {
        expect(n).toBe(start + i);
        return n;
      }
      const expected = start + i;
      if (q.rule.kind !== 'steps') throw new Error('Missing three-field rule');
      expect(q.rule.values[answerIndex++]).toBe(expected);
      return expected;
    });
    expect(values).toEqual(Array.from({ length: 7 }, (_, n) => start + n));
    expect(answerIndex).toBe(3);
    expect(evaluate(q.rule, [start, start + 3, start + 6])).toBe(true);
    expect(evaluate(q.rule, [start, start + 3, start + 5])).toBe(false);
    expect(() => evaluate(q.rule, [start, null, start + 6])).toThrow(
      'educationLearning.answerRequired',
    );
  }
  for (const [i, main] of twentyDescriptionQuestions(false).entries()) {
    const review = required(twentyDescriptionQuestions(true)[i]);
    expect(main.knowledge).toBe(review.knowledge);
    expect(main.rule).not.toEqual(review.rule);
  }
});
it('keeps old course snapshots, partial multi-field drafts, wrong history and every original-source activity independent', () => {
  const state = initialLibrary('2026-10-04T00:00:00.000Z');
  for (const [index, oldCount] of [15, 16].entries()) {
    const course = required(twentyPracticeLessons[index]);
    const old = createSession(
      {
        ...course,
        version: 1,
        questions: course.questions.slice(0, oldCount),
        steps: course.steps.slice(0, 5),
        reviewQuestions: course.reviewQuestions?.slice(0, 4),
      },
      'pep-math-p1-upper-2024',
      state.activeProfileId,
      { seed: 12, now: '2026-10-04T00:00:00Z' },
    );
    const current = createSession(
      course,
      'pep-math-p1-upper-2024',
      state.activeProfileId,
      { seed: 23, now: '2026-10-04T00:01:00Z' },
    );
    expect(current.lessonVersion).toBe(2);
    expect(current.questions).toHaveLength(index === 0 ? 23 : 25);
    const actual = current.questions.filter((q) =>
      q.id.includes('-actual-source-'),
    );
    expect(actual).toHaveLength(index === 0 ? 8 : 2);
    for (const q of actual) {
      expect(q.rule.kind).toBe('manual');
      const i = current.questions.indexOf(q);
      const r = required(current.responses[i]);
      current.responses[i] = submitResponse(
        q,
        { ...r, draft: 'confirmed' },
        '2026-10-04T00:02:00Z',
      );
      expect(current.responses[i]?.submissions[0]?.correct).toBeNull();
    }
    if (index === 1) {
      const i = current.questions.findIndex((q) =>
        q.id.endsWith('-q-description-strip'),
      );
      const q = required(current.questions[i]);
      current.responses[i] = {
        ...required(current.responses[i]),
        draft: [12, null, 18],
      };
      const pairIndex = current.questions.findIndex((q) =>
        q.id.endsWith('-q-description-0'),
      );
      const pair = required(current.questions[pairIndex]);
      let r: Response = {
        ...required(current.responses[pairIndex]),
        draft: '12',
      };
      r = submitResponse(pair, r, '2026-10-04T00:03:00Z');
      r = submitResponse(pair, { ...r, draft: '13' }, '2026-10-04T00:04:00Z');
      expect(r.submissions.map((s) => s.correct)).toEqual([false, true]);
      current.responses[pairIndex] = r;
      expect(q.visual).toEqual({
        kind: 'number-strip',
        values: [null, 13, 14, null, 16, 17, null],
      });
    }
    state.sessions.push(old, current);
  }
  expect(parseBackup(exportBackup(state)).data).toEqual(state);
});

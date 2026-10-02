import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { exchangePlaceValue, placeValue } from '../learning/place-value';
import { mathBooks } from './math';
import { sujiaoTenRecognitionDraft as lesson } from './sujiao-ten';

describe('sujiao recognition of ten draft', () => {
  it('distinguishes ten objects, one ten, two digits and zero remaining ones', () => {
    for (const questions of [lesson.questions, lesson.reviewQuestions!]) {
      const answer = (
        suffix: string,
        correct: number | string,
        wrong: number | string,
      ) => {
        const q = questions.find((item) => item.id.endsWith(suffix))!;
        expect(evaluate(q.rule, correct)).toBe(true);
        expect(evaluate(q.rule, wrong)).toBe(false);
        expect(() => evaluate(q.rule, null)).toThrow(
          'educationLearning.answerRequired',
        );
      };
      answer('-quantity', 10, 2);
      answer('-bundle', 10, 1);
      answer('-ten-unit', 1, 10);
      answer('-digits', 2, 10);
      answer('-zero', 'ones', 'empty');
      answer('-conservation', 'same', 'one');
      answer('-before-ten', 9, 0);
      const order = questions.find((q) => q.id.endsWith('-order'))!;
      expect(evaluate(order.rule, ['8', '9', '10'])).toBe(true);
      expect(evaluate(order.rule, ['10', '9', '8'])).toBe(false);
    }
    const split = exchangePlaceValue(10, undefined, 'split-ten');
    expect(placeValue(10, split)).toMatchObject({ tens: 0, ones: 10 });
    const bundled = exchangePlaceValue(10, split, 'bundle-ten');
    expect(placeValue(10, bundled)).toMatchObject({
      tens: 1,
      ones: 0,
      value: 10,
    });
  });
  it('keeps preparing status, independent identifiers and changed review contexts', () => {
    expect(lesson.status).toBe('preparing');
    expect(
      mathBooks.flatMap((book) =>
        book.units.flatMap((unit) => unit.lessons.map((item) => item.id)),
      ),
    ).not.toContain(lesson.id);
    const main = lesson.questions.filter((q) => q.rule.kind !== 'manual');
    expect(main).toHaveLength(10);
    expect(lesson.reviewQuestions).toHaveLength(10);
    for (const [index, q] of main.entries()) {
      expect(lesson.reviewQuestions![index]!.knowledge).toBe(q.knowledge);
      expect(lesson.reviewQuestions![index]!.prompt).not.toBe(q.prompt);
    }
  });
  it('retains first unit confusion, correction, manual confirmations and visual snapshots in backup', () => {
    const now = '2026-10-01T12:00:00.000Z';
    const session = createSession(
      lesson,
      'unregistered-source-draft',
      'child',
      { now, seed: 37 },
    );
    session.phase = 'practice';
    const index = session.questions.findIndex((q) => q.id.endsWith('-bundle'));
    session.responses[index] = submitResponse(
      session.questions[index]!,
      { ...session.responses[index]!, draft: 1 },
      now,
    );
    for (const [position, q] of session.questions.entries()) {
      const draft = (() => {
        if (q.rule.kind === 'number' || q.rule.kind === 'choice')
          return q.rule.value;
        return q.rule.kind === 'sequence' ? q.rule.values : 'confirmed';
      })();
      session.responses[position] = submitResponse(
        q,
        { ...session.responses[position]!, draft },
        now,
      );
    }
    expect(statistics(session).manual).toBe(3);
    expect(
      session.responses[index]!.submissions.map((item) => item.correct),
    ).toEqual([false, true]);
    const restored = parseBackup(
      exportBackup(
        {
          schemaVersion: 1,
          activeProfileId: 'child',
          profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
          sessions: [session],
        },
        now,
      ),
    );
    expect(restored.data.sessions[0]).toEqual(session);
    expect(
      restored.data.sessions[0]!.questions.find((question) =>
        question.id.endsWith('-quantity'),
      )?.visual,
    ).toEqual({ kind: 'count', count: 10 });
  });
});

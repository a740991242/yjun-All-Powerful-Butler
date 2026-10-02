import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { mathBooks } from './math';
import { sujiaoFirstArithmeticDrafts } from './sujiao-first-arithmetic';

describe('sujiao first arithmetic drafts', () => {
  it('matches story quantities and counts moves without counting the starting point', () => {
    const live = mathBooks.flatMap((book) =>
      book.units.flatMap((unit) => unit.lessons.map((lesson) => lesson.id)),
    );
    for (const lesson of sujiaoFirstArithmeticDrafts) {
      const add = lesson.id.endsWith('-add');
      expect(lesson.status).toBe('preparing');
      expect(live).not.toContain(lesson.id);
      const all = [...lesson.questions, ...lesson.reviewQuestions!];
      expect(new Set(all.map((question) => question.id)).size).toBe(all.length);
      for (const question of all) {
        if (question.rule.kind === 'number') {
          const numbers = question.prompt.match(/\d+/g)!.map(Number);
          const [left, right] = numbers;
          const expected = add ? left! + right! : left! - right!;
          expect(question.rule.value).toBe(expected);
          expect(expected).toBeGreaterThanOrEqual(1);
          expect(expected).toBeLessThanOrEqual(5);
          if (question.visual?.kind === 'count') {
            expect(question.visual.count).toBe(left);
            expect(question.visual.other).toBe(add ? right : undefined);
          }
        }
        if (question.rule.kind === 'steps') {
          if (question.visual?.kind !== 'number-line')
            throw new Error('Expected line');
          const start = question.visual.value;
          const delta = add ? 1 : -1;
          expect(question.rule.values).toHaveLength(2);
          expect(question.rule.values).toEqual([
            start + delta,
            start + 2 * delta,
          ]);
          expect(evaluate(question.rule, [start, start + delta])).toBe(false);
          expect(
            evaluate(question.rule, [start + delta, start + 2 * delta]),
          ).toBe(true);
          expect(question.visual.minimum).toBe(0);
          expect(question.visual.maximum).toBe(5);
        }
        if (question.rule.kind === 'choice') {
          expect(
            question.choices!.filter((choice) =>
              evaluate(question.rule, choice.id),
            ),
          ).toHaveLength(1);
        }
      }
      const main = lesson.questions.filter(
        (question) => question.rule.kind !== 'manual',
      );
      expect(main).toHaveLength(8);
      expect(lesson.reviewQuestions).toHaveLength(8);
      for (const [index, question] of main.entries()) {
        const review = lesson.reviewQuestions![index]!;
        expect(review.knowledge).toBe(question.knowledge);
        expect(review.prompt).not.toBe(question.prompt);
      }
    }
  });

  it('keeps assisted first mistakes and manual activities separate in saved history', () => {
    const now = '2026-10-01T03:00:00.000Z';
    for (const lesson of sujiaoFirstArithmeticDrafts) {
      const session = createSession(
        lesson,
        'unregistered-source-draft',
        'child',
        { now, seed: 9 },
      );
      session.phase = 'practice';
      const first = session.questions[0]!;
      session.responses[0] = submitResponse(
        first,
        { ...session.responses[0]!, draft: -1, readingHelp: true },
        now,
      );
      for (const [index, question] of session.questions.entries()) {
        const draft = (() => {
          if (
            question.rule.kind === 'number' ||
            question.rule.kind === 'choice'
          )
            return question.rule.value;
          return question.rule.kind === 'steps'
            ? question.rule.values
            : 'confirmed';
        })();
        session.responses[index] = submitResponse(
          question,
          { ...session.responses[index]!, draft },
          now,
        );
      }
      expect(statistics(session).manual).toBe(2);
      expect(
        session.responses[0]!.submissions.map((item) => item.correct),
      ).toEqual([false, true]);
      expect(session.responses[0]!.submissions[0]!.readingHelp).toBe(true);
      const json = exportBackup(
        {
          schemaVersion: 1,
          activeProfileId: 'child',
          profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
          sessions: [session],
        },
        now,
      );
      expect(parseBackup(json).data.sessions[0]).toEqual(session);
      const data = JSON.parse(json);
      const line = data.data.sessions[0].questions.find(
        (question: { visual?: { kind: string } }) =>
          question.visual?.kind === 'number-line',
      );
      line.visual.value = 6;
      expect(() => parseBackup(JSON.stringify(data))).toThrow(Error);
    }
  });
});

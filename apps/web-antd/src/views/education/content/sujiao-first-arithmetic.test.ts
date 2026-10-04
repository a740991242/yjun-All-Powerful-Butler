import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { required } from '../learning/required';
import { mathBooks } from './math';
import { sujiaoBooks } from './sujiao';
import { sujiaoFirstArithmeticDrafts } from './sujiao-first-arithmetic';

describe('sujiao first arithmetic drafts', () => {
  it('checks all thirty-two published first arithmetic tasks against independent meanings and results', () => {
    const unit = required(
      required(sujiaoBooks.find((b) => b.volume === 'upper')).units.find(
        (u) => u.id === 'u1',
      ),
    );
    const fixtures: {
      id: string;
      main: (number | number[] | string)[];
      review: (number | number[] | string)[];
    }[] = [
      {
        id: 'sj-upper-first-add',
        main: [2, 3, 4, 5, '+', 4, [4, 5], 'sum'],
        review: [3, 4, 4, 5, '+', 5, [2, 3], 'sum'],
      },
      {
        id: 'sj-upper-first-subtract',
        main: [1, 2, 1, 4, '-', 1, [4, 3], 'difference'],
        review: [1, 3, 2, 2, '-', 2, [3, 2], 'difference'],
      },
    ];
    for (const f of fixtures) {
      const lesson = required(unit.lessons.find((l) => l.id === f.id));
      expect(lesson.status).toBe('available');
      for (const [questions, prefix, answers] of [
        [lesson.questions.filter((q) => q.rule.kind !== 'manual'), 'q', f.main],
        [required(lesson.reviewQuestions), 'r', f.review],
      ] as const) {
        expect(questions.map((q) => q.id)).toEqual(
          [
            ...Array.from({ length: 4 }, (_, i) => `calculate-${i}`),
            'operator',
            'story',
            'path',
            'term',
          ].map((suffix) => `${f.id}-${prefix}-${suffix}`),
        );
        questions.forEach((q, i) => {
          const answer = required(answers[i]);
          expect(evaluate(q.rule, answer)).toBe(true);
          if (typeof answer === 'number') {
            for (let n = 0; n <= 5; n++)
              expect(evaluate(q.rule, n)).toBe(n === answer);
          } else if (typeof answer === 'string') {
            for (const option of required(q.choices))
              expect(evaluate(q.rule, option.id)).toBe(option.id === answer);
          } else {
            for (let a = 0; a <= 5; a++)
              for (let b = 0; b <= 5; b++)
                expect(evaluate(q.rule, [a, b])).toBe(
                  a === answer[0] && b === answer[1],
                );
          }
        });
      }
    }
  });
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

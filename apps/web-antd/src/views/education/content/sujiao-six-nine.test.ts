import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { mathBooks } from './math';
import {
  sujiaoSixNineArithmeticDraft,
  sujiaoSixNineDrafts,
  sujiaoSixNineRecognitionDraft,
} from './sujiao-six-nine';

describe('sujiao six to nine drafts', () => {
  it('counts the designated group, matches digits, and accepts all positive two-part distributions', () => {
    const lesson = sujiaoSixNineRecognitionDraft;
    for (const [review, tasks] of [
      lesson.questions,
      lesson.reviewQuestions!,
    ].entries()) {
      for (const question of tasks) {
        if (
          question.id.includes('-count-') ||
          question.id.includes('-digit-')
        ) {
          if (question.visual?.kind !== 'count')
            throw new Error('Expected count');
          const target =
            review && question.id.includes('-count-')
              ? question.visual.other!
              : question.visual.count;
          expect(target).toBeGreaterThanOrEqual(6);
          expect(target).toBeLessThanOrEqual(9);
          expect(
            evaluate(
              question.rule,
              question.rule.kind === 'choice' ? String(target) : target,
            ),
          ).toBe(true);
        }
        if (question.id.includes('-compare-')) {
          if (question.visual?.kind !== 'count')
            throw new Error('Expected count');
          const { count, other } = question.visual;
          expect(
            evaluate(
              question.rule,
              (() => {
                if (count === other) return '=';
                return count > other! ? '>' : '<';
              })(),
            ),
          ).toBe(true);
        }
      }
      const share = tasks.find(
        (question) => question.rule.kind === 'partition',
      )!;
      const total = review ? 7 : 6;
      for (let first = 1; first < total; first++)
        expect(evaluate(share.rule, [first, total - first])).toBe(true);
      expect(evaluate(share.rule, [0, total])).toBe(false);
      expect(evaluate(share.rule, [1, total])).toBe(false);
      const order = tasks.find(
        (question) => question.rule.kind === 'sequence',
      )!;
      expect(
        evaluate(
          order.rule,
          review ? ['9', '8', '7', '6'] : ['6', '7', '8', '9'],
        ),
      ).toBe(true);
    }
  });
  it('keeps arithmetic families and counting paths consistent and changes each review task', () => {
    for (const lesson of sujiaoSixNineDrafts) {
      expect(lesson.status).toBe('preparing');
      expect(
        mathBooks.flatMap((book) =>
          book.units.flatMap((unit) => unit.lessons.map((item) => item.id)),
        ),
      ).not.toContain(lesson.id);
      const main = lesson.questions.filter(
        (question) => question.rule.kind !== 'manual',
      );
      expect(main).toHaveLength(
        lesson === sujiaoSixNineRecognitionDraft ? 18 : 20,
      );
      expect(lesson.reviewQuestions).toHaveLength(main.length);
      const all = [...lesson.questions, ...lesson.reviewQuestions!];
      expect(new Set(all.map((question) => question.id)).size).toBe(all.length);
      for (const [index, question] of main.entries()) {
        const review = lesson.reviewQuestions![index]!;
        expect(review.knowledge).toBe(question.knowledge);
        expect(
          JSON.stringify({ prompt: review.prompt, visual: review.visual }),
        ).not.toBe(
          JSON.stringify({ prompt: question.prompt, visual: question.visual }),
        );
      }
    }
    for (const tasks of [
      sujiaoSixNineArithmeticDraft.questions,
      sujiaoSixNineArithmeticDraft.reviewQuestions!,
    ]) {
      for (const question of tasks) {
        if (
          (question.id.includes('-add-') && !question.id.includes('-story-')) ||
          (question.id.includes('-subtract-') &&
            !question.id.includes('-story-'))
        ) {
          const match = question.prompt.match(/(\d+) ([+-]) (\d+)/)!;
          const left = Number(match[1]);
          const right = Number(match[3]);
          const value = match[2] === '+' ? left + right : left - right;
          expect(evaluate(question.rule, value)).toBe(true);
          expect(value).toBeGreaterThan(0);
          expect(value).toBeLessThanOrEqual(9);
        }
        if (question.rule.kind === 'steps') {
          if (question.visual?.kind !== 'number-line')
            throw new Error('Expected line');
          const start = question.visual.value;
          const delta = question.id.endsWith('-forward') ? 1 : -1;
          expect(
            evaluate(question.rule, [start + delta, start + 2 * delta]),
          ).toBe(true);
          expect(evaluate(question.rule, [start, start + delta])).toBe(false);
        }
      }
    }
  });
  it('saves first mistakes, multi-field answers and manual work as distinct history', () => {
    const now = '2026-10-01T07:00:00.000Z';
    for (const lesson of sujiaoSixNineDrafts) {
      const session = createSession(
        lesson,
        'unregistered-source-draft',
        'child',
        { now, seed: 13 },
      );
      session.phase = 'practice';
      const index = session.questions.findIndex(
        (question) => question.rule.kind === 'number',
      );
      session.responses[index] = submitResponse(
        session.questions[index]!,
        { ...session.responses[index]!, draft: -1 },
        now,
      );
      for (const [position, question] of session.questions.entries()) {
        const draft = (() => {
          if (
            question.rule.kind === 'number' ||
            question.rule.kind === 'choice'
          )
            return question.rule.value;
          return (() => {
            if (
              question.rule.kind === 'steps' ||
              question.rule.kind === 'sequence'
            )
              return question.rule.values;
            return question.rule.kind === 'partition'
              ? [1, question.rule.total - 1]
              : 'confirmed';
          })();
        })();
        session.responses[position] = submitResponse(
          question,
          { ...session.responses[position]!, draft },
          now,
        );
      }
      expect(statistics(session).manual).toBe(3);
      expect(
        session.responses[index]!.submissions.map((item) => item.correct),
      ).toEqual([false, true]);
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
    }
  });
});

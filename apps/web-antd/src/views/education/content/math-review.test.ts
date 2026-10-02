import type { Answer } from '../learning/types';

import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate } from '../learning/engine';
import { mathBooks } from './math';

describe('separate mathematics review pools and bridge packs', () => {
  it('provides different substantive tasks for every course, within book ranges, with valid saved snapshots', () => {
    const now = '2026-09-30T00:00:00.000Z';
    for (const book of mathBooks) {
      const ids = new Set<string>();
      for (const lesson of book.units.flatMap((unit) => unit.lessons)) {
        const questions = lesson.reviewQuestions ?? [];
        expect(questions.length, lesson.id).toBeGreaterThanOrEqual(4);
        const original = new Set(
          lesson.questions.map((q) =>
            JSON.stringify([q.prompt, q.visual, q.rule]),
          ),
        );
        for (const question of questions) {
          expect(ids.has(question.id)).toBe(false);
          ids.add(question.id);
          expect(
            original.has(
              JSON.stringify([question.prompt, question.visual, question.rule]),
            ),
            question.id,
          ).toBe(false);
          expect(question.knowledge).toBe(lesson.id);
          expect(question.hint.length).toBeGreaterThan(4);
          expect(question.explanation.length).toBeGreaterThan(4);
          if (question.rule.kind === 'number')
            expect(question.rule.value).toBeLessThanOrEqual(
              book.volume === 'upper' ? 20 : 100,
            );
        }
        const session = createSession(lesson, book.id, 'profile', {
          mode: 'review',
          questions,
          seed: 21,
          now,
        });
        expect(
          parseBackup(
            exportBackup({
              schemaVersion: 1,
              profiles: [{ id: 'profile', nickname: 'test', createdAt: now }],
              activeProfileId: 'profile',
              sessions: [session],
            }),
          ).data.sessions[0]?.questions,
        ).toEqual(session.questions);
      }
    }
  });

  it('verifies the new arithmetic, inverse tasks, money and 100 interpretation against independent examples', () => {
    const lessons = mathBooks.flatMap((book) =>
      book.units.flatMap((unit) => unit.lessons),
    );
    const examples: [string, string, Answer][] = [
      ['mu-five-add', '1 + □ = 2，方框里填几？', 1],
      ['mu-carry-nine', '9 + 8 = ？', 17],
      ['ml-borrow-eight', '12 - 7 = ？', 5],
      ['ml-written-add', '37 + 28 = ？', 65],
      ['ml-written-sub', '90 - 17 = ？', 73],
      ['ml-hundred-place', '10个十合起来是多少？', 100],
      ['ml-money', '38角是3元多少角？只填写角数。', 8],
      ['ml-shop', '2元、5角和2角的金额卡合起来是多少角？', 27],
    ];
    for (const [id, prompt, answer] of examples) {
      const question = lessons
        .find((lesson) => lesson.id === id)
        ?.reviewQuestions?.find((q) => q.prompt === prompt);
      expect(question, `${id} / ${prompt}`).toBeDefined();
      expect(evaluate(question!.rule, answer)).toBe(true);
      expect(
        evaluate(question!.rule, typeof answer === 'number' ? answer + 1 : 0),
      ).toBe(false);
    }
  });

  it('keeps bridges distinct from the official unit list, with separate skills and manual activity grading', () => {
    const book = mathBooks.find((book) => book.volume === 'lower')!;
    expect(book.transitions?.map((lesson) => lesson.id)).toEqual([
      'mt-place',
      'mt-calculation',
      'mt-shapes',
    ]);
    for (const lesson of book.transitions ?? []) {
      expect(
        book.units
          .flatMap((unit) => unit.lessons)
          .some((item) => item.id === lesson.id),
      ).toBe(false);
      expect(lesson.questions).toHaveLength(6);
      expect(lesson.steps.some((step) => step.activity)).toBe(true);
    }
    const calculation = book.transitions![1]!;
    expect(evaluate(calculation.questions[0]!.rule, [4, 6])).toBe(true);
    expect(evaluate(calculation.questions[3]!.rule, [1, 5, 15])).toBe(true);
    const shapes = book.transitions![2]!;
    expect(evaluate(shapes.questions[4]!.rule, ['三角形', '圆'])).toBe(true);
    expect(evaluate(shapes.questions[5]!.rule, 'confirmed')).toBeNull();
  });
});

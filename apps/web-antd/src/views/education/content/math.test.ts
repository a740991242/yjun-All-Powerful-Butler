import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate } from '../learning/engine';
import { required } from '../learning/required';
import { mathBooks } from './math';
import { textbooks } from './textbooks';

describe('reviewed PEP mathematics lesson packs', () => {
  it('records written methods separately, rejects blank exchange fields and keeps paper work manual', () => {
    const lower = required(mathBooks.find((book) => book.volume === 'lower'));
    for (const [id, expected] of [
      [
        'ml-written-add',
        [
          [0, 7, 3],
          [0, 7, 5],
          [1, 3, 6],
          [1, 3, 7],
        ],
      ],
      [
        'ml-written-sub',
        [
          [0, 5, 4],
          [0, 4, 3],
          [1, 5, 2],
          [1, 6, 2],
        ],
      ],
    ] as const) {
      const course = required(
        lower.units
          .flatMap((unit) => unit.lessons)
          .find((item) => item.id === id),
      );
      expect(course.version).toBe(2);
      expect(course.questions.slice(0, 6).map((item) => item.id)).toEqual(
        Array.from({ length: 6 }, (_, index) => `${id}-q${index + 1}`),
      );
      const methods = course.questions.filter(
        (item) => item.rule.kind === 'steps',
      );
      expect(methods.map((item) => item.rule)).toEqual(
        expected.map((values) => ({ kind: 'steps', values: [...values] })),
      );
      for (const [index, question] of methods.entries()) {
        const values = [...required(expected[index])];
        expect(evaluate(question.rule, values)).toBe(true);
        expect(
          evaluate(question.rule, [
            1 - required(values[0]),
            ...values.slice(1),
          ]),
        ).toBe(false);
        expect(() =>
          evaluate(question.rule, [null, ...values.slice(1)]),
        ).toThrow('educationLearning.answerRequired');
      }
      expect(
        evaluate(
          required(course.questions.find((item) => item.id === `${id}-paper`))
            .rule,
          'confirmed',
        ),
      ).toBeNull();
      const now = '2026-10-03T00:00:00.000Z';
      const old = createSession(
        { ...course, version: 1, questions: course.questions.slice(0, 6) },
        lower.id,
        'child-1',
        { seed: 7, now },
      );
      const restored = parseBackup(
        exportBackup({
          schemaVersion: 1,
          activeProfileId: 'child-1',
          profiles: [{ id: 'child-1', nickname: '学习者', createdAt: now }],
          sessions: [old],
        }),
      ).data.sessions[0];
      expect(restored).toEqual(old);
      expect(restored?.questions).toHaveLength(6);
    }
  });
  it('teaches unit exchanges separately from written digits and includes the three digits of 100', () => {
    for (const book of mathBooks) {
      const id =
        book.volume === 'upper' ? 'mu-twenty-place' : 'ml-hundred-place';
      const course = book.units
        .flatMap((unit) => unit.lessons)
        .find((lesson) => lesson.id === id)!;
      expect(course.version).toBe(2);
      expect(
        course.steps.filter((step) => step.visual?.kind === 'place-value')
          .length,
      ).toBeGreaterThanOrEqual(2);
      expect(
        course.steps.some((step) =>
          step.text.includes('不一定是写数时的数位数字'),
        ),
      ).toBe(true);
      const hundred = course.questions.find(
        (question) =>
          question.visual?.kind === 'place-value' &&
          question.visual.value === 100,
      );
      if (book.volume === 'lower') {
        expect(hundred?.rule).toEqual({ kind: 'steps', values: [1, 0, 0] });
        expect(
          course.steps.some(
            (step) =>
              step.visual?.kind === 'place-value' && step.visual.value === 100,
          ),
        ).toBe(true);
      } else expect(hundred).toBeUndefined();
    }
  });
  it('adds source-scoped hundred-chart practice with independently checked row boundaries', () => {
    const course = mathBooks
      .find((book) => book.volume === 'lower')!
      .units.flatMap((unit) => unit.lessons)
      .find((lesson) => lesson.id === 'ml-hundred-chart')!;
    expect(course.steps[0]?.visual).toEqual({
      kind: 'hundred-chart',
      value: 35,
    });
    expect(course.questions.map((question) => question.rule)).toEqual([
      { kind: 'number', value: 36 },
      { kind: 'number', value: 45 },
      { kind: 'number', value: 37 },
      { kind: 'number', value: 58 },
      { kind: 'choice', value: '没有' },
      { kind: 'number', value: 100 },
    ]);
  });
  it('provides manipulatives for all three break-ten courses without changing their numeric grading', () => {
    const book = mathBooks.find((item) => item.volume === 'lower')!;
    const courses = book.units.find((unit) => unit.id === 'u2')!.lessons;
    expect(courses).toHaveLength(3);
    for (const course of courses) {
      expect(course.steps[0]?.visual?.kind).toBe('break-ten');
      for (const question of course.questions) {
        expect(question.visual?.kind).toBe('break-ten');
        if (question.visual?.kind === 'break-ten')
          expect(
            evaluate(
              question.rule,
              question.visual.left - question.visual.right,
            ),
          ).toBe(true);
      }
    }
  });
  it('covers each official unit with substantive original tasks and valid persisted question snapshots', () => {
    for (const book of mathBooks) {
      const source = textbooks.find((item) => item.id === book.id)!;
      expect(book.units.map((unit) => unit.id)).toEqual(
        source.units.map((unit) => unit.id),
      );
      const ids = new Set<string>();
      for (const [unitIndex, unit] of book.units.entries()) {
        expect(unit.lessons.length).toBeGreaterThan(0);
        for (const lesson of unit.lessons) {
          expect(ids.has(lesson.id)).toBe(false);
          ids.add(lesson.id);
          expect(lesson.questions.length).toBeGreaterThanOrEqual(6);
          expect(lesson.steps.some((step) => step.activity)).toBe(true);
          expect(lesson.page).toBeGreaterThanOrEqual(unit.page);
          const nextUnit = book.units[unitIndex + 1];
          if (nextUnit) expect(lesson.page).toBeLessThan(nextUnit.page);
          const now = '2026-09-30T00:00:00.000Z';
          const state = {
            schemaVersion: 1 as const,
            activeProfileId: 'child-1',
            profiles: [{ id: 'child-1', nickname: '学习者', createdAt: now }],
            sessions: [
              createSession(lesson, book.id, 'child-1', { seed: 7, now }),
            ],
          };
          expect(
            parseBackup(exportBackup(state)).data.sessions[0]?.questions.length,
          ).toBe(lesson.questions.length);
        }
      }
    }
  });
  it('uses the revised lower-volume topics, includes both carrying and borrowing, and keeps upper-volume arithmetic within 20', () => {
    const upper = mathBooks.find((book) => book.volume === 'upper')!;
    const lower = mathBooks.find((book) => book.volume === 'lower')!;
    for (const unit of upper.units)
      for (const lesson of unit.lessons)
        for (const question of lesson.questions) {
          if (question.rule.kind === 'number')
            expect(question.rule.value).toBeLessThanOrEqual(20);
        }
    const written = lower.units.find((unit) => unit.id === 'u5')!.lessons;
    for (const unit of lower.units)
      for (const lesson of unit.lessons)
        for (const question of lesson.questions) {
          if (question.rule.kind === 'number')
            expect(question.rule.value).toBeLessThanOrEqual(100);
        }
    expect(written.map((lesson) => lesson.id)).toEqual([
      'ml-written-add',
      'ml-written-sub',
    ]);
    expect(
      written[0]?.questions.find(
        (question) => question.prompt === '28 + 35 = ？',
      )?.rule,
    ).toEqual({ kind: 'number', value: 63 });
    expect(
      written[1]?.questions.find(
        (question) => question.prompt === '52 - 27 = ？',
      )?.rule,
    ).toEqual({ kind: 'number', value: 25 });
    const money = lower.units.find((unit) => unit.id === 'shopping')!.lessons;
    expect(money.length).toBe(3);
    expect(
      money
        .find((course) => course.id === 'ml-shop')
        ?.questions.find((question) => question.prompt.includes('一共多少角'))
        ?.rule,
    ).toEqual({ kind: 'number', value: 30 });
  });
  it('does not imply each partition has only one answer', () => {
    const question = mathBooks[0]!.units[0]!.lessons[2]!.questions[0]!;
    expect(evaluate(question.rule, [1, 3])).toBe(true);
    expect(evaluate(question.rule, [2, 2])).toBe(true);
    expect(evaluate(question.rule, [0, 4])).toBe(false);
  });
});

import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { mathBooks } from './math';
import { sujiaoIntroGamesDraft as lesson } from './sujiao-intro-games';

describe('sujiao introductory counting and classification games', () => {
  it('counts only the specified group and conserves quantities when rearranged', () => {
    for (const [index, questions] of [
      lesson.questions,
      lesson.reviewQuestions!,
    ].entries()) {
      for (const q of questions.filter((q) => q.id.includes('-count-'))) {
        expect(q.visual?.kind).toBe('count');
        if (q.visual?.kind !== 'count') throw new Error('Missing count visual');
        const target = index === 0 ? q.visual.count : q.visual.other!;
        expect(evaluate(q.rule, target)).toBe(true);
        expect(evaluate(q.rule, q.visual.count + q.visual.other!)).toBe(false);
        expect(() => evaluate(q.rule, null)).toThrow(
          'educationLearning.answerRequired',
        );
      }
      const rearrange = questions.find((q) => q.id.endsWith('-rearrange'))!;
      const [original] = rearrange.prompt.match(/\d+/g)!.map(Number);
      expect(evaluate(rearrange.rule, original!)).toBe(true);
      expect(evaluate(rearrange.rule, original! + 1)).toBe(false);
      const compare = questions.find((q) => q.id.endsWith('-compare'))!;
      const quantities = compare.prompt.match(/\d+/g)!.map(Number);
      const expected = quantities[0]! > quantities[1]! ? 'rain' : 'forest';
      expect(evaluate(compare.rule, expected)).toBe(true);
      expect(evaluate(compare.rule, 'same')).toBe(false);
      const meaning = questions.find((q) => q.id.endsWith('-number-meaning'))!;
      expect(evaluate(meaning.rule, 'age')).toBe(false);
      expect(evaluate(meaning.rule, 'code')).toBe(false);
    }
  });

  it('uses the stated sorting criterion and requires all matching objects', () => {
    for (const questions of [lesson.questions, lesson.reviewQuestions!]) {
      for (const q of questions.filter((q) => q.id.includes('-sort-'))) {
        const labels = q.choices!;
        const expected = labels
          .filter(({ label }) =>
            (() => {
              if (q.id.endsWith('-sort-use'))
                return q.prompt.includes('写字')
                  ? label.includes('笔')
                  : label.includes('书');
              return q.id.endsWith('-sort-subject')
                ? label.includes(q.prompt.includes('语文') ? '语文' : '数学')
                : label.includes(q.prompt.includes('蓝色') ? '蓝' : '红');
            })(),
          )
          .map((choice) => choice.id);
        expect(expected).toHaveLength(2);
        expect(evaluate(q.rule, expected)).toBe(true);
        expect(evaluate(q.rule, [...expected].toReversed())).toBe(true);
        expect(evaluate(q.rule, expected.slice(0, 1))).toBe(false);
        expect(
          evaluate(
            q.rule,
            labels.map((choice) => choice.id),
          ),
        ).toBe(false);
      }
      const methods = questions.find((q) =>
        q.id.endsWith('-different-methods'),
      )!;
      expect(evaluate(methods.rule, 'criteria')).toBe(true);
      expect(evaluate(methods.rule, 'same-only')).toBe(false);
    }
  });

  it('preserves first mistakes, help, diagrams and manual tasks in backups without changing live books', () => {
    expect(lesson.status).toBe('preparing');
    expect(
      mathBooks.flatMap((book) =>
        book.units.flatMap((unit) => unit.lessons.map((item) => item.id)),
      ),
    ).not.toContain(lesson.id);
    const main = lesson.questions.filter((q) => q.rule.kind !== 'manual');
    expect(main).toHaveLength(10);
    expect(lesson.reviewQuestions).toHaveLength(10);
    main.forEach((q, index) => {
      expect(lesson.reviewQuestions![index]!.knowledge).toBe(q.knowledge);
      expect(lesson.reviewQuestions![index]!.prompt).not.toBe(q.prompt);
    });
    const now = '2026-10-01T18:00:00.000Z';
    const session = createSession(lesson, 'sujiao-source-draft', 'child', {
      now,
      seed: 61,
    });
    session.phase = 'practice';
    const first = session.questions.findIndex((q) =>
      q.id.endsWith('-rearrange'),
    );
    session.responses[first] = submitResponse(
      session.questions[first]!,
      { ...session.responses[first]!, draft: 0, readingHelp: true },
      now,
    );
    for (const [index, q] of session.questions.entries()) {
      const draft = (() => {
        if (q.rule.kind === 'number' || q.rule.kind === 'choice')
          return q.rule.value;
        return q.rule.kind === 'set' ? q.rule.values : 'confirmed';
      })();
      session.responses[index] = submitResponse(
        q,
        { ...session.responses[index]!, draft },
        now,
      );
    }
    expect(statistics(session).manual).toBe(3);
    expect(session.responses[first]!.submissions.map((s) => s.correct)).toEqual(
      [false, true],
    );
    expect(session.responses[first]!.submissions[0]!.readingHelp).toBe(true);
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
  });
});

import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { sujiaoBooks } from './sujiao';
import { sujiaoUpperColourCountLesson as lesson } from './sujiao-upper-colour-count';

describe('physical counting, subsets and complete colour records', () => {
  it('keeps per-row positions, zero, subset membership and changed review conditions', () => {
    expect(
      sujiaoBooks[0]!.units[1]!.lessons.some((l) => l.id === lesson.id),
    ).toBe(true);
    expect(lesson.questions).toHaveLength(13);
    expect(lesson.reviewQuestions).toHaveLength(8);
    const rows = lesson.questions.find((q) =>
      q.knowledge.endsWith('-full-colour-record'),
    )!;
    expect(rows.rule).toEqual({
      kind: 'steps',
      values: [1, 4, 2, 3, 3, 2, 4, 1, 5, 0],
    });
    expect(evaluate(rows.rule, [1, 4, 2, 3, 3, 2, 4, 1, 5, 0])).toBe(true);
    expect(evaluate(rows.rule, [4, 1, 3, 2, 2, 3, 1, 4, 0, 5])).toBe(false);
    const review = lesson.reviewQuestions!.find(
      (q) => q.knowledge === rows.knowledge,
    )!;
    expect(review.rule).toEqual({
      kind: 'steps',
      values: [4, 1, 1, 4, 5, 0, 2, 3, 3, 2],
    });
    expect(evaluate(review.rule, [1, 4, 2, 3, 3, 2, 4, 1, 5, 0])).toBe(false);
    for (const tasks of [lesson.questions, lesson.reviewQuestions!]) {
      for (const q of tasks) {
        if (q.rule.kind === 'choice')
          expect(q.choices!.filter((c) => evaluate(q.rule, c.id))).toHaveLength(
            1,
          );
        if (q.rule.kind === 'steps') {
          expect(evaluate(q.rule, q.rule.values)).toBe(true);
          expect(
            evaluate(
              q.rule,
              q.rule.values.map((n) => n + 1),
            ),
          ).toBe(false);
        }
      }
    }
    expect(
      lesson.questions.find((q) => q.knowledge.endsWith('-multiple-targets'))!
        .rule,
    ).toEqual({ kind: 'steps', values: [1, 3, 2] });
    expect(
      lesson.reviewQuestions!.find((q) =>
        q.knowledge.endsWith('-multiple-targets'),
      )!.rule,
    ).toEqual({ kind: 'steps', values: [4, 2, 2] });
    const subset = lesson.questions.find((q) =>
      q.knowledge.endsWith('-whole-and-subsets'),
    )!;
    expect(evaluate(subset.rule, [7, 5, 2])).toBe(false);
    for (const q of lesson.reviewQuestions!)
      expect(JSON.stringify(q)).not.toBe(
        JSON.stringify(
          lesson.questions.find((main) => main.knowledge === q.knowledge),
        ),
      );
    expect(
      lesson.questions
        .filter((q) => q.rule.kind === 'manual')
        .map((q) => q.knowledge),
    ).toEqual(
      [
        'actual-beads',
        'actual-subsets',
        'actual-columns',
        'actual-rows',
        'actual-completion',
      ].map((key) => `${lesson.id}-${key}`),
    );
  });

  it('backs up ten-field partial drafts and corrected mistakes without auto-confirming physical work', () => {
    const now = '2026-10-02T06:00:00.000Z';
    const session = createSession(
      lesson,
      'sujiao-math-p1-upper-2024',
      'child',
      { now, seed: 23 },
    );
    session.phase = 'practice';
    const index = session.questions.findIndex((q) =>
      q.knowledge.endsWith('-full-colour-record'),
    );
    session.responses[index]!.draft = [
      1,
      4,
      null,
      null,
      null,
      null,
      null,
      null,
      5,
      0,
    ];
    const data = {
      schemaVersion: 1 as const,
      activeProfileId: 'child',
      profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
      sessions: [session],
    };
    expect(
      parseBackup(exportBackup(data, now)).data.sessions[0]!.responses[index]!
        .draft,
    ).toEqual(session.responses[index]!.draft);
    const task = session.questions[index]!;
    session.responses[index] = submitResponse(
      task,
      {
        ...session.responses[index]!,
        draft: Array.from({ length: 10 }, () => 5),
      },
      now,
    );
    for (const [i, q] of session.questions.entries()) {
      if (q.rule.kind === 'manual') continue;
      const answer = (() => {
        if (q.rule.kind === 'steps') return q.rule.values;
        if (q.rule.kind === 'number' || q.rule.kind === 'choice')
          return q.rule.value;
        throw new Error('Unexpected objective rule');
      })();
      session.responses[i] = submitResponse(
        q,
        { ...session.responses[i]!, draft: answer },
        now,
      );
    }
    expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual(
      [false, true],
    );
    expect(statistics(session).manual).toBe(0);
    expect(statistics(session).finalCorrect).toBe(8);
    for (const [i, q] of session.questions.entries())
      if (q.rule.kind === 'manual')
        expect(session.responses[i]!.submissions).toHaveLength(0);
    expect(parseBackup(exportBackup(data, now)).data.sessions[0]).toEqual(
      session,
    );
  });
});

import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { queueNeighbours, queuePosition } from '../learning/queue';
import { sujiaoDirectionComparisonLesson as lesson } from './sujiao-direction-comparison';

describe('ordinal contexts and bounded open comparisons', () => {
  it('counts from the actual motion front, excludes self, keeps zero and all valid strict answers', () => {
    expect(lesson.questions).toHaveLength(12);
    expect(lesson.reviewQuestions).toHaveLength(8);
    for (const tasks of [lesson.questions, lesson.reviewQuestions!]) {
      for (const q of tasks) {
        if (q.visual?.kind === 'queue' && q.knowledge.endsWith('-moving-front'))
          expect(
            evaluate(q.rule, queueNeighbours(q.visual, '小安')!.before),
          ).toBe(true);
        if (
          q.visual?.kind === 'queue' &&
          q.knowledge.endsWith('-reverse-motion')
        )
          expect(evaluate(q.rule, queuePosition(q.visual, '小安')!)).toBe(true);
        if (q.rule.kind === 'steps') {
          expect(evaluate(q.rule, q.rule.values)).toBe(true);
          expect(
            evaluate(
              q.rule,
              q.rule.values.map((n) => n + 1),
            ),
          ).toBe(false);
        }
        if (q.rule.kind === 'set') {
          expect(evaluate(q.rule, q.rule.values)).toBe(true);
          expect(evaluate(q.rule, q.rule.values.slice(1))).toBe(false);
        }
      }
    }
    const rank = lesson.questions.find((q) =>
      q.knowledge.endsWith('-floor-rank'),
    )!;
    expect(evaluate(rank.rule, 2)).toBe(true);
    expect(evaluate(rank.rule, 4)).toBe(false);
    expect(
      lesson.questions.find((q) => q.knowledge.endsWith('-floor-neighbours'))!
        .rule,
    ).toEqual({ kind: 'steps', values: [1, 3] });
    expect(
      lesson.questions.find((q) => q.knowledge.endsWith('-departing-front'))!
        .rule,
    ).toEqual({ kind: 'steps', values: [3, 2, 1] });
    expect(
      lesson.reviewQuestions!.find((q) =>
        q.knowledge.endsWith('-departing-front'),
      )!.rule,
    ).toEqual({ kind: 'steps', values: [4, 3, 2] });
    const all = lesson.questions.find((q) =>
      q.knowledge.endsWith('-all-smaller-with-zero'),
    )!;
    expect(evaluate(all.rule, ['0', '1', '2', '3', '4'])).toBe(true);
    expect(evaluate(all.rule, ['1', '2', '3', '4'])).toBe(false);
    expect(evaluate(all.rule, ['0', '1', '2', '3', '4', '5'])).toBe(false);
    const open = lesson.questions.find((q) =>
      q.knowledge.endsWith('-multiple-open-comparison'),
    )!;
    expect(evaluate(open.rule, ['0', '1', '2', '3'])).toBe(true);
    expect(evaluate(open.rule, ['3'])).toBe(false);
    expect(evaluate(open.rule, ['0', '1', '2', '3', '4'])).toBe(false);
    for (const q of lesson.reviewQuestions!) {
      const main = lesson.questions.find((m) => m.knowledge === q.knowledge)!;
      expect(q.prompt).not.toBe(main.prompt);
      expect(q.rule).not.toEqual(main.rule);
    }
    expect(
      lesson.questions
        .filter((q) => q.rule.kind === 'manual')
        .map((q) => q.knowledge),
    ).toEqual(
      [
        'actual-floors',
        'actual-directions',
        'actual-partner-game',
        'actual-open-comparison',
      ].map((key) => `${lesson.id}-${key}`),
    );
  });

  it('preserves partial position records and first mistakes while keeping physical tasks unconfirmed', () => {
    const now = '2026-10-02T07:00:00.000Z';
    const session = createSession(
      lesson,
      'sujiao-math-p1-upper-2024',
      'child',
      { now, seed: 31 },
    );
    session.phase = 'practice';
    const index = session.questions.findIndex((q) =>
      q.knowledge.endsWith('-departing-front'),
    );
    session.responses[index]!.draft = [3, null, 1];
    const data = {
      schemaVersion: 1 as const,
      activeProfileId: 'child',
      profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
      sessions: [session],
    };
    expect(
      parseBackup(exportBackup(data, now)).data.sessions[0]!.responses[index]!
        .draft,
    ).toEqual([3, null, 1]);
    session.responses[index] = submitResponse(
      session.questions[index]!,
      { ...session.responses[index]!, draft: [3, 3, 3] },
      now,
    );
    for (const [i, q] of session.questions.entries()) {
      if (q.rule.kind === 'manual') continue;
      const answer = (() => {
        if (q.rule.kind === 'steps' || q.rule.kind === 'set')
          return q.rule.values;
        if (q.rule.kind === 'number') return q.rule.value;
        throw new Error('Unexpected rule');
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
    expect(statistics(session).finalCorrect).toBe(8);
    expect(statistics(session).manual).toBe(0);
    for (const [i, q] of session.questions.entries())
      if (q.rule.kind === 'manual')
        expect(session.responses[i]!.submissions).toHaveLength(0);
    expect(parseBackup(exportBackup(data, now)).data.sessions[0]).toEqual(
      session,
    );
  });
});

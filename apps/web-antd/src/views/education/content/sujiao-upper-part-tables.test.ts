import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { sujiaoBooks } from './sujiao';
import { sujiaoUpperPartTablesLesson as lesson } from './sujiao-upper-part-tables';

describe('complete 8 and 9 partition tables and independent physical tasks', () => {
  it('covers every positive ordered split, distinguishes units and changes review positions', () => {
    expect(sujiaoBooks[0]!.units.find((u) => u.id === 'u2')!.lessons).toContain(
      lesson,
    );
    expect(lesson.questions).toHaveLength(14);
    expect(lesson.reviewQuestions).toHaveLength(8);
    for (const total of [8, 9]) {
      const q = lesson.questions.find((q) =>
        q.knowledge.endsWith(`full-table-${total}`),
      )!;
      const r = lesson.reviewQuestions!.find(
        (r) => r.knowledge === q.knowledge,
      )!;
      expect(q.rule).toEqual({
        kind: 'steps',
        values: Array.from({ length: total - 1 }, (_, i) => total - i - 1),
      });
      if (q.rule.kind !== 'steps' || r.rule.kind !== 'steps')
        throw new Error('Missing table');
      const pairs = q.rule.values.map((n, i) => [i + 1, n]);
      expect(pairs).toEqual(
        Array.from({ length: total - 1 }, (_, i) => [i + 1, total - i - 1]),
      );
      expect(new Set(pairs.map((p) => p.join(','))).size).toBe(total - 1);
      for (const [first, second] of pairs) {
        expect(first! + second!).toBe(total);
        expect(first).toBeGreaterThan(0);
        expect(second).toBeGreaterThan(0);
      }
      expect(r.rule.values.toSorted((a, b) => a - b)).toEqual(
        Array.from({ length: total - 1 }, (_, i) => i + 1),
      );
      expect(evaluate(r.rule, q.rule.values)).toBe(false);
      expect(evaluate(r.rule, r.rule.values)).toBe(true);
      expect(
        evaluate(
          q.rule,
          Array.from({ length: total - 1 }, () => total),
        ),
      ).toBe(false);
    }
    expect(
      lesson.questions.find((q) => q.knowledge.endsWith('paired-units'))!.rule,
    ).toEqual({ kind: 'steps', values: [4, 8] });
    expect(
      lesson.reviewQuestions!.find((q) => q.knowledge.endsWith('paired-units'))!
        .rule,
    ).toEqual({ kind: 'steps', values: [3, 6] });
    expect(
      lesson.questions.find((q) => q.knowledge.endsWith('three-completions'))!
        .rule,
    ).toEqual({ kind: 'steps', values: [3, 6, 4] });
    expect(
      lesson.reviewQuestions!.find((q) =>
        q.knowledge.endsWith('three-completions'),
      )!.rule,
    ).toEqual({ kind: 'steps', values: [3, 5, 3] });
    for (const questions of [lesson.questions, lesson.reviewQuestions!])
      for (const q of questions)
        if (q.rule.kind === 'choice')
          expect(q.choices!.filter((c) => evaluate(q.rule, c.id))).toHaveLength(
            1,
          );
    expect(
      lesson.questions
        .filter((q) => q.rule.kind === 'manual')
        .map((q) => q.knowledge),
    ).toEqual(
      [
        'actual-beads',
        'actual-pairs-comparison',
        'actual-three-completions',
        'actual-table-8',
        'actual-table-9',
        'actual-distribution',
      ].map((key) => `${lesson.id}-${key}`),
    );
  });

  it('preserves eight-field partial drafts and first mistakes without auto-confirming real operations', () => {
    const now = '2026-10-02T07:00:00.000Z';
    const session = createSession(
      lesson,
      'sujiao-math-p1-upper-2024',
      'child',
      { now, seed: 42 },
    );
    session.phase = 'practice';
    const index = session.questions.findIndex((q) =>
      q.knowledge.endsWith('full-table-9'),
    );
    const response = session.responses[index]!;
    response.draft = [8, null, 6, null, null, 3, null, 1];
    const data = {
      schemaVersion: 1 as const,
      activeProfileId: 'child',
      profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
      sessions: [session],
    };
    expect(
      parseBackup(exportBackup(data, now)).data.sessions[0]!.responses[index]!
        .draft,
    ).toEqual(response.draft);
    session.responses[index] = submitResponse(
      session.questions[index]!,
      { ...response, draft: Array.from({ length: 8 }, () => 9) },
      now,
    );
    for (const [i, q] of session.questions.entries()) {
      if (q.rule.kind === 'manual') continue;
      const answer = (() => {
        if (q.rule.kind === 'steps') return q.rule.values;
        if (q.rule.kind === 'choice' || q.rule.kind === 'number')
          return q.rule.value;
        throw new Error('Unexpected rule');
      })();
      session.responses[i] = submitResponse(
        q,
        { ...session.responses[i]!, draft: answer },
        now,
      );
    }
    expect(session.responses[index]!.submissions.map((a) => a.correct)).toEqual(
      [false, true],
    );
    expect(statistics(session).manual).toBe(0);
    expect(statistics(session).finalCorrect).toBe(8);
    expect(parseBackup(exportBackup(data, now)).data.sessions[0]).toEqual(
      session,
    );
  });
});

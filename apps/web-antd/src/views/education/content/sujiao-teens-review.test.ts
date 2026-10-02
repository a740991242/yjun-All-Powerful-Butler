import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { fold } from '../learning/fold';
import { mathBooks } from './math';
import { sujiaoTeensReviewDraft as lesson } from './sujiao-teens-review';

describe('sujiao teens integrated activities', () => {
  it('counts the printed weather data without duplicating days and distinguishes rank from total', () => {
    for (const tasks of [lesson.questions, lesson.reviewQuestions!]) {
      const weather = tasks.find((q) => q.id.endsWith('-weather-counts'))!;
      const entries = weather.prompt
        .split('：')[1]!
        .split('。')[0]!
        .split('、');
      expect(entries).toHaveLength(18);
      const counts = ['晴', '阴', '雨'].map(
        (type) => entries.filter((x) => x === type).length,
      );
      expect(fold(counts, 0, (a, b) => a + b)).toBe(18);
      expect(evaluate(weather.rule, counts)).toBe(true);
      expect(
        evaluate(
          weather.rule,
          counts.map((x) => x + 1),
        ),
      ).toBe(false);
      const combined = tasks.find((q) => q.id.endsWith('-weather-combine'))!;
      expect(evaluate(combined.rule, counts[0]! + counts[1]!)).toBe(true);
      expect(evaluate(combined.rule, 18)).toBe(false);
      const before = tasks.find((q) => q.id.endsWith('-queue-before'))!;
      const numbers = before.prompt.match(/\d+/g)!.map(Number);
      const rank = numbers.at(-1)!;
      expect(evaluate(before.rule, rank - 1)).toBe(true);
      expect(evaluate(before.rule, rank)).toBe(false);
      const total = tasks.find((q) => q.id.endsWith('-queue-total'))!;
      const [position, after] = total.prompt.match(/\d+/g)!.map(Number);
      expect(evaluate(total.rule, position! + after!)).toBe(true);
      expect(evaluate(total.rule, position! + after! + 1)).toBe(false);
      const meaning = tasks.find((q) => q.id.endsWith('-meaning'))!;
      expect(evaluate(meaning.rule, 'code')).toBe(true);
      expect(evaluate(meaning.rule, 'count')).toBe(false);
    }
  });
  it('compares results and retains intermediate quantities within the stated range', () => {
    for (const tasks of [lesson.questions, lesson.reviewQuestions!]) {
      const signs = new Set<string>();
      for (const q of tasks.filter((q) => q.id.includes('-compare-'))) {
        const match = q.prompt.match(/^(\d+) ([+-]) (\d+) ○ (\d+)/)!;
        const left =
          match[2] === '+'
            ? Number(match[1]) + Number(match[3])
            : Number(match[1]) - Number(match[3]);
        const right = Number(match[4]);
        const sign = (() => {
          if (left > right) return 'greater';
          return left < right ? 'less' : 'equal';
        })();
        signs.add(sign);
        expect(evaluate(q.rule, sign)).toBe(true);
      }
      expect(signs.size).toBe(3);
      for (const q of tasks.filter((q) => q.id.includes('-chain-'))) {
        const m = q.prompt.match(/^(\d+) ([+-]) (\d+) ([+-]) (\d+)/)!;
        const start = Number(m[1]);
        const middle =
          m[2] === '+' ? start + Number(m[3]) : start - Number(m[3]);
        const end =
          m[4] === '+' ? middle + Number(m[5]) : middle - Number(m[5]);
        expect([start, middle, end].every((n) => n >= 0 && n <= 19)).toBe(true);
        expect(evaluate(q.rule, [middle, end])).toBe(true);
        expect(evaluate(q.rule, [start, end])).toBe(false);
        expect(q.visual).toEqual({
          kind: 'number-line',
          minimum: 0,
          maximum: 19,
          value: start,
        });
      }
      const units = tasks.find((q) => q.id.endsWith('-single-units'))!;
      const numbers = units.prompt.match(/\d+/g)!.map(Number);
      const small = numbers.at(-1)!;
      expect(evaluate(units.rule, 10 + small)).toBe(true);
      expect(evaluate(units.rule, 1 + small)).toBe(false);
      const clues = tasks.find((q) => q.id.endsWith('-clues'))!;
      const [lo, hi] = clues.prompt.match(/\d+/g)!.map(Number);
      expect(evaluate(clues.rule, lo! + 1)).toBe(true);
      expect(evaluate(clues.rule, lo!)).toBe(false);
      expect(evaluate(clues.rule, hi!)).toBe(false);
    }
  });
  it('keeps reviews varied, manual activities separate and first mistakes backed up', () => {
    expect(lesson.status).toBe('preparing');
    expect(
      mathBooks.flatMap((b) =>
        b.units.flatMap((u) => u.lessons.map((l) => l.id)),
      ),
    ).not.toContain(lesson.id);
    const main = lesson.questions.filter((q) => q.rule.kind !== 'manual');
    expect(main).toHaveLength(14);
    expect(lesson.reviewQuestions).toHaveLength(14);
    for (const [i, q] of main.entries()) {
      expect(lesson.reviewQuestions![i]!.knowledge).toBe(q.knowledge);
      expect(lesson.reviewQuestions![i]!.prompt).not.toBe(q.prompt);
    }
    const now = '2026-10-01T16:00:00.000Z';
    const session = createSession(
      lesson,
      'unregistered-source-draft',
      'child',
      { now, seed: 53 },
    );
    session.phase = 'practice';
    const first = session.questions.findIndex((q) =>
      q.id.endsWith('-queue-before'),
    );
    session.responses[first] = submitResponse(
      session.questions[first]!,
      { ...session.responses[first]!, draft: 13, readingHelp: true },
      now,
    );
    for (const [i, q] of session.questions.entries()) {
      const draft = (() => {
        if (q.rule.kind === 'number' || q.rule.kind === 'choice')
          return q.rule.value;
        return q.rule.kind === 'steps' ? q.rule.values : 'confirmed';
      })();
      session.responses[i] = submitResponse(
        q,
        { ...session.responses[i]!, draft },
        now,
      );
    }
    expect(statistics(session).manual).toBe(4);
    expect(session.responses[first]!.submissions.map((s) => s.correct)).toEqual(
      [false, true],
    );
    expect(session.responses[first]!.submissions[0]!.readingHelp).toBe(true);
    const backup = exportBackup(
      {
        schemaVersion: 1,
        activeProfileId: 'child',
        profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
        sessions: [session],
      },
      now,
    );
    expect(parseBackup(backup).data.sessions[0]).toEqual(session);
  });
});

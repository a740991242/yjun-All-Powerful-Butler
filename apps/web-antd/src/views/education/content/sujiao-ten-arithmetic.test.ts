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
  sujiaoTenArithmeticDraft,
  sujiaoTenArithmeticDrafts,
  sujiaoTenCompositionDraft,
} from './sujiao-ten-arithmetic';

describe('sujiao composition and arithmetic with ten', () => {
  it('covers every ordered split including empty parts and rejects missing answers', () => {
    for (const tasks of [
      sujiaoTenCompositionDraft.questions,
      sujiaoTenCompositionDraft.reviewQuestions!,
    ]) {
      const splits = tasks.filter((q) => /-part-\d+$/.test(q.id));
      expect(splits).toHaveLength(11);
      const seen: number[] = [];
      for (const q of splits) {
        const [total, first] = q.prompt.match(/\d+/g)!.map(Number);
        expect(total).toBe(10);
        seen.push(first!);
        expect(evaluate(q.rule, 10 - first!)).toBe(true);
        expect(evaluate(q.rule, 11 - first!)).toBe(false);
        expect(() => evaluate(q.rule, null)).toThrow(
          'educationLearning.answerRequired',
        );
      }
      expect(seen.toSorted((a, b) => a - b)).toEqual(
        Array.from({ length: 11 }, (_, i) => i),
      );
    }
  });
  it('uses equation meaning and actual story totals instead of always subtracting from ten', () => {
    for (const tasks of [
      sujiaoTenArithmeticDraft.questions,
      sujiaoTenArithmeticDraft.reviewQuestions!,
    ]) {
      for (const q of tasks.filter((q) => q.id.includes('-equation-'))) {
        const match = q.prompt.match(/^(\d+) ([+-]) (\d+)/)!;
        const expected =
          match[2] === '+'
            ? Number(match[1]) + Number(match[3])
            : Number(match[1]) - Number(match[3]);
        expect(evaluate(q.rule, expected)).toBe(true);
        expect(evaluate(q.rule, expected + 1)).toBe(false);
      }
      const find = (suffix: string) =>
        tasks.find((q) => q.id.endsWith(suffix))!;
      const other = find('-story-other');
      const [total, part] = other.prompt.match(/\d+/g)!.map(Number);
      expect(evaluate(other.rule, total! - part!)).toBe(true);
      expect(evaluate(other.rule, total! + part!)).toBe(false);
      const smaller = find('-story-smaller');
      const [smallTotal, smallPart] = smaller.prompt.match(/\d+/g)!.map(Number);
      expect(evaluate(smaller.rule, smallTotal! - smallPart!)).toBe(true);
      expect(evaluate(smaller.rule, 10 - smallPart!)).toBe(false);
      expect(evaluate(find('-method').rule, 'subtract')).toBe(true);
      expect(evaluate(find('-asked').rule, 'total')).toBe(true);
      expect(evaluate(find('-story-zero').rule, 10)).toBe(true);
      expect(evaluate(find('-story-empty').rule, 0)).toBe(true);
      const join = find('-story-join');
      expect(join.visual?.kind).toBe('count');
      if (join.visual?.kind === 'count')
        expect(join.visual.count + join.visual.other!).toBe(10);
    }
  });
  it('preserves separate drafts, varied reviews, first mistakes and physical confirmations through backup', () => {
    const live = mathBooks.flatMap((book) =>
      book.units.flatMap((unit) => unit.lessons.map((l) => l.id)),
    );
    const now = '2026-10-01T13:00:00.000Z';
    for (const lesson of sujiaoTenArithmeticDrafts) {
      expect(lesson.status).toBe('preparing');
      expect(live).not.toContain(lesson.id);
      const main = lesson.questions.filter((q) => q.rule.kind !== 'manual');
      expect(main).toHaveLength(lesson === sujiaoTenCompositionDraft ? 13 : 14);
      expect(lesson.reviewQuestions).toHaveLength(main.length);
      for (const [index, q] of main.entries()) {
        expect(lesson.reviewQuestions![index]!.knowledge).toBe(q.knowledge);
        expect(lesson.reviewQuestions![index]!.prompt).not.toBe(q.prompt);
      }
      const session = createSession(
        lesson,
        'unregistered-source-draft',
        'child',
        { now, seed: 41 },
      );
      session.phase = 'practice';
      const first = session.questions.findIndex(
        (q) => q.rule.kind === 'number',
      );
      session.responses[first] = submitResponse(
        session.questions[first]!,
        { ...session.responses[first]!, draft: -1, readingHelp: true },
        now,
      );
      for (const [index, q] of session.questions.entries()) {
        const draft =
          q.rule.kind === 'number' || q.rule.kind === 'choice'
            ? q.rule.value
            : 'confirmed';
        session.responses[index] = submitResponse(
          q,
          { ...session.responses[index]!, draft },
          now,
        );
      }
      expect(statistics(session).manual).toBe(2);
      expect(
        session.responses[first]!.submissions.map((s) => s.correct),
      ).toEqual([false, true]);
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
    }
  });
});

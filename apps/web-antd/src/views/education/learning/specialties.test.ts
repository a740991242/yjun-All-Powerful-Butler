import { describe, expect, it } from 'vitest';

import { mathBooks } from '../content/math';
import { exportBackup, parseBackup } from './backup';
import { createSession } from './engine';
import { specialtyQuestions } from './specialties';

describe('authored specialty practice sampling', () => {
  it('keeps groups outside the unit list and chooses distinct reproducible snapshots with skills spread across sources', () => {
    for (const book of mathBooks) {
      expect(book.specialties?.length).toBe(book.volume === 'upper' ? 5 : 6);
      const original = book.units.flatMap((unit) => unit.lessons);
      for (const group of book.specialties ?? []) {
        expect(original.some((lesson) => lesson.id === group.id)).toBe(false);
        const sourceIds = new Set(
          original.flatMap((lesson) =>
            lesson.questions.map((question) => question.id),
          ),
        );
        expect(
          group.questions.every((question) => sourceIds.has(question.id)),
        ).toBe(true);
        for (const count of [6, 12, 20]) {
          const tasks = specialtyQuestions(group.questions, count, 17);
          expect(tasks).toEqual(specialtyQuestions(group.questions, count, 17));
          expect(tasks).toHaveLength(Math.min(count, group.questions.length));
          expect(new Set(tasks.map((question) => question.id)).size).toBe(
            tasks.length,
          );
          const skills = new Set(
            group.questions.map((question) => question.knowledge),
          );
          expect(
            new Set(tasks.map((question) => question.knowledge)).size,
          ).toBe(Math.min(skills.size, count));
          const now = '2026-09-30T00:00:00.000Z';
          const session = createSession(group, book.id, 'child', {
            mode: 'practice',
            questions: tasks,
            seed: 17,
            now,
          });
          expect(session.phase).toBe('practice');
          expect(
            parseBackup(
              exportBackup({
                schemaVersion: 1,
                activeProfileId: 'child',
                profiles: [{ id: 'child', nickname: '练习', createdAt: now }],
                sessions: [session],
              }),
            ).data.sessions[0]?.questions,
          ).toEqual(session.questions);
        }
      }
    }
  });
  it('varies selection across seeds, preserves source arrays, deduplicates IDs and rejects unsupported sizes', () => {
    const group = mathBooks[0]!.specialties!.find((lesson) =>
      lesson.id.endsWith('calculation'),
    )!;
    const before = structuredClone(group.questions);
    const variants = new Set(
      Array.from({ length: 20 }, (_, seed) =>
        JSON.stringify(
          specialtyQuestions(group.questions, 6, seed).map((q) => q.id),
        ),
      ),
    );
    expect(variants.size).toBeGreaterThan(10);
    expect(group.questions).toEqual(before);
    const first = group.questions[0]!;
    expect(specialtyQuestions([first, first], 6, 1)).toHaveLength(1);
    expect(specialtyQuestions([], 6, 1)).toEqual([]);
    expect(() => specialtyQuestions(group.questions, 7, 1)).toThrow(Error);
  });
});

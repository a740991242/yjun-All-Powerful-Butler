import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession } from '../learning/engine';
import { required } from '../learning/required';
import { specialtyQuestions } from '../learning/specialties';
import { mathBooks } from './math';
import { sujiaoBooks } from './sujiao';

const now = '2026-10-03T00:00:00.000Z';
function roundtrip(session: ReturnType<typeof createSession>) {
  const state = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '练习', createdAt: now }],
    sessions: [session],
  };
  expect(parseBackup(exportBackup(state)).data).toEqual(state);
}
describe('sujiao edition-specific practice and bridges', () => {
  it('makes every current Sujiao unit available for bounded 6/12/20 practice without borrowing foreign tasks or changing source evidence', () => {
    for (const book of sujiaoBooks) {
      const before = JSON.stringify(book.units);
      expect(book.specialties).toHaveLength(book.volume === 'upper' ? 9 : 11);
      for (const [index, group] of required(book.specialties).entries()) {
        const source = required(book.units[index]);
        const originals = new Map(
          source.lessons.flatMap((l) => l.questions).map((q) => [q.id, q]),
        );
        expect(group.questions.length).toBeGreaterThan(0);
        for (const q of group.questions) expect(q).toEqual(originals.get(q.id));
        for (const count of [6, 12, 20]) {
          const tasks = specialtyQuestions(group.questions, count, 23);
          expect(tasks.length).toBe(
            Math.min(count, new Set(group.questions.map((q) => q.id)).size),
          );
          expect(new Set(tasks.map((q) => q.id)).size).toBe(tasks.length);
          expect(tasks).toEqual(specialtyQuestions(group.questions, count, 23));
          const skills = new Set(group.questions.map((q) => q.knowledge));
          expect(new Set(tasks.map((q) => q.knowledge)).size).toBe(
            Math.min(skills.size, tasks.length),
          );
          const session = createSession(group, book.id, 'child', {
            mode: 'practice',
            questions: tasks,
            seed: 23,
            now,
          });
          expect(session.phase).toBe('practice');
          roundtrip(session);
        }
      }
      expect(JSON.stringify(book.units)).toBe(before);
    }
  });
  it('connects Sujiao numbers, calculation and shapes with two upper and four lower original tasks, without admission gates or PEP substitutions', () => {
    const upper = required(sujiaoBooks.find((b) => b.volume === 'upper'));
    const lower = required(sujiaoBooks.find((b) => b.volume === 'lower'));
    const upperTasks = new Map(
      upper.units
        .flatMap((u) => u.lessons.flatMap((l) => l.questions))
        .map((q) => [q.id, q]),
    );
    const lowerTasks = new Map(
      lower.units
        .flatMap((u) => u.lessons.flatMap((l) => l.questions))
        .map((q) => [q.id, q]),
    );
    expect(lower.transitions?.map((l) => l.id)).toEqual([
      'sj-transition-numbers',
      'sj-transition-calculation',
      'sj-transition-shapes',
    ]);
    expect(upper.transitions).toBeUndefined();
    for (const bridge of required(lower.transitions)) {
      expect(bridge.questions).toHaveLength(6);
      expect(bridge.prerequisite).toContain('不要求先完成上册');
      expect(bridge.questions.filter((q) => upperTasks.has(q.id))).toHaveLength(
        2,
      );
      expect(bridge.questions.filter((q) => lowerTasks.has(q.id))).toHaveLength(
        4,
      );
      for (const q of bridge.questions)
        expect(q).toEqual(upperTasks.get(q.id) ?? lowerTasks.get(q.id));
      const session = createSession(bridge, lower.id, 'child', {
        mode: 'transition',
        seed: 5,
        now,
      });
      expect(session.mode).toBe('transition');
      roundtrip(session);
    }
  });
  it('includes the added PEP operation tasks in versioned specialty pools and keeps v1 saved practice restorable', () => {
    const upper = required(mathBooks.find((b) => b.volume === 'upper'));
    const lower = required(mathBooks.find((b) => b.volume === 'lower'));
    for (const [book, id, sourceId, originalId] of [
      [upper, 'ms-upper-shapes', 'mu-solid-observe', 'mu-solid'],
      [lower, 'ms-lower-shapes', 'ml-plane-build', 'ml-flat'],
      [lower, 'ms-lower-money', 'ml-shopping-practice', 'ml-money'],
    ] as const) {
      const group = required(book.specialties?.find((l) => l.id === id));
      expect(group.version).toBe(book.volume === 'upper' ? 3 : 2);
      expect(group.questions.some((q) => q.knowledge === sourceId)).toBe(true);
      const original = required(
        book.units.flatMap((u) => u.lessons).find((l) => l.id === originalId),
      );
      const old = createSession(
        { ...group, version: 1, questions: original.questions },
        book.id,
        'child',
        { mode: 'practice', seed: 1, now },
      );
      const snapshot = structuredClone(old);
      roundtrip(old);
      expect(old).toEqual(snapshot);
      expect(old.lessonVersion).toBe(1);
    }
  });
});

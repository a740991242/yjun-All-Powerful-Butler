import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, statistics, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { specialtyQuestions } from '../learning/specialties';
import { chineseBooks } from './chinese';
import { chineseSpecialties } from './chinese-specialties';

describe('source-preserving Chinese specialty practice', () => {
  it('uses only available authored tasks, separating manual work and retaining original IDs, materials and rules', () => {
    for (const book of chineseBooks) {
      expect(book.specialties!.map((l) => l.id)).toEqual(
        (book.volume === 'upper'
          ? ['recognition', 'phonics', 'reading', 'timetable', 'manual']
          : ['recognition', 'phonics', 'reading', 'manual']
        ).map((id) => `cs-${book.volume}-${id}`),
      );
      const originals = [
        ...book.units.flatMap((u) => u.lessons),
        ...book.transitions!,
      ].filter((l) => l.status === 'available');
      const tasks = new Map(
        originals.flatMap((l) => l.questions).map((q) => [q.id, q]),
      );
      const reviews = new Map(
        originals.flatMap((l) => l.reviewQuestions ?? []).map((q) => [q.id, q]),
      );
      for (const group of book.specialties!) {
        expect(
          book.units.flatMap((u) => u.lessons).some((l) => l.id === group.id),
        ).toBe(false);
        expect(group.questions.length).toBeGreaterThan(0);
        expect(new Set(group.questions.map((q) => q.id)).size).toBe(
          group.questions.length,
        );
        for (const question of group.questions) {
          expect(question).toBe(tasks.get(question.id));
          expect(question.rule.kind === 'manual').toBe(
            group.id.endsWith('-manual'),
          );
          if (group.id.endsWith('-reading'))
            expect(question.material).toBeTruthy();
        }
        for (const question of group.reviewQuestions!)
          expect(question).toBe(reviews.get(question.id));
      }
    }
    expect(chineseSpecialties('lower', [])).toEqual([]);
  });
  it('caps task counts at actual pool size, distributes source skills, and roundtrips every sampled snapshot without changing pools', () => {
    const now = '2026-09-30T00:00:00.000Z';
    for (const book of chineseBooks)
      for (const group of book.specialties!) {
        const before = structuredClone(group.questions);
        for (const count of [6, 12, 20]) {
          const tasks = specialtyQuestions(group.questions, count, 42);
          expect(tasks).toEqual(specialtyQuestions(group.questions, count, 42));
          expect(tasks).toHaveLength(Math.min(count, group.questions.length));
          expect(new Set(tasks.map((q) => q.id)).size).toBe(tasks.length);
          expect(new Set(tasks.map((q) => q.knowledge)).size).toBe(
            Math.min(
              count,
              new Set(group.questions.map((q) => q.knowledge)).size,
            ),
          );
          const session = createSession(group, book.id, 'child', {
            mode: 'practice',
            seed: 42,
            questions: tasks,
            now,
          });
          expect(
            parseBackup(
              exportBackup({
                schemaVersion: 1,
                activeProfileId: 'child',
                profiles: [{ id: 'child', nickname: '专项', createdAt: now }],
                sessions: [session],
              }),
            ).data.sessions[0]!.questions,
          ).toEqual(session.questions);
        }
        expect(group.questions).toEqual(before);
      }
    expect(
      chineseBooks[1]!.specialties!.find((l) => l.id.endsWith('-phonics'))!
        .questions,
    ).toHaveLength(6);
    expect(
      chineseBooks[0]!.specialties!.find((l) => l.id.endsWith('-timetable'))!
        .questions,
    ).toHaveLength(6);
  });
  it('keeps manual activities out of objective statistics and selects new review only for the failed original skill', () => {
    const now = '2026-09-30T00:00:00.000Z';
    const book = chineseBooks[1]!;
    const manual = book.specialties!.find((l) => l.id.endsWith('-manual'))!;
    const session = createSession(manual, book.id, 'child', {
      mode: 'practice',
      seed: 4,
      questions: specialtyQuestions(manual.questions, 20, 4),
      now,
    });
    for (const [index, question] of session.questions.entries())
      session.responses[index] = submitResponse(
        question,
        { ...session.responses[index]!, draft: 'confirmed' },
        now,
      );
    expect(statistics(session).manual).toBe(session.questions.length);
    expect(statistics(session).firstCorrect).toBe(0);
    expect(newReviewQuestions(manual, session, [session])).toEqual([]);
    const reading = book.specialties!.find((l) => l.id.endsWith('-reading'))!;
    const other = createSession(reading, book.id, 'child', {
      mode: 'practice',
      seed: 10,
      now,
    });
    const first = other.questions[0]!;
    if (first.rule.kind !== 'choice') throw new Error('missing objective task');
    const answer = first.rule.value;
    other.responses[0] = submitResponse(
      first,
      {
        ...other.responses[0]!,
        draft: first.choices!.find((c) => c.id !== answer)!.id,
      },
      now,
    );
    other.responses[0] = submitResponse(
      first,
      { ...other.responses[0]!, draft: answer },
      now,
    );
    const review = newReviewQuestions(reading, other, [other]);
    expect(review).toHaveLength(1);
    expect(review[0]!.knowledge).toBe(first.knowledge);
    expect(review[0]!.material).not.toBe(first.material);
    expect(other.responses[0]!.submissions[0]!.correct).toBe(false);
  });
});

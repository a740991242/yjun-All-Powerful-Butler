import { describe, expect, it } from 'vitest';

import { mathBooks } from '../content/math';
import { createSession, submitResponse } from './engine';
import { newReviewQuestions, originalReviewLesson } from './review';

describe('evidence-based review selection', () => {
  it('selects different questions for mistakes and excludes prior pool attempts only within the same profile and book', () => {
    const book = mathBooks[0]!;
    const lesson = book.units[0]!.lessons[0]!;
    const original = createSession(lesson, book.id, 'child');
    original.responses[0]!.draft = 999;
    original.responses[0] = submitResponse(
      original.questions[0]!,
      original.responses[0]!,
    );
    const candidates = newReviewQuestions(lesson, original, [original]);
    expect(candidates.length).toBeGreaterThanOrEqual(4);
    const attempt = createSession(lesson, book.id, 'child', {
      mode: 'review',
      questions: [candidates[0]!],
    });
    expect(
      newReviewQuestions(lesson, original, [original, attempt]).some(
        (q) => q.id === candidates[0]!.id,
      ),
    ).toBe(false);
    expect(
      newReviewQuestions(lesson, original, [
        original,
        { ...attempt, profileId: 'another-child' },
      ]),
    ).toEqual(candidates);
    expect(
      newReviewQuestions(lesson, original, [
        original,
        { ...attempt, bookId: 'another-book' },
      ]),
    ).toEqual(candidates);
    const copied = structuredClone(attempt);
    copied.questions[0]!.id = 'same-task-different-id';
    copied.questions[0]!.knowledge = 'another-course-skill';
    expect(
      newReviewQuestions(lesson, original, [original, copied]).some(
        (q) => q.id === candidates[0]!.id,
      ),
    ).toBe(false);
    expect(
      newReviewQuestions(lesson, original, [
        original,
        createSession(lesson, book.id, 'child', {
          mode: 'review',
          questions: candidates,
        }),
      ]),
    ).toEqual([]);
    expect(newReviewQuestions(undefined, original, [original])).toEqual([]);
  });

  it('offers no invented weakness and preserves old snapshots even if the current lesson was removed', () => {
    const book = mathBooks[0]!;
    const lesson = book.units[0]!.lessons[0]!;
    const original = createSession(lesson, book.id, 'child');
    expect(newReviewQuestions(lesson, original, [original])).toEqual([]);
    original.responses[0]!.draft = 999;
    original.responses[0] = submitResponse(
      original.questions[0]!,
      original.responses[0]!,
    );
    original.lessonId = 'removed-course';
    const saved = originalReviewLesson(original);
    expect(saved.id).toBe('removed-course');
    expect(saved.questions).toEqual([original.questions[0]]);
    expect(
      createSession(saved, book.id, 'child', { mode: 'review' }).phase,
    ).toBe('practice');
    expect(saved.questions[0]?.explanation).toBe(
      original.questions[0]?.explanation,
    );
    expect(original.responses[0]?.submissions).toHaveLength(1);
  });
});

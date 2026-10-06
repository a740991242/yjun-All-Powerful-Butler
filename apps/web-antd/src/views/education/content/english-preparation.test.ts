import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { editionTarget } from './edition-targets';
import { englishPreparationBook } from './english-preparation';
import { englishQihangDraftLessons } from './english-qihang-drafts';
import { englishQihangSource } from './english-qihang-source';
import { mathBooks } from './math';
import { findTextbook } from './textbooks';

describe('original English foundations and saved learning', () => {
  it('opens both original volumes without assigning an unverified textbook or province', () => {
    for (const [volume, count] of [
      ['upper', 8],
      ['lower', 6],
    ] as const) {
      const book = required(englishPreparationBook(volume, 'Original course'));
      expect(book.id).toBe(`original-english-preparation-p1-${volume}-v1`);
      expect(book.subject).toBe('english');
      expect(book.edition).toBe('original-preparation');
      expect(book.units).toHaveLength(5);
      const lessons = book.units.flatMap((unit) => unit.lessons);
      expect(lessons).toHaveLength(count);
      expect(new Set(lessons.map((lesson) => lesson.id)).size).toBe(count);
      for (const lesson of lessons) {
        expect(lesson.status).toBe('available');
        const draft = required(
          englishQihangDraftLessons.find((item) => item.id === lesson.id),
        );
        expect(draft.status).toBe('preparing');
        expect(lesson.questions).toEqual(draft.questions);
        expect(lesson.reviewQuestions).toEqual(draft.reviewQuestions);
        expect(lesson.steps).toEqual(draft.steps);
      }
      expect(
        findTextbook('english', 'original-preparation', volume),
      ).toBeUndefined();
      expect(editionTarget('english', 'pep-2024', volume)).toBeUndefined();
      expect(editionTarget('english', 'yilin', volume)).toBeUndefined();
    }
    expect(englishQihangSource.identity.studentBookIsbn).toBeNull();
    expect(englishQihangSource.identity.adoptedProvinces).toEqual([]);
    for (const volume of ['', 'middle', null, ['upper']])
      expect(englishPreparationBook(volume, 'Invalid')).toBeUndefined();
  });

  it('round-trips every activity and separate review beside an unchanged old mathematics attempt', () => {
    const library = initialLibrary('测试档案');
    const oldBook = required(mathBooks[0]);
    const oldLesson = required(oldBook.units[0]?.lessons[0]);
    library.sessions.push(
      createSession(oldLesson, oldBook.id, library.activeProfileId),
    );
    const oldSnapshot = structuredClone(library.sessions[0]);
    for (const volume of ['upper', 'lower']) {
      const book = required(englishPreparationBook(volume, 'Original course'));
      for (const lesson of book.units.flatMap((unit) => unit.lessons)) {
        const session = createSession(lesson, book.id, library.activeProfileId);
        for (const [index, question] of session.questions.entries()) {
          const response = required(session.responses[index]);
          if (question.rule.kind === 'manual') {
            response.skipped = true;
          } else if (question.rule.kind === 'reflection') {
            response.draft = '测试记录：未做实际交流，以后计划单独记录。';
            session.responses[index] = submitResponse(question, response);
            expect(
              session.responses[index]?.submissions[0]?.correct,
            ).toBeNull();
          }
        }
        library.sessions.push(
          session,
          createSession(lesson, book.id, library.activeProfileId, {
            mode: 'review',
            originalSessionId: session.id,
            questions: required(lesson.reviewQuestions),
          }),
        );
      }
    }
    const restored = parseBackup(exportBackup(library)).data;
    expect(restored.schemaVersion).toBe(1);
    expect(restored.sessions).toHaveLength(29);
    expect(restored.sessions[0]).toEqual(oldSnapshot);
    expect(restored).toEqual(library);
  });

  it('rejects damaged English clock snapshots through the existing strict backup contract', () => {
    const book = required(englishPreparationBook('lower', 'Original course'));
    const lesson = required(
      book.units
        .flatMap((unit) => unit.lessons)
        .find((item) => item.id.includes('farm-time')),
    );
    const library = initialLibrary('测试档案');
    const session = createSession(lesson, book.id, library.activeProfileId);
    library.sessions.push(session);
    expect(parseBackup(exportBackup(library)).data).toEqual(library);
    const question = required(
      session.questions.find((item) => item.visual?.kind === 'clock'),
    );
    const clock = required(question.visual);
    if (clock.kind !== 'clock') throw new Error('Clock fixture missing');
    const corrupt = JSON.parse(exportBackup(library));
    const stored = corrupt.data.sessions[0].questions.find(
      (item: { id: string }) => item.id === question.id,
    );
    stored.visual.minute = 15;
    expect(() => parseBackup(JSON.stringify(corrupt))).toThrow(
      'educationLearning.invalidBackup',
    );
  });
});

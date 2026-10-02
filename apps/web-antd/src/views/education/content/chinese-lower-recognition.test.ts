import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { lowerCharacters } from './characters';
import { chineseBooks } from './chinese';
import { lowerRecognitionPacks } from './chinese-lower-recognition';
import { textbooks } from './textbooks';

describe('lower first-unit character-scope supplements', () => {
  it('covers every verified character without inventing writing scope or completing official lessons', () => {
    const book = chineseBooks.find((item) => item.volume === 'lower')!;
    const official = textbooks.find((item) => item.id === book.id)!;
    const lessons = book.units.flatMap((unit) => unit.lessons);
    expect(
      Object.keys(lowerRecognitionPacks).filter((id) => id.startsWith('u1-')),
    ).toEqual(['u1-1', 'u1-2', 'u1-3', 'u1-4']);
    for (const [itemId, pack] of Object.entries(lowerRecognitionPacks).filter(
      ([id]) => id.startsWith('u1-'),
    )) {
      const scope = lowerCharacters[itemId]!;
      const source = official.units
        .flatMap((unit) => unit.items)
        .find((item) => item.id === itemId)!;
      expect(lessons).toContain(pack);
      expect(pack.textbookTitle).toBe(source.title);
      expect(pack.page).toBe(source.page);
      expect(
        lessons.find((lesson) => lesson.title === source.title)?.status,
      ).toBe(
        ['u1-1', 'u1-2', 'u1-3', 'u1-4'].includes(itemId)
          ? 'available'
          : 'preparing',
      );
      expect(
        lessons.find((lesson) => lesson.title === source.title)?.id,
      ).not.toBe(pack.id);
      expect(scope.writeVerified).toBe(true);
      expect(pack.parentTip).toContain('不新增会写字');
      expect(pack.steps[0]!.visual).toEqual({
        kind: 'characters',
        characters: [...scope.recognize],
        grid: 'tian',
      });
      const objective = pack.questions.filter(
        (question) => question.rule.kind === 'choice',
      );
      expect(
        objective.map((question) =>
          question.rule.kind === 'choice' ? question.rule.value : '',
        ),
      ).toEqual([...scope.recognize]);
      expect(
        pack.questions.filter((question) => question.rule.kind === 'manual'),
      ).toHaveLength(2);
      expect(pack.reviewQuestions).toHaveLength(objective.length);
      const ids = [...pack.questions, ...pack.reviewQuestions!].map(
        (question) => question.id,
      );
      expect(new Set(ids).size).toBe(ids.length);
      for (const question of [...objective, ...pack.reviewQuestions!]) {
        if (question.rule.kind !== 'choice') throw new Error('expected choice');
        expect(new Set(question.choices!.map((choice) => choice.id)).size).toBe(
          3,
        );
        for (const choice of question.choices!)
          expect(evaluate(question.rule, choice.id)).toBe(
            choice.id === question.rule.value,
          );
      }
    }
  });
  it('preserves a wrong first attempt after correction and selects only the corresponding character review', () => {
    const pack = lowerRecognitionPacks['u1-3']!;
    const session = createSession(pack, 'pep-chinese-p1-lower-2024', 'child', {
      seed: 14,
      now: '2026-09-30T00:00:00.000Z',
    });
    const question = session.questions.find(
      (item) => item.rule.kind === 'choice' && item.rule.value === '晴',
    )!;
    const index = session.questions.indexOf(question);
    session.responses[index] = submitResponse(question, {
      ...session.responses[index]!,
      draft: '河',
    });
    session.responses[index] = submitResponse(question, {
      ...session.responses[index]!,
      draft: '晴',
    });
    expect(
      session.responses[index]!.submissions.map(
        (submission) => submission.correct,
      ),
    ).toEqual([false, true]);
    const review = newReviewQuestions(pack, session, [session]);
    expect(review).toHaveLength(1);
    expect(review[0]!.knowledge).toBe(question.knowledge);
    expect(review[0]!.prompt).not.toBe(question.prompt);
    const practicedReview = { ...session, id: 'new-review', questions: review };
    expect(
      newReviewQuestions(pack, session, [session, practicedReview]),
    ).toEqual([]);
  });
  it('roundtrips full scoped tasks and separates all manual confirmations from objective results', () => {
    const now = '2026-09-30T00:00:00.000Z';
    for (const pack of Object.values(lowerRecognitionPacks)) {
      const session = createSession(
        pack,
        'pep-chinese-p1-lower-2024',
        'child',
        { seed: 42, now },
      );
      session.phase = 'practice';
      for (const [index, question] of session.questions.entries()) {
        const answer =
          question.rule.kind === 'choice' ? question.rule.value : 'confirmed';
        session.responses[index] = submitResponse(
          question,
          { ...session.responses[index]!, draft: answer },
          now,
        );
      }
      expect(statistics(session).manual).toBe(
        pack.id.startsWith('cl-u5-') ? 3 : 2,
      );
      const restored = parseBackup(
        exportBackup({
          schemaVersion: 1,
          activeProfileId: 'child',
          profiles: [{ id: 'child', nickname: '识字', createdAt: now }],
          sessions: [session],
        }),
      ).data.sessions[0]!;
      expect(restored).toEqual(session);
    }
  });
});

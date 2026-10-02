import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { upperCharacters } from './characters';
import { chineseBooks } from './chinese';
import { makeRecognitionPack } from './chinese-recognition-pack';
import { upperRecognitionPacks } from './chinese-upper-recognition';
import { textbooks } from './textbooks';

describe('upper source-scoped recognition and paper writing supplements', () => {
  it('covers verified recognition and writing scopes while keeping formal textbook items pending', () => {
    const book = chineseBooks.find((item) => item.volume === 'upper')!;
    const official = textbooks.find((item) => item.id === book.id)!;
    let recognition = 0;
    let writing = 0;
    for (const [itemId, lesson] of Object.entries(upperRecognitionPacks)) {
      const scope = upperCharacters[itemId]!;
      const source = official.units
        .flatMap((unit) => unit.items)
        .find((item) => item.id === itemId)!;
      const inBook = book.units.flatMap((unit) => unit.lessons);
      expect(inBook).toContain(lesson);
      expect(inBook.find((item) => item.title === source.title)?.status).toBe(
        [
          'u1-2',
          'u1-3',
          'u1-4',
          'u1-5',
          'u2-3',
          'u2-4',
          'u2-5',
          'u3-1',
          'u3-2',
          'u3-3',
          'u3-4',
          'u3-5',
          'u3-6',
          'u4-1',
          'u4-2',
          'u4-3',
          'u4-4',
          'u4-5',
          'u4-6',
          'u5-1',
          'u5-2',
          'u5-3',
          'u5-4',
          'u5-5',
          'u6-1',
          'u6-2',
          'u6-3',
          'u6-4',
          'u6-5',
          'u7-1',
          'u7-2',
          'u7-3',
          'u7-4',
          'u8-1',
          'u8-2',
          'u8-3',
          'u8-4',
        ].includes(itemId)
          ? 'available'
          : 'preparing',
      );
      expect(lesson.page).toBe(source.page);
      expect(lesson.steps[0]!.visual).toEqual({
        kind: 'characters',
        grid: 'tian',
        characters: [...scope.recognize],
      });
      const objective = lesson.questions.filter(
        (question) => question.rule.kind === 'choice',
      );
      expect(
        objective.map((question) =>
          question.rule.kind === 'choice' ? question.rule.value : '',
        ),
      ).toEqual([...scope.recognize]);
      expect(lesson.reviewQuestions).toHaveLength(objective.length);
      expect(
        lesson.questions.filter((question) => question.rule.kind === 'manual'),
      ).toHaveLength(3);
      const paper = lesson.questions.find((question) =>
        question.id.endsWith('-write'),
      )!;
      expect(paper.rule.kind).toBe('manual');
      expect(paper.material).toBe([...scope.write].join('　'));
      expect(lesson.parentTip).toContain('写字表第108页');
      expect(paper.prompt).toContain('可以跳过');
      for (const question of [...objective, ...lesson.reviewQuestions!]) {
        if (question.rule.kind !== 'choice') throw new Error('expected choice');
        const expected = question.rule.value;
        expect(
          question.choices!.filter((choice) => choice.id === expected),
        ).toHaveLength(1);
        expect(evaluate(question.rule, question.rule.value)).toBe(true);
        for (const choice of question.choices!)
          if (choice.id !== question.rule.value)
            expect(evaluate(question.rule, choice.id)).toBe(false);
      }
      recognition += [...scope.recognize].length;
      writing += [...scope.write].length;
    }
    expect(recognition).toBe(78);
    expect(writing).toBe(40);
  });
  it('preserves paper work as manual evidence through backups and only reviews the missed character', () => {
    const now = '2026-09-30T00:00:00.000Z';
    for (const lesson of Object.values(upperRecognitionPacks)) {
      const session = createSession(
        lesson,
        'pep-chinese-p1-upper-2024',
        'child',
        { seed: 42, now },
      );
      session.phase = 'practice';
      let missed: string | undefined;
      for (const [index, question] of session.questions.entries()) {
        const answer =
          question.rule.kind === 'choice' ? question.rule.value : 'confirmed';
        if (!missed && question.rule.kind === 'choice') {
          missed = question.knowledge;
          session.responses[index] = submitResponse(
            question,
            {
              ...session.responses[index]!,
              draft: question.choices!.find((choice) => choice.id !== answer)!
                .id,
            },
            now,
          );
        }
        session.responses[index] = submitResponse(
          question,
          { ...session.responses[index]!, draft: answer },
          now,
        );
      }
      expect(statistics(session).manual).toBe(3);
      const review = newReviewQuestions(lesson, session, [session]);
      expect(review).toHaveLength(1);
      expect(review[0]!.knowledge).toBe(missed);
      const restored = parseBackup(
        exportBackup({
          schemaVersion: 1,
          activeProfileId: 'child',
          profiles: [{ id: 'child', nickname: '写字', createdAt: now }],
          sessions: [session],
        }),
      ).data.sessions[0]!;
      expect(restored).toEqual(session);
    }
  });
  it('does not manufacture paper-writing tasks when a verified writing reference is absent', () => {
    const rows = [...upperCharacters['u1-1']!.recognize].map(
      (character) =>
        [character, character, '字形辨认', '□'] as [
          string,
          string,
          string,
          string,
        ],
    );
    const lesson = makeRecognitionPack(
      { itemId: 'u1-1', title: '天地人', page: 8, activity: '说一说', rows },
      'upper',
    );
    expect(
      lesson.questions.some((question) => question.id.endsWith('-write')),
    ).toBe(false);
    expect(lesson.parentTip).not.toContain('117');
    expect(lesson.review.notes).not.toContain('undefined');
    expect(() =>
      makeRecognitionPack(
        {
          itemId: 'u1-1',
          title: '天地人',
          page: 8,
          activity: '说一说',
          rows: rows.slice(1),
        },
        'upper',
      ),
    ).toThrow('educationLearning.invalidRecord');
    const missingContext = rows.map((row) => [...row] as typeof row);
    missingContext[0]![3] = '没有填字位置';
    expect(() =>
      makeRecognitionPack(
        {
          itemId: 'u1-1',
          title: '天地人',
          page: 8,
          activity: '说一说',
          rows: missingContext,
        },
        'upper',
      ),
    ).toThrow('educationLearning.invalidRecord');
  });
});

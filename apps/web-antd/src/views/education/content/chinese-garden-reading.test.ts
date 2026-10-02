import { expect, it } from 'vitest';

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
import { gardenOneComparison } from './chinese-garden-one';
import {
  firstGardenReadingAudits,
  gardenOneLesson,
  happyReadingLesson,
} from './chinese-garden-reading';

it('covers the actual garden columns and reading page without overriding the existing supplement or guessing metadata', () => {
  expect(firstGardenReadingAudits[0]!.pages).toEqual([15, 16, 17, 18]);
  expect(firstGardenReadingAudits[0]!.sections).toHaveLength(6);
  expect(firstGardenReadingAudits[0]!.recognize).toBe(
    upperCharacters['u1-5']!.recognize,
  );
  expect(firstGardenReadingAudits[0]!.write).toBe(
    upperCharacters['u1-5']!.write,
  );
  expect(firstGardenReadingAudits[1]!.pages).toEqual([19]);
  expect(
    firstGardenReadingAudits.every(
      (audit) =>
        audit.isbn === null &&
        audit.editionDate === null &&
        audit.printingDate === null,
    ),
  ).toBe(true);
  const lessons = chineseBooks[0]!.units.flatMap((unit) => unit.lessons);
  expect(lessons).toContain(gardenOneLesson);
  expect(lessons).toContain(happyReadingLesson);
  expect(lessons).toContain(gardenOneComparison);
  expect(gardenOneComparison.parentTip).toContain('不代替');
  expect(gardenOneLesson.steps.map((step) => step.title)).toContain(
    '和大人一起读《剪窗花》',
  );
  expect(gardenOneLesson.review.notes).toContain('第三方');
  expect(
    happyReadingLesson.questions.filter(
      (question) => question.rule.kind === 'reflection',
    ),
  ).toHaveLength(3);
});
it('keeps physical work, original reading cards and review attempts separate through backup restore', () => {
  const now = '2026-10-01T00:00:00.000Z';
  for (const lesson of [gardenOneLesson, happyReadingLesson]) {
    const session = createSession(lesson, chineseBooks[0]!.id, 'child', {
      seed: 36,
      now,
    });
    session.phase = 'practice';
    let missed: string | undefined;
    for (const [index, question] of session.questions.entries()) {
      if (question.rule.kind === 'choice') {
        const expected = question.rule.value;
        expect(
          question.choices!.filter((choice) => choice.id === expected),
        ).toHaveLength(1);
        expect(evaluate(question.rule, expected)).toBe(true);
        for (const choice of question.choices!)
          if (choice.id !== expected)
            expect(evaluate(question.rule, choice.id)).toBe(false);
        if (!missed) {
          missed = question.knowledge;
          session.responses[index] = submitResponse(
            question,
            {
              ...session.responses[index]!,
              draft: question.choices!.find((choice) => choice.id !== expected)!
                .id,
            },
            now,
          );
        }
      }
      const answer = (() => {
        if (question.rule.kind === 'choice') return question.rule.value;
        return question.rule.kind === 'manual'
          ? 'confirmed'
          : '读书卡原话\n我还想再读一段。';
      })();
      session.responses[index] = submitResponse(
        question,
        { ...session.responses[index]!, draft: answer },
        now,
      );
      if (question.rule.kind !== 'choice')
        expect(
          session.responses[index]!.submissions.at(-1)!.correct,
        ).toBeNull();
    }
    expect(statistics(session).manual).toBe(lesson === gardenOneLesson ? 6 : 3);
    const review = newReviewQuestions(lesson, session, [session]);
    expect(review).toHaveLength(1);
    expect(review[0]!.knowledge).toBe(missed);
    const allIds = [...lesson.questions, ...lesson.reviewQuestions!].map(
      (question) => question.id,
    );
    expect(new Set(allIds).size).toBe(allIds.length);
    for (const question of lesson.reviewQuestions!) {
      const main = lesson.questions.find(
        (main) => main.knowledge === question.knowledge,
      )!;
      expect(
        JSON.stringify([question.prompt, question.material, question.visual]),
      ).not.toBe(JSON.stringify([main.prompt, main.material, main.visual]));
      if (question.rule.kind !== 'choice') throw new Error('expected choice');
      const expected = question.rule.value;
      expect(question.choices!.some((choice) => choice.id === expected)).toBe(
        true,
      );
    }
    expect(
      parseBackup(
        exportBackup({
          schemaVersion: 1,
          activeProfileId: 'child',
          profiles: [{ id: 'child', nickname: '陪读', createdAt: now }],
          sessions: [session],
        }),
      ).data.sessions[0],
    ).toEqual(session);
  }
});
it('keeps textbook-dependent modern reading questions explicit and never fabricates unknown book titles', () => {
  for (const question of gardenOneLesson.questions.filter((question) =>
    question.id.includes('window-'),
  ))
    expect(question.material).toContain('教材第18页');
  expect(
    happyReadingLesson.questions.find((question) =>
      question.id.endsWith('-unknown'),
    )!.rule,
  ).toEqual({ kind: 'choice', value: '不能，先看真实封面' });
  expect(
    happyReadingLesson.reviewQuestions!.find((question) =>
      question.id.endsWith('-ending'),
    )!.rule,
  ).toEqual({ kind: 'choice', value: '家' });
  expect(
    gardenOneLesson.questions.find((question) =>
      question.id.endsWith('-poem-color'),
    )!.rule,
  ).toEqual({ kind: 'choice', value: '白色' });
  expect(
    gardenOneLesson.reviewQuestions!.find((question) =>
      question.id.endsWith('-poem-color'),
    )!.rule,
  ).toEqual({ kind: 'choice', value: '红色' });
});

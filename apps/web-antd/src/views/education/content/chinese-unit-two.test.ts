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
import { consonantPacks } from './chinese-consonants';
import { firstPhonics } from './chinese-first-packs';
import { iuuPhonics } from './chinese-iuu';
import { unitTwoChineseLessons, unitTwoPageAudits } from './chinese-unit-two';

it('opens actual revised second-unit scopes independently and preserves old supplements and unknown publication details', () => {
  expect(unitTwoPageAudits.map((audit) => audit.pages)).toEqual([
    [20, 21],
    [22, 23],
    [24, 25],
    [26, 27],
    [28, 29, 30, 31],
  ]);
  const lessons = chineseBooks[0]!.units.flatMap((unit) => unit.lessons);
  for (const audit of unitTwoPageAudits) {
    expect(audit.isbn).toBeNull();
    expect(audit.editionDate).toBeNull();
    expect(audit.printingDate).toBeNull();
    if (audit.recognize) {
      expect(audit.recognize).toBe(upperCharacters[audit.itemId]!.recognize);
      expect(audit.write).toBe(upperCharacters[audit.itemId]!.write);
    }
    const lesson = unitTwoChineseLessons[audit.itemId]!;
    expect(lessons).toContain(lesson);
    expect(lesson.id).toBe(`cu-${audit.itemId}`);
    expect(lesson.title).toBe(audit.title);
    expect(lesson.review.notes).toContain('第三方原书公开预览');
    expect(lesson.review.notes).toContain('未知');
  }
  for (const supplement of [
    firstPhonics,
    iuuPhonics,
    consonantPacks['u2-3'],
    consonantPacks['u2-4'],
  ])
    expect(lessons).toContain(supplement);
  expect(unitTwoChineseLessons['u2-2']!.steps[0]!.text).toContain('不合并y w');
  expect(
    unitTwoChineseLessons['u2-4']!.questions.find((question) =>
      question.id.endsWith('-q-umlaut'),
    )!.rule,
  ).toEqual({ kind: 'choice', value: 'nǚ' });
  expect(
    unitTwoChineseLessons['u2-4']!.reviewQuestions!.find((question) =>
      question.id.endsWith('-r-umlaut'),
    )!.rule,
  ).toEqual({ kind: 'choice', value: 'lǜ' });
  expect(
    unitTwoChineseLessons['u2-5']!.questions.find((question) =>
      question.id.endsWith('-manual-write'),
    )!.material,
  ).toBe('会写范围：九、王。');
});
it('validates every answer and preserves manual/reflection evidence, a first error and different review material in snapshots', () => {
  const now = '2026-10-01T00:00:00.000Z';
  for (const lesson of Object.values(unitTwoChineseLessons)) {
    const session = createSession(lesson, chineseBooks[0]!.id, 'child', {
      seed: 12,
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
          : '还想练拼音\n请家长再示范。';
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
    expect(statistics(session).manual).toBe(
      lesson.questions.filter((question) => question.rule.kind === 'manual')
        .length,
    );
    const review = newReviewQuestions(lesson, session, [session]);
    expect(review).toHaveLength(1);
    expect(review[0]!.knowledge).toBe(missed);
    for (const question of lesson.reviewQuestions!) {
      const main = lesson.questions.find(
        (original) => original.knowledge === question.knowledge,
      )!;
      expect(
        JSON.stringify([question.prompt, question.material, question.visual]),
      ).not.toBe(JSON.stringify([main.prompt, main.material, main.visual]));
      if (question.rule.kind !== 'choice')
        throw new Error('expected objective');
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
it('anchors textbook-dependent modern reading and avoids fake personal info or fabricated audio assessment', () => {
  const garden = unitTwoChineseLessons['u2-5']!;
  const fields = garden.questions.filter((question) =>
    question.id.includes('-q-field-'),
  );
  expect(fields).toHaveLength(3);
  expect(fields.every((question) => question.material?.includes('虚构'))).toBe(
    true,
  );
  for (const question of garden.questions.filter((question) =>
    question.id.includes('-q-rabbit-'),
  ))
    expect(question.material).toContain('教材第');
  expect(
    garden.questions.find((question) => question.id.endsWith('-q-rabbit-seed'))!
      .rule,
  ).toEqual({ kind: 'choice', value: '菜子' });
  expect(
    garden.reviewQuestions!.find((question) =>
      question.id.endsWith('-r-rabbit-seed'),
    )!.rule,
  ).toEqual({ kind: 'choice', value: '一车白菜' });
  for (const lesson of Object.values(unitTwoChineseLessons))
    expect(lesson.parentTip).toMatch(/声音|发音|朗读/);
});

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { upperCharacters } from './characters';
import { chineseBooks } from './chinese';
import { compoundVowelPacks } from './chinese-compound-vowels';
import { formalUnitFourMiddle } from './chinese-unit-four-middle';

it('publishes inspected bodies independently of unchanged supplements with exact recognition and physical scopes', () => {
  const lessons = chineseBooks[0]!.units.flatMap((u) => u.lessons);
  for (const [index, itemId] of ['u4-2', 'u4-3'].entries()) {
    const lesson = formalUnitFourMiddle[itemId]!;
    expect(lessons).toContain(lesson);
    expect(lessons).toContain(compoundVowelPacks[itemId]);
    expect(lesson.id).toBe(`cu-${itemId}`);
    expect(lesson.status).toBe('available');
    expect(compoundVowelPacks[itemId]!.id).toBe(`cu-${itemId}-vowel-tone`);
    expect(compoundVowelPacks[itemId]!.questions).toHaveLength(12);
    expect(compoundVowelPacks[itemId]!.parentTip).toContain(
      '尚待教材正文逐页核验',
    );
    expect(lesson.steps).toHaveLength(index === 0 ? 10 : 11);
    expect(
      lesson.questions.filter((q) => q.rule.kind === 'choice'),
    ).toHaveLength(index === 0 ? 18 : 22);
    expect(
      lesson.questions.filter((q) => q.rule.kind === 'manual'),
    ).toHaveLength(6);
    expect(
      lesson.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(1);
    expect(
      lesson.questions
        .filter((q) => q.id.includes('-q-char-'))
        .map((q) => (q.rule.kind === 'choice' ? q.rule.value : ''))
        .join(''),
    ).toBe(upperCharacters[itemId]!.recognize);
    expect(upperCharacters[itemId]!.write).toBe('');
    expect(lesson.parentTip).toContain('第三方');
    for (const q of [...lesson.questions, ...lesson.reviewQuestions!]) {
      expect(q.knowledge).toMatch(/^[\w-]{1,120}$/);
      if (q.rule.kind !== 'choice') continue;
      const answer = q.rule.value;
      expect(new Set(q.choices!.map((c) => c.id)).size).toBe(q.choices!.length);
      expect(q.choices!.some((c) => c.id === answer)).toBe(true);
      for (const c of q.choices!)
        expect(evaluate(q.rule, c.id)).toBe(c.id === q.rule.value);
      if (q.id.includes('-reading-'))
        expect(q.material).toContain(
          `共读教材印刷第${index === 0 ? 48 : 50}页`,
        );
    }
    for (const q of lesson.reviewQuestions!)
      expect(
        lesson.questions.some(
          (main) =>
            JSON.stringify([main.prompt, main.material, main.visual]) ===
            JSON.stringify([q.prompt, q.material, q.visual]),
        ),
      ).toBe(false);
  }
});

it('distinguishes whole syllables, unchanged üe and condition-specific dot omission', () => {
  const lesson = formalUnitFourMiddle['u4-3']!;
  const cases = [
    ['whole-ye', 'ye', 'ie'],
    ['whole-final', 'üe', 'u'],
    ['dots-nl', 'nüè', 'nuè'],
    ['dots-jqx', 'jué', 'jüé'],
    ['dots-final', 'üe', 'u'],
  ];
  for (const [key, correct, wrong] of cases) {
    const q = lesson.questions.find((q) => q.id.endsWith(`-q-${key}`))!;
    expect(evaluate(q.rule, correct!)).toBe(true);
    expect(evaluate(q.rule, wrong!)).toBe(false);
  }
  const texts = lesson.steps.map((s) => s.text).join('\n');
  expect(texts).toContain('er自成音节');
  expect(texts).toContain('nüè、lüè');
  expect(texts).toContain('jué、quē、xuě');
  expect(
    lesson.questions.find((q) => q.id.endsWith('-q-whole-ye'))!.material,
  ).toContain('比较ye与ie');
});

it('retains wrong-first evidence, manual and reflection nulls, backup snapshots and changed reading reviews for both bodies', () => {
  const now = '2026-10-01T00:00:00.000Z';
  for (const [itemId, answer] of [
    ['u4-2', '台湾'],
    ['u4-3', '校园'],
  ]) {
    const lesson = formalUnitFourMiddle[itemId!]!;
    const session = createSession(lesson, chineseBooks[0]!.id, 'child', {
      seed: 17,
      now,
    });
    session.phase = 'practice';
    for (const [index, q] of session.questions.entries()) {
      if (
        q.rule.kind === 'choice' &&
        (q.id.endsWith('-q-reading-visit') || q.id.endsWith('-q-reading-place'))
      ) {
        const answer = q.rule.value;
        session.responses[index] = submitResponse(
          q,
          {
            ...session.responses[index]!,
            draft: q.choices!.find((c) => c.id !== answer)!.id,
          },
          now,
        );
      }
      const draft = (() => {
        if (q.rule.kind === 'choice') return q.rule.value;
        return q.rule.kind === 'manual'
          ? 'confirmed'
          : '我想再读一遍。\n这是计划。';
      })();
      session.responses[index] = submitResponse(
        q,
        { ...session.responses[index]!, draft },
        now,
      );
      if (q.rule.kind !== 'choice')
        expect(
          session.responses[index]!.submissions.at(-1)!.correct,
        ).toBeNull();
    }
    const review = newReviewQuestions(lesson, session, [session]);
    expect(review).toHaveLength(1);
    expect(review[0]!.rule).toEqual({ kind: 'choice', value: answer });
    const main = session.questions.find(
      (q) => q.knowledge === review[0]!.knowledge,
    )!;
    if (main.rule.kind !== 'choice') throw new Error('expected objective');
    expect(evaluate(review[0]!.rule, main.rule.value)).toBe(false);
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

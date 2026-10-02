import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { upperCharacters } from './characters';
import { chineseBooks } from './chinese';
import { compoundVowelPacks } from './chinese-compound-vowels';
import { formalAiEiUiLesson, unitFourPageAudits } from './chinese-unit-four';

it('retains inspected fourth-unit page scopes without publishing unimplemented courses', () => {
  const lessons = chineseBooks[0]!.units.flatMap((u) => u.lessons);
  expect(unitFourPageAudits.map((a) => a.pages)).toEqual([
    [45, 46],
    [47, 48],
    [49, 50],
    [51, 52, 53],
    [54, 55],
    [56, 57, 58, 59],
  ]);
  for (const audit of unitFourPageAudits) {
    expect(audit.recognize).toBe(upperCharacters[audit.itemId]!.recognize);
    expect(audit.write).toBe(upperCharacters[audit.itemId]!.write);
    expect(audit.provider).toContain('第三方');
    expect(audit.isbn).toBeNull();
    expect(audit.editionDate).toBeNull();
    expect(audit.printingDate).toBeNull();
    expect(lessons.find((x) => x.id === `cu-${audit.itemId}`)!.status).toBe(
      ['u4-1', 'u4-2', 'u4-3', 'u4-4', 'u4-5', 'u4-6'].includes(audit.itemId)
        ? 'available'
        : 'preparing',
    );
  }
  expect(lessons).toContain(formalAiEiUiLesson);
  expect(lessons).toContain(compoundVowelPacks['u4-1']);
  expect(compoundVowelPacks['u4-1']!.id).toBe('cu-u4-1-vowel-tone');
  expect(compoundVowelPacks['u4-1']!.questions).toHaveLength(12);
  expect(compoundVowelPacks['u4-1']!.parentTip).toContain(
    '尚待教材正文逐页核验',
  );
});

it('checks written syllables, exact recognition scope and external reading without claiming actual sound or writing', () => {
  const lesson = formalAiEiUiLesson;
  expect(lesson.steps).toHaveLength(10);
  expect(lesson.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(
    18,
  );
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    6,
  );
  expect(
    lesson.questions.filter((q) => q.rule.kind === 'reflection'),
  ).toHaveLength(1);
  expect(
    lesson.questions
      .filter((q) => q.id.includes('-q-char-'))
      .map((q) => (q.rule.kind === 'choice' ? q.rule.value : ''))
      .join(''),
  ).toBe('白菜西瓜果');
  for (const q of [...lesson.questions, ...lesson.reviewQuestions!]) {
    if (q.rule.kind !== 'choice') continue;
    expect(new Set(q.choices!.map((c) => c.id)).size).toBe(q.choices!.length);
    for (const c of q.choices!)
      expect(evaluate(q.rule, c.id)).toBe(c.id === q.rule.value);
    if (q.id.includes('-song-'))
      expect(q.material).toContain('共读教材印刷第46页');
  }
  const triple = lesson.questions.find((q) => q.id.endsWith('-q-triple'))!;
  expect(triple.material).toBe('g + u + āi');
  expect(evaluate(triple.rule, 'guāi')).toBe(true);
  expect(evaluate(triple.rule, 'gāi')).toBe(false);
  for (const q of lesson.reviewQuestions!)
    expect(
      lesson.questions.some(
        (main) =>
          JSON.stringify([main.prompt, main.material, main.visual]) ===
          JSON.stringify([q.prompt, q.material, q.visual]),
      ),
    ).toBe(false);
});

it('keeps wrong-first evidence, independent physical activity and reflection snapshots and generates changed review', () => {
  const now = '2026-10-01T00:00:00.000Z';
  const s = createSession(formalAiEiUiLesson, chineseBooks[0]!.id, 'child', {
    seed: 11,
    now,
  });
  s.phase = 'practice';
  for (const [index, q] of s.questions.entries()) {
    if (q.id.endsWith('-q-song-material'))
      s.responses[index] = submitResponse(
        q,
        { ...s.responses[index]!, draft: '书本' },
        now,
      );
    const draft = (() => {
      if (q.rule.kind === 'choice') return q.rule.value;
      return q.rule.kind === 'manual'
        ? 'confirmed'
        : '我想再练三拼。\n这是计划。';
    })();
    s.responses[index] = submitResponse(
      q,
      { ...s.responses[index]!, draft },
      now,
    );
    if (q.rule.kind !== 'choice')
      expect(s.responses[index]!.submissions.at(-1)!.correct).toBeNull();
  }
  const review = newReviewQuestions(formalAiEiUiLesson, s, [s]);
  expect(review).toHaveLength(1);
  expect(review[0]!.rule).toEqual({ kind: 'choice', value: '毛巾' });
  expect(evaluate(review[0]!.rule, '肥皂')).toBe(false);
  expect(
    parseBackup(
      exportBackup({
        schemaVersion: 1,
        activeProfileId: 'child',
        profiles: [{ id: 'child', nickname: '陪读', createdAt: now }],
        sessions: [s],
      }),
    ).data.sessions[0],
  ).toEqual(s);
});

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
import { gardenFourLesson, gardenFourPageAudit } from './chinese-garden-four';

it('covers all four inspected garden pages with exact character scopes and separate actual activities', () => {
  const lesson = gardenFourLesson;
  expect(chineseBooks[0]!.units.flatMap((u) => u.lessons)).toContain(lesson);
  expect(gardenFourPageAudit.pages).toEqual([56, 57, 58, 59]);
  expect(gardenFourPageAudit.recognize).toBe(
    upperCharacters['u4-6']!.recognize,
  );
  expect(gardenFourPageAudit.write).toBe('个去');
  expect(gardenFourPageAudit.provider).toContain('第三方');
  for (const field of ['isbn', 'editionDate', 'printingDate'] as const)
    expect(gardenFourPageAudit[field]).toBeNull();
  expect(lesson.steps).toHaveLength(12);
  expect(lesson.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(
    38,
  );
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    10,
  );
  expect(
    lesson.questions.filter((q) => q.rule.kind === 'reflection'),
  ).toHaveLength(2);
  expect(lesson.reviewQuestions).toHaveLength(38);
  expect(
    lesson.questions
      .filter((q) => q.id.includes('-q-char-'))
      .map((q) => (q.rule.kind === 'choice' ? q.rule.value : ''))
      .join(''),
  ).toBe('晚昨今明个这去年');
  expect(lesson.steps[6]!.text).toContain(
    'zhi chi shi ri zi ci si yi wu yu ye yue yuan yin yun ying',
  );
  expect(lesson.steps[6]!.text).toContain('ang eng ing ong');
  expect(lesson.steps[6]!.text).toContain('不上传或录入');
  expect(lesson.steps[8]!.text).toContain('已学字的应用');
  expect(lesson.steps[9]!.text).toContain('[唐] 李绅');
  expect(lesson.steps[10]!.text).toContain('胡木仁');
});

it('uses explicit time references and specified syllables, external reading and changed review conditions', () => {
  const lesson = gardenFourLesson;
  expect(
    lesson.questions.find((q) => q.id.endsWith('-q-time-day'))!.prompt,
  ).toContain('同一天');
  expect(
    lesson.questions.find((q) => q.id.endsWith('-q-time-year'))!.prompt,
  ).toContain('以今年为参照');
  expect(
    lesson.questions.find((q) => q.id.endsWith('-q-fill-2'))!.prompt,
  ).toContain('tí mù');
  expect(
    lesson.reviewQuestions!.find((q) => q.id.endsWith('-r-fill-2'))!.prompt,
  ).toContain('mù guāng');
  const all = [...lesson.questions, ...lesson.reviewQuestions!];
  expect(new Set(all.map((q) => q.id)).size).toBe(all.length);
  for (const q of all) {
    if (q.rule.kind !== 'choice') continue;
    const expected = q.rule.value;
    expect(q.choices!.filter((c) => c.id === expected)).toHaveLength(1);
    for (const c of q.choices!)
      expect(evaluate(q.rule, c.id)).toBe(c.id === expected);
    if (q.id.includes('-reading-'))
      expect(q.material).toContain('共读教材印刷第59页');
  }
  for (const q of lesson.reviewQuestions!)
    expect(
      lesson.questions.some(
        (main) =>
          JSON.stringify([main.prompt, main.material, main.visual]) ===
          JSON.stringify([q.prompt, q.material, q.visual]),
      ),
    ).toBe(false);
});

it('keeps wrong-first history and manual/reflection evidence through backup with a new bird-sound review', () => {
  const now = '2026-10-01T00:00:00.000Z';
  const s = createSession(gardenFourLesson, chineseBooks[0]!.id, 'child', {
    seed: 13,
    now,
  });
  s.phase = 'practice';
  for (const [i, q] of s.questions.entries()) {
    if (q.id.endsWith('-q-reading-sound'))
      s.responses[i] = submitResponse(
        q,
        { ...s.responses[i]!, draft: '轰隆隆' },
        now,
      );
    s.responses[i] = submitResponse(
      q,
      {
        ...s.responses[i]!,
        draft: (() => {
          if (q.rule.kind === 'choice') return q.rule.value;
          return q.rule.kind === 'manual'
            ? 'confirmed'
            : '想带水壶。\n这是计划。';
        })(),
      },
      now,
    );
    if (q.rule.kind !== 'choice')
      expect(s.responses[i]!.submissions.at(-1)!.correct).toBeNull();
  }
  expect(statistics(s).manual).toBe(10);
  expect(s.responses.filter((r) => r.submissions.length === 2)).toHaveLength(1);
  const review = newReviewQuestions(gardenFourLesson, s, [s]);
  expect(review).toHaveLength(1);
  expect(review[0]!.rule).toEqual({ kind: 'choice', value: '叽叽喳喳' });
  expect(evaluate(review[0]!.rule, '淅淅沙沙')).toBe(false);
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

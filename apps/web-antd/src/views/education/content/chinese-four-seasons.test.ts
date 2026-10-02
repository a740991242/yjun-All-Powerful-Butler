import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { upperCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  fourSeasonsLesson,
  fourSeasonsPageAudit,
  seasonalScenes,
  seasonalShapes,
} from './chinese-four-seasons';

it('covers both observed pages and the actual reading/imitation requirements without adding recitation or familiar di to new character lists', () => {
  const l = fourSeasonsLesson;
  expect(chineseBooks[0]!.units.flatMap((u) => u.lessons)).toContain(l);
  expect(l.id).toBe('cu-u5-4');
  expect(fourSeasonsPageAudit.pages).toEqual([66, 67]);
  expect(fourSeasonsPageAudit.recognize).toBe(
    upperCharacters['u5-4']!.recognize,
  );
  expect(fourSeasonsPageAudit.write).toBe(upperCharacters['u5-4']!.write);
  expect(fourSeasonsPageAudit.familiarCharacter).toBe('地');
  expect(fourSeasonsPageAudit.recognize).not.toContain('地');
  expect(fourSeasonsPageAudit.write).not.toContain('地');
  expect(fourSeasonsPageAudit.author).toBe('薛卫民');
  expect(fourSeasonsPageAudit.adapted).toBe(true);
  expect(fourSeasonsPageAudit.provider).toContain('第三方');
  for (const field of ['isbn', 'editionDate', 'printingDate'] as const)
    expect(fourSeasonsPageAudit[field]).toBeNull();
  expect(l.steps).toHaveLength(8);
  expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(25);
  expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(7);
  expect(l.questions.filter((q) => q.rule.kind === 'reflection')).toHaveLength(
    2,
  );
  expect(l.reviewQuestions).toHaveLength(25);
  expect(
    l.questions
      .filter((q) => q.id.includes('-q-char-'))
      .map((q) => (q.rule.kind === 'choice' ? q.rule.value : ''))
      .join(''),
  ).toBe('鸟说是春青蛙夏着皮就冬');
  expect(
    l.questions.find((q) => q.id.endsWith('-manual-write'))!.prompt,
  ).toContain('四小鸟是天');
  expect(l.questions.some((q) => q.id.endsWith('-manual-recite'))).toBe(false);
  expect(fourSeasonsPageAudit.activities).not.toContain('背诵课文');
  expect(
    l.questions.find((q) => q.id.endsWith('-manual-imitate'))!.rule.kind,
  ).toBe('manual');
  expect(
    l.questions.find((q) => q.id.endsWith('-reflect-season'))!.rule.kind,
  ).toBe('reflection');
});

it('matches season and shape conditions both ways and separates open preference, personification and contextual light tones', () => {
  const l = fourSeasonsLesson;
  expect(seasonalScenes).toEqual([
    ['草芽', '春天'],
    ['荷叶', '夏天'],
    ['谷穗', '秋天'],
    ['雪人', '冬天'],
  ]);
  expect(seasonalShapes).toEqual([
    ['草芽', '尖尖'],
    ['荷叶', '圆圆'],
    ['谷穗', '弯弯'],
  ]);
  for (const [i, [scene, season]] of seasonalScenes.entries()) {
    expect(
      l.questions.find((q) => q.id.endsWith(`-q-season-${i}`))!.rule,
    ).toEqual({ kind: 'choice', value: season });
    expect(
      l.reviewQuestions!.find((q) => q.id.endsWith(`-r-season-${i}`))!.rule,
    ).toEqual({ kind: 'choice', value: scene });
  }
  for (const [i, [scene, shape]] of seasonalShapes.entries()) {
    expect(
      l.questions.find((q) => q.id.endsWith(`-q-shape-${i}`))!.rule,
    ).toEqual({ kind: 'choice', value: shape });
    expect(
      l.reviewQuestions!.find((q) => q.id.endsWith(`-r-shape-${i}`))!.rule,
    ).toEqual({ kind: 'choice', value: scene });
  }
  expect(l.steps[4]!.text).toContain('不能理解成现实雪人真的能说话');
  expect(l.steps[5]!.text).toContain('例子不是教材原文');
  expect(
    l.questions.find((q) => q.id.endsWith('-q-sound-familiar'))!.rule,
  ).toEqual({ kind: 'choice', value: 'de' });
  expect(
    l.reviewQuestions!.find((q) => q.id.endsWith('-r-sound-familiar'))!.rule,
  ).toEqual({ kind: 'choice', value: 'zhe' });
  const all = [...l.questions, ...l.reviewQuestions!];
  expect(new Set(all.map((q) => q.id)).size).toBe(all.length);
  for (const q of all) {
    if (q.rule.kind !== 'choice') continue;
    const expected = q.rule.value;
    expect(q.choices!.filter((c) => c.id === expected)).toHaveLength(1);
    for (const c of q.choices!)
      expect(evaluate(q.rule, c.id)).toBe(c.id === expected);
    if (
      q.id.includes('-season-') ||
      q.id.includes('-shape-') ||
      q.id.includes('-snow-person')
    )
      expect(q.material).toContain('共读教材印刷第66—67页');
  }
  for (const q of l.reviewQuestions!)
    expect(
      l.questions.some(
        (m) =>
          JSON.stringify([m.prompt, m.material, m.visual]) ===
          JSON.stringify([q.prompt, q.material, q.visual]),
      ),
    ).toBe(false);
});

it('retains wrong-first snowman evidence, actual expression and ungraded reflection backups with changed review target', () => {
  const now = '2026-10-01T00:00:00.000Z';
  const s = createSession(fourSeasonsLesson, chineseBooks[0]!.id, 'child', {
    seed: 18,
    now,
  });
  s.phase = 'practice';
  for (const [i, q] of s.questions.entries()) {
    if (q.id.endsWith('-q-snow-person'))
      s.responses[i] = submitResponse(
        q,
        { ...s.responses[i]!, draft: '真的会说话的植物' },
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
            : '喜欢春天。\n下次想说风筝。';
        })(),
      },
      now,
    );
    if (q.rule.kind !== 'choice')
      expect(s.responses[i]!.submissions.at(-1)!.correct).toBeNull();
  }
  expect(s.responses.filter((r) => r.submissions.length === 2)).toHaveLength(1);
  const review = newReviewQuestions(fourSeasonsLesson, s, [s]);
  expect(review).toHaveLength(1);
  expect(review[0]!.rule).toEqual({ kind: 'choice', value: '雪人' });
  expect(evaluate(review[0]!.rule, '顽皮')).toBe(false);
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

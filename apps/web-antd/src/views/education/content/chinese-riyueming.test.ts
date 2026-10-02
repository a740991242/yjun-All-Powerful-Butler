import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { upperCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  riyuemingCompositions,
  riyuemingLesson,
  riyuemingPageAudit,
} from './chinese-riyueming';
import { upperRecognitionPacks } from './chinese-upper-recognition';

it('publishes the observed formal lesson separately from recognition history with exact character and activity scopes', () => {
  const l = riyuemingLesson;
  const lessons = chineseBooks[0]!.units.flatMap((u) => u.lessons);
  expect(lessons).toContain(l);
  expect(l.id).toBe('cu-u6-2');
  expect(lessons).toContain(upperRecognitionPacks['u6-2']);
  expect(upperRecognitionPacks['u6-2']!.id).not.toBe(l.id);
  expect(riyuemingPageAudit.pages).toEqual([74, 75]);
  expect(riyuemingPageAudit.recognize).toBe(upperCharacters['u6-2']!.recognize);
  expect(riyuemingPageAudit.write).toBe(upperCharacters['u6-2']!.write);
  for (const field of [
    'author',
    'isbn',
    'editionDate',
    'printingDate',
  ] as const)
    expect(riyuemingPageAudit[field]).toBeNull();
  expect(riyuemingPageAudit.provider).toContain('第三方');
  expect(l.steps).toHaveLength(8);
  expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(26);
  expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(7);
  expect(l.questions.filter((q) => q.rule.kind === 'reflection')).toHaveLength(
    1,
  );
  expect(
    l.questions
      .filter((q) => q.id.includes('-q-char-'))
      .map((q) => (q.rule.kind === 'choice' ? q.rule.value : ''))
      .join(''),
  ).toBe('力尖尘众双林森不条心金');
  for (const key of ['read', 'words', 'guess', 'write'])
    expect(
      l.questions.find((q) => q.id.endsWith(`-manual-${key}`))!.rule.kind,
    ).toBe('manual');
  expect(
    l.questions.find((q) => q.id.endsWith('-manual-write'))!.prompt,
  ).toContain('力男土木心');
});
it('matches eight compositions and three contextual guesses without expanding character scope or required recitation', () => {
  const l = riyuemingLesson;
  expect(riyuemingCompositions).toEqual([
    ['日＋月', '明'],
    ['田＋力', '男'],
    ['小＋大', '尖'],
    ['小＋土', '尘'],
    ['两个 人', '从'],
    ['三个 人', '众'],
    ['两个 木', '林'],
    ['三个 木', '森'],
  ]);
  for (const [i, [parts, result]] of riyuemingCompositions.entries()) {
    expect(
      l.questions.find((q) => q.id.endsWith(`-q-compose-${i}`))!.rule,
    ).toEqual({ kind: 'choice', value: result });
    expect(
      l.reviewQuestions!.find((q) => q.id.endsWith(`-r-compose-${i}`))!.rule,
    ).toEqual({ kind: 'choice', value: parts });
  }
  for (const [i, meaning] of ['眼泪', '幼小的植物', '不正或倾斜'].entries())
    expect(
      l.questions.find((q) => q.id.endsWith(`-q-guess-${i}`))!.rule,
    ).toEqual({ kind: 'choice', value: meaning });
  expect(riyuemingPageAudit.words).toEqual([
    '力气',
    '尘土',
    '双手',
    '金黄',
    '树林',
    '森林',
    '关心',
    '开心',
  ]);
  expect(riyuemingPageAudit.guessCharacters).toEqual(['泪', '苗', '歪']);
  expect(riyuemingPageAudit.compiledBy).toBe('人民教育出版社小学语文室');
  expect(l.questions.some((q) => q.id.endsWith('-manual-recite'))).toBe(false);
  expect(l.steps[1]!.text).toContain('不意味着男性才有力量');
  expect(l.steps[2]!.text).toContain('恰好三个人');
  expect(l.steps[4]!.text).toContain('不加入本课新增会认会写清单');
  expect(l.steps[5]!.text).toContain('不是泥土真的变黄金');
  const all = [...l.questions, ...l.reviewQuestions!];
  expect(new Set(all.map((q) => q.id)).size).toBe(all.length);
  for (const q of all) {
    if (q.rule.kind !== 'choice') continue;
    const value = q.rule.value;
    expect(q.choices!.filter((c) => c.id === value)).toHaveLength(1);
    for (const c of q.choices!)
      expect(evaluate(q.rule, c.id)).toBe(c.id === value);
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
it('preserves a wrong-first pair response and separate manual/reflection history through backup and changed review', () => {
  const now = '2026-10-01T00:00:00.000Z';
  const s = createSession(riyuemingLesson, chineseBooks[0]!.id, 'child', {
    seed: 18,
    now,
  });
  s.phase = 'practice';
  for (const [i, q] of s.questions.entries()) {
    if (q.id.endsWith('-q-compose-0'))
      s.responses[i] = submitResponse(
        q,
        { ...s.responses[i]!, draft: '尖' },
        now,
      );
    s.responses[i] = submitResponse(
      q,
      {
        ...s.responses[i]!,
        draft: (() => {
          if (q.rule.kind === 'choice') return q.rule.value;
          return q.rule.kind === 'manual' ? 'confirmed' : '下次想练雨字。';
        })(),
      },
      now,
    );
    if (q.rule.kind !== 'choice')
      expect(s.responses[i]!.submissions.at(-1)!.correct).toBeNull();
  }
  expect(s.responses.filter((r) => r.submissions.length === 2)).toHaveLength(1);
  const review = newReviewQuestions(riyuemingLesson, s, [s]);
  expect(review).toHaveLength(1);
  expect(review[0]!.rule).toEqual({ kind: 'choice', value: '日＋月' });
  expect(evaluate(review[0]!.rule, '明')).toBe(false);
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

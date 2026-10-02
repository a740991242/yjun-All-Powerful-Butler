import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { upperCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  twoTreasuresLesson,
  twoTreasuresPageAudit,
} from './chinese-two-treasures';

it('publishes the observed formal lesson separately from recognition history with exact character and activity scopes', () => {
  const l = twoTreasuresLesson;
  const lessons = chineseBooks[0]!.units.flatMap((u) => u.lessons);
  expect(lessons).toContain(l);
  expect(l.id).toBe('cu-u7-3');
  expect(twoTreasuresPageAudit.pages).toEqual([88, 89]);
  expect(twoTreasuresPageAudit.recognize).toBe(
    upperCharacters['u7-3']!.recognize,
  );
  expect(twoTreasuresPageAudit.write).toBe(upperCharacters['u7-3']!.write);
  for (const field of ['isbn', 'editionDate', 'printingDate'] as const)
    expect(twoTreasuresPageAudit[field]).toBeNull();
  expect(twoTreasuresPageAudit.provider).toContain('第三方');
  expect(l.steps).toHaveLength(7);
  expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(15);
  expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(7);
  expect(l.questions.filter((q) => q.rule.kind === 'reflection')).toHaveLength(
    1,
  );
  expect(
    l.questions
      .filter((q) => q.id.includes('-q-char-'))
      .map((q) => (q.rule.kind === 'choice' ? q.rule.value : ''))
      .join(''),
  ).toBe('件有和做也办到又才能');
  for (const key of ['read', 'recite', 'explain', 'try', 'talk', 'write'])
    expect(
      l.questions.find((q) => q.id.endsWith(`-manual-${key}`))!.rule.kind,
    ).toBe('manual');
  expect(
    l.questions.find((q) => q.id.endsWith('-manual-write'))!.prompt,
  ).toContain('和也又才');
});
it('keeps book-based roles, contextual sounds and original safe activity distinct', () => {
  const l = twoTreasuresLesson;
  expect(twoTreasuresPageAudit.author).toBe('陶行知');
  expect(twoTreasuresPageAudit.adapted).toBe(true);
  for (const [key, main, review] of [
    ['treasure-use', '做工', '思考'],
    ['treasures', '双手与大脑', '用手又用脑'],
    ['sound', 'hé', 'zuò'],
    ['writing-scope', '和', '才'],
    ['plan-action', '先想办法', '实际尝试'],
  ]) {
    expect(l.questions.find((q) => q.id.endsWith(`-q-${key}`))!.rule).toEqual({
      kind: 'choice',
      value: main,
    });
    expect(
      l.reviewQuestions!.find((q) => q.id.endsWith(`-r-${key}`))!.rule,
    ).toEqual({ kind: 'choice', value: review });
  }
  expect(l.steps[2]!.text).toContain('不以身体差异评价人');
  expect(l.steps[3]!.text).toContain('不是教材原题');
  expect(l.steps[3]!.text).toContain('没有唯一作品');
  expect(l.steps[5]!.text).toContain('不把朗读记录自动算背过');
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
  const s = createSession(twoTreasuresLesson, chineseBooks[0]!.id, 'child', {
    seed: 18,
    now,
  });
  s.phase = 'practice';
  for (const [i, q] of s.questions.entries()) {
    if (q.id.endsWith('-q-treasure-use'))
      s.responses[i] = submitResponse(
        q,
        { ...s.responses[i]!, draft: '不用实际尝试' },
        now,
      );
    s.responses[i] = submitResponse(
      q,
      {
        ...s.responses[i]!,
        draft: (() => {
          if (q.rule.kind === 'choice') return q.rule.value;
          return q.rule.kind === 'manual' ? 'confirmed' : '下次想练和字。';
        })(),
      },
      now,
    );
    if (q.rule.kind !== 'choice')
      expect(s.responses[i]!.submissions.at(-1)!.correct).toBeNull();
  }
  expect(s.responses.filter((r) => r.submissions.length === 2)).toHaveLength(1);
  const review = newReviewQuestions(twoTreasuresLesson, s, [s]);
  expect(review).toHaveLength(1);
  expect(review[0]!.rule).toEqual({ kind: 'choice', value: '思考' });
  expect(evaluate(review[0]!.rule, '做工')).toBe(false);
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

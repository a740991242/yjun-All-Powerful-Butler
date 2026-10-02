import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { upperCharacters } from './characters';
import { chineseBooks } from './chinese';
import { duiyunLesson, duiyunPageAudit, duiyunPairs } from './chinese-duiyun';
import { upperRecognitionPacks } from './chinese-upper-recognition';

it('publishes the observed formal lesson separately from recognition history with exact character and activity scopes', () => {
  const l = duiyunLesson;
  const lessons = chineseBooks[0]!.units.flatMap((u) => u.lessons);
  expect(lessons).toContain(l);
  expect(l.id).toBe('cu-u6-1');
  expect(lessons).toContain(upperRecognitionPacks['u6-1']);
  expect(upperRecognitionPacks['u6-1']!.id).not.toBe(l.id);
  expect(duiyunPageAudit.pages).toEqual([73]);
  expect(duiyunPageAudit.recognize).toBe(upperCharacters['u6-1']!.recognize);
  expect(duiyunPageAudit.write).toBe(upperCharacters['u6-1']!.write);
  for (const field of [
    'author',
    'isbn',
    'editionDate',
    'printingDate',
  ] as const)
    expect(duiyunPageAudit[field]).toBeNull();
  expect(duiyunPageAudit.provider).toContain('第三方');
  expect(l.steps).toHaveLength(7);
  expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(18);
  expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(6);
  expect(l.questions.filter((q) => q.rule.kind === 'reflection')).toHaveLength(
    1,
  );
  expect(
    l.questions
      .filter((q) => q.id.includes('-q-char-'))
      .map((q) => (q.rule.kind === 'choice' ? q.rule.value : ''))
      .join(''),
  ).toBe('对歌雨风虫清绿桃红');
  for (const key of ['read', 'recite', 'write'])
    expect(
      l.questions.find((q) => q.id.endsWith(`-manual-${key}`))!.rule.kind,
    ).toBe('manual');
  expect(
    l.questions.find((q) => q.id.endsWith('-manual-write'))!.prompt,
  ).toContain('云雨虫山水');
});
it('reverses each specified textual pair and validates alternatives without treating all pairs as opposites or real-world absolutes', () => {
  const l = duiyunLesson;
  expect(duiyunPairs).toEqual([
    ['云', '雨'],
    ['雪', '风'],
    ['花', '树'],
    ['鸟', '虫'],
    ['山清', '水秀'],
    ['柳绿', '桃红'],
  ]);
  for (const [i, [a, b]] of duiyunPairs.entries()) {
    const main = l.questions.find((q) => q.id.endsWith(`-q-pair-${i}`))!;
    const review = l.reviewQuestions!.find((q) =>
      q.id.endsWith(`-r-pair-${i}`),
    )!;
    expect(main.rule).toEqual({ kind: 'choice', value: b });
    expect(review.rule).toEqual({ kind: 'choice', value: a });
    expect(main.material).toContain('共读教材印刷第73页');
    expect(review.material).toContain('共读教材印刷第73页');
  }
  expect(l.steps[1]!.text).toContain('不全是严格反义词');
  expect(l.steps[2]!.text).toContain('不要求各地');
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
  const s = createSession(duiyunLesson, chineseBooks[0]!.id, 'child', {
    seed: 18,
    now,
  });
  s.phase = 'practice';
  for (const [i, q] of s.questions.entries()) {
    if (q.id.endsWith('-q-pair-0'))
      s.responses[i] = submitResponse(
        q,
        { ...s.responses[i]!, draft: '时间' },
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
  const review = newReviewQuestions(duiyunLesson, s, [s]);
  expect(review).toHaveLength(1);
  expect(review[0]!.rule).toEqual({ kind: 'choice', value: '云' });
  expect(evaluate(review[0]!.rule, '雨')).toBe(false);
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

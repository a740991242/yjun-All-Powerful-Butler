import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { chineseBooks } from './chinese';
import {
  lowerGardenOnePageAudit as a,
  lowerGardenOneLesson as l,
} from './chinese-lower-garden-one';
it('covers all five actual pages, twelve recognition and four writing characters, reused writing and distinct manual activities', () => {
  expect(
    chineseBooks[1]!.units
      .flatMap((u) => u.lessons)
      .find((x) => x.id === 'cl-u1-5'),
  ).toBe(l);
  expect(l.status).toBe('available');
  expect(a.pages).toEqual([10, 11, 12, 13, 14]);
  expect(a.recognize).toBe('识组计算减式图形卡合唱团');
  expect(a.recognize).toHaveLength(12);
  expect(a.write).toBe('文卡片合');
  expect(a.writingReuse).toBe('田四白');
  expect(a.modernAuthor).toBe('樊发稼');
  expect(a.modernAdapted).toBe(true);
  expect(a.poet).toBe('孟浩然');
  expect(a.dynasty).toBe('唐');
  expect(a.readingAuthor).toBeNull();
  for (const key of ['isbn', 'editionDate', 'printingDate'] as const)
    expect(a[key]).toBeNull();
  expect(l.steps).toHaveLength(13);
  expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(66);
  expect(l.reviewQuestions).toHaveLength(66);
  expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(13);
  expect(l.questions.filter((q) => q.rule.kind === 'reflection')).toHaveLength(
    2,
  );
  for (const key of [
    'words',
    'recognize',
    'nasal',
    'letters',
    'remember',
    'modern',
    'contrast',
    'write',
    'stroke',
    'poem',
    'request',
    'response',
    'reading',
  ])
    expect(
      l.questions.find((q) => q.id.endsWith(`-manual-${key}`))!.rule.kind,
    ).toBe('manual');
  expect(l.steps[4]!.text).toContain('不是英语字母课');
  expect(l.steps[9]!.text).toContain('合理实际表达不唯一判分');
  expect(l.steps[11]!.text).toContain('传统绕口令');
});
it('checks full alphabet in both directions and exact nasal, poem and dialogue conditions with genuine review changes', () => {
  const qs = l.questions;
  const rs = l.reviewQuestions!;
  const value = (key: string, review = false) =>
    (review ? rs : qs).find((q) =>
      q.id.endsWith(`-${review ? 'r' : 'q'}-${key}`),
    )!.rule;
  for (const [i, c] of [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].entries()) {
    expect(value(`letter-${i}`)).toEqual({ kind: 'choice', value: c });
    expect(value(`letter-${i}`, true)).toEqual({
      kind: 'choice',
      value: c.toLowerCase(),
    });
  }
  for (const [key, main, review] of [
    ['nasal-0', '见', '长'],
    ['stroke', '先外后内再封口', '封口'],
    ['poet', '孟浩然', '唐'],
    ['poem-sound', '啼鸟', '风雨声'],
    ['reading-region-0', '雪花飞舞', '大兴安岭'],
    ['help-request', '请问，可以借我一支彩笔吗？', '谢谢你！'],
    ['tongue-place', '河边', '柳'],
  ]) {
    expect(value(key!)).toEqual({ kind: 'choice', value: main });
    expect(value(key!, true)).toEqual({ kind: 'choice', value: review });
  }
  const all = [...qs, ...rs];
  expect(new Set(all.map((q) => q.id)).size).toBe(all.length);
  for (const q of all) {
    if (q.rule.kind !== 'choice') continue;
    const v = q.rule.value;
    expect(q.choices!.filter((c) => c.id === v)).toHaveLength(1);
    for (const c of q.choices!) expect(evaluate(q.rule, c.id)).toBe(c.id === v);
  }
  for (const q of rs)
    expect(
      qs.some(
        (m) =>
          JSON.stringify([m.prompt, m.material, m.visual]) ===
          JSON.stringify([q.prompt, q.material, q.visual]),
      ),
    ).toBe(false);
});
it('preserves wrong-first, separate manual and reflection through backup and changed alphabet review', () => {
  const now = '2026-10-01T00:00:00.000Z';
  const s = createSession(l, chineseBooks[1]!.id, 'child', { seed: 9, now });
  s.phase = 'practice';
  for (const [i, q] of s.questions.entries()) {
    if (q.id.endsWith('-q-letter-0'))
      s.responses[i] = submitResponse(
        q,
        { ...s.responses[i]!, draft: 'B' },
        now,
      );
    s.responses[i] = submitResponse(
      q,
      {
        ...s.responses[i]!,
        draft: (() => {
          if (q.rule.kind === 'choice') return q.rule.value;
          return q.rule.kind === 'manual' ? 'confirmed' : '下一次想再读一次。';
        })(),
      },
      now,
    );
    if (q.rule.kind !== 'choice')
      expect(s.responses[i]!.submissions.at(-1)!.correct).toBeNull();
  }
  expect(s.responses.filter((r) => r.submissions.length === 2)).toHaveLength(1);
  const review = newReviewQuestions(l, s, [s]);
  expect(review).toHaveLength(1);
  expect(review[0]!.rule).toEqual({ kind: 'choice', value: 'a' });
  expect(evaluate(review[0]!.rule, 'A')).toBe(false);
  expect(
    parseBackup(
      exportBackup({
        schemaVersion: 1,
        activeProfileId: 'child',
        profiles: [{ id: 'child', nickname: '测试', createdAt: now }],
        sessions: [s],
      }),
    ).data.sessions[0],
  ).toEqual(s);
});

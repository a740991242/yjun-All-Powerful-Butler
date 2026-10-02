import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { chineseBooks } from './chinese';
import {
  lowerHappyReadingPageAudit as a,
  lowerHappyReadingLesson as l,
} from './chinese-lower-happy-reading';
it('publishes the actual page and reading sources without inventing new writing or mandatory recitation', () => {
  expect(
    chineseBooks[1]!.units
      .flatMap((u) => u.lessons)
      .find((x) => x.id === 'cl-u1-6'),
  ).toBe(l);
  expect(l.status).toBe('available');
  expect(a.pages).toEqual([15]);
  expect(a.recognize).toBe('');
  expect(a.write).toBe('');
  expect(a.reciteRequired).toBe(false);
  expect(a.readings).toEqual([
    { title: '摇摇船', sourceKind: '传统童谣', author: null },
    { title: '小刺猬理发', sourceKind: '儿歌', author: '鲁兵' },
  ]);
  for (const key of ['isbn', 'editionDate', 'printingDate'] as const)
    expect(a[key]).toBeNull();
  expect(l.steps).toHaveLength(9);
  expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(12);
  expect(l.reviewQuestions).toHaveLength(12);
  expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(9);
  expect(l.questions.filter((q) => q.rule.kind === 'reflection')).toHaveLength(
    2,
  );
  for (const key of [
    'left',
    'right',
    'info',
    'rhythm',
    'accumulation',
    'choose',
    'read-more',
    'share',
    'listen',
  ])
    expect(
      l.questions.find((q) => q.id.endsWith(`-manual-${key}`))!.rule.kind,
    ).toBe('manual');
  expect(
    l.questions.find((q) => q.id.endsWith('-manual-read-more'))!.prompt,
  ).toContain('只选书或写计划不能确认');
  expect(l.steps[3]!.text).toContain('不要求给动物剪毛');
  expect(l.steps[5]!.text).toContain('不强制背诵固定全文');
});
it('uses original reading cards explicitly and changes actual review direction and answer', () => {
  const value = (key: string, review = false) =>
    (review ? l.reviewQuestions! : l.questions).find((q) =>
      q.id.endsWith(`-${review ? 'r' : 'q'}-${key}`),
    )!.rule;
  for (const [key, main, review] of [
    ['traditional', '传统童谣', '摇摇船'],
    ['author', '鲁兵', '小刺猬理发'],
    ['character', '小刺猬', '小娃娃'],
    ['rhythm', '轻轻', '慢慢'],
    ['reading-state', '今天读了一段', '明天想再读一段'],
    ['roles', '小禾', '小安'],
  ]) {
    expect(value(key!)).toEqual({ kind: 'choice', value: main });
    expect(value(key!, true)).toEqual({ kind: 'choice', value: review });
  }
  for (const key of ['rhythm', 'reading-state', 'roles', 'roles-next'])
    expect(
      l.questions.find((q) => q.id.endsWith(`-q-${key}`))!.material,
    ).toContain('本站原创');
  const all = [...l.questions, ...l.reviewQuestions!];
  expect(new Set(all.map((q) => q.id)).size).toBe(all.length);
  for (const q of all) {
    if (q.rule.kind !== 'choice') continue;
    const v = q.rule.value;
    expect(q.choices!.filter((c) => c.id === v)).toHaveLength(1);
    for (const c of q.choices!) expect(evaluate(q.rule, c.id)).toBe(c.id === v);
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
it('retains actual/manual, ungraded reflection and wrong-first evidence without counting a plan as completed reading', () => {
  const now = '2026-10-01T00:00:00.000Z';
  const s = createSession(l, chineseBooks[1]!.id, 'child', { seed: 19, now });
  s.phase = 'practice';
  for (const [i, q] of s.questions.entries()) {
    if (q.id.endsWith('-q-character'))
      s.responses[i] = submitResponse(
        q,
        { ...s.responses[i]!, draft: '小娃娃' },
        now,
      );
    if (q.id.endsWith('-manual-read-more')) {
      s.responses[i] = { ...s.responses[i]!, skipped: true };
      continue;
    }
    s.responses[i] = submitResponse(
      q,
      {
        ...s.responses[i]!,
        draft: (() => {
          if (q.rule.kind === 'choice') return q.rule.value;
          return q.rule.kind === 'manual'
            ? 'confirmed'
            : '下一次想再读一段，这是计划。';
        })(),
      },
      now,
    );
    if (q.rule.kind !== 'choice')
      expect(s.responses[i]!.submissions.at(-1)!.correct).toBeNull();
  }
  const r =
    s.responses[
      s.questions.findIndex((q) => q.id.endsWith('-manual-read-more'))
    ]!;
  expect(r.skipped).toBe(true);
  expect(r.submissions).toEqual([]);
  const review = newReviewQuestions(l, s, [s]);
  expect(review).toHaveLength(1);
  expect(review[0]!.rule).toEqual({ kind: 'choice', value: '小娃娃' });
  expect(evaluate(review[0]!.rule, '小刺猬')).toBe(false);
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

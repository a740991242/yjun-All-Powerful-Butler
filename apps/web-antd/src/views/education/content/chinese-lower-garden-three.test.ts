import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { lowerCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  lowerGardenThreePageAudit as a,
  lowerGardenThreeLesson as l,
} from './chinese-lower-garden-three';

it('covers five pages, nine recognized and six written characters, dictionary practice, poem, three calls and both reading pages', () => {
  expect(
    chineseBooks[1]!.units
      .flatMap((u) => u.lessons)
      .find((x) => x.id === 'cl-u3-4'),
  ).toBe(l);
  expect(a.pages).toEqual([34, 35, 36, 37, 38]);
  expect(a).toMatchObject({
    recognize: '母页止斤寸丁千全元',
    write: '止寸千斤丁元',
    poem: '赠汪伦',
    poet: '李白',
    dynasty: '唐',
    reading: '谁和谁好',
    readingAuthor: '张玉庭',
    readingAdapted: false,
    dictionaryExample: '厨',
    dictionaryInitial: 'C',
    dictionarySyllable: 'chu',
    dictionaryReading: 'chú',
  });
  expect(lowerCharacters['u3-4']!.recognize).toBe(a.recognize);
  expect([...lowerCharacters['u3-4']!.write].toSorted()).toEqual(
    [...a.write].toSorted(),
  );
  expect(lowerCharacters['u3-4']!.writeVerified).toBe(true);
  for (const k of ['isbn', 'editionDate', 'printingDate'] as const)
    expect(a[k]).toBeNull();
  expect(l.steps).toHaveLength(10);
  expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(34);
  expect(l.reviewQuestions).toHaveLength(34);
  expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(11);
  expect(l.questions.filter((q) => q.rule.kind === 'reflection')).toHaveLength(
    2,
  );
  for (const k of [
    'recognize',
    'dictionary-example',
    'dictionary-nine',
    'write',
    'poem',
    'phone-friend',
    'phone-elder',
    'phone-library',
    'reading-first',
    'reading-second',
    'exchange',
  ])
    expect(
      l.questions.find((q) => q.id.endsWith(`-manual-${k}`))?.rule,
    ).toEqual({ kind: 'manual' });
  expect(l.steps[4]!.text).toContain('不增加必做背诵');
  expect(l.steps[6]!.text).toContain('时间未给');
  expect(l.steps[7]!.text).toContain('未标有改动');
});
it('keeps unknown dictionary pages and literary imagery distinct while every review changes condition', () => {
  const val = (k: string, r = false) =>
    (r ? l.reviewQuestions! : l.questions).find((q) =>
      q.id.endsWith(`-${r ? 'r' : 'q'}-${k}`),
    )!.rule;
  for (const [k, m, n] of [
    ['dictionary-start', 'C', 'chu'],
    ['dictionary-tone', '第二声', 'chú'],
    ['dictionary-page', '字典正文对应页', '不能，需要看实际字典'],
    ['lookup-0', 'M', 'mu'],
    ['lookup-8', 'Y', 'yuan'],
    ['poet', '李白', '唐'],
    ['poem-event', '舟', '岸上'],
    ['poem-friendship', '深厚的送别情谊', '夸张'],
    ['phone-start', '主动问好', '自己是谁'],
    ['phone-purpose', '约玩的来意', '开放时间'],
    ['reading-pair-0', '瓜', '藤'],
    ['reading-pair-3', '同学', '我'],
    ['writing', '止', '元'],
  ]) {
    expect(val(k!)).toEqual({ kind: 'choice', value: m });
    expect(val(k!, true)).toEqual({ kind: 'choice', value: n });
  }
  expect(
    l.questions.find((q) => q.id.endsWith('-q-dictionary-page'))!.material,
  ).toContain('××');
  expect(
    l.questions.find((q) => q.id.endsWith('-q-phone-start'))!.material,
  ).toContain('本站原创模拟卡');
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
it('preserves first errors, actual confirmations and reflections across backup and changed dictionary review', () => {
  const now = '2026-10-01T00:00:00.000Z';
  const s = createSession(l, chineseBooks[1]!.id, 'child', { seed: 5, now });
  s.phase = 'practice';
  for (const [i, q] of s.questions.entries()) {
    if (q.id.endsWith('-q-dictionary-start')) {
      s.responses[i] = submitResponse(
        q,
        { ...s.responses[i]!, draft: 'chu' },
        now,
      );
      expect(s.responses[i]!.submissions.at(-1)!.correct).toBe(false);
    }
    s.responses[i] = submitResponse(
      q,
      {
        ...s.responses[i]!,
        draft: (() => {
          if (q.rule.kind === 'choice') return q.rule.value;
          return q.rule.kind === 'manual'
            ? 'confirmed'
            : '下一次还想读一段，是未来计划。';
        })(),
      },
      now,
    );
    if (q.rule.kind !== 'choice')
      expect(s.responses[i]!.submissions.at(-1)!.correct).toBeNull();
  }
  const rs = newReviewQuestions(l, s, [s]);
  expect(rs).toHaveLength(1);
  expect(rs[0]!.rule).toEqual({ kind: 'choice', value: 'chu' });
  expect(evaluate(rs[0]!.rule, 'C')).toBe(false);
  expect(s.responses.filter((r) => r.submissions.length === 2)).toHaveLength(1);
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

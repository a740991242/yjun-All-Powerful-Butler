import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { lowerCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  lowerGardenFourPageAudit as a,
  lowerGardenFourLesson as l,
} from './chinese-lower-garden-four';

it('covers four pages with ten recognized and four written characters and all word, sound, writing and reading activities', () => {
  expect(
    chineseBooks[1]!.units
      .flatMap((u) => u.lessons)
      .find((x) => x.id === 'cl-u4-4'),
  ).toBe(l);
  expect(a.pages).toEqual([44, 45, 46, 47]);
  expect(l.goal).toContain('认十字写四字');
  expect(l.goal).toContain('七量词');
  expect(l.goal).not.toContain('模拟电话');
  expect(l.goal).not.toContain('音序查字');
  expect(a.recognize).toBe('册支台电视部机衣裤被');
  expect(a.write).toBe('册电支衣');
  expect(lowerCharacters['u4-4']!.recognize).toBe(a.recognize);
  expect([...lowerCharacters['u4-4']!.write].toSorted()).toEqual(
    [...a.write].toSorted(),
  );
  expect(a.measurePhrases).toEqual([
    '一册书',
    '一支铅笔',
    '一台电视',
    '一部手机',
    '一件上衣',
    '一条裤子',
    '一床棉被',
  ]);
  expect(a.lightWords).toEqual([
    '胆子',
    '样子',
    '粽子',
    '爸爸',
    '妈妈',
    '哥哥',
    '眼睛',
    '喜欢',
    '故事',
  ]);
  expect(a.pinyinExamples).toEqual(['yuán', 'zhuàng', 'biāo diǎn']);
  expect(a.writingReuse).toBe('床间书我');
  expect(a.idioms).toHaveLength(8);
  expect(a).toMatchObject({
    newRadicals: ['衣字旁'],
    reading: '胖乎乎的小手',
    readingAuthor: '望安',
    readingAdapted: true,
  });
  for (const key of ['isbn', 'editionDate', 'printingDate'] as const)
    expect(a[key]).toBeNull();
  expect(l.steps).toHaveLength(10);
  expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(43);
  expect(l.reviewQuestions).toHaveLength(43);
  expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(11);
  expect(l.questions.filter((q) => q.rule.kind === 'reflection')).toHaveLength(
    2,
  );
  for (const key of [
    'recognize',
    'measure',
    'light',
    'pinyin',
    'dot',
    'write',
    'radical',
    'idioms',
    'reading-first',
    'reading-second',
    'exchange',
  ])
    expect(
      l.questions.find((q) => q.id.endsWith(`-manual-${key}`))!.rule,
    ).toEqual({ kind: 'manual' });
  expect(l.steps[4]!.text).toContain('四字复用不加新增写字清单');
});
it('distinguishes constrained measure examples, neutral-tone contexts, dot positions and future wishes in changed reviews', () => {
  const value = (k: string, r = false) =>
    (r ? l.reviewQuestions! : l.questions).find((q) =>
      q.id.endsWith(`-${r ? 'r' : 'q'}-${k}`),
    )!.rule;
  for (const [k, m, n] of [
    ['measure-0', '册', '书'],
    ['measure-6', '床', '棉被'],
    ['light-0', '子', '胆'],
    ['light-3', '爸', '相同'],
    ['light-8', '事', '故'],
    ['radical', '衣字旁', '裤'],
    ['pinyin-tone', '第二声', '第四声'],
    ['pinyin-count', '两个', '第三声'],
    ['dot-first', '先写点', '后写点'],
    ['dot-reuse', '床', '书'],
    ['idiom-4', '一起用心合作', '同心协力'],
    ['reading-help', '拖鞋', '手绢'],
    ['reading-grandma', '挠痒痒', '未来愿望'],
    ['writing', '册', '衣'],
  ]) {
    expect(value(k!)).toEqual({ kind: 'choice', value: m });
    expect(value(k!, true)).toEqual({ kind: 'choice', value: n });
  }
  expect(
    l.questions.find((q) => q.id.endsWith('-q-idiom-0'))!.material,
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
it('preserves first errors, actual confirmations and reflections across backup and changed measure review', () => {
  const now = '2026-10-01T00:00:00.000Z';
  const s = createSession(l, chineseBooks[1]!.id, 'child', { seed: 5, now });
  s.phase = 'practice';
  for (const [i, q] of s.questions.entries()) {
    if (q.id.endsWith('-q-measure-0')) {
      s.responses[i] = submitResponse(
        q,
        { ...s.responses[i]!, draft: '书' },
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
  expect(rs[0]!.rule).toEqual({ kind: 'choice', value: '书' });
  expect(evaluate(rs[0]!.rule, '册')).toBe(false);
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

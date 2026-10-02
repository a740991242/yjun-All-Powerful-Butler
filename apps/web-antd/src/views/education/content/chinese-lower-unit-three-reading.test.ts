import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { lowerCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  lowerUnitThreeReadingPageAudits as audits,
  lowerUnitThreeReadingLessons as lessons,
  lowerUnitThreeReadingSource as source,
} from './chinese-lower-unit-three-reading';

it('covers actual page ranges, distinct author credits, exact new and familiar character scopes, writing and manual activities', () => {
  for (const [
    item,
    pages,
    recognize,
    write,
    author,
    radicals,
    additional,
    steps,
    objective,
    manual,
  ] of [
    [
      'u3-1',
      [26, 27, 28],
      '玩得急直哭跟忽然听喊快己背',
      '走说自河让己',
      null,
      ['王字旁', '双人旁', '足字旁'],
      '',
      8,
      22,
      8,
    ],
    [
      'u3-2',
      [29, 30],
      '很孤单种每都邻居叫招呼乐',
      '从们他好叫回',
      '金波',
      ['尸字头'],
      '只',
      8,
      27,
      8,
    ],
    [
      'u3-3',
      [31, 32, 33],
      '怎独跳绳当还羽球劲轮排',
      '快当画乐书毛',
      '任溶溶',
      ['车字旁'],
      '乐得',
      9,
      24,
      9,
    ],
  ] as const) {
    const l = lessons[item]!;
    expect(
      chineseBooks[1]!.units
        .flatMap((u) => u.lessons)
        .find((x) => x.id === `cl-${item}`),
    ).toBe(l);
    expect(l.status).toBe('available');
    expect(audits.find((a) => a.itemId === item)).toMatchObject({
      pages,
      recognize,
      write,
      author,
      newRadicals: radicals,
      additionalReadings: additional,
      reciteRequired: false,
    });
    expect(lowerCharacters[item]).toMatchObject({
      recognize,
      write,
      writeVerified: true,
    });
    expect(l.steps).toHaveLength(steps);
    expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(
      objective,
    );
    expect(l.reviewQuestions).toHaveLength(objective);
    expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
      manual,
    );
    expect(
      l.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(2);
    expect(
      l.questions
        .filter((q) => q.id.includes('-q-char-'))
        .map((q) => (q.rule.kind === 'choice' ? q.rule.value : ''))
        .join(''),
    ).toBe(recognize);
    expect(l.questions.some((q) => q.id.endsWith('-manual-recite'))).toBe(
      false,
    );
  }
  expect(audits[0]!.sourceCredit).toContain('语文第一册');
  for (const key of ['isbn', 'editionDate', 'printingDate'] as const)
    expect(source[key]).toBeNull();
});
it('changes specified conditions and answer roles in source comprehension, sentence modifiers, repeated word shapes and context readings', () => {
  for (const [item, key, main, review] of [
    ['u3-1', 'grass', '小公鸡', '小鸭子'],
    ['u3-1', 'modifier', '偷偷地', '飞快地'],
    ['u3-1', 'radical-2', '足字旁', '跟'],
    ['u3-2', 'change', '邻居', '快乐'],
    ['u3-2', 'time', '天亮', '天黑'],
    ['u3-2', 'radical', '尸字头', '居'],
    ['u3-2', 'familiar-reading', 'zhǐ', 'zhī'],
    ['u3-2', 'word-6', '叽', '喳'],
    ['u3-2', 'aabb', 'AABB', '开开心心'],
    ['u3-3', 'turn', '甩绳子', '轮流跳'],
    ['u3-3', 'music-reading', 'yuè', 'lè'],
    ['u3-3', 'need-reading', 'děi', 'dé'],
    ['u3-3', 'phrase-0', '跳', '绳'],
    ['u3-3', 'phrase-5', '玩', '游戏'],
    ['u3-3', 'radical', '车字旁', '轮'],
  ]) {
    const l = lessons[item!]!;
    const q = l.questions.find((q) => q.id.endsWith(`-q-${key}`))!;
    const r = l.reviewQuestions!.find((q) => q.id.endsWith(`-r-${key}`))!;
    expect(evaluate(q.rule, main!)).toBe(true);
    expect(evaluate(r.rule, review!)).toBe(true);
    expect(evaluate(r.rule, main!)).toBe(false);
  }
  expect(
    lessons['u3-2']!.questions.find((q) => q.id.endsWith('-q-aabb'))!.material,
  ).toContain('本站原创');
  expect(lessons['u3-1']!.steps[3]!.text).toContain('不要求实际抓虫、下水');
  expect(lessons['u3-2']!.steps[4]!.text).toContain('不以重读哪个词唯一判声音');
  expect(lessons['u3-3']!.steps[4]!.text).toContain('不等于必须大喊');
  for (const l of Object.values(lessons)) {
    const all = [...l.questions, ...l.reviewQuestions!];
    expect(new Set(all.map((q) => q.id)).size).toBe(all.length);
    for (const q of all) {
      if (q.rule.kind !== 'choice') continue;
      const correct = q.rule.value;
      expect(q.choices!.filter((c) => c.id === correct)).toHaveLength(1);
      for (const c of q.choices!)
        expect(evaluate(q.rule, c.id)).toBe(c.id === correct);
    }
    for (const r of l.reviewQuestions!)
      expect(
        l.questions.some(
          (q) =>
            JSON.stringify([q.prompt, q.material, q.visual]) ===
            JSON.stringify([r.prompt, r.material, r.visual]),
        ),
      ).toBe(false);
  }
});
it.each([
  ['u3-1', 'grass', '小鸭子'],
  ['u3-2', 'change', '快乐'],
  ['u3-3', 'turn', '轮流跳'],
] as const)(
  'keeps wrong-first, manual and reflection evidence in backup and selective changed review %s',
  (item, key, next) => {
    const l = lessons[item]!;
    const now = '2026-10-01T00:00:00.000Z';
    const s = createSession(l, chineseBooks[1]!.id, 'child', { seed: 17, now });
    s.phase = 'practice';
    let old = '';
    for (const [i, q] of s.questions.entries()) {
      if (q.id.endsWith(`-q-${key}`) && q.rule.kind === 'choice') {
        old = q.rule.value;
        s.responses[i] = submitResponse(
          q,
          {
            ...s.responses[i]!,
            draft: q.choices!.find((c) => c.id !== old)!.id,
          },
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
              : '下一次想再读一组词，这是未来计划。';
          })(),
        },
        now,
      );
      if (q.rule.kind !== 'choice')
        expect(s.responses[i]!.submissions.at(-1)!.correct).toBeNull();
    }
    expect(s.responses.filter((r) => r.submissions.length === 2)).toHaveLength(
      1,
    );
    const rs = newReviewQuestions(l, s, [s]);
    expect(rs).toHaveLength(1);
    expect(rs[0]!.rule).toEqual({ kind: 'choice', value: next });
    expect(evaluate(rs[0]!.rule, old)).toBe(false);
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
  },
);

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { lowerCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  lowerUnitFourReadingPageAudits as audits,
  lowerUnitFourReadingLessons as lessons,
  lowerUnitFourReadingSource as source,
} from './chinese-lower-unit-four-reading';

it('checks all three actual reading scopes and preserves the required recitation only for the ancient poem', () => {
  for (const [
    id,
    pages,
    rec,
    write,
    author,
    rad,
    extra,
    n,
    m,
    steps,
    recite,
  ] of [
    [
      'u4-1',
      [39],
      '静思床疑举望低故',
      '思前故床地乡',
      '李白',
      [],
      '',
      14,
      5,
      6,
      true,
    ],
    [
      'u4-2',
      [40, 41],
      '胆敢勇讲窗乱拉样笑再睡觉',
      '色讲笑把样再',
      '柯岩',
      ['提手旁'],
      '',
      29,
      7,
      7,
      false,
    ],
    [
      'u4-3',
      [42, 43],
      '端粽节总煮盼米枣甜分鲜肉',
      '节间吃米分肉',
      '屠再华',
      ['米字旁'],
      '了liǎo',
      19,
      9,
      8,
      false,
    ],
  ] as const) {
    const l = lessons[id]!;
    expect(
      chineseBooks[1]!.units
        .flatMap((u) => u.lessons)
        .find((x) => x.id === `cl-${id}`),
    ).toBe(l);
    expect(audits.find((a) => a.itemId === id)).toMatchObject({
      pages,
      recognize: rec,
      write,
      author,
      newRadicals: rad,
      additionalReadings: extra,
      reciteRequired: recite,
    });
    expect(lowerCharacters[id]!.recognize).toBe(rec);
    expect([...lowerCharacters[id]!.write].toSorted()).toEqual(
      [...write].toSorted(),
    );
    expect(lowerCharacters[id]!.writeVerified).toBe(true);
    expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(n);
    expect(l.reviewQuestions).toHaveLength(n);
    expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(m);
    expect(
      l.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(2);
    expect(l.steps).toHaveLength(steps);
    expect(l.questions.some((q) => q.id.endsWith('-manual-recite'))).toBe(
      recite,
    );
  }
  for (const k of ['isbn', 'editionDate', 'printingDate'] as const)
    expect(source[k]).toBeNull();
  for (const word of [
    '胆子',
    '胆量',
    '大胆',
    '勇敢',
    '勇气',
    '勇士',
    '样子',
    '一样',
    '花样',
    '再见',
    '再三',
    '再次',
  ]) {
    expect(lessons['u4-2']!.steps[3]!.text).toContain(word);
  }
  expect(
    lessons['u4-3']!.questions.find((q) => q.id.endsWith('-manual-extension'))!
      .prompt,
  ).toContain('选做');
});
it('changes roles, word positions and familiar readings in every review without rewriting literary facts', () => {
  for (const [item, key, main, next] of [
    ['u4-1', 'light', '明月', '地上霜'],
    ['u4-1', 'action', '举头', '低头'],
    ['u4-1', 'sequence', '之前', '之后'],
    ['u4-2', 'helpers', '妈妈', '爸爸'],
    ['u4-2', 'word-11', '再', '次'],
    ['u4-2', 'radical', '提手旁', '拉'],
    ['u4-3', 'reading', 'liǎo', 'le'],
    ['u4-3', 'sharing', '邻居', '传说'],
    ['u4-3', 'radical', '米字旁', '粽'],
  ]) {
    const l = lessons[item!]!;
    const q = l.questions.find((q) => q.id.endsWith(`-q-${key}`))!;
    const n = l.reviewQuestions!.find((q) => q.id.endsWith(`-r-${key}`))!;
    expect(evaluate(q.rule, main!)).toBe(true);
    expect(evaluate(n.rule, next!)).toBe(true);
    expect(evaluate(n.rule, main!)).toBe(false);
  }
  expect(
    lessons['u4-1']!.questions.find((q) => q.id.endsWith('-q-light'))!.material,
  ).toBe('床前明月光，疑是地上霜。\n举头望明月，低头思故乡。');
  for (const l of Object.values(lessons)) {
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
  }
});
it.each([
  ['u4-1', 'action', '低头'],
  ['u4-2', 'helpers', '爸爸'],
  ['u4-3', 'reading', 'le'],
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

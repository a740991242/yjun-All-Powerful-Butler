import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { lowerCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  lowerLastStoriesPageAudits as audits,
  lowerLastStoriesLessons as lessons,
  lowerLastStoriesSource as source,
} from './chinese-lower-last-stories';

for (const [
  id,
  pages,
  recognize,
  write,
  author,
  radical,
  additional,
  steps,
  objective,
  manual,
] of [
  [
    'u8-2',
    [102, 103, 104],
    '咕咚熟掉湖吓啦鹿象野拦哪那领',
    '吓怕象到为家没',
    null,
    '页字旁',
    '',
    9,
    24,
    12,
  ],
  [
    'u8-3',
    [105, 106, 107, 108],
    '壁借咬难爬您拨赶摆过孩转',
    '向行赶找边草过',
    '林颂英',
    '走字底',
    '哪na',
    10,
    25,
    14,
  ],
] as const) {
  it(`${id} matches source page ranges, character lists and independent actual activities`, () => {
    const a = audits.find((x) => x.itemId === id)!;
    const l = lessons[id]!;
    expect(a).toMatchObject({
      pages: [...pages],
      recognize,
      write,
      author,
      newRadicals: [radical],
      additionalReadings: additional,
      reciteRequired: false,
    });
    expect(a.sourceCredit).toContain('有改动');
    expect(lowerCharacters[id]!.recognize).toBe(recognize);
    expect([...lowerCharacters[id]!.write].toSorted()).toEqual(
      [...write].toSorted(),
    );
    expect(
      chineseBooks[1]!.units
        .flatMap((u) => u.lessons)
        .find((x) => x.id === `cl-${id}`),
    ).toBe(l);
    expect(source).toMatchObject({
      isbn: null,
      editionDate: null,
      printingDate: null,
      checkedAt: '2026-10-01',
    });
    expect(l.steps).toHaveLength(steps);
    expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(
      objective,
    );
    expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
      manual,
    );
    expect(
      l.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(2);
    for (const key of [
      'read-first',
      'read-second',
      'read-third',
      'write',
      'exchange',
    ])
      expect(
        l.questions.find((q) => q.id.endsWith(`-manual-${key}`))!.rule,
      ).toEqual({ kind: 'manual' });
    expect(l.questions.some((q) => q.id.includes('recite'))).toBe(false);
  });
}
it('separates heard information from seeing, and keeps folk-story arranger and picture-based literacy accurate', () => {
  const l = lessons['u8-2']!;
  const text = l.steps
    .map((s) => `${s.title} ${s.text} ${s.activity}`)
    .join('\n');
  for (const t of [
    '民间故事',
    '王沂暖整理',
    '另一个木瓜',
    '借助图画认字',
    '交流自己的方法',
    '为什么跟着兔子跑',
    '没有必背',
    '不要求到湖边',
  ])
    expect(text).toContain(t);
  for (const [key, value, next] of [
    ['evidence', '听到声音', '没有看见'],
    ['bull', '野牛', '兔子'],
    ['radical', '页字旁', '页'],
    ['source', '整理者', '民间故事'],
  ]) {
    expect(l.questions.find((q) => q.id.endsWith(`-q-${key}`))!.rule).toEqual({
      kind: 'choice',
      value,
    });
    expect(
      l.reviewQuestions!.find((q) => q.id.endsWith(`-r-${key}`))!.rule,
    ).toEqual({ kind: 'choice', value: next });
  }
  for (const key of ['picture', 'picture-exchange', 'read', 'why', 'bull'])
    expect(
      l.questions.find((q) => q.id.endsWith(`-manual-${key}`))!.rule,
    ).toEqual({ kind: 'manual' });
});
it('keeps twelve new characters, alternate na, three distinct tail uses and actual guess/role activities', () => {
  const l = lessons['u8-3']!;
  const a = audits.find((x) => x.itemId === 'u8-3')!;
  expect(a.recognize).not.toContain('哪');
  expect(a.recognize).toContain('过');
  expect(a.recognize).not.toContain('这');
  const text = l.steps
    .map((s) => `${s.title} ${s.text} ${s.activity}`)
    .join('\n');
  for (const t of [
    '走字底',
    '猜读音及意思',
    '怎样猜',
    '带问号',
    '小鱼—拨水',
    '老牛—赶蝇子',
    '燕子—掌握方向',
    '选做',
    '不是向妈妈借来的',
    '不把故事省略的时间当立即再生',
    '没有必背',
  ])
    expect(text).toContain(t);
  for (const [key, value, next] of [
    ['borrow', '小鱼', '自己长出新尾巴'],
    ['use-0', '拨水', '小鱼'],
    ['use-1', '赶蝇子', '老牛'],
    ['use-2', '掌握方向', '燕子'],
    ['radical', '走字底', '走'],
    ['reading', 'na', 'nǎ'],
  ]) {
    expect(l.questions.find((q) => q.id.endsWith(`-q-${key}`))!.rule).toEqual({
      kind: 'choice',
      value,
    });
    expect(
      l.reviewQuestions!.find((q) => q.id.endsWith(`-r-${key}`))!.rule,
    ).toEqual({ kind: 'choice', value: next });
  }
  for (const key of [
    'reading',
    'guess',
    'guess-exchange',
    'roles',
    'questions',
    'retell',
    'other-tail',
  ])
    expect(
      l.questions.find((q) => q.id.endsWith(`-manual-${key}`))!.rule,
    ).toEqual({ kind: 'manual' });
});
for (const [id, key, oldAnswer, newAnswer] of [
  ['u8-2', 'bull', '野牛', '兔子'],
  ['u8-3', 'borrow', '小鱼', '自己长出新尾巴'],
]) {
  it(`${id} preserves actual/reflection evidence and first errors through backup; changes the targeted review condition`, () => {
    const l = lessons[id!]!;
    const now = '2026-10-01T00:00:00.000Z';
    const all = [...l.questions, ...l.reviewQuestions!];
    expect(new Set(all.map((q) => q.id)).size).toBe(all.length);
    for (const q of all) {
      if (q.rule.kind !== 'choice') continue;
      const v = q.rule.value;
      expect(q.choices!.filter((c) => c.id === v)).toHaveLength(1);
      for (const c of q.choices!)
        expect(evaluate(q.rule, c.id)).toBe(c.id === v);
    }
    for (const q of l.reviewQuestions!)
      expect(
        l.questions.some(
          (m) =>
            JSON.stringify([m.prompt, m.material, m.visual]) ===
            JSON.stringify([q.prompt, q.material, q.visual]),
        ),
      ).toBe(false);
    const s = createSession(l, chineseBooks[1]!.id, 'child', { seed: 9, now });
    s.phase = 'practice';
    for (const [i, q] of s.questions.entries()) {
      if (q.id.endsWith(`-q-${key}`)) {
        s.responses[i] = submitResponse(
          q,
          { ...s.responses[i]!, draft: newAnswer! },
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
              : '下一次再读，这是计划。';
          })(),
        },
        now,
      );
      if (q.rule.kind !== 'choice')
        expect(s.responses[i]!.submissions.at(-1)!.correct).toBeNull();
    }
    const r = newReviewQuestions(l, s, [s]);
    expect(r).toHaveLength(1);
    expect(r[0]!.rule).toEqual({ kind: 'choice', value: newAnswer });
    expect(evaluate(r[0]!.rule, oldAnswer!)).toBe(false);
    expect(s.responses.filter((r) => r.submissions.length === 2)).toHaveLength(
      1,
    );
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
}

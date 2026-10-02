import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { lowerCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  lowerGardenFivePageAudit as a,
  lowerGardenFiveLesson as l,
} from './chinese-lower-garden-five';

it('covers all five pages with nine recognized and two written characters, family, dictionary, games and both shared-reading pages', () => {
  expect(
    chineseBooks[1]!.units
      .flatMap((u) => u.lessons)
      .find((x) => x.id === 'cl-u5-5'),
  ).toBe(l);
  expect(a.pages).toEqual([56, 57, 58, 59, 60]);
  expect(a.recognize).toBe('饭饱茶泡轻穿袍鞭炮');
  expect(a.write).toBe('饱抱');
  expect(lowerCharacters['u5-5']!.recognize).toBe(a.recognize);
  expect([...lowerCharacters['u5-5']!.write].toSorted()).toEqual(
    [...a.write].toSorted(),
  );
  expect(a.newRadicals).toEqual(['食字旁', '火字旁']);
  expect(a.family.map((x) => x[1])).toEqual([
    '饱',
    '泡',
    '跑',
    '抱',
    '袍',
    '炮',
  ]);
  expect(a.fillPairs).toEqual(['青清', '再在']);
  expect(a.groups).toEqual({
    口字旁: '吃叫吹唱',
    提手旁: '抱拔捉拍',
    足字旁: '跑跳踢跟',
  });
  expect(a.dictionary).toEqual([
    ['溪', 'xī', 'X', 'xi'],
    ['解', 'jiě', 'J', 'jie'],
    ['准', 'zhǔn', 'Z', 'zhun'],
    ['楼', 'lóu', 'L', 'lou'],
    ['伯', 'bó', 'B', 'bo'],
  ]);
  expect(a.sayings).toEqual([
    ['芝麻开花', '节节高'],
    ['竹篮打水', '一场空'],
    ['十五个吊桶打水', '七上八下'],
  ]);
  expect(a).toMatchObject({
    reading: '孙悟空打妖怪',
    readingAuthor: '樊家信',
    readingAdapted: true,
    game: '一起做游戏',
  });
  for (const key of ['isbn', 'editionDate', 'printingDate'] as const)
    expect(a[key]).toBeNull();
  expect(l.steps).toHaveLength(11);
  expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(35);
  expect(l.reviewQuestions).toHaveLength(35);
  expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(13);
  expect(l.questions.filter((q) => q.rule.kind === 'reflection')).toHaveLength(
    2,
  );
  for (const key of [
    'recognize',
    'family',
    'fill',
    'groups',
    'dictionary',
    'sayings',
    'invite',
    'explain',
    'write',
    'radical',
    'reading-first',
    'reading-second',
    'exchange',
  ])
    expect(
      l.questions.find((q) => q.id.endsWith(`-manual-${key}`))!.rule,
    ).toEqual({ kind: 'manual' });
  expect(l.goal).toContain('认九字写两字');
  expect(l.goal).toContain('音序查字');
  expect(l.goal).not.toContain('读轻声');
  expect(l.steps[4]!.text).toContain('不预填统一页码');
  expect(l.steps[7]!.text).toContain('本站可选原创示例');
  expect(l.steps[9]!.activity).toContain('第59页');
  expect(l.steps[10]!.activity).toContain('第60页');
});
it('distinguishes word families, meaning-based fills, dictionary steps, games and shared-reading roles in changed reviews', () => {
  const value = (k: string, r = false) =>
    (r ? l.reviewQuestions! : l.questions).find((q) =>
      q.id.endsWith(`-${r ? 'r' : 'q'}-${k}`),
    )!.rule;
  for (const [k, m, n] of [
    ['family-0', '食字旁', '饱'],
    ['family-5', '火字旁', '炮'],
    ['fill-color', '青', '清'],
    ['fill-place', '在', '再'],
    ['group-0', '口字旁', '吃叫吹唱'],
    ['group-2', '足字旁', '跑跳踢跟'],
    ['dictionary-0', 'X', 'xi'],
    ['dictionary-1', 'J', 'jie'],
    ['dictionary-4', 'B', 'bo'],
    ['saying-2', '七上八下', '十五个吊桶打水'],
    ['invite', '说明玩法', '主动邀请'],
    ['explain', '边说边做动作', '让伙伴理解玩法'],
    ['reading-order', '孙悟空', '猪八戒'],
    ['reading-next', '沙和尚', '老妖婆'],
    ['reading-deceived', '唐僧和八戒', '悟空'],
    ['radical', '炮', '食字旁'],
    ['writing', '饱', '抱'],
  ]) {
    expect(value(k!)).toEqual({ kind: 'choice', value: m });
    expect(value(k!, true)).toEqual({ kind: 'choice', value: n });
  }
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
it('preserves first errors, actual confirmations and reflections across backup and changed word-family review', () => {
  const now = '2026-10-01T00:00:00.000Z';
  const s = createSession(l, chineseBooks[1]!.id, 'child', { seed: 5, now });
  s.phase = 'practice';
  for (const [i, q] of s.questions.entries()) {
    if (q.id.endsWith('-q-family-0')) {
      s.responses[i] = submitResponse(
        q,
        { ...s.responses[i]!, draft: '饱' },
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
  expect(rs[0]!.rule).toEqual({ kind: 'choice', value: '饱' });
  expect(evaluate(rs[0]!.rule, '食字旁')).toBe(false);
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

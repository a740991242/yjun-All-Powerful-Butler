import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { lowerCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  lowerGardenSixPageAudit as a,
  lowerGardenSixLesson as l,
} from './chinese-lower-garden-six';
import { lowerRecognitionPacks } from './chinese-lower-recognition';

it('covers the five original pages including all three shared-reading pages and the actual final-sentence copy', () => {
  expect(
    chineseBooks[1]!.units
      .flatMap((u) => u.lessons)
      .find((x) => x.id === 'cl-u6-5'),
  ).toBe(l);
  for (const old of Object.values(lowerRecognitionPacks))
    expect(chineseBooks[1]!.units.flatMap((u) => u.lessons)).toContain(old);
  expect(a.pages).toEqual([73, 74, 75, 76, 77]);
  expect(a.recognize).toBe('棍豆汤蚊扇椅牵织斗');
  expect(a.write).toBe('豆斗');
  expect(lowerCharacters['u6-5']!.recognize).toBe(a.recognize);
  expect(lowerCharacters['u6-5']!.write).toBe(a.write);
  expect(a.newRadicals).toEqual(['大字头']);
  expect(a.radicalExample).toBe('牵');
  expect(a.words).toEqual([
    '冰棍',
    '西瓜',
    '绿豆汤',
    '凉席',
    '蚊香',
    '花露水',
    '蒲扇',
    '竹椅',
    '萤火虫',
    '牵牛',
    '织女',
    '北斗星',
  ]);
  expect(a.punctuation).toEqual(['！', '？', '。', '，', '。']);
  expect(a.packagingWords).toEqual(['饼干', '牛奶', '巧克力', '面包']);
  expect(a.packagingExample).toBe('保质期：3天');
  expect(a.sayings).toEqual([
    ['朝霞不出门', '晚霞行千里'],
    ['有雨山戴帽', '无雨半山腰'],
    ['早晨下雨当日晴', '晚上下雨到天明'],
    ['蚂蚁搬家蛇过道', '大雨不久要来到'],
  ]);
  expect(a).toMatchObject({
    reading: '夏夜多美',
    readingAuthor: '彭万洲',
    readingAdapted: true,
    readingPages: [75, 76, 77],
    isbn: null,
    editionDate: null,
    printingDate: null,
  });
  expect(l.goal).toContain('三页共读');
  expect(l.goal).toContain('标点抄写');
  expect(l.goal).not.toContain('查字');
  expect(l.steps).toHaveLength(12);
  expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(41);
  expect(l.reviewQuestions).toHaveLength(41);
  expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(14);
  expect(l.questions.filter((q) => q.rule.kind === 'reflection')).toHaveLength(
    2,
  );
  for (const key of [
    'recognize',
    'words',
    'rabbit',
    'duck',
    'punctuation',
    'copy',
    'packaging',
    'sayings',
    'write',
    'radical',
    'reading-first',
    'reading-second',
    'reading-third',
    'exchange',
  ])
    expect(
      l.questions.find((q) => q.id.endsWith(`-manual-${key}`))!.rule,
    ).toEqual({ kind: 'manual' });
  expect(l.steps[5]!.text).toContain('实际纸面抄写');
  expect(l.steps[6]!.text).toContain('3天只是原图示例');
  expect(l.steps[7]!.text).toContain('不是实时天气预报');
  expect(l.steps[9]!.activity).toContain('第75页');
  expect(l.steps[10]!.activity).toContain('第76页');
  expect(l.steps[11]!.activity).toContain('第77页');
  expect(l.steps[8]!.visual).toMatchObject({ characters: ['豆', '斗'] });
});
it('separates expansion meanings, five punctuation positions, package examples and the helping roles in changed reviews', () => {
  const value = (k: string, r = false) =>
    (r ? l.reviewQuestions! : l.questions).find((q) =>
      q.id.endsWith(`-${r ? 'r' : 'q'}-${k}`),
    )!.rule;
  for (const [k, m, n] of [
    ['expansion-place', '地点', '动作姿态'],
    ['expansion-order', '谁做什么', '按意思合理仿说'],
    ['punct-0', '！', '？'],
    ['punct-1', '？', '。'],
    ['punct-2', '。', '，'],
    ['punct-3', '，', '。'],
    ['punct-4', '。', '！'],
    ['package-word', '牛奶', '饼干'],
    ['package-example', '保质期说明', '不能，只是原图示例'],
    ['reading-roles-0', '睡莲', '蜻蜓'],
    ['reading-roles-1', '萤火虫', '小蚂蚁'],
    ['reading-wish', '回家', '让它爬上来'],
    ['radical', '大字头', '牵'],
    ['writing', '豆', '斗'],
  ]) {
    expect(value(k!)).toEqual({ kind: 'choice', value: m });
    expect(value(k!, true)).toEqual({ kind: 'choice', value: n });
  }
  for (const q of l.reviewQuestions!)
    expect(
      l.questions.some(
        (m) =>
          JSON.stringify([m.prompt, m.material, m.visual]) ===
          JSON.stringify([q.prompt, q.material, q.visual]),
      ),
    ).toBe(false);
  const all = [...l.questions, ...l.reviewQuestions!];
  expect(new Set(all.map((q) => q.id)).size).toBe(all.length);
  for (const q of all) {
    if (q.rule.kind !== 'choice') continue;
    const v = q.rule.value;
    expect(q.choices!.filter((c) => c.id === v)).toHaveLength(1);
    for (const c of q.choices!) expect(evaluate(q.rule, c.id)).toBe(c.id === v);
  }
});
it('preserves first errors and actual/reflection evidence across backup, with one new role question rejecting the old answer', () => {
  const now = '2026-10-01T00:00:00.000Z';
  const s = createSession(l, chineseBooks[1]!.id, 'child', { seed: 11, now });
  s.phase = 'practice';
  for (const [i, q] of s.questions.entries()) {
    if (q.id.endsWith('-q-reading-roles-0')) {
      s.responses[i] = submitResponse(
        q,
        { ...s.responses[i]!, draft: '蜻蜓' },
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
            : '下一次想再读一页，这是计划。';
        })(),
      },
      now,
    );
    if (q.rule.kind !== 'choice')
      expect(s.responses[i]!.submissions.at(-1)!.correct).toBeNull();
  }
  const r = newReviewQuestions(l, s, [s]);
  expect(r).toHaveLength(1);
  expect(r[0]!.rule).toEqual({ kind: 'choice', value: '蜻蜓' });
  expect(evaluate(r[0]!.rule, '睡莲')).toBe(false);
  expect(s.responses.filter((x) => x.submissions.length === 2)).toHaveLength(1);
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

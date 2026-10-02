import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { lowerCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  lowerUnitFiveReadingPageAudits as audits,
  lowerUnitFiveReadingLessons as lessons,
  lowerUnitFiveReadingSource as source,
} from './chinese-lower-unit-five-reading';

it('matches both original pages, thirteen recognition characters, six writing characters and all six phrases', () => {
  const l = lessons['u5-1']!;
  expect(
    chineseBooks[1]!.units
      .flatMap((u) => u.lessons)
      .find((x) => x.id === 'cl-u5-1'),
  ).toBe(l);
  expect(audits[0]).toMatchObject({
    pages: [48, 49],
    recognize: '物捉迷藏造蚂蚁运食粮房结网',
    write: '物运房造欢网',
    author: null,
    sourceCredit: '本文由人民教育出版社小学语文室编写',
    newRadicals: ['牛字旁', '虫字旁', '户字头'],
    reciteRequired: false,
  });
  expect(lowerCharacters['u5-1']!.recognize).toBe(audits[0]!.recognize);
  expect([...lowerCharacters['u5-1']!.write].toSorted()).toEqual(
    [...audits[0]!.write].toSorted(),
  );
  expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(25);
  expect(l.reviewQuestions).toHaveLength(25);
  expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(7);
  expect(l.questions.filter((q) => q.rule.kind === 'reflection')).toHaveLength(
    2,
  );
  expect(l.steps).toHaveLength(7);
  expect(l.questions.some((q) => q.id.endsWith('-manual-recite'))).toBe(false);
  for (const phrase of [
    '蜻蜓展翅',
    '蝴蝶飞舞',
    '蚯蚓松土',
    '蚂蚁搬家',
    '蝌蚪游泳',
    '蜘蛛结网',
  ])
    expect(l.steps[3]!.text).toContain(phrase);
  for (const k of ['isbn', 'editionDate', 'printingDate'] as const)
    expect(source[k]).toBeNull();
});
it('covers the remaining three verified texts, their word lists and only the required recitations', () => {
  for (const [
    id,
    pages,
    recognize,
    write,
    newRadicals,
    reciteRequired,
    objective,
    manual,
    steps,
  ] of [
    [
      'u5-2',
      [50, 51],
      '圆严寒酷暑暖晨细朝霞夕杨香',
      '对雪夕今细语',
      [],
      true,
      27,
      7,
      7,
    ],
    [
      'u5-3',
      [52, 53],
      '操拔拍跑踢铃真闹丢沙身体',
      '打跑沙皮足包',
      ['身字旁'],
      false,
      21,
      7,
      6,
    ],
    [
      'u5-4',
      [54, 55],
      '之初相近习远教道专幼玉知义',
      '近远玉习学义',
      [],
      true,
      25,
      8,
      7,
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
      recognize,
      write,
      newRadicals,
      reciteRequired,
      author: null,
    });
    expect(lowerCharacters[id]!.recognize).toBe(recognize);
    expect([...lowerCharacters[id]!.write].toSorted()).toEqual(
      [...write].toSorted(),
    );
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
    expect(l.steps).toHaveLength(steps);
    expect(l.questions.some((q) => q.id.endsWith('-manual-recite'))).toBe(
      reciteRequired,
    );
  }
  for (const word of [
    '和风细雨',
    '夕阳',
    '严寒',
    '鸟语花香',
    '朝霞',
    '方圆',
    '酷暑',
  ])
    expect(lessons['u5-2']!.steps[4]!.text).toContain(word);
  for (const word of ['打球', '拔河', '拍皮球', '跳高', '跑步', '踢足球'])
    expect(lessons['u5-3']!.steps[1]!.text).toContain(word);
  for (const word of ['跳绳', '踢毽', '丢沙包'])
    expect(lessons['u5-3']!.steps[2]!.text).toContain(word);
  for (const word of [
    '相近',
    '相反',
    '学习',
    '练习',
    '知道',
    '道路',
    '专心',
    '专门',
  ])
    expect(lessons['u5-4']!.steps[4]!.text).toContain(word);
  expect(audits.find((a) => a.itemId === 'u5-3')!.sourceCredit).toBe(
    '本文由人民教育出版社小学语文室编写',
  );
  expect(audits.find((a) => a.itemId === 'u5-4')!.sourceCredit).toContain(
    '三字经',
  );
  expect(lessons['u5-4']!.steps[1]!.text).toContain('性相近，习相远。');
  expect(lessons['u5-2']!.steps[1]!.text).toContain('不把桃李或雪霜都叫反义词');
  expect(lessons['u5-3']!.steps[3]!.text).toContain('喜好没有唯一答案');
});
it('changes roles, word positions and familiar readings in every review without rewriting literary facts', () => {
  for (const [item, key, main, next] of [
    ['u5-1', 'phrase-0', '展翅', '飞舞'],
    ['u5-1', 'radical-0', '物', '牛字旁'],
    ['u5-1', 'location', '土里', '池中'],
    ['u5-1', 'expression', '拟人描写', '不能'],
    ['u5-1', 'writing', '物', '网'],
    ['u5-2', 'contrast-8', '李', '桃'],
    ['u5-2', 'reading', 'zhāo', 'yǔ'],
    ['u5-3', 'sport-2', '拍', '球'],
    ['u5-3', 'radical', '身', '身字旁'],
    ['u5-4', 'word-3', '练', '习'],
    ['u5-4', 'reading', 'jiào', 'xiāng'],
    ['u5-4', 'analogy', '类比表达', '不需要'],
  ]) {
    const l = lessons[item!]!;
    const q = l.questions.find((q) => q.id.endsWith(`-q-${key}`))!;
    const n = l.reviewQuestions!.find((q) => q.id.endsWith(`-r-${key}`))!;
    expect(evaluate(q.rule, main!)).toBe(true);
    expect(evaluate(n.rule, next!)).toBe(true);
    expect(evaluate(n.rule, main!)).toBe(false);
  }
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
  ['u5-1', 'phrase-0', '飞舞'],
  ['u5-2', 'contrast-0', '古'],
  ['u5-3', 'sport-0', '球'],
  ['u5-4', 'reading', 'xiāng'],
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

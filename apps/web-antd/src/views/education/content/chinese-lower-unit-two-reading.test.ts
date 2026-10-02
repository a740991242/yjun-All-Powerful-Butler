import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { characterSources, lowerCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  lowerUnitTwoReadingPageAudits as audits,
  lowerUnitTwoReadingLessons as lessons,
  lowerUnitTwoReadingSource as source,
} from './chinese-lower-unit-two-reading';
it('covers actual two-page sources, exact recognition and writing, independent actual activities without adding recitation', () => {
  const all = chineseBooks[1]!.units.flatMap((u) => u.lessons);
  for (const [
    itemId,
    pages,
    steps,
    objective,
    manual,
    recognize,
    write,
    radicals,
  ] of [
    [
      'u2-1',
      [16, 17],
      8,
      21,
      7,
      '热爱共产党太阳光怀抱幸福成',
      '共产党太阳光',
      ['四点底', '示字旁'],
    ],
    [
      'u2-2',
      [18, 19],
      9,
      27,
      9,
      '井城村毛主席住乡亲战士想念',
      '井江方主住后',
      ['广字头', '心字底'],
    ],
  ] as const) {
    const a = audits.find((x) => x.itemId === itemId)!;
    const l = lessons[itemId]!;
    expect(all.find((x) => x.id === `cl-${itemId}`)).toBe(l);
    expect(l.status).toBe('available');
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
    expect(a.pages).toEqual(pages);
    expect(a.recognize).toBe(recognize);
    expect(a.recognize).toHaveLength(13);
    expect(a.write).toBe(write);
    expect(a.newRadicals).toEqual(radicals);
    expect(a.author).toBeNull();
    expect(a.reciteRequired).toBe(false);
    expect(lowerCharacters[itemId]).toMatchObject({
      recognize,
      write,
      writeVerified: true,
    });
    expect(characterSources.lower.verifiedWritingLessonPages[itemId]).toBe(
      pages[1],
    );
    expect(l.questions.some((q) => q.id.endsWith('-manual-recite'))).toBe(
      false,
    );
    expect(
      l.questions
        .filter((q) => q.id.includes('-q-char-'))
        .map((q) => (q.rule.kind === 'choice' ? q.rule.value : ''))
        .join(''),
    ).toBe(recognize);
  }
  for (const key of ['isbn', 'editionDate', 'printingDate'] as const)
    expect(source[key]).toBeNull();
  expect(audits[0]!.sourceCredit).toContain('五年制');
  expect(audits[1]!.sourceCredit).toContain('1951年10月12日');
  expect(characterSources.lower.pendingWritePages).toEqual([]);
});
it('checks changed source conditions, original extension cards, twelve-word pairs and context-limited erhua', () => {
  for (const [itemId, key, main, review] of [
    ['u2-1', 'flower', '太阳', '蓝天'],
    ['u2-1', 'radical-heat', '四点底', '热'],
    ['u2-1', 'extension-boat', '在河面上', '前进'],
    ['u2-2', 'water', '水井', '到很远的地方挑水'],
    ['u2-2', 'leader', '毛主席', '战士和乡亲们'],
    ['u2-2', 'erhua', '不单独读一个音节', 'r'],
    ['u2-2', 'word-0', '井', '口'],
    ['u2-2', 'word-3', '主', '动'],
  ] as const) {
    const l = lessons[itemId]!;
    expect(l.questions.find((q) => q.id.endsWith(`-q-${key}`))!.rule).toEqual({
      kind: 'choice',
      value: main,
    });
    expect(
      l.reviewQuestions!.find((q) => q.id.endsWith(`-r-${key}`))!.rule,
    ).toEqual({ kind: 'choice', value: review });
  }
  expect(
    lessons['u2-1']!.questions.find((q) => q.id.endsWith('-q-extension-boat'))!
      .material,
  ).toContain('本站原创');
  expect(lessons['u2-2']!.steps[4]!.text).toContain('不推广每个儿字');
  expect(lessons['u2-2']!.steps[7]!.text).toContain('视觉换行不是断句');
  for (const l of Object.values(lessons)) {
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
  }
});
it.each([
  ['u2-1', 'flower', '蓝天'],
  ['u2-2', 'water', '到很远的地方挑水'],
  ['u2-3', 'wish', '新疆'],
] as const)(
  'retains wrong-first and manual/reflection evidence through backup and review %s',
  (itemId, key, newValue) => {
    const l = lessons[itemId]!;
    const now = '2026-10-01T00:00:00.000Z';
    const s = createSession(l, chineseBooks[1]!.id, 'child', { seed: 21, now });
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
              : '下一次想再读一个词，这是计划。';
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
    const r = newReviewQuestions(l, s, [s]);
    expect(r).toHaveLength(1);
    expect(r[0]!.rule).toEqual({ kind: 'choice', value: newValue });
    expect(evaluate(r[0]!.rule, old)).toBe(false);
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

it('keeps the two first-person wishes distinct, covers all six phrase directions and optional actual wish writing', () => {
  const l = lessons['u2-3']!;
  expect(
    chineseBooks[1]!.units
      .flatMap((u) => u.lessons)
      .find((x) => x.id === 'cl-u2-3'),
  ).toBe(l);
  expect(audits.find((a) => a.itemId === 'u2-3')).toMatchObject({
    pages: [20, 21],
    recognize: '告诉走京座安广场非宽丽洁',
    write: '告会京的北广',
    author: '王宝柱',
    sourceCredit: '王宝柱，选作课文时有改动',
    newRadicals: ['京字头'],
    reciteRequired: false,
  });
  expect(l.steps).toHaveLength(9);
  expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(24);
  expect(l.reviewQuestions).toHaveLength(24);
  expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(8);
  expect(l.questions.filter((q) => q.rule.kind === 'reflection')).toHaveLength(
    2,
  );
  expect(
    l.questions.find((q) => q.id.endsWith('-manual-wish-writing'))?.prompt,
  ).toContain('选做');
  expect(
    l.questions.find((q) => q.id.endsWith('-manual-wish-writing'))?.rule,
  ).toEqual({ kind: 'manual' });
  expect(l.questions.some((q) => q.id.endsWith('-manual-recite'))).toBe(false);
  expect(lowerCharacters['u2-3']).toMatchObject({
    write: '告会京的北广',
    writeVerified: true,
  });
  expect(characterSources.lower.verifiedWritingLessonPages['u2-3']).toBe(21);
  expect(characterSources.lower.pendingWritePages).toEqual([]);
  expect(l.steps[2]!.text).toContain('每段的我各指该段孩子');
  for (const [key, main, review] of [
    ['wish', '北京', '新疆'],
    ['informant', '妈妈', '爸爸'],
    ['route', '天山', '北京'],
    ['scene', '天安门', '雪莲'],
    ['radical', '京字头', '京'],
    ['writing', '告', '北'],
    ['phrase-0', '弯弯的', '小路'],
    ['phrase-1', '宽宽的', '公路'],
    ['phrase-2', '美丽的', '天山'],
    ['phrase-3', '洁白的', '雪莲'],
    ['phrase-4', '雄伟的', '天安门'],
    ['phrase-5', '壮观的', '升旗仪式'],
  ]) {
    const q = l.questions.find((q) => q.id.endsWith(`-q-${key}`))!;
    const r = l.reviewQuestions!.find((q) => q.id.endsWith(`-r-${key}`))!;
    expect(evaluate(q.rule, main!)).toBe(true);
    expect(evaluate(r.rule, review!)).toBe(true);
    expect(evaluate(r.rule, main!)).toBe(false);
  }
});

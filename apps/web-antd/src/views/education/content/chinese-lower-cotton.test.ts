import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { lowerCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  lowerCottonPageAudits as audits,
  lowerCottonLessons as lessons,
  lowerCottonSource as source,
} from './chinese-lower-cotton';

it('matches all four source pages and keeps recognition, writing and actual reading distinct', () => {
  const a = audits[0]!;
  const l = lessons['u8-1']!;
  expect(a).toMatchObject({
    pages: [98, 99, 100, 101],
    recognize: '棉姑娘病她治燕帮害别干惊奇',
    write: '她还身久空干星',
    author: '李春明',
    newRadicals: ['病字头'],
    additionalReadings: '',
    reciteRequired: false,
  });
  expect(a.sourceCredit).toContain('有改动');
  expect(lowerCharacters['u8-1']!.recognize).toBe(a.recognize);
  expect([...lowerCharacters['u8-1']!.write].toSorted()).toEqual(
    [...a.write].toSorted(),
  );
  expect(
    chineseBooks[1]!.units
      .flatMap((u) => u.lessons)
      .find((x) => x.id === 'cl-u8-1'),
  ).toBe(l);
  expect(source).toMatchObject({
    isbn: null,
    editionDate: null,
    printingDate: null,
    checkedAt: '2026-10-01',
  });
  expect(l.steps).toHaveLength(9);
  expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(25);
  expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(15);
  expect(l.questions.filter((q) => q.rule.kind === 'reflection')).toHaveLength(
    2,
  );
  for (const key of [
    'read-first',
    'read-second',
    'read-third',
    'read',
    'matching',
    'sequence',
    'abab-green',
    'abab-white',
    'abab-red',
    'write',
  ])
    expect(
      l.questions.find((q) => q.id.endsWith(`-manual-${key}`))!.rule,
    ).toEqual({ kind: 'manual' });
  expect(l.questions.some((q) => q.id.includes('recite'))).toBe(false);
  expect(l.steps[7]!.visual).toMatchObject({
    characters: [...'她还身久空干星'],
  });
});
it('covers four habitat pairs, request order, dialogue and all three open ABAB blanks', () => {
  const l = lessons['u8-1']!;
  const text = l.steps.map((s) => s.text).join('\n');
  for (const t of [
    '燕子—空中',
    '啄木鸟—树干里',
    '青蛙—水田里',
    '七星瓢虫—棉花叶子上',
    '自己飞来',
    '碧绿碧绿的叶子',
    '雪白雪白的棉花',
    '火红火红的太阳',
    '分别想一个合适的事物',
    '没有必背',
    '不推广所有瓢虫',
  ])
    expect(text).toContain(t);
  for (const [key, value, next] of [
    ['helper', '燕子', '七星瓢虫'],
    ['habitat-0', '燕子', '空中'],
    ['habitat-1', '啄木鸟', '树干里'],
    ['habitat-2', '青蛙', '水田里'],
    ['habitat-3', '七星瓢虫', '棉花叶子上'],
    ['radical', '病字头', '疒'],
    ['reading', 'gàn', 'gān'],
  ]) {
    expect(l.questions.find((q) => q.id.endsWith(`-q-${key}`))!.rule).toEqual({
      kind: 'choice',
      value,
    });
    expect(
      l.reviewQuestions!.find((q) => q.id.endsWith(`-r-${key}`))!.rule,
    ).toEqual({ kind: 'choice', value: next });
  }
});
for (const [id, key, oldAnswer, newAnswer] of [
  ['u8-1', 'helper', '燕子', '七星瓢虫'],
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

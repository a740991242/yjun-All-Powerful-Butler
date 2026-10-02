import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { lowerCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  lowerAnimalStoriesPageAudits as audits,
  lowerAnimalStoriesLessons as lessons,
  lowerAnimalStoriesSource as source,
} from './chinese-lower-animal-stories';

it('matches source pages, author credits and new versus reused character scopes', () => {
  expect(
    audits.map((a) => [
      a.itemId,
      a.pages,
      a.recognize,
      a.write,
      a.author,
      a.additionalReadings,
    ]),
  ).toEqual([
    [
      'u7-3',
      [84, 85, 86, 87, 88, 89],
      '虎熊通注意遍百为因舌理忘第',
      '国百时林都听点',
      '郝鸿',
      '呀yā',
    ],
    [
      'u7-4',
      [90, 91, 92],
      '猴块兴掰扛往棵满扔摘捧追',
      '高着瓜进兴往兔',
      '发堤',
      '结jiē',
    ],
  ]);
  for (const a of audits) {
    const l = lessons[a.itemId]!;
    expect(a.sourceCredit).toContain('有改动');
    expect(a.newRadicals).toEqual([]);
    expect(a.reciteRequired).toBe(false);
    expect(lowerCharacters[a.itemId]!.recognize).toBe(a.recognize);
    expect([...lowerCharacters[a.itemId]!.write].toSorted()).toEqual(
      [...a.write].toSorted(),
    );
    expect(
      chineseBooks[1]!.units
        .flatMap((u) => u.lessons)
        .find((x) => x.id === `cl-${a.itemId}`),
    ).toBe(l);
    expect(l.questions.some((q) => q.id.includes('recite'))).toBe(false);
  }
  expect(audits[1]!.recognize).not.toContain('抱');
  expect(audits[1]!.recognize).not.toContain('结');
  expect(source).toMatchObject({
    isbn: null,
    editionDate: null,
    printingDate: null,
    checkedAt: '2026-10-01',
  });
});
it('distinguishes four notices from ten shouts and covers date, time, place and actual role reading', () => {
  const l = lessons['u7-3']!;
  const text = l.steps.map((s) => s.text).join('\n');
  for (const t of [
    '狐狸',
    '大灰狼',
    '梅花鹿',
    '森林广场',
    '四次通知',
    '十遍',
    '不增加必背',
  ])
    expect(text).toContain(t);
  for (const [key, value, next] of [
    ['count', '四次通知', '十遍喊话'],
    ['missing-0', '哪一天', '几点钟'],
    ['missing-1', '几点钟', '在哪里'],
    ['missing-2', '在哪里', '哪一天'],
    ['final-time', '八点', '森林广场'],
    ['reading', 'yā', 'ya'],
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
    'read-first',
    'read-middle',
    'read-last',
    'roles',
    'retell',
    'notice',
  ])
    expect(
      l.questions.find((q) => q.id.endsWith(`-manual-${key}`))!.rule,
    ).toEqual({ kind: 'manual' });
});
it('keeps unspecified peach quantities and six open action words apart from new recognition and writing', () => {
  const l = lessons['u7-4']!;
  const text = l.steps.map((s) => s.text).join('\n');
  expect(text).toContain('桃子只说几个');
  expect(text).toContain('抱只在动作词练习');
  expect(text).toContain('选几个，各说一句话');
  expect(text).toContain('没有必背');
  expect(l.questions.filter((q) => q.id.includes('-q-action-'))).toHaveLength(
    6,
  );
  for (const key of ['actions', 'sentences', 'habits', 'listen'])
    expect(
      l.questions.find((q) => q.id.endsWith(`-manual-${key}`))!.rule,
    ).toEqual({ kind: 'manual' });
  expect(l.steps[6]!.visual).toMatchObject({
    characters: [...'高着瓜进兴往兔'],
  });
});
for (const [id, key, oldAnswer, newAnswer] of [
  ['u7-3', 'count', '四次通知', '十遍喊话'],
  ['u7-4', 'quantity', '一个玉米', '几个桃子'],
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

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { lowerCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  lowerGardenSevenPageAudits as audits,
  lowerGardenSevenLessons as lessons,
  lowerGardenSevenSource as source,
} from './chinese-lower-garden-seven';

it('matches all five source pages and keeps reused writing and ancient versus modern source scopes separate', () => {
  const a = audits[0]!;
  const l = lessons['u7-5']!;
  expect(a).toMatchObject({
    pages: [93, 94, 95, 96, 97],
    recognize: '刷梳巾皂洗澡脸盆',
    write: '巾洗',
    newRadicals: ['立刀旁'],
    reciteRequired: false,
    author: null,
  });
  expect(a.sourceCredit).toContain('伊索寓言');
  expect(source).toMatchObject({
    isbn: null,
    editionDate: null,
    printingDate: null,
    checkedAt: '2026-10-01',
  });
  expect(lowerCharacters['u7-5']!.recognize).toBe(a.recognize);
  expect(lowerCharacters['u7-5']!.write).toBe(a.write);
  expect(
    chineseBooks[1]!.units
      .flatMap((u) => u.lessons)
      .find((x) => x.id === 'cl-u7-5'),
  ).toBe(l);
  expect(l.steps).toHaveLength(13);
  expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(33);
  expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(15);
  expect(l.questions.filter((q) => q.rule.kind === 'reflection')).toHaveLength(
    3,
  );
  expect(l.steps[5]!.visual).toMatchObject({ characters: [...'房老着包'] });
  expect(l.steps[6]!.visual).toMatchObject({ characters: [...'巾洗'] });
  expect(l.questions.some((q) => q.id.includes('recite'))).toBe(false);
});
it('covers all activity columns with open speaking, real listening, independent two-page reading and exact changed contexts', () => {
  const l = lessons['u7-5']!;
  const text = l.steps.map((s) => s.text).join('\n');
  for (const key of [
    'hygiene',
    'groups',
    'words',
    'imagine',
    'write-reused',
    'write',
    'quotes',
    'listen-story',
    'tell-story',
    'feedback',
    'read-first',
    'read-second',
    'exchange',
  ])
    expect(
      l.questions.find((q) => q.id.endsWith(`-manual-${key}`))!.rule,
    ).toEqual({ kind: 'manual' });
  for (const t of [
    '不知则问，不能则学',
    '一日无书，百事荒芜',
    '读万卷书，行万里路',
    '不是必须完成的固定本数里数',
    '具体教师讲述原文未核验',
    '前四图小猫看人播种或收获',
    '没有新增必背',
    '左上包围和右上包围',
  ])
    expect(text).toContain(t);
  expect(l.questions.filter((q) => q.id.includes('-q-word-'))).toHaveLength(8);
  expect(l.questions.filter((q) => q.id.includes('-q-hygiene-'))).toHaveLength(
    5,
  );
  for (const [key, value, next] of [
    ['radical', '立刀旁', '刷'],
    ['order', '先外后内', '已学字复用'],
    ['oral-help', '借助图画', '听清声音'],
    ['fox-answer', '没有回答', '开口唱歌'],
    ['quote-0', '《荀子》', '陈寿'],
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
  ['u7-5', 'fox-answer', '没有回答', '开口唱歌'],
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

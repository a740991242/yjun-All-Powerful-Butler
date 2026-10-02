import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { lowerCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  lowerMinutePageAudits as audits,
  lowerMinuteLessons as lessons,
  lowerMinuteSource as source,
} from './chinese-lower-minute';

it('matches source pages and separates new recognition, alternate reading, writing and actual activities', () => {
  const a = audits[0]!;
  const l = lessons['u7-2']!;
  expect(a).toMatchObject({
    pages: [81, 82, 83],
    recognize: '钟迟灯等啊决定已经位表',
    write: '灯站坐师车课老',
    author: '鲁兵',
    newRadicals: [],
    additionalReadings: '背bēi',
    reciteRequired: false,
  });
  expect(a.recognize).not.toContain('背');
  expect(a.sourceCredit).toContain('有改动');
  expect(lowerCharacters['u7-2']!.recognize).toBe(a.recognize);
  expect([...lowerCharacters['u7-2']!.write].toSorted()).toEqual(
    [...a.write].toSorted(),
  );
  expect(
    chineseBooks[1]!.units
      .flatMap((u) => u.lessons)
      .find((x) => x.id === 'cl-u7-2'),
  ).toBe(l);
  expect(source).toMatchObject({
    isbn: null,
    editionDate: null,
    printingDate: null,
    checkedAt: '2026-10-01',
  });
  expect(l.steps).toHaveLength(9);
  expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(21);
  expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(11);
  expect(l.questions.filter((q) => q.rule.kind === 'reflection')).toHaveLength(
    5,
  );
  for (const key of [
    'read-first',
    'read-second',
    'read',
    'chain',
    'walk',
    'timed-write',
    'free',
    'write',
  ])
    expect(
      l.questions.find((q) => q.id.endsWith(`-manual-${key}`))!.rule,
    ).toEqual({ kind: 'manual' });
  expect(l.questions.some((q) => q.id.includes('recite'))).toBe(false);
  expect(l.steps[5]!.visual).toMatchObject({
    characters: [...'灯站坐师车课老'],
  });
});
it('covers both middle condition blanks and independent timed measurements without making a universal delay formula', () => {
  const l = lessons['u7-2']!;
  const text = l.steps.map((s) => s.text).join('\n');
  for (const t of [
    '早一分钟能赶上绿灯',
    '赶上绿灯能及时通过路口',
    '及时通过路口能赶上公交车',
    '赶上公交车就不会迟到',
    '不当普遍换算',
    '没有预填数量',
    '没计时不能填写成实测',
    '没有必背',
  ])
    expect(text).toContain(t);
  for (const [key, value, next] of [
    ['story-delay', '一分钟', '二十分钟'],
    ['reading', 'bēi', 'bèi'],
    ['writing', '灯', '课'],
    ['chain-0', '赶上绿灯', '不会迟到'],
    ['chain-1', '及时通过路口', '赶上公交车'],
    ['measurement', '实际计时并数写完的字', '实际计时并数走过的步'],
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
  ['u7-2', 'story-delay', '一分钟', '二十分钟'],
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

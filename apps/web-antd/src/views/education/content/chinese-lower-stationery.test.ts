import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { lowerCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  lowerStationeryPageAudits as audits,
  lowerStationeryLessons as lessons,
  lowerStationerySource as source,
} from './chinese-lower-stationery';

it('matches all three source pages, character scopes, new radical and actual textbook activities', () => {
  const a = audits[0]!;
  const l = lessons['u7-1']!;
  expect(a).toMatchObject({
    itemId: 'u7-1',
    pages: [78, 79, 80],
    recognize: '具铅新平盒些此仔检查所伙伴',
    write: '笔道平知放安',
    author: '圣野',
    newRadicals: ['皿字底'],
    reciteRequired: false,
  });
  expect(a.sourceCredit).toContain('有改动');
  expect(
    chineseBooks[1]!.units
      .flatMap((u) => u.lessons)
      .find((x) => x.id === 'cl-u7-1'),
  ).toBe(l);
  expect(lowerCharacters['u7-1']!.recognize).toBe(a.recognize);
  expect([...lowerCharacters['u7-1']!.write].toSorted()).toEqual(
    [...a.write].toSorted(),
  );
  expect(source).toMatchObject({
    sourceUrl: 'https://keben.app/book/0026',
    checkedAt: '2026-10-01',
    isbn: null,
    editionDate: null,
    printingDate: null,
  });
  expect(l.steps).toHaveLength(8);
  expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(32);
  expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(10);
  expect(l.questions.filter((q) => q.rule.kind === 'reflection')).toHaveLength(
    2,
  );
  expect(l.questions.some((q) => q.id.includes('recite'))).toBe(false);
  expect(l.questions.filter((q) => q.id.includes('-q-word-'))).toHaveLength(12);
  for (const key of [
    'read-first',
    'read-second',
    'retell',
    'radical',
    'read',
    'words',
    'write',
    'organize',
    'exchange',
  ])
    expect(
      l.questions.find((q) => q.id.endsWith(`-manual-${key}`))!.rule,
    ).toEqual({ kind: 'manual' });
  const text = l.steps.map((s) => s.text).join('\n');
  expect(text).toContain('红标在盒上方');
  expect(text).toContain('所没有此红标');
  expect(text).toContain('实际检查');
  expect(text).toContain('没有必背');
  expect(text).toContain('现代全文原画声音');
  expect(l.steps[6]!.visual).toMatchObject({ characters: [...'笔道平知放安'] });
});
it('uses precise changed story, radical and vocabulary contexts without treating open actions as objective scores', () => {
  const l = lessons['u7-1']!;
  for (const [key, value, next] of [
    ['story-home', '铅笔', '自己的家'],
    ['story-place', '文具盒', '每天放学时'],
    ['story-action', '仔细检查文具', '新的铅笔和橡皮'],
    ['radical', '皿字底', '盒'],
    ['writing', '笔', '知'],
    ['word-3', '新', '清新'],
    ['word-7', '平', '平地'],
    ['word-11', '伴', '结伴'],
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
  ['u7-1', 'story-home', '铅笔', '自己的家'],
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

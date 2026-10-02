import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { lowerCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  lowerGardenEightPageAudits as audits,
  lowerGardenEightLessons as lessons,
  lowerGardenEightSource as source,
} from './chinese-lower-garden-eight';

it('matches all five source pages, four columns and recognition/writing boundaries', () => {
  const a = audits[0]!;
  const l = lessons['u8-4']!;
  expect(a).toMatchObject({
    pages: [109, 110, 111, 112, 113],
    recognize: '吵现顶胖票户交父',
    write: '页户交父',
    author: null,
    newRadicals: [],
    additionalReadings: '',
    reciteRequired: false,
  });
  expect(a.sourceCredit).toContain('明唐寅');
  expect(a.sourceCredit).toContain('胡木仁');
  expect(a.sourceCredit).toContain('有改动');
  expect(lowerCharacters['u8-4']!.recognize).toBe(a.recognize);
  expect([...lowerCharacters['u8-4']!.write].toSorted()).toEqual(
    [...a.write].toSorted(),
  );
  expect(a.write).not.toContain('顶');
  expect(
    chineseBooks[1]!.units
      .flatMap((u) => u.lessons)
      .find((x) => x.id === 'cl-u8-4'),
  ).toBe(l);
  expect(source).toMatchObject({
    isbn: null,
    editionDate: null,
    printingDate: null,
    checkedAt: '2026-10-01',
  });
  expect(l.steps).toHaveLength(12);
  expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(35);
  expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(15);
  expect(l.questions.filter((q) => q.rule.kind === 'reflection')).toHaveLength(
    2,
  );
  for (const key of [
    'add',
    'minus',
    'fill',
    'feelings-read',
    'feelings-say',
    'feelings-write',
    'write',
    'poem-read',
    'poem-recite',
    'read-first',
    'read-second',
    'read-third',
    'story-exchange',
  ])
    expect(
      l.questions.find((q) => q.id.endsWith(`-manual-${key}`))!.rule,
    ).toEqual({ kind: 'manual' });
  expect(
    l.questions.find((q) => q.id.endsWith('-manual-poem-recite'))!.prompt,
  ).toContain('选做');
  expect(l.steps[6]!.visual).toMatchObject({ characters: [...'页户交父'] });
});
it('covers eight component examples, eight contextual blanks, open speaking/writing and complete poem/story', () => {
  const l = lessons['u8-4']!;
  const text = l.steps
    .map((s) => `${s.title} ${s.text} ${s.activity}`)
    .join('\n');
  for (const t of [
    '口与少',
    '丁与页',
    '王与见',
    '月与半',
    '飘去风留票',
    '校去木留交',
    '房去方留户',
    '爸去巴留父',
    '午牛',
    '刀力',
    '人入',
    '玉主',
    '中午、水牛、力气、剪刀、人们、出入、主食、玉米',
    '高兴、生气、害怕、难过',
    '虚构',
    '说与写分别确认',
    '千门万户',
    '夸张',
    '不补成原页明确必背指令',
    '共读111页',
    '共读112页',
    '共读113页',
    '一年又一年',
    '没有砍树',
  ])
    expect(text).toContain(t);
  for (const [key, value, next] of [
    ['add-0', '吵', '口'],
    ['add-1', '顶', '页'],
    ['add-2', '现', '见'],
    ['add-3', '胖', '半'],
    ['minus-0', '票', '风'],
    ['minus-1', '交', '木'],
    ['minus-2', '户', '方'],
    ['minus-3', '父', '巴'],
    ['fill-0', '午', '牛'],
    ['fill-1', '力', '刀'],
    ['fill-2', '人', '入'],
    ['fill-3', '主', '玉'],
    ['story-season', '花', '绿叶'],
    ['story-autumn', '果子', '小鸟的家'],
    ['story-home', '山洞', '没有盖新房'],
    ['story-gifts', '鲜花和果子', '没有砍树'],
  ]) {
    expect(l.questions.find((q) => q.id.endsWith(`-q-${key}`))!.rule).toEqual({
      kind: 'choice',
      value,
    });
    expect(
      l.reviewQuestions!.find((q) => q.id.endsWith(`-r-${key}`))!.rule,
    ).toEqual({ kind: 'choice', value: next });
  }
  expect(l.steps[7]!.text).toContain(
    '头上红冠不用裁，满身雪白走将来。平生不敢轻言语，一叫千门万户开。',
  );
  expect(
    l.questions.some(
      (q) => q.rule.kind === 'choice' && q.id.includes('feelings'),
    ),
  ).toBe(false);
  expect(
    l.questions
      .filter((q) => q.rule.kind === 'reflection')
      .every((q) => q.explanation.includes('null')),
  ).toBe(true);
});
for (const [id, key, oldAnswer, newAnswer] of [
  ['u8-4', 'story-autumn', '果子', '小鸟的家'],
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

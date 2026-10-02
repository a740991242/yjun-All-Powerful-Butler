import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { lowerCharacters } from './characters';
import { chineseBooks } from './chinese';
import { lowerRecognitionPacks } from './chinese-lower-recognition';
import {
  lowerUnitSixReadingPageAudits as audits,
  lowerUnitSixReadingLessons as lessons,
  lowerUnitSixReadingSource as source,
} from './chinese-lower-unit-six-reading';

it('publishes four exact textbook lessons while preserving independent supplements and distinct source facts', () => {
  expect(
    audits.map((a) => [
      a.itemId,
      a.pages,
      a.recognize,
      a.write,
      a.reciteRequired,
    ]),
  ).toEqual([
    ['u6-1', [61, 62, 63], '诗首偷浮萍泉惜照柔荷露角', '首采角池尖早', true],
    ['u6-2', [64, 65], '浪迈悄泪次给壳虾装像淘娃', '玩眼泪它贝气', false],
    ['u6-3', [66, 67, 68], '珠摇篮亮晶停坪展透翅膀朵', '机唱朵台伞美', true],
    [
      'u6-4',
      [69, 70, 71, 72],
      '要腰阴沉呀忙呢吗面闷吧消息',
      '这鱼问看面加',
      false,
    ],
  ]);
  const book = chineseBooks[1]!;
  for (const a of audits) {
    const l = lessons[a.itemId]!;
    expect(
      book.units
        .flatMap((u) => u.lessons)
        .find((x) => x.id === `cl-${a.itemId}`),
    ).toBe(l);
    expect(lowerCharacters[a.itemId]!.recognize).toBe(a.recognize);
    expect([...lowerCharacters[a.itemId]!.write].toSorted()).toEqual(
      [...a.write].toSorted(),
    );
    expect(
      l.questions.some(
        (q) =>
          q.id.endsWith('-manual-recite') || q.id.includes('-manual-recite-'),
      ),
    ).toBe(a.reciteRequired);
  }
  for (const supplement of Object.values(lowerRecognitionPacks))
    expect(book.units.flatMap((u) => u.lessons)).toContain(supplement);
  expect(audits[0]!.sourceCredit).toBe('池上：唐白居易；小池：宋杨万里');
  expect(audits[1]!.author).toBeNull();
  expect(audits[1]!.sourceCredit).toContain('五年制');
  expect(audits[1]!.sourceCredit).toContain('第二册');
  expect(audits[2]!.newRadicals).toEqual(['几字头']);
  expect(audits[3]!.additionalReadings).toBe('空kòng');
  expect(audits[3]!.recognize).not.toContain('空');
  expect(source).toMatchObject({
    sourceUrl: 'https://keben.app/book/0026',
    checkedAt: '2026-10-01',
    isbn: null,
    editionDate: null,
    printingDate: null,
  });
});
it('teaches both complete ancient poems, exact tree-yin text and all word groups without extending writing scope', () => {
  const l = lessons['u6-1']!;
  const text = l.steps.map((s) => s.text).join('\n');
  for (const line of [
    '小娃撑小艇，偷采白莲回。不解藏踪迹，浮萍一道开。',
    '泉眼无声惜细流，树阴照水爱晴柔。小荷才露尖尖角，早有蜻蜓立上头。',
  ])
    expect(text).toContain(line);
  expect(l.questions.filter((q) => q.id.includes('-q-word-'))).toHaveLength(6);
  for (const key of [
    'read-chishang',
    'read-xiaochi',
    'recite-chishang',
    'recite-xiaochi',
    'words',
    'scene',
    'write',
  ])
    expect(
      l.questions.find((q) => q.id.endsWith(`-manual-${key}`))!.rule,
    ).toEqual({ kind: 'manual' });
  expect(l.title).toBe('古诗二首 · 池上、小池');
  expect(l.textbookTitle).toBe(l.title);
  expect(l.goal).toContain('两诗');
  expect(l.steps[5]!.visual).toMatchObject({ characters: [...'首采角池尖早'] });
});
it('keeps sentence expansion and apple description open, four literary roles precise, and story weather separate from real forecasts', () => {
  const value = (id: string, k: string, r = false) =>
    (r ? lessons[id]!.reviewQuestions! : lessons[id]!.questions).find((q) =>
      q.id.endsWith(`-${r ? 'r' : 'q'}-${k}`),
    )!.rule;
  for (const [id, k, main, next] of [
    ['u6-1', 'author', '白居易', '杨万里'],
    ['u6-1', 'text', '阴', '惜细流'],
    ['u6-2', 'detail', '淘气的', '唱着笑着'],
    ['u6-2', 'writing', '玩', '贝'],
    ['u6-3', 'role-0', '摇篮', '小水珠'],
    ['u6-3', 'role-1', '停机坪', '小蜻蜓'],
    ['u6-3', 'role-2', '歌台', '小青蛙'],
    ['u6-3', 'role-3', '凉伞', '小鱼儿'],
    ['u6-3', 'radical', '几字头', '朵'],
    ['u6-4', 'animal-0', '低飞捉虫', '到水面透气'],
    ['u6-4', 'animal-1', '到水面透气', '搬东西'],
    ['u6-4', 'animal-2', '搬东西', '低飞捉虫'],
    ['u6-4', 'reading', 'kòng', 'mēn'],
  ]) {
    expect(value(id!, k!)).toEqual({ kind: 'choice', value: main });
    expect(value(id!, k!, true)).toEqual({ kind: 'choice', value: next });
  }
  expect(
    lessons['u6-2']!.questions.find((q) =>
      q.id.endsWith('-manual-open-sentence'),
    )!.rule,
  ).toEqual({ kind: 'manual' });
  expect(
    lessons['u6-3']!.questions.find((q) => q.id.endsWith('-manual-open-shape'))!
      .rule,
  ).toEqual({ kind: 'manual' });
  expect(lessons['u6-2']!.steps.map((s) => s.text).join('\n')).toContain(
    '本站原创比较',
  );
  expect(lessons['u6-3']!.steps.map((s) => s.text).join('\n')).toContain(
    '联系生活理解摇篮',
  );
  expect(lessons['u6-4']!.steps.map((s) => s.text).join('\n')).toContain(
    '理解本段闷',
  );
  expect(lessons['u6-4']!.steps.map((s) => s.text).join('\n')).toContain(
    '不是现实天气预报',
  );
});
for (const [id, key, oldAnswer, newAnswer] of [
  ['u6-1', 'author', '白居易', '杨万里'],
  ['u6-2', 'detail', '淘气的', '唱着笑着'],
  ['u6-3', 'role-0', '摇篮', '小水珠'],
  ['u6-4', 'animal-0', '低飞捉虫', '到水面透气'],
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

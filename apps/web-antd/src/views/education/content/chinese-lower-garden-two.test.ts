import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { characterSources, lowerCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  lowerGardenTwoPageAudit as a,
  lowerGardenTwoLesson as l,
} from './chinese-lower-garden-two';

it('covers all four printed pages and every instruction, letter, shape and life-word scope with separate manual reading pages', () => {
  expect(
    chineseBooks[1]!.units
      .flatMap((u) => u.lessons)
      .find((x) => x.id === 'cl-u2-4'),
  ).toBe(l);
  expect(l.status).toBe('available');
  expect(a.pages).toEqual([22, 23, 24, 25]);
  expect(a.recognize).toBe('认连选圈涂填试练');
  expect(a.write).toBe('写认');
  expect(a.letters.join('')).toBe('NRDTLABGHEQ');
  expect(a.sharedParts).toEqual({ 日: [...'明星早阳'], 土: [...'地尘场'] });
  expect(a.shoppingWords).toEqual([
    '直尺',
    '橡皮',
    '水彩笔',
    '牙膏',
    '水杯',
    '洗手液',
    '衬衫',
    '外套',
    '运动鞋',
  ]);
  expect(a).toMatchObject({
    poem: '寻隐者不遇',
    poet: '贾岛',
    dynasty: '唐',
    reading: '快乐的节日',
    readingAuthor: '管桦',
    readingAdapted: true,
  });
  for (const key of ['isbn', 'editionDate', 'printingDate'] as const)
    expect(a[key]).toBeNull();
  expect(lowerCharacters['u2-4']).toMatchObject({
    recognize: a.recognize,
    write: a.write,
    writeVerified: true,
  });
  expect(characterSources.lower.verifiedWritingLessonPages['u2-4']).toBe(22);
  expect(characterSources.lower.pendingWritePages).toEqual([]);
  expect(l.steps).toHaveLength(11);
  expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(53);
  expect(l.reviewQuestions).toHaveLength(53);
  expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(10);
  expect(l.questions.filter((q) => q.rule.kind === 'reflection')).toHaveLength(
    2,
  );
  for (const key of [
    'instructions',
    'recognize',
    'write',
    'letters',
    'parts',
    'shopping',
    'poem',
    'reading-first',
    'reading-second',
    'exchange',
  ])
    expect(
      l.questions.find((q) => q.id.endsWith(`-manual-${key}`))?.rule,
    ).toEqual({ kind: 'manual' });
  expect(l.steps[3]!.text).toContain('不是英语读音课');
  expect(l.steps[4]!.text).toContain('不是新增认写清单');
  expect(l.steps[8]!.text).toContain('不强制唱歌背诵');
});
it('changes the question condition in every review and retains unknown poem details and imaginative modern imagery', () => {
  const value = (key: string, review = false) =>
    (review ? l.reviewQuestions! : l.questions).find((q) =>
      q.id.endsWith(`-${review ? 'r' : 'q'}-${key}`),
    )!.rule;
  for (const [i, c] of a.letters.entries()) {
    expect(value(`letter-${i}`)).toEqual({ kind: 'choice', value: c });
    expect(value(`letter-${i}`, true)).toEqual({
      kind: 'choice',
      value: c.toLowerCase(),
    });
  }
  for (const [key, main, review] of [
    ['instruction-0', '按拼音拼读', '拼一拼'],
    ['instruction-8', '尝试给定方法', '试一试'],
    ['instruction-9', '练习给定内容', '练一练'],
    ['part-sun-3', '日', '阳'],
    ['part-soil-1', '土', '尘'],
    ['shopping-2', '水', '笔'],
    ['shopping-8', '运', '鞋'],
    ['poet', '贾岛', '唐'],
    ['poem-dialogue', '童子', '松下'],
    ['poem-absence', '采药', '不知道具体在哪里'],
    ['reading-place', '花园和草地', '开放的花儿'],
    ['reading-personification', '花儿', '白杨树'],
    ['reading-future', '比喻', '没有证明实际完成'],
    ['reading-together', '叔叔阿姨们', '祖国'],
    ['writing', '写', '认'],
  ]) {
    expect(value(key!)).toEqual({ kind: 'choice', value: main });
    expect(value(key!, true)).toEqual({ kind: 'choice', value: review });
  }
  expect(
    l.questions.find((q) => q.id.endsWith('-q-instruction-0'))!.material,
  ).toContain('本站原创');
  expect(
    l.questions.find((q) => q.id.endsWith('-q-poem-dialogue'))!.material,
  ).toBe('松下问童子，言师采药去。\n只在此山中，云深不知处。');
  const all = [...l.questions, ...l.reviewQuestions!];
  expect(new Set(all.map((q) => q.id)).size).toBe(all.length);
  for (const q of all) {
    if (q.rule.kind !== 'choice') continue;
    const correct = q.rule.value;
    expect(q.choices!.filter((c) => c.id === correct)).toHaveLength(1);
    for (const c of q.choices!)
      expect(evaluate(q.rule, c.id)).toBe(c.id === correct);
  }
  for (const r of l.reviewQuestions!)
    expect(
      l.questions.some(
        (q) =>
          JSON.stringify([q.prompt, q.material, q.visual]) ===
          JSON.stringify([r.prompt, r.material, r.visual]),
      ),
    ).toBe(false);
});
it('preserves first errors, actual confirmations and reflections across backup and changed letter review', () => {
  const now = '2026-10-01T00:00:00.000Z';
  const s = createSession(l, chineseBooks[1]!.id, 'child', { seed: 5, now });
  s.phase = 'practice';
  for (const [i, q] of s.questions.entries()) {
    if (q.id.endsWith('-q-letter-0')) {
      s.responses[i] = submitResponse(
        q,
        { ...s.responses[i]!, draft: 'n' },
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
            : '下一次还想读一段，是未来计划。';
        })(),
      },
      now,
    );
    if (q.rule.kind !== 'choice')
      expect(s.responses[i]!.submissions.at(-1)!.correct).toBeNull();
  }
  const rs = newReviewQuestions(l, s, [s]);
  expect(rs).toHaveLength(1);
  expect(rs[0]!.rule).toEqual({ kind: 'choice', value: 'n' });
  expect(evaluate(rs[0]!.rule, 'N')).toBe(false);
  expect(s.responses.filter((r) => r.submissions.length === 2)).toHaveLength(1);
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

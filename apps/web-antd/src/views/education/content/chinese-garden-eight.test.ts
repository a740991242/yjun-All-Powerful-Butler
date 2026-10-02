import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { upperCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  gardenEightLesson,
  gardenEightPageAudit,
  gardenEightStructures,
  gardenEightWordPairs,
} from './chinese-garden-eight';

it('publishes the observed formal lesson separately from recognition history with exact character and activity scopes', () => {
  const l = gardenEightLesson;
  const lessons = chineseBooks[0]!.units.flatMap((u) => u.lessons);
  expect(lessons).toContain(l);
  expect(l.id).toBe('cu-u8-4');
  expect(gardenEightPageAudit.pages).toEqual([101, 102, 103, 104]);
  expect(gardenEightPageAudit.recognize).toBe(
    upperCharacters['u8-4']!.recognize,
  );
  expect(gardenEightPageAudit.write).toBe(upperCharacters['u8-4']!.write);
  for (const field of ['isbn', 'editionDate', 'printingDate'] as const)
    expect(gardenEightPageAudit[field]).toBeNull();
  expect(gardenEightPageAudit.provider).toContain('第三方');
  expect(l.steps).toHaveLength(12);
  expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(33);
  expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(11);
  expect(l.questions.filter((q) => q.rule.kind === 'reflection')).toHaveLength(
    2,
  );
  expect(
    l.questions
      .filter((q) => q.id.includes('-q-char-'))
      .map((q) => (q.rule.kind === 'choice' ? q.rule.value : ''))
      .join(''),
  ).toBe('牛羊爪元拼音');
  for (const key of [
    'recognize',
    'classify',
    'words',
    'blessing',
    'write',
    'order',
    'poem',
    'pumpkin-share',
    'pumpkin-listen',
    'read',
    'talk',
  ])
    expect(
      l.questions.find((q) => q.id.endsWith(`-manual-${key}`))!.rule.kind,
    ).toBe('manual');
  expect(
    l.questions.find((q) => q.id.endsWith('-manual-write'))!.prompt,
  ).toContain('牛羊爪白');
});
it('covers exact structure and word positions, public-domain poetry and open discussion without replacing the textbook', () => {
  const l = gardenEightLesson;
  expect(gardenEightPageAudit.organizer).toBe('王文宝');
  expect(gardenEightPageAudit.readingKind).toBe('传统童谣');
  expect(gardenEightPageAudit.adapted).toBe(true);
  expect([gardenEightPageAudit.poet, gardenEightPageAudit.dynasty]).toEqual([
    '李峤',
    '唐',
  ]);
  expect(gardenEightPageAudit.structureExamples).toEqual([
    ['元', '花'],
    ['巴', '田'],
    ['叶', '作'],
  ]);
  expect(l.steps[1]!.text).toContain('元按原页上下拆分示范');
  expect(gardenEightStructures).toEqual([
    ['牛', '独体', '叶'],
    ['羊', '独体', '音'],
    ['只', '上下', '爪'],
    ['爪', '独体', '拼'],
    ['叶', '左右', '元'],
    ['元', '上下', '牛'],
    ['拼', '左右', '牛'],
    ['音', '上下', '巴'],
    ['巴', '独体', '拼'],
    ['白', '独体', '音'],
  ]);
  const structureByChar = new Map(
    gardenEightStructures.map(([char, structure]) => [char, structure]),
  );
  for (const [i, [char, structure, other]] of gardenEightStructures.entries()) {
    expect(structureByChar.get(other)).not.toBe(structure);
    expect(
      l.questions.find((q) => q.id.endsWith(`-q-structure-${i}`))!.rule,
    ).toEqual({ kind: 'choice', value: structure });
    expect(
      l.reviewQuestions!.find((q) => q.id.endsWith(`-r-structure-${i}`))!.rule,
    ).toEqual({ kind: 'choice', value: char });
  }
  expect(gardenEightWordPairs).toEqual([
    ['果皮', '树皮', '果', '树'],
    ['加法', '办法', '加', '办'],
    ['回来', '回答', '来', '答'],
    ['许多', '不许', '许', '不'],
    ['到处', '四处', '到', '四'],
    ['方向', '地方', '向', '地'],
  ]);
  for (const [i, [a, b, av, bv]] of gardenEightWordPairs.entries()) {
    for (const [review, word, value] of [
      [false, a, av],
      [true, b, bv],
    ] as const) {
      const q = (review ? l.reviewQuestions! : l.questions).find((q) =>
        q.id.endsWith(`-${review ? 'r' : 'q'}-word-${i}`),
      )!;
      const position = q.prompt.includes('第二') ? 1 : 0;
      expect(word[position]).toBe(value);
      expect(q.rule).toEqual({ kind: 'choice', value });
    }
  }
  for (const [key, main, review] of [
    ['writing-scope', '牛', '白'],
    ['order', '先外后内', '先中间后两边'],
    ['blessing', '祝你新年快乐！', '小禾'],
    ['poem-author', '李峤', '唐'],
    ['poem-season', '三秋叶', '二月花'],
    ['poem-scene', '千尺浪', '万竿斜'],
    ['reading-23', '糖瓜粘', '扫房子'],
    ['reading-25', '磨豆腐', '去买肉'],
    ['reading-27', '宰公鸡', '把面发'],
    ['reading-29', '蒸馒头', '熬一宿'],
    ['reading-start', '腊八粥', '满街走'],
  ]) {
    expect(l.questions.find((q) => q.id.endsWith(`-q-${key}`))!.rule).toEqual({
      kind: 'choice',
      value: main,
    });
    expect(
      l.reviewQuestions!.find((q) => q.id.endsWith(`-r-${key}`))!.rule,
    ).toEqual({ kind: 'choice', value: review });
  }
  expect(l.steps[3]!.text).toContain('没有唯一句子');
  expect(l.steps[5]!.text).toContain('不将四个已学字增加新增会写');
  expect(l.steps[6]!.text).toContain(
    '解落三秋叶，能开二月花。\n过江千尺浪，入竹万竿斜。',
  );
  expect(l.steps[7]!.text).toContain('没有给唯一方法');
  expect(l.steps[8]!.text).toContain('讨论不当已经搬运完成');
  expect(l.steps[9]!.text).toContain('不把整理者当创作者');
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
});
it('preserves a wrong-first pair response and separate manual/reflection history through backup and changed review', () => {
  const now = '2026-10-01T00:00:00.000Z';
  const s = createSession(gardenEightLesson, chineseBooks[0]!.id, 'child', {
    seed: 18,
    now,
  });
  s.phase = 'practice';
  for (const [i, q] of s.questions.entries()) {
    if (q.id.endsWith('-q-reading-23'))
      s.responses[i] = submitResponse(
        q,
        { ...s.responses[i]!, draft: '每家必须一样' },
        now,
      );
    s.responses[i] = submitResponse(
      q,
      {
        ...s.responses[i]!,
        draft: (() => {
          if (q.rule.kind === 'choice') return q.rule.value;
          return q.rule.kind === 'manual' ? 'confirmed' : '下次想练羊字。';
        })(),
      },
      now,
    );
    if (q.rule.kind !== 'choice')
      expect(s.responses[i]!.submissions.at(-1)!.correct).toBeNull();
  }
  expect(s.responses.filter((r) => r.submissions.length === 2)).toHaveLength(1);
  const review = newReviewQuestions(gardenEightLesson, s, [s]);
  expect(review).toHaveLength(1);
  expect(review[0]!.rule).toEqual({ kind: 'choice', value: '扫房子' });
  expect(evaluate(review[0]!.rule, '糖瓜粘')).toBe(false);
  expect(
    parseBackup(
      exportBackup({
        schemaVersion: 1,
        activeProfileId: 'child',
        profiles: [{ id: 'child', nickname: '陪读', createdAt: now }],
        sessions: [s],
      }),
    ).data.sessions[0],
  ).toEqual(s);
});

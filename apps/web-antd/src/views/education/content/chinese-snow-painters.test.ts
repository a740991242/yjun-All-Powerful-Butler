import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { upperCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  snowFootprintPairs,
  snowPaintersLesson,
  snowPaintersPageAudit,
} from './chinese-snow-painters';

it('covers the two actual pages, author/adaptation, eleven recognized/five written characters and independent actual tasks', () => {
  const l = snowPaintersLesson;
  expect(chineseBooks[0]!.units.flatMap((u) => u.lessons)).toContain(l);
  expect(l.id).toBe('cu-u5-3');
  expect(snowPaintersPageAudit.pages).toEqual([64, 65]);
  expect(snowPaintersPageAudit.recognize).toBe(
    upperCharacters['u5-3']!.recognize,
  );
  expect(snowPaintersPageAudit.write).toBe(upperCharacters['u5-3']!.write);
  expect(snowPaintersPageAudit.author).toBe('程宏明');
  expect(snowPaintersPageAudit.adapted).toBe(true);
  expect(snowPaintersPageAudit.provider).toContain('第三方');
  for (const field of ['isbn', 'editionDate', 'printingDate'] as const)
    expect(snowPaintersPageAudit[field]).toBeNull();
  expect(l.steps).toHaveLength(8);
  expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(25);
  expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(7);
  expect(l.questions.filter((q) => q.rule.kind === 'reflection')).toHaveLength(
    2,
  );
  expect(l.reviewQuestions).toHaveLength(25);
  expect(
    l.questions
      .filter((q) => q.id.includes('-q-char-'))
      .map((q) => (q.rule.kind === 'choice' ? q.rule.value : ''))
      .join(''),
  ).toBe('的家鸡竹牙用几步没参加');
  expect(
    l.questions.find((q) => q.id.endsWith('-manual-write'))!.prompt,
  ).toContain('竹马牙用几');
  expect(
    l.questions.find((q) => q.id.endsWith('-manual-read'))!.knowledge,
  ).not.toBe(
    l.questions.find((q) => q.id.endsWith('-manual-recite'))!.knowledge,
  );
});

it('matches each specified animal/shape both ways and separates literary footprints, contextual sounds and actual biology', () => {
  const l = snowPaintersLesson;
  expect(snowFootprintPairs).toEqual([
    ['小鸡', '竹叶'],
    ['小狗', '梅花'],
    ['小鸭', '枫叶'],
    ['小马', '月牙'],
  ]);
  for (const [i, [animal, shape]] of snowFootprintPairs.entries()) {
    const main = l.questions.find((q) => q.id.endsWith(`-q-footprint-${i}`))!;
    const review = l.reviewQuestions!.find((q) =>
      q.id.endsWith(`-r-footprint-${i}`),
    )!;
    expect(main.prompt).toContain(animal);
    expect(main.rule).toEqual({ kind: 'choice', value: shape });
    expect(review.prompt).toContain(shape);
    expect(review.rule).toEqual({ kind: 'choice', value: animal });
  }
  expect(l.steps[3]!.text).toContain('不能用诗中形状当所有真实脚印');
  expect(l.steps[4]!.text).toContain('不说所有青蛙');
  expect(l.questions.find((q) => q.id.endsWith('-q-sound-de'))!.rule).toEqual({
    kind: 'choice',
    value: 'de',
  });
  expect(
    l.reviewQuestions!.find((q) => q.id.endsWith('-r-sound-de'))!.rule,
  ).toEqual({ kind: 'choice', value: 'cān' });
  expect(l.questions.find((q) => q.id.endsWith('-q-sound-mei'))!.rule).toEqual({
    kind: 'choice',
    value: 'méi',
  });
  const all = [...l.questions, ...l.reviewQuestions!];
  expect(new Set(all.map((q) => q.id)).size).toBe(all.length);
  for (const q of all) {
    if (q.rule.kind !== 'choice') continue;
    const expected = q.rule.value;
    expect(q.choices!.filter((c) => c.id === expected)).toHaveLength(1);
    for (const c of q.choices!)
      expect(evaluate(q.rule, c.id)).toBe(c.id === expected);
    if (q.id.includes('-footprint-') || q.id.includes('-frog-'))
      expect(q.material).toContain('共读教材印刷第64页');
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

it('keeps wrong-first frog history and ungraded activity/reflection snapshots with a changed review target', () => {
  const now = '2026-10-01T00:00:00.000Z';
  const s = createSession(snowPaintersLesson, chineseBooks[0]!.id, 'child', {
    seed: 17,
    now,
  });
  s.phase = 'practice';
  for (const [i, q] of s.questions.entries()) {
    if (q.id.endsWith('-q-frog-reason'))
      s.responses[i] = submitResponse(
        q,
        { ...s.responses[i]!, draft: '去画梅花' },
        now,
      );
    s.responses[i] = submitResponse(
      q,
      {
        ...s.responses[i]!,
        draft: (() => {
          if (q.rule.kind === 'choice') return q.rule.value;
          return q.rule.kind === 'manual'
            ? 'confirmed'
            : '想再读最后问答。\n这是计划。';
        })(),
      },
      now,
    );
    if (q.rule.kind !== 'choice')
      expect(s.responses[i]!.submissions.at(-1)!.correct).toBeNull();
  }
  expect(s.responses.filter((r) => r.submissions.length === 2)).toHaveLength(1);
  const review = newReviewQuestions(snowPaintersLesson, s, [s]);
  expect(review).toHaveLength(1);
  expect(review[0]!.rule).toEqual({ kind: 'choice', value: '青蛙' });
  expect(evaluate(review[0]!.rule, '在洞里睡着')).toBe(false);
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

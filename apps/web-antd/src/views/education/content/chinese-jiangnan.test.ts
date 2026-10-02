import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { upperCharacters } from './characters';
import { chineseBooks } from './chinese';
import { jiangnanLesson, jiangnanPageAudit } from './chinese-jiangnan';

it('covers both observed pages and exact poem attribution/read/write requirements', () => {
  const l = jiangnanLesson;
  expect(chineseBooks[0]!.units.flatMap((u) => u.lessons)).toContain(l);
  expect(l.id).toBe('cu-u5-2');
  expect(jiangnanPageAudit.pages).toEqual([62, 63]);
  expect(jiangnanPageAudit.recognize).toBe(upperCharacters['u5-2']!.recognize);
  expect(jiangnanPageAudit.write).toBe(upperCharacters['u5-2']!.write);
  expect(jiangnanPageAudit.provider).toContain('第三方');
  for (const field of ['isbn', 'editionDate', 'printingDate'] as const)
    expect(jiangnanPageAudit[field]).toBeNull();
  expect(jiangnanPageAudit.sourceNote).toContain('汉乐府');
  expect(l.steps).toHaveLength(8);
  expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(19);
  expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(7);
  expect(l.questions.filter((q) => q.rule.kind === 'reflection')).toHaveLength(
    2,
  );
  expect(l.reviewQuestions).toHaveLength(19);
  expect(
    l.questions
      .filter((q) => q.id.includes('-q-char-'))
      .map((q) => (q.rule.kind === 'choice' ? q.rule.value : ''))
      .join(''),
  ).toBe('江南可采莲戏间东北');
  expect(
    l.questions.find((q) => q.id.endsWith('-manual-write'))!.prompt,
  ).toContain('可叶东西');
  expect(
    l.questions.find((q) => q.id.endsWith('-manual-read'))!.knowledge,
  ).not.toBe(
    l.questions.find((q) => q.id.endsWith('-manual-recite'))!.knowledge,
  );
  expect(l.steps[0]!.text).toContain('公有领域古诗');
});

it('derives direction order from poem lines, distinguishes diagram positions and constrains writing comparisons', () => {
  const l = jiangnanLesson;
  const poem = l.questions.find((q) =>
    q.id.endsWith('-q-reading-direction'),
  )!.material!;
  const lines = poem
    .split('\n')
    .filter((line) => /^鱼戏莲叶[东西南北]/.test(line));
  expect(lines.map((line) => line.slice(4, 5))).toEqual([
    '东',
    '西',
    '南',
    '北',
  ]);
  expect(l.steps[4]!.text).toContain('未标指南针');
  expect(l.steps[3]!.text).toContain('不要求鱼真实按固定路线游');
  expect(
    l.questions.find((q) => q.id.endsWith('-q-writing-scope'))!.prompt,
  ).toContain('只比较叶与南');
  expect(
    l.reviewQuestions!.find((q) => q.id.endsWith('-r-writing-scope'))!.prompt,
  ).toContain('只比较西与北');
  expect(l.questions.find((q) => q.id.endsWith('-q-word-sound'))!.rule).toEqual(
    { kind: 'choice', value: 'jiān' },
  );
  const all = [...l.questions, ...l.reviewQuestions!];
  expect(new Set(all.map((q) => q.id)).size).toBe(all.length);
  for (const q of all) {
    if (q.rule.kind !== 'choice') continue;
    const expected = q.rule.value;
    expect(q.choices!.filter((c) => c.id === expected)).toHaveLength(1);
    for (const c of q.choices!)
      expect(evaluate(q.rule, c.id)).toBe(c.id === expected);
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

it('retains wrong-first direction evidence and null manual/reflections with changed poem conditions in review', () => {
  const now = '2026-10-01T00:00:00.000Z';
  const s = createSession(jiangnanLesson, chineseBooks[0]!.id, 'child', {
    seed: 16,
    now,
  });
  s.phase = 'practice';
  for (const [i, q] of s.questions.entries()) {
    if (q.id.endsWith('-q-reading-direction'))
      s.responses[i] = submitResponse(
        q,
        { ...s.responses[i]!, draft: '北' },
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
            : '想再读一遍。\n这是计划。';
        })(),
      },
      now,
    );
    if (q.rule.kind !== 'choice')
      expect(s.responses[i]!.submissions.at(-1)!.correct).toBeNull();
  }
  expect(s.responses.filter((r) => r.submissions.length === 2)).toHaveLength(1);
  const review = newReviewQuestions(jiangnanLesson, s, [s]);
  expect(review).toHaveLength(1);
  expect(review[0]!.rule).toEqual({ kind: 'choice', value: '南' });
  expect(evaluate(review[0]!.rule, '东')).toBe(false);
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

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { upperCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  gardenFiveLesson,
  gardenFiveOppositePairs,
  gardenFivePageAudit,
} from './chinese-garden-five';

it('covers all five inspected pages including oral communication and adapted translated reading with exact character and task scope', () => {
  const l = gardenFiveLesson;
  expect(chineseBooks[0]!.units.flatMap((u) => u.lessons)).toContain(l);
  expect(l.id).toBe('cu-u5-5');
  expect(gardenFivePageAudit.pages).toEqual([68, 69, 70, 71, 72]);
  expect(gardenFivePageAudit.recognize).toBe(
    upperCharacters['u5-5']!.recognize,
  );
  expect(gardenFivePageAudit.write).toBe(upperCharacters['u5-5']!.write);
  expect(gardenFivePageAudit.storyAuthor).toBe('阿·尼·托尔斯泰');
  expect(gardenFivePageAudit.translator).toBe('司徒贞');
  expect(gardenFivePageAudit.adapted).toBe(true);
  expect(gardenFivePageAudit.provider).toContain('第三方');
  for (const field of ['isbn', 'editionDate', 'printingDate'] as const)
    expect(gardenFivePageAudit[field]).toBeNull();
  expect(l.steps).toHaveLength(12);
  expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(31);
  expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(11);
  expect(l.questions.filter((q) => q.rule.kind === 'reflection')).toHaveLength(
    2,
  );
  expect(l.reviewQuestions).toHaveLength(31);
  expect(
    l.questions
      .filter((q) => q.id.includes('-q-char-'))
      .map((q) => (q.rule.kind === 'choice' ? q.rule.value : ''))
      .join(''),
  ).toBe('男女关正反先后内外');
  expect(
    l.questions.find((q) => q.id.endsWith('-manual-write'))!.prompt,
  ).toContain('女开关先');
  expect(
    l.questions.find((q) => q.id.endsWith('-manual-intro'))!.knowledge,
  ).not.toBe(
    l.questions.find((q) => q.id.endsWith('-manual-conversation'))!.knowledge,
  );
});

it('changes paired vocabulary conditions, keeps fictional names and open preferences separate and distinguishes printed ending from illustration', () => {
  const l = gardenFiveLesson;
  expect(gardenFiveOppositePairs).toEqual([
    ['南', '北'],
    ['男', '女'],
    ['开', '关'],
    ['正', '反'],
    ['先', '后'],
    ['内', '外'],
  ]);
  for (const [i, [a, b]] of gardenFiveOppositePairs.entries()) {
    expect(
      l.questions.find((q) => q.id.endsWith(`-q-pair-${i}`))!.rule,
    ).toEqual({ kind: 'choice', value: b });
    expect(
      l.reviewQuestions!.find((q) => q.id.endsWith(`-r-pair-${i}`))!.rule,
    ).toEqual({ kind: 'choice', value: a });
  }
  expect(l.steps[4]!.text).toContain('原创虚构卡');
  expect(l.steps[4]!.text).toContain('不要求录入网站');
  expect(l.steps[7]!.text).toContain('不强迫持续对视');
  expect(l.steps[10]!.text).toContain('自己的结尾是想法');
  expect(
    l.questions.find((q) => q.id.endsWith('-q-reading-result'))!.rule,
  ).toEqual({ kind: 'choice', value: '拔不动' });
  const picture = l.reviewQuestions!.find((q) =>
    q.id.endsWith('-r-reading-result'),
  )!;
  expect(picture.rule).toEqual({ kind: 'choice', value: '萝卜已拔出' });
  expect(picture.material).toContain('不把图示改称印刷结尾文字');
  expect(
    l.questions.find((q) => q.id.endsWith('-manual-season'))!.rule.kind,
  ).toBe('manual');
  expect(
    l.questions.find((q) => q.id.endsWith('-reflect-expression'))!.rule.kind,
  ).toBe('reflection');
  const all = [...l.questions, ...l.reviewQuestions!];
  expect(new Set(all.map((q) => q.id)).size).toBe(all.length);
  for (const q of all) {
    if (q.rule.kind !== 'choice') continue;
    const expected = q.rule.value;
    expect(q.choices!.filter((c) => c.id === expected)).toHaveLength(1);
    for (const c of q.choices!)
      expect(evaluate(q.rule, c.id)).toBe(c.id === expected);
    if (q.id.includes('-reading-') && !q.id.includes('-reading-credit'))
      expect(q.material).toContain('共读教材印刷第71—72页');
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

it('preserves wrong-first caller history and null real/open evidence in backups with changed caller review', () => {
  const now = '2026-10-01T00:00:00.000Z';
  const s = createSession(gardenFiveLesson, chineseBooks[0]!.id, 'child', {
    seed: 19,
    now,
  });
  s.phase = 'practice';
  for (const [i, q] of s.questions.entries()) {
    if (q.id.endsWith('-q-reading-caller'))
      s.responses[i] = submitResponse(
        q,
        { ...s.responses[i]!, draft: '小狗' },
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
            : '计划下次介绍画画兴趣。\n尚未交流。';
        })(),
      },
      now,
    );
    if (q.rule.kind !== 'choice')
      expect(s.responses[i]!.submissions.at(-1)!.correct).toBeNull();
  }
  expect(s.responses.filter((r) => r.submissions.length === 2)).toHaveLength(1);
  const review = newReviewQuestions(gardenFiveLesson, s, [s]);
  expect(review).toHaveLength(1);
  expect(review[0]!.rule).toEqual({ kind: 'choice', value: '老婆婆' });
  expect(evaluate(review[0]!.rule, '老公公')).toBe(false);
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

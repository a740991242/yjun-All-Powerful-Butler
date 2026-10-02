import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { upperCharacters } from './characters';
import { chineseBooks } from './chinese';
import { autumnLesson, autumnPageAudit } from './chinese-autumn';
import { firstReading } from './chinese-first-packs';

it('publishes the inspected autumn body separately from old supplements with exact read/write and task scope', () => {
  const lessons = chineseBooks[0]!.units.flatMap((u) => u.lessons);
  expect(lessons).toContain(autumnLesson);
  expect(lessons).toContain(firstReading);
  expect(firstReading.id).not.toBe(autumnLesson.id);
  expect(firstReading.questions).toHaveLength(6);
  expect(autumnLesson.id).toBe('cu-u5-1');
  expect(autumnPageAudit.pages).toEqual([60, 61]);
  expect(autumnPageAudit.recognize).toBe(upperCharacters['u5-1']!.recognize);
  expect(autumnPageAudit.write).toBe(upperCharacters['u5-1']!.write);
  expect(autumnPageAudit.provider).toContain('第三方');
  for (const field of ['isbn', 'editionDate', 'printingDate'] as const)
    expect(autumnPageAudit[field]).toBeNull();
  expect(autumnPageAudit.sourceNote).toContain('未署个人作者');
  expect(autumnLesson.steps).toHaveLength(8);
  expect(
    autumnLesson.questions.filter((q) => q.rule.kind === 'choice'),
  ).toHaveLength(21);
  expect(
    autumnLesson.questions.filter((q) => q.rule.kind === 'manual'),
  ).toHaveLength(7);
  expect(
    autumnLesson.questions.filter((q) => q.rule.kind === 'reflection'),
  ).toHaveLength(2);
  expect(autumnLesson.reviewQuestions).toHaveLength(21);
  expect(
    autumnLesson.questions
      .filter((q) => q.id.includes('-q-char-'))
      .map((q) => (q.rule.kind === 'choice' ? q.rule.value : ''))
      .join(''),
  ).toBe('秋气了树叶黄片从来飞');
  expect(
    autumnLesson.questions.find((q) => q.id.endsWith('-manual-write'))!.prompt,
  ).toContain('了子大人');
  const read = autumnLesson.questions.find((q) =>
    q.id.endsWith('-manual-read'),
  )!;
  const recite = autumnLesson.questions.find((q) =>
    q.id.endsWith('-manual-recite'),
  )!;
  expect(read.rule.kind).toBe('manual');
  expect(recite.rule.kind).toBe('manual');
  expect(read.knowledge).not.toBe(recite.knowledge);
});

it('distinguishes natural paragraph indentation, context-dependent yi and light le without mechanical screen or sound scoring', () => {
  const main = autumnLesson.questions;
  const review = autumnLesson.reviewQuestions!;
  const answer = (suffix: string, questions = main) => {
    const q = questions.find((q) => q.id.endsWith(suffix))!;
    return q.rule.kind === 'choice' ? q.rule.value : null;
  };
  expect(answer('-q-paragraph-count')).toBe('3');
  expect(answer('-r-paragraph-count', review)).toBe('2');
  expect(answer('-q-paragraph-rule')).toBe('段首空两个字的位置');
  expect(answer('-r-paragraph-rule', review)).toBe('屏幕太窄自动换行');
  expect(answer('-q-tone-single')).toBe('yī');
  expect(answer('-q-tone-piece')).toBe('yí');
  expect(answer('-q-tone-group')).toBe('yì');
  expect(answer('-r-tone-piece', review)).toBe('yí');
  expect(answer('-r-tone-group', review)).toBe('yí');
  expect(answer('-q-word-sound')).toBe('le');
  expect(autumnLesson.steps[3]!.text).toContain('自动换行不能');
  expect(autumnLesson.steps[4]!.text).toContain('一会儿yí huìr');
  expect(autumnLesson.steps[6]!.text).toContain('朗读完成不等于已经背诵');
  const all = [...main, ...review];
  expect(new Set(all.map((q) => q.id)).size).toBe(all.length);
  for (const q of all) {
    if (q.rule.kind !== 'choice') continue;
    const expected = q.rule.value;
    expect(q.choices!.filter((c) => c.id === expected)).toHaveLength(1);
    for (const c of q.choices!)
      expect(evaluate(q.rule, c.id)).toBe(c.id === expected);
    if (q.id.includes('-reading-'))
      expect(q.material).toContain('共读教材印刷第60页');
  }
  for (const q of review)
    expect(
      main.some(
        (m) =>
          JSON.stringify([m.prompt, m.material, m.visual]) ===
          JSON.stringify([q.prompt, q.material, q.visual]),
      ),
    ).toBe(false);
});

it('preserves wrong-first geese history, real activities and plans through backup and changes review to formation', () => {
  const now = '2026-10-01T00:00:00.000Z';
  const s = createSession(autumnLesson, chineseBooks[0]!.id, 'child', {
    seed: 15,
    now,
  });
  s.phase = 'practice';
  for (const [i, q] of s.questions.entries()) {
    if (q.id.endsWith('-q-reading-geese'))
      s.responses[i] = submitResponse(
        q,
        { ...s.responses[i]!, draft: '口' },
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
            : '想看看树叶。\n这是计划。';
        })(),
      },
      now,
    );
    if (q.rule.kind !== 'choice')
      expect(s.responses[i]!.submissions.at(-1)!.correct).toBeNull();
  }
  expect(s.responses.filter((r) => r.submissions.length === 2)).toHaveLength(1);
  const review = newReviewQuestions(autumnLesson, s, [s]);
  expect(review).toHaveLength(1);
  expect(review[0]!.rule).toEqual({ kind: 'choice', value: '一' });
  expect(evaluate(review[0]!.rule, '南')).toBe(false);
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

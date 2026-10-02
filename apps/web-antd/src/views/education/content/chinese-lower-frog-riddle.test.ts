import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { lowerCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  lowerFrogRiddleLessons,
  lowerFrogRiddlePageAudits,
  lowerFrogRiddleSource,
} from './chinese-lower-frog-riddle';
import { lowerRecognitionPacks } from './chinese-lower-recognition';
it('keeps exact pages, recognition and writing, actual reading and independent supplement identity', () => {
  const all = chineseBooks[1]!.units.flatMap((u) => u.lessons);
  for (const [itemId, steps, objective, manual, pages, radicals] of [
    ['u1-3', 8, 20, 7, [6, 7], ['目字旁', '竖心旁']],
    ['u1-4', 9, 25, 8, [8, 9], ['走之', '又字旁', '竖心旁', '力字旁']],
  ] as const) {
    const a = lowerFrogRiddlePageAudits.find((x) => x.itemId === itemId)!;
    const l = lowerFrogRiddleLessons[itemId]!;
    expect(all.find((x) => x.id === `cl-${itemId}`)).toBe(l);
    expect(all).toContain(lowerRecognitionPacks[itemId]);
    expect(l.id).not.toBe(lowerRecognitionPacks[itemId]!.id);
    expect(l.status).toBe('available');
    expect(l.steps).toHaveLength(steps);
    expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(
      objective,
    );
    expect(l.reviewQuestions).toHaveLength(objective);
    expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
      manual,
    );
    expect(
      l.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(2);
    expect(a.pages).toEqual(pages);
    expect(a.newRadicals).toEqual(radicals);
    expect(a.reciteRequired).toBe(false);
    expect(a.author).toBeNull();
    expect(a.recognize).toBe(lowerCharacters[itemId]!.recognize);
    expect(a.write).toBe(lowerCharacters[itemId]!.write);
    expect(
      l.questions
        .filter((q) => q.id.includes('-q-char-'))
        .map((q) => (q.rule.kind === 'choice' ? q.rule.value : ''))
        .join(''),
    ).toBe(a.recognize);
    expect(l.questions.some((q) => q.id.endsWith('-manual-recite'))).toBe(
      false,
    );
    expect(
      l.questions.find((q) => q.id.endsWith('-manual-write'))!.prompt,
    ).toContain(a.write);
  }
  for (const key of ['isbn', 'editionDate', 'printingDate'] as const)
    expect(lowerFrogRiddleSource[key]).toBeNull();
  expect(lowerFrogRiddlePageAudits[0]!.sourceCredit).toContain('有改动');
  expect(lowerFrogRiddlePageAudits[1]!.sourceCredit).toContain('小学语文室');
});
it('uses actual word/part conditions, changed review directions and open riddle activity', () => {
  const frog = lowerFrogRiddleLessons['u1-3']!;
  const riddle = lowerFrogRiddleLessons['u1-4']!;
  for (const [l, key, main, review] of [
    [frog, 'word-0', '睛', '目字旁'],
    [frog, 'role', '禾苗', '害虫'],
    [frog, 'radical', '目字旁', '竖心旁'],
    [riddle, 'riddle-one', '秋', '禾'],
    [riddle, 'part', '火', '禾'],
    [riddle, 'riddle-two', '青', '晴'],
    [riddle, 'radical-0', '走之', '边'],
  ] as const) {
    expect(l.questions.find((q) => q.id.endsWith(`-q-${key}`))!.rule).toEqual({
      kind: 'choice',
      value: main,
    });
    expect(
      l.reviewQuestions!.find((q) => q.id.endsWith(`-r-${key}`))!.rule,
    ).toEqual({ kind: 'choice', value: review });
  }
  expect(
    riddle.questions.find((q) => q.id.endsWith('-manual-game'))!.prompt,
  ).toContain('不强判唯一谜底');
  for (const l of [frog, riddle]) {
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
  }
});
it.each([
  ['u1-3', 'role', '害虫'],
  ['u1-4', 'riddle-one', '禾'],
] as const)(
  'preserves wrong first, skipped manual and ungraded reflection through backup and review %s',
  (itemId, key, newValue) => {
    const l = lowerFrogRiddleLessons[itemId]!;
    const now = '2026-10-01T00:00:00.000Z';
    const s = createSession(l, chineseBooks[1]!.id, 'child', { seed: 18, now });
    s.phase = 'practice';
    let old = '';
    for (const [i, q] of s.questions.entries()) {
      if (q.id.endsWith(`-q-${key}`) && q.rule.kind === 'choice') {
        old = q.rule.value;
        s.responses[i] = submitResponse(
          q,
          {
            ...s.responses[i]!,
            draft: q.choices!.find((c) => c.id !== old)!.id,
          },
          now,
        );
        expect(s.responses[i]!.submissions.at(-1)!.correct).toBe(false);
      }
      if (q.rule.kind === 'manual') {
        s.responses[i] = { ...s.responses[i]!, skipped: true };
        continue;
      }
      s.responses[i] = submitResponse(
        q,
        {
          ...s.responses[i]!,
          draft:
            q.rule.kind === 'choice'
              ? q.rule.value
              : '我发现了一个字，下一次想再练。',
        },
        now,
      );
      if (q.rule.kind === 'reflection')
        expect(s.responses[i]!.submissions.at(-1)!.correct).toBeNull();
    }
    const restored = parseBackup(
      exportBackup({
        schemaVersion: 1,
        activeProfileId: 'child',
        profiles: [{ id: 'child', nickname: '测试', createdAt: now }],
        sessions: [s],
      }),
    );
    expect(restored.data.sessions[0]!.responses).toEqual(s.responses);
    const review = newReviewQuestions(l, s, [s]);
    expect(review).toHaveLength(1);
    expect(review[0]!.rule).toEqual({ kind: 'choice', value: newValue });
    expect(evaluate(review[0]!.rule, old)).toBe(false);
  },
);

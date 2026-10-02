import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { upperCharacters } from './characters';
import { chineseBooks } from './chinese';
import { tailPairs, tailsLesson, tailsPageAudit } from './chinese-tails';

it('publishes the observed formal lesson separately from recognition history with exact character and activity scopes', () => {
  const l = tailsLesson;
  const lessons = chineseBooks[0]!.units.flatMap((u) => u.lessons);
  expect(lessons).toContain(l);
  expect(l.id).toBe('cu-u8-1');
  expect(tailsPageAudit.pages).toEqual([95, 96]);
  expect(tailsPageAudit.recognize).toBe(upperCharacters['u8-1']!.recognize);
  expect(tailsPageAudit.write).toBe(upperCharacters['u8-1']!.write);
  for (const field of ['isbn', 'editionDate', 'printingDate'] as const)
    expect(tailsPageAudit[field]).toBeNull();
  expect(tailsPageAudit.provider).toContain('第三方');
  expect(l.steps).toHaveLength(8);
  expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(20);
  expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(7);
  expect(l.questions.filter((q) => q.rule.kind === 'reflection')).toHaveLength(
    2,
  );
  expect(
    l.questions
      .filter((q) => q.id.includes('-q-char-'))
      .map((q) => (q.rule.kind === 'choice' ? q.rule.value : ''))
      .join(''),
  ).toBe('比尾巴谁长短把伞兔最公');
  for (const key of ['read', 'recite', 'pairs', 'game', 'talk', 'write'])
    expect(
      l.questions.find((q) => q.id.endsWith(`-manual-${key}`))!.rule.kind,
    ).toBe('manual');
  expect(
    l.questions.find((q) => q.id.endsWith('-manual-write'))!.prompt,
  ).toContain('比巴长公');
});
it('uses six exact textual descriptions while keeping personal preference and actual question games open', () => {
  const l = tailsLesson;
  expect(tailsPageAudit.author).toBe('崔宏明');
  expect(tailsPageAudit.adapted).toBe(true);
  expect(tailPairs).toEqual([
    ['猴子', '长'],
    ['兔子', '短'],
    ['松鼠', '好像一把伞'],
    ['公鸡', '弯'],
    ['鸭子', '扁'],
    ['孔雀', '最好看'],
  ]);
  for (const [i, [animal, description]] of tailPairs.entries()) {
    expect(
      l.questions.find((q) => q.id.endsWith(`-q-tail-${i}`))!.rule,
    ).toEqual({ kind: 'choice', value: description });
    expect(
      l.reviewQuestions!.find((q) => q.id.endsWith(`-r-tail-${i}`))!.rule,
    ).toEqual({ kind: 'choice', value: animal });
  }
  for (const [key, main, review] of [
    ['sound', 'ba', 'de'],
    ['writing-scope', '比', '公'],
    ['question-answer', '你喜欢哪一种动物？', '我喜欢小猫。'],
  ]) {
    expect(l.questions.find((q) => q.id.endsWith(`-q-${key}`))!.rule).toEqual({
      kind: 'choice',
      value: main,
    });
    expect(
      l.reviewQuestions!.find((q) => q.id.endsWith(`-r-${key}`))!.rule,
    ).toEqual({ kind: 'choice', value: review });
  }
  expect(l.steps[1]!.text).toContain('不是真的雨伞');
  expect(l.steps[2]!.text).toContain('不以个人偏好唯一判分');
  expect(l.steps[6]!.text).toContain('不是教材原句');
  expect(l.steps[5]!.text).toContain('不因朗读完成就算背过');
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
  const s = createSession(tailsLesson, chineseBooks[0]!.id, 'child', {
    seed: 18,
    now,
  });
  s.phase = 'practice';
  for (const [i, q] of s.questions.entries()) {
    if (q.id.endsWith('-q-tail-0'))
      s.responses[i] = submitResponse(
        q,
        { ...s.responses[i]!, draft: '短' },
        now,
      );
    s.responses[i] = submitResponse(
      q,
      {
        ...s.responses[i]!,
        draft: (() => {
          if (q.rule.kind === 'choice') return q.rule.value;
          return q.rule.kind === 'manual' ? 'confirmed' : '下次想练比字。';
        })(),
      },
      now,
    );
    if (q.rule.kind !== 'choice')
      expect(s.responses[i]!.submissions.at(-1)!.correct).toBeNull();
  }
  expect(s.responses.filter((r) => r.submissions.length === 2)).toHaveLength(1);
  const review = newReviewQuestions(tailsLesson, s, [s]);
  expect(review).toHaveLength(1);
  expect(review[0]!.rule).toEqual({ kind: 'choice', value: '猴子' });
  expect(evaluate(review[0]!.rule, '长')).toBe(false);
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

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { upperCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  gardenSevenFamilyWords,
  gardenSevenLesson,
  gardenSevenPageAudit,
  gardenSevenProverbs,
} from './chinese-garden-seven';

it('publishes the observed formal lesson separately from recognition history with exact character and activity scopes', () => {
  const l = gardenSevenLesson;
  const lessons = chineseBooks[0]!.units.flatMap((u) => u.lessons);
  expect(lessons).toContain(l);
  expect(l.id).toBe('cu-u7-4');
  expect(gardenSevenPageAudit.pages).toEqual([90, 91, 92, 93, 94]);
  expect(gardenSevenPageAudit.recognize).toBe(
    upperCharacters['u7-4']!.recognize,
  );
  expect(gardenSevenPageAudit.write).toBe(upperCharacters['u7-4']!.write);
  for (const field of ['isbn', 'editionDate', 'printingDate'] as const)
    expect(gardenSevenPageAudit[field]).toBeNull();
  expect(gardenSevenPageAudit.provider).toContain('第三方');
  expect(l.steps).toHaveLength(12);
  expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(20);
  expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(12);
  expect(l.questions.filter((q) => q.rule.kind === 'reflection')).toHaveLength(
    2,
  );
  expect(
    l.questions
      .filter((q) => q.id.includes('-q-char-'))
      .map((q) => (q.rule.kind === 'choice' ? q.rule.value : ''))
      .join(''),
  ).toBe('爷奶叔姐妹');
  for (const key of [
    'read',
    'retell',
    'family-words',
    'compare-write',
    'direction-read',
    'direction-recite',
    'voice',
    'write',
  ])
    expect(
      l.questions.find((q) => q.id.endsWith(`-manual-${key}`))!.rule.kind,
    ).toBe('manual');
  expect(
    l.questions.find((q) => q.id.endsWith('-manual-write'))!.prompt,
  ).toContain('爸妈');
});
it('covers the observed five pages without treating predictions, volume or personal family details as automatically graded', () => {
  const l = gardenSevenLesson;
  expect(gardenSevenPageAudit.storySource).toBe('陈鹤琴等编《儿童故事》');
  expect(gardenSevenPageAudit.adapted).toBe(true);
  for (const [key, main, review] of [
    ['shape-one', '才', '四'],
    ['shape-two', '山', '心'],
    ['component', '日', '女'],
    ['direction-front', '东', '西'],
    ['direction-side', '北', '南'],
    ['reading-caller', '小猴子', '老猴子'],
    ['reading-place', '井里', '天上'],
    ['reading-ending', '不见了', '不用捞了'],
    ['voice', '轻声清楚地询问', '适当提高声音让全班听清'],
  ]) {
    expect(l.questions.find((q) => q.id.endsWith(`-q-${key}`))!.rule).toEqual({
      kind: 'choice',
      value: main,
    });
    expect(
      l.reviewQuestions!.find((q) => q.id.endsWith(`-r-${key}`))!.rule,
    ).toEqual({ kind: 'choice', value: review });
  }
  expect(l.steps[1]!.text).toContain('虚构人物');
  expect(l.steps[3]!.text).toContain('已有字复用');
  expect(l.steps[5]!.text).toContain('不把太阳图当全年精确指南针');
  expect(l.steps[8]!.text).toContain('不录音');
  expect(l.steps[10]!.text).toContain('叫喊不是月亮真落井的证据');
  expect(gardenSevenFamilyWords).toHaveLength(14);
  expect(gardenSevenProverbs).toEqual([
    '种瓜得瓜，种豆得豆。',
    '前人栽树，后人乘凉。',
    '千里之行，始于足下。',
    '百尺竿头，更进一步。',
  ]);
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
  const s = createSession(gardenSevenLesson, chineseBooks[0]!.id, 'child', {
    seed: 18,
    now,
  });
  s.phase = 'practice';
  for (const [i, q] of s.questions.entries()) {
    if (q.id.endsWith('-q-reading-place'))
      s.responses[i] = submitResponse(
        q,
        { ...s.responses[i]!, draft: '书包里' },
        now,
      );
    s.responses[i] = submitResponse(
      q,
      {
        ...s.responses[i]!,
        draft: (() => {
          if (q.rule.kind === 'choice') return q.rule.value;
          return q.rule.kind === 'manual' ? 'confirmed' : '下次想练爸字。';
        })(),
      },
      now,
    );
    if (q.rule.kind !== 'choice')
      expect(s.responses[i]!.submissions.at(-1)!.correct).toBeNull();
  }
  expect(s.responses.filter((r) => r.submissions.length === 2)).toHaveLength(1);
  const review = newReviewQuestions(gardenSevenLesson, s, [s]);
  expect(review).toHaveLength(1);
  expect(review[0]!.rule).toEqual({ kind: 'choice', value: '天上' });
  expect(evaluate(review[0]!.rule, '井里')).toBe(false);
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

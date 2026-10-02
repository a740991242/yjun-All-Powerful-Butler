import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { upperCharacters } from './characters';
import { chineseBooks } from './chinese';
import { flagLesson, flagPageAudit } from './chinese-flag';
import { upperRecognitionPacks } from './chinese-upper-recognition';

it('publishes the observed formal lesson separately from recognition history with exact character and activity scopes', () => {
  const l = flagLesson;
  const lessons = chineseBooks[0]!.units.flatMap((u) => u.lessons);
  expect(lessons).toContain(l);
  expect(l.id).toBe('cu-u6-4');
  expect(lessons).toContain(upperRecognitionPacks['u6-4']);
  expect(upperRecognitionPacks['u6-4']!.id).not.toBe(l.id);
  expect(flagPageAudit.pages).toEqual([78, 79]);
  expect(flagPageAudit.recognize).toBe(upperCharacters['u6-4']!.recognize);
  expect(flagPageAudit.write).toBe(upperCharacters['u6-4']!.write);
  for (const field of [
    'author',
    'isbn',
    'editionDate',
    'printingDate',
  ] as const)
    expect(flagPageAudit[field]).toBeNull();
  expect(flagPageAudit.provider).toContain('第三方');
  expect(l.steps).toHaveLength(8);
  expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(17);
  expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(6);
  expect(l.questions.filter((q) => q.rule.kind === 'reflection')).toHaveLength(
    1,
  );
  expect(
    l.questions
      .filter((q) => q.id.includes('-q-char-'))
      .map((q) => (q.rule.kind === 'choice' ? q.rule.value : ''))
      .join(''),
  ).toBe('升国旗中们声起多么向立');
  for (const key of ['read', 'recite', 'words', 'talk', 'write'])
    expect(
      l.questions.find((q) => q.id.endsWith(`-manual-${key}`))!.rule.kind,
    ).toBe('manual');
  expect(
    l.questions.find((q) => q.id.endsWith('-manual-write'))!.prompt,
  ).toContain('中五风立正');
});
it('uses contextual homophones and light tones and keeps textual pose descriptions separate from actual ceremonies', () => {
  const l = flagLesson;
  expect(flagPageAudit.adapted).toBe(true);
  expect(flagPageAudit.sourceNote).toContain('九年一贯制试用课本');
  expect(flagPageAudit.activities).toContain('朗读课文');
  expect(flagPageAudit.activities).toContain('背诵课文');
  for (const [key, main, review] of [
    ['pose', '立正', '敬礼'],
    ['homophone', '升', '声'],
    ['sound-light', 'men', 'me'],
    ['flag-name', '五星红旗', '中国'],
    ['scene', '慢慢', '迎风'],
    ['writing-scope', '中', '正'],
  ]) {
    expect(l.questions.find((q) => q.id.endsWith(`-q-${key}`))!.rule).toEqual({
      kind: 'choice',
      value: main,
    });
    expect(
      l.reviewQuestions!.find((q) => q.id.endsWith(`-r-${key}`))!.rule,
    ).toEqual({ kind: 'choice', value: review });
  }
  expect(l.steps[3]!.text).toContain('不能用它推算真实速度');
  expect(l.steps[4]!.text).toContain('不因答对自动认定');
  expect(l.steps[4]!.text).toContain('自身情况');
  expect(l.steps[6]!.text).toContain('不把朗读确认当背诵完成');
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
  const s = createSession(flagLesson, chineseBooks[0]!.id, 'child', {
    seed: 18,
    now,
  });
  s.phase = 'practice';
  for (const [i, q] of s.questions.entries()) {
    if (q.id.endsWith('-q-pose'))
      s.responses[i] = submitResponse(
        q,
        { ...s.responses[i]!, draft: '四处跑' },
        now,
      );
    s.responses[i] = submitResponse(
      q,
      {
        ...s.responses[i]!,
        draft: (() => {
          if (q.rule.kind === 'choice') return q.rule.value;
          return q.rule.kind === 'manual' ? 'confirmed' : '下次想练风字。';
        })(),
      },
      now,
    );
    if (q.rule.kind !== 'choice')
      expect(s.responses[i]!.submissions.at(-1)!.correct).toBeNull();
  }
  expect(s.responses.filter((r) => r.submissions.length === 2)).toHaveLength(1);
  const review = newReviewQuestions(flagLesson, s, [s]);
  expect(review).toHaveLength(1);
  expect(review[0]!.rule).toEqual({ kind: 'choice', value: '敬礼' });
  expect(evaluate(review[0]!.rule, '立正')).toBe(false);
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

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { characterSources, lowerCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  lowerFirstReadingLessons,
  lowerFirstReadingPageAudits,
  lowerFirstReadingSource,
  lowerFirstScenes,
  lowerFirstSurnameComponents,
  lowerFirstWeather,
} from './chinese-lower-first-reading';
import { lowerRecognitionPacks } from './chinese-lower-recognition';

it('publishes the actual two-page lessons and exact recognition/writing scopes while preserving independent supplements', () => {
  const all = chineseBooks[1]!.units.flatMap((u) => u.lessons);
  for (const [itemId, steps, objective, manual] of [
    ['u1-1', 8, 22, 8],
    ['u1-2', 11, 23, 9],
  ] as const) {
    const audit = lowerFirstReadingPageAudits.find((a) => a.itemId === itemId)!;
    const l = lowerFirstReadingLessons[itemId]!;
    expect(all.filter((x) => x.id === `cl-${itemId}`)).toEqual([l]);
    expect(l.status).toBe('available');
    expect(all).toContain(lowerRecognitionPacks[itemId]);
    expect(lowerRecognitionPacks[itemId]!.id).not.toBe(l.id);
    expect(l.steps).toHaveLength(steps);
    expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(
      objective,
    );
    expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
      manual,
    );
    expect(
      l.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(2);
    expect(l.reviewQuestions).toHaveLength(objective);
    expect(audit.author).toBeNull();
    expect(audit.reciteRequired).toBe(true);
    expect(audit.recognize).toBe(lowerCharacters[itemId]!.recognize);
    expect(audit.write).toBe(lowerCharacters[itemId]!.write);
    expect(
      l.questions
        .filter((q) => q.id.includes('-q-char-'))
        .map((q) => (q.rule.kind === 'choice' ? q.rule.value : ''))
        .join(''),
    ).toBe(audit.recognize);
    for (const key of ['read', 'recite', 'write'])
      expect(
        l.questions.find((q) => q.id.endsWith(`-manual-${key}`))!.rule.kind,
      ).toBe('manual');
    expect(
      l.questions.find((q) => q.id.endsWith('-manual-write'))!.prompt,
    ).toContain(audit.write);
  }
  expect(lowerFirstReadingPageAudits.map((a) => a.pages)).toEqual([
    [2, 3],
    [4, 5],
  ]);
  expect(characterSources.lower.verifiedWritingLessonPages).toMatchObject({
    'u1-1': 3,
    'u1-2': 5,
    'u1-3': 7,
    'u1-4': 9,
  });
  expect(characterSources.lower.writingLessonSource).toMatchObject({
    url: 'https://keben.app/book/0026',
    provider: '第三方原书公开预览',
  });
  for (const key of ['isbn', 'editionDate', 'printingDate'] as const)
    expect(lowerFirstReadingSource[key]).toBeNull();
});
it('matches the observed weather, scene and surname conditions without turning mnemonics into natural laws or real identity', () => {
  expect(lowerFirstWeather).toEqual([
    ['春风', '春', '风', '吹'],
    ['夏雨', '夏', '雨', '落'],
    ['秋霜', '秋', '霜', '降'],
    ['冬雪', '冬', '雪', '飘'],
  ]);
  expect(lowerFirstScenes).toEqual([
    ['青草', '青'],
    ['红花', '红'],
    ['游鱼', '出水'],
    ['飞鸟', '入林'],
  ]);
  expect(lowerFirstSurnameComponents).toEqual([
    ['李', '木和子'],
    ['张', '弓和长'],
    ['胡', '古和月'],
    ['吴', '口和天'],
    ['徐', '双人旁和余'],
    ['许', '言字旁和午'],
  ]);
  for (const [itemId, key, main, review] of [
    ['u1-1', 'season-0', '风', '春'],
    ['u1-1', 'verb-2', '降', '秋霜'],
    ['u1-1', 'scene-2', '出水', '游鱼'],
    ['u1-1', 'radical', '雨字头', '霜'],
    ['u1-1', 'writing', '春', '吹'],
    ['u1-2', 'composition-0', '李', '木和子'],
    ['u1-2', 'compound-one', '诸葛', '东方'],
    ['u1-2', 'compound-two', '上官', '欧阳'],
    ['u1-2', 'sound', 'shén', 'shì'],
    ['u1-2', 'writing', '什', '双'],
    ['u1-2', 'radical-shen', '单人旁', '什'],
    ['u1-2', 'radical-gong', '弓字旁', '弓'],
    ['u1-2', 'radical-zi', '子字旁', '子'],
  ]) {
    const l = lowerFirstReadingLessons[itemId!]!;
    expect(l.questions.find((q) => q.id.endsWith(`-q-${key}`))!.rule).toEqual({
      kind: 'choice',
      value: main,
    });
    expect(
      l.reviewQuestions!.find((q) => q.id.endsWith(`-r-${key}`))!.rule,
    ).toEqual({ kind: 'choice', value: review });
  }
  const spring = lowerFirstReadingLessons['u1-1']!;
  const surname = lowerFirstReadingLessons['u1-2']!;
  expect(spring.steps[2]!.text).toContain('不意味着霜像雨滴从天空落下');
  expect(spring.steps[1]!.text).toContain('不要求四季在所有地区');
  expect(surname.steps[3]!.text).toContain('不当所有姓字来源');
  expect(surname.steps[5]!.text).toContain('不是所有双字名称都是复姓');
  expect(
    surname.questions.find((q) => q.id.endsWith('-manual-optional'))!.prompt,
  ).toContain('未选择或无资料可跳过');
  for (const l of [spring, surname]) {
    const all = [...l.questions, ...l.reviewQuestions!];
    expect(new Set(all.map((q) => q.id)).size).toBe(all.length);
    for (const q of all) {
      if (q.rule.kind !== 'choice') continue;
      const value = q.rule.value;
      expect(new Set(q.choices!.map((c) => c.id)).size).toBe(q.choices!.length);
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
  }
});
it.each([
  ['u1-1', 'verb-0', '春风'],
  ['u1-2', 'composition-0', '木和子'],
] as const)(
  'keeps wrong-first, manual and reflection evidence for %s through backup and changed-condition review',
  (itemId, key, value) => {
    const l = lowerFirstReadingLessons[itemId]!;
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
      s.responses[i] = submitResponse(
        q,
        {
          ...s.responses[i]!,
          draft: (() => {
            if (q.rule.kind === 'choice') return q.rule.value;
            return q.rule.kind === 'manual'
              ? 'confirmed'
              : '下一次想再练一个字。';
          })(),
        },
        now,
      );
      if (q.rule.kind !== 'choice')
        expect(s.responses[i]!.submissions.at(-1)!.correct).toBeNull();
    }
    expect(s.responses.filter((r) => r.submissions.length === 2)).toHaveLength(
      1,
    );
    const review = newReviewQuestions(l, s, [s]);
    expect(review).toHaveLength(1);
    expect(review[0]!.rule).toEqual({ kind: 'choice', value });
    expect(evaluate(review[0]!.rule, old)).toBe(false);
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
  },
);

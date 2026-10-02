import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { upperCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  boatDescriptionPairs,
  littleBoatLesson,
  shadowLesson,
  unitSevenReadingPageAudits,
  unitSevenReadingSource,
} from './chinese-unit-seven-reading';

it('publishes two formal lessons with observed distinct writing and activity requirements', () => {
  const lessons = chineseBooks[0]!.units.flatMap((u) => u.lessons);
  for (const [l, audit, count, manual] of [
    [littleBoatLesson, unitSevenReadingPageAudits.boat, 18, 7],
    [shadowLesson, unitSevenReadingPageAudits.shadow, 17, 6],
  ] as const) {
    expect(lessons).toContain(l);
    expect(lessons.filter((item) => item.id === l.id)).toHaveLength(1);
    expect(audit.recognize).toBe(upperCharacters[audit.itemId]!.recognize);
    expect(audit.write).toBe(upperCharacters[audit.itemId]!.write);
    expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(
      count,
    );
    expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
      manual,
    );
    expect(
      l.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(1);
    expect(
      l.questions
        .filter((q) => q.id.includes('-q-char-'))
        .map((q) => (q.rule.kind === 'choice' ? q.rule.value : ''))
        .join(''),
    ).toBe(audit.recognize);
    expect(
      l.questions.find((q) => q.id.endsWith('-manual-write'))!.prompt,
    ).toContain(audit.write);
  }
  expect(unitSevenReadingPageAudits.boat.pages).toEqual([84, 85]);
  expect(unitSevenReadingPageAudits.shadow.pages).toEqual([86, 87]);
  expect(unitSevenReadingPageAudits.boat.author).toBe('叶圣陶');
  expect(unitSevenReadingPageAudits.boat.adaptedNote).toBe(false);
  expect(unitSevenReadingPageAudits.shadow.author).toBe('林焕彰');
  expect(unitSevenReadingPageAudits.shadow.adaptedNote).toBe(true);
  for (const key of ['isbn', 'editionDate', 'printingDate'] as const)
    expect(unitSevenReadingSource[key]).toBeNull();
  expect(unitSevenReadingSource.provider).toContain('第三方');
  expect(
    littleBoatLesson.questions.find((q) => q.id.endsWith('-manual-recite'))!
      .rule.kind,
  ).toBe('manual');
  expect(
    shadowLesson.questions.some((q) => q.id.endsWith('-manual-recite')),
  ).toBe(false);
  expect(littleBoatLesson.steps[3]!.text).toContain('不是教材原句');
  expect(shadowLesson.steps[3]!.text).toContain('自己的面向');
});

it('uses exact descriptive pairs, explicit orientation and changed review answers without duplicate questions', () => {
  expect(boatDescriptionPairs).toEqual([
    ['船', '小小'],
    ['月儿', '弯弯'],
    ['星星', '闪闪'],
    ['天', '蓝蓝'],
  ]);
  for (const [i, [noun, description]] of boatDescriptionPairs.entries()) {
    expect(
      littleBoatLesson.questions.find((q) =>
        q.id.endsWith(`-q-description-${i}`),
      )!.rule,
    ).toEqual({ kind: 'choice', value: description });
    expect(
      littleBoatLesson.reviewQuestions!.find((q) =>
        q.id.endsWith(`-r-description-${i}`),
      )!.rule,
    ).toEqual({ kind: 'choice', value: noun });
  }
  for (const [l, key, value, review] of [
    [littleBoatLesson, 'reading-object', '小小的船里', '星星与天'],
    [littleBoatLesson, 'sound', 'ér', 'de'],
    [shadowLesson, 'body-reference', '小安', '小禾'],
    [shadowLesson, 'simile', '小黑狗', '好朋友'],
    [shadowLesson, 'sound-light', 'zi', 'you'],
  ] as const) {
    expect(l.questions.find((q) => q.id.endsWith(`-q-${key}`))!.rule).toEqual({
      kind: 'choice',
      value,
    });
    expect(
      l.reviewQuestions!.find((q) => q.id.endsWith(`-r-${key}`))!.rule,
    ).toEqual({ kind: 'choice', value: review });
  }
  for (const l of [littleBoatLesson, shadowLesson]) {
    const all = [...l.questions, ...l.reviewQuestions!];
    expect(new Set(all.map((q) => q.id)).size).toBe(all.length);
    for (const q of all) {
      if (q.rule.kind !== 'choice') continue;
      const value = q.rule.value;
      expect(q.choices!.filter((c) => c.id === value)).toHaveLength(1);
      expect(new Set(q.choices!.map((c) => c.id)).size).toBe(q.choices!.length);
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
  [littleBoatLesson, 'reading-object', '星星与天'],
  [shadowLesson, 'body-reference', '小禾'],
] as const)(
  'preserves wrong-first, manual and reflection history for %s through backup and changed review',
  (lesson, key, newAnswer) => {
    const now = '2026-10-01T00:00:00.000Z';
    const s = createSession(lesson, chineseBooks[0]!.id, 'child', {
      seed: 18,
      now,
    });
    s.phase = 'practice';
    let oldAnswer = '';
    for (const [i, q] of s.questions.entries()) {
      if (q.id.endsWith(`-q-${key}`) && q.rule.kind === 'choice') {
        oldAnswer = q.rule.value;
        const wrong = q.choices!.find((c) => c.id !== oldAnswer)!.id;
        s.responses[i] = submitResponse(
          q,
          { ...s.responses[i]!, draft: wrong },
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
            return q.rule.kind === 'manual' ? 'confirmed' : '下次想练一个字。';
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
    const review = newReviewQuestions(lesson, s, [s]);
    expect(review).toHaveLength(1);
    expect(review[0]!.rule).toEqual({ kind: 'choice', value: newAnswer });
    expect(evaluate(review[0]!.rule, oldAnswer)).toBe(false);
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

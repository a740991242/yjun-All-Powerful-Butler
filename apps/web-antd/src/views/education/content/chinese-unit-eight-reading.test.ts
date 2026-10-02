import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { upperCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  crowLesson,
  rainLesson,
  unitEightReadingPageAudits,
  unitEightReadingSource,
} from './chinese-unit-eight-reading';
it('publishes exact source-based scopes including familiar characters and distinct reading activities', () => {
  const lessons = chineseBooks[0]!.units.flatMap((u) => u.lessons);
  for (const [l, audit, manual, reflection] of [
    [crowLesson, unitEightReadingPageAudits.crow, 6, 1],
    [rainLesson, unitEightReadingPageAudits.rain, 7, 2],
  ] as const) {
    expect(lessons).toContain(l);
    expect(lessons.filter((x) => x.id === l.id)).toHaveLength(1);
    expect(audit.recognize).toBe(upperCharacters[audit.itemId]!.recognize);
    expect(audit.write).toBe(upperCharacters[audit.itemId]!.write);
    expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(
      18,
    );
    expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
      manual,
    );
    expect(
      l.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(reflection);
    expect(
      l.questions
        .filter((q) => q.id.includes('-q-char-'))
        .map((q) => (q.rule.kind === 'choice' ? q.rule.value : ''))
        .join(''),
    ).toBe(audit.recognize);
    expect(
      l.questions.find((q) => q.id.endsWith('-manual-write'))!.prompt,
    ).toContain(audit.write);
    expect(l.questions.some((q) => q.id.endsWith('-manual-recite'))).toBe(
      false,
    );
  }
  expect(unitEightReadingPageAudits.crow.pages).toEqual([97, 98]);
  expect(unitEightReadingPageAudits.rain.pages).toEqual([99, 100]);
  expect(unitEightReadingPageAudits.crow.familiar).toBe('着');
  expect(unitEightReadingPageAudits.rain.familiar).toBe('数长');
  expect(unitEightReadingPageAudits.crow.author).toBeNull();
  expect(unitEightReadingPageAudits.crow.sourceNote).toContain('伊索寓言');
  expect(unitEightReadingPageAudits.rain.author).toBe('金波');
  expect(unitEightReadingPageAudits.rain.adapted).toBe(true);
  for (const key of ['isbn', 'editionDate', 'printingDate'] as const)
    expect(unitEightReadingSource[key]).toBeNull();
  expect(unitEightReadingSource.provider).toContain('第三方');
  expect(crowLesson.steps).toHaveLength(7);
  expect(rainLesson.steps).toHaveLength(8);
  for (const key of ['roles', 'bu', 'pause', 'familiar'])
    expect(
      rainLesson.questions.find((q) => q.id.endsWith(`-manual-${key}`))!.rule
        .kind,
    ).toBe('manual');
});
it('uses changed textual conditions and contextual readings without grading real sound or extrapolating natural events', () => {
  for (const [l, key, main, review] of [
    [crowLesson, 'reading-method', '小石子', '渐渐升高'],
    [crowLesson, 'reading-problem', '水不多', '瓶口小'],
    [crowLesson, 'sound', 'zháo', 'zhī'],
    [rainLesson, 'reading-destination', '有花有草', '没有花没有草'],
    [rainLesson, 'reading-growth', '花更红草更绿', '开花长草'],
    [rainLesson, 'bu-one', 'bù', 'bú'],
    [rainLesson, 'bu-two', 'bù', 'bú'],
    [rainLesson, 'familiar-sounds', 'shǔ', 'zhǎng'],
  ] as const) {
    expect(l.questions.find((q) => q.id.endsWith(`-q-${key}`))!.rule).toEqual({
      kind: 'choice',
      value: main,
    });
    expect(
      l.reviewQuestions!.find((q) => q.id.endsWith(`-r-${key}`))!.rule,
    ).toEqual({ kind: 'choice', value: review });
  }
  expect(crowLesson.steps[2]!.text).toContain('没有给精确颗数');
  expect(crowLesson.steps[3]!.text).toContain('不要求用石子和瓶子做饮水实验');
  expect(rainLesson.steps[2]!.text).toContain('不声称所有土壤气候');
  expect(rainLesson.steps[4]!.text).toContain('屏幕换行不是教材自然段');
  expect(rainLesson.steps[3]!.text).toContain('这里的“不”变读bú');
  for (const l of [crowLesson, rainLesson]) {
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
  [crowLesson, 'reading-method', '渐渐升高'],
  [rainLesson, 'reading-destination', '没有花没有草'],
] as const)(
  'preserves wrong-first and ungraded actual activity history for %s through backup',
  (lesson, key, newAnswer) => {
    const now = '2026-10-01T00:00:00.000Z';
    const s = createSession(lesson, chineseBooks[0]!.id, 'child', {
      seed: 18,
      now,
    });
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

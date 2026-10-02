import { expect, it } from 'vitest';

import { sujiaoMonthCalendarDraft as lesson } from '../content/sujiao-month-calendar';
import { exportBackup, parseBackup } from './backup';
import { createSession, evaluate, submitResponse } from './engine';
import { isMonthCalendarVisual, monthCalendarCells } from './month-calendar';
import { initialLibrary } from './storage';
it('places actual dates under Sunday-first columns, preserving blanks and leap years', () => {
  const cells = monthCalendarCells({
    kind: 'month-calendar',
    year: 2026,
    month: 6,
  });
  expect(cells.slice(0, 8)).toEqual([null, 1, 2, 3, 4, 5, 6, 7]);
  expect(cells.slice(-7)).toEqual([28, 29, 30, null, null, null, null]);
  const july = monthCalendarCells({
    kind: 'month-calendar',
    year: 2026,
    month: 7,
  });
  expect(july.slice(0, 7)).toEqual([null, null, null, 1, 2, 3, 4]);
  expect(july.filter((n) => n !== null)).toHaveLength(31);
  expect(
    monthCalendarCells({ kind: 'month-calendar', year: 2024, month: 2 }).filter(
      (n) => n !== null,
    ),
  ).toHaveLength(29);
  expect(
    monthCalendarCells({ kind: 'month-calendar', year: 2100, month: 2 }).filter(
      (n) => n !== null,
    ),
  ).toHaveLength(28);
  for (const v of [
    { kind: 'month-calendar', year: 2026, month: 0 },
    { kind: 'month-calendar', year: 2026, month: 13 },
    { kind: 'month-calendar', year: 2026.5, month: 6 },
    { kind: 'month-calendar', year: 2026, month: [6] },
    { kind: 'month-calendar', year: 2026, month: 6, today: 1 },
  ])
    expect(isMonthCalendarVisual(v)).toBe(false);
});
it('checks month totals and weekday positions independently rather than using one month for every review', () => {
  const main = (key: string) =>
    lesson.questions.find((q) => q.id.endsWith(`-q-${key}`))!;
  const review = (key: string) =>
    lesson.reviewQuestions!.find((q) => q.id.endsWith(`-r-${key}`))!;
  for (const [key, a, b] of [
    ['count', 30, 31],
    ['sunday', 7, 5],
    ['next-sunday', 14, 12],
    ['week-gap', 7, 7],
  ] as const) {
    expect(evaluate(main(key).rule, a)).toBe(true);
    expect(evaluate(review(key).rule, b)).toBe(true);
  }
  expect(evaluate(main('first').rule, '1')).toBe(true);
  expect(evaluate(review('first').rule, '3')).toBe(true);
  expect(evaluate(main('last').rule, '2')).toBe(true);
  expect(evaluate(review('last').rule, '5')).toBe(true);
  expect(lesson.questions).toHaveLength(13);
  expect(lesson.reviewQuestions).toHaveLength(9);
  for (const r of lesson.reviewQuestions!) {
    const m = lesson.questions.find((q) => q.knowledge === r.knowledge)!;
    expect(r.prompt).not.toBe(m.prompt);
    expect(r.visual).not.toEqual(m.visual);
  }
});
it('keeps an incorrect month length and correction with exact calendar snapshots in backup', () => {
  const library = initialLibrary('月历');
  const s = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const i = s.questions.findIndex((q) => q.id.endsWith('-q-count'));
  for (const draft of [31, 30]) {
    s.responses[i]!.draft = draft;
    s.responses[i] = submitResponse(s.questions[i]!, s.responses[i]!);
  }
  expect(s.responses[i]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  library.sessions.push(s);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(s);
  const bad = JSON.parse(exportBackup(library));
  bad.data.sessions[0].questions[i].visual.month = 0;
  expect(() => parseBackup(JSON.stringify(bad))).toThrow(Error);
  expect(
    s.responses
      .filter((_, index) => s.questions[index]!.rule.kind === 'manual')
      .every((r) => r.submissions.length === 0),
  ).toBe(true);
});

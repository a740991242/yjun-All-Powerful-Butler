import { describe, expect, it } from 'vitest';

import { exportBackup, isLibraryState, parseBackup } from '../learning/backup';
import { createSession, statistics, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { chineseBooks } from './chinese';
import { chinesePageAudits } from './chinese-source-audit';
import { timetableLesson } from './chinese-timetable';

const now = '2026-09-30T00:00:00.000Z';
const library = () => {
  const session = createSession(
    timetableLesson,
    'pep-chinese-p1-upper-2024',
    'child',
    { seed: 42, now },
  );
  return {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '读表', createdAt: now }],
    sessions: [session],
  };
};
describe('original source-scoped timetable reading', () => {
  it('keeps the supplement independent of the formal garden and derives every answer from the displayed row and column', () => {
    const lessons = chineseBooks
      .find((book) => book.volume === 'upper')!
      .units.flatMap((unit) => unit.lessons);
    expect(lessons.find((lesson) => lesson.id === 'cu-u3-6')!.status).toBe(
      'available',
    );
    expect(lessons).toContain(timetableLesson);
    expect(
      chinesePageAudits.find(
        (page) => page.volume === 'upper' && page.itemId === 'u3-6',
      )?.page,
    ).toBe(timetableLesson.page);
    for (const question of [
      ...timetableLesson.questions,
      ...timetableLesson.reviewQuestions!,
    ]) {
      if (question.rule.kind !== 'choice') continue;
      if (question.visual?.kind !== 'timetable')
        throw new Error('missing table');
      const table = question.visual;
      const day = table.days.findIndex((day) => question.prompt.includes(day));
      const row = table.rows.find((row) =>
        question.prompt.includes(row.period),
      )!;
      expect(day).toBeGreaterThanOrEqual(0);
      expect(question.rule.value).toBe(row.subjects[day]);
      expect(
        question.choices?.filter((choice) => choice.id === row.subjects[day]),
      ).toHaveLength(1);
    }
  });
  it('preserves first errors and separate manual evidence, with new tables for missed-skill review', () => {
    const value = library();
    const session = value.sessions[0]!;
    for (const [index, question] of session.questions.entries()) {
      if (question.rule.kind === 'choice') {
        const expected = question.rule.value;
        const wrong = question.choices!.find(
          (choice) => choice.id !== expected,
        )!.id;
        session.responses[index] = submitResponse(
          question,
          { ...session.responses[index]!, draft: wrong },
          now,
        );
        session.responses[index] = submitResponse(
          question,
          { ...session.responses[index]!, draft: question.rule.value },
          now,
        );
      } else
        session.responses[index] = submitResponse(
          question,
          { ...session.responses[index]!, draft: 'confirmed' },
          now,
        );
    }
    expect(statistics(session).manual).toBe(2);
    expect(statistics(session).firstCorrect).toBe(0);
    expect(
      newReviewQuestions(timetableLesson, session, [session]),
    ).toHaveLength(6);
    expect(parseBackup(exportBackup(value)).data).toEqual(value);
  });
  it('rejects duplicate axes, missing cells, malformed rows and unbounded table snapshots', () => {
    const value = library();
    const table = value.sessions[0]!.questions.find(
      (question) => question.visual?.kind === 'timetable',
    )!.visual!;
    if (table.kind !== 'timetable') throw new Error('missing table');
    const variants = [
      { ...table, days: ['星期一', '星期一'] },
      { ...table, days: [] },
      { ...table, rows: [{ period: '第一节', subjects: [] }] },
      { ...table, rows: [table.rows[0], table.rows[0]] },
      { ...table, days: Array.from({ length: 8 }, (_, i) => String(i)) },
      { ...table, unexpected: true },
      {
        ...table,
        rows: [
          { period: '第一节', subjects: ['语文', '数学', '美术'], extra: true },
        ],
      },
    ];
    for (const invalid of variants) {
      const malformed = structuredClone(value);
      Object.assign(
        malformed.sessions[0]!.questions.find(
          (question) => question.visual?.kind === 'timetable',
        )!,
        { visual: invalid },
      );
      expect(isLibraryState(malformed)).toBe(false);
    }
  });
});

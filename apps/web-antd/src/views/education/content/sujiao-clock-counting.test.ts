import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  clockCountingMarks,
  isClockCountingVisual,
} from '../learning/clock-counting';
import { createSession, evaluate } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoClockCountingDraft as lesson } from './sujiao-clock-counting';
it('keeps a closed circle of distinct boundaries, five intervals between major marks and no time fields', () => {
  const marks = clockCountingMarks();
  expect(new Set(marks.map((m) => m.angle)).size).toBe(60);
  const major = marks.filter((m) => m.major);
  expect(major).toHaveLength(12);
  for (let i = 0; i < major.length; i++) {
    const start = major[i]!.index;
    const end = (major[(i + 1) % major.length]!.index + 60 - start) % 60;
    expect(end).toBe(5);
    expect(
      marks.filter((m) => !m.major && (m.index + 60 - start) % 60 < end),
    ).toHaveLength(4);
  }
  expect(marks.some((m) => m.angle === 360)).toBe(false);
  expect(isClockCountingVisual({ kind: 'clock-counting' })).toBe(true);
  for (const bad of [
    { kind: 'clock-counting', total: 60 },
    { kind: 'clock-counting', minute: 30 },
    [{ kind: 'clock-counting' }],
    { kind: 'clock-counting', variant: 'main' },
  ])
    expect(isClockCountingVisual(bad)).toBe(false);
});
it('checks partial arcs across twelve, cumulative count and strict snapshots while keeping actual work separate', () => {
  const find = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find(
      (q) => q.knowledge === `${lesson.id}-${key}`,
    )!;
  expect(lesson.questions).toHaveLength(12);
  expect(lesson.reviewQuestions).toHaveLength(8);
  expect(find('groups').rule).toEqual({ kind: 'number', value: 12 });
  expect(find('total').rule).toEqual({ kind: 'number', value: 60 });
  expect(evaluate(find('total').rule, 61)).toBe(false);
  expect(find('part').rule).toEqual({ kind: 'number', value: 15 });
  expect(find('part', true).rule).toEqual({ kind: 'number', value: 20 });
  expect(evaluate(find('part', true).rule, 15)).toBe(false);
  expect(find('continue', true).rule).toEqual({
    kind: 'steps',
    values: [20, 25, 30],
  });
  const library = initialLibrary('钟面');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  library.sessions.push(session);
  expect(
    session.questions.filter((q) => q.rule.kind === 'manual'),
  ).toHaveLength(3);
  expect(session.responses.every((r) => r.submissions.length === 0)).toBe(true);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
  const json = JSON.parse(exportBackup(library));
  const index = json.data.sessions[0].questions.findIndex(
    (q: { visual?: { kind: string } }) => q.visual?.kind === 'clock-counting',
  );
  expect(index).toBeGreaterThanOrEqual(0);
  json.data.sessions[0].questions[index].visual.total = 60;
  expect(() => parseBackup(JSON.stringify(json))).toThrow(Error);
});

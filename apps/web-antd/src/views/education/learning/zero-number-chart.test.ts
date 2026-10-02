import { expect, it } from 'vitest';

import { sujiaoZeroChartDraft as lesson } from '../content/sujiao-zero-chart';
import { exportBackup, parseBackup } from './backup';
import { createSession, evaluate, submitResponse } from './engine';
import { hundredPosition } from './hundred-chart';
import { initialLibrary } from './storage';
import {
  isZeroNumberChartVisual,
  zeroNumberPosition,
  zeroNumberRows,
} from './zero-number-chart';
it('preserves the inspected zero layout and never wraps row boundaries or mutates the older 1–100 layout', () => {
  const rows = zeroNumberRows();
  expect(rows).toHaveLength(10);
  expect(Object.values(rows[0]!).slice(1)).toEqual([
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  ]);
  expect(Object.values(rows[9]!).slice(1)).toEqual([
    90, 91, 92, 93, 94, 95, 96, 97, 98, 99,
  ]);
  expect(zeroNumberPosition(0)).toEqual({
    value: 0,
    row: 1,
    column: 1,
    left: null,
    right: 1,
    up: null,
    down: 10,
  });
  expect(zeroNumberPosition(9)).toMatchObject({
    row: 1,
    column: 10,
    right: null,
    down: 19,
  });
  expect(zeroNumberPosition(10)).toMatchObject({
    row: 2,
    column: 1,
    left: null,
    up: 0,
  });
  expect(zeroNumberPosition(99)).toMatchObject({
    row: 10,
    column: 10,
    right: null,
    down: null,
    up: 89,
  });
  expect(hundredPosition(10)).toMatchObject({
    row: 1,
    column: 10,
    right: null,
  });
  expect(hundredPosition(100)).toMatchObject({ row: 10, column: 10 });
  for (let value = 0; value < 100; value++) {
    const p = zeroNumberPosition(value);
    expect((p.row - 1) * 10 + p.column - 1).toBe(value);
    if (p.down !== null) expect(zeroNumberPosition(p.down).up).toBe(value);
    if (p.right !== null) expect(zeroNumberPosition(p.right).left).toBe(value);
  }
  for (const value of [-1, 100, 1.5, Number.NaN, Infinity])
    expect(() => zeroNumberPosition(value)).toThrow(Error);
});
it('rejects malformed charts and keeps changed review conditions, zero answers and wrong edge history in strict backups', () => {
  for (const value of [0, 99])
    expect(isZeroNumberChartVisual({ kind: 'zero-number-chart', value })).toBe(
      true,
    );
  for (const data of [
    { kind: 'zero-number-chart', value: 100 },
    { kind: 'zero-number-chart', value: '0' },
    { kind: 'zero-number-chart', value: 0, answer: 0 },
    { kind: ['zero-number-chart'], value: 0 },
    null,
    [],
  ])
    expect(isZeroNumberChartVisual(data)).toBe(false);
  expect(lesson.questions).toHaveLength(17);
  expect(lesson.reviewQuestions).toHaveLength(13);
  const find = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find((q) =>
      q.id.endsWith(`-${key}`),
    )!;
  expect(find('neighbor-0').rule).toEqual({ kind: 'number', value: 46 });
  expect(find('neighbor-3', true).rule).toEqual({ kind: 'number', value: 72 });
  expect(evaluate(find('first-row').rule, 0)).toBe(true);
  expect(find('first-row').visual).toEqual({
    kind: 'zero-number-chart',
    value: 15,
  });
  expect(find('last-row').visual).toEqual({
    kind: 'zero-number-chart',
    value: 73,
  });
  expect(evaluate(find('same-column').rule, ['7', '27', '97'])).toBe(true);
  expect(find('position-count').rule).toEqual({ kind: 'number', value: 100 });
  for (const q of lesson.reviewQuestions!) {
    const old = lesson.questions.find((o) => o.knowledge === q.knowledge)!;
    expect(JSON.stringify([q.prompt, q.visual, q.choices])).not.toBe(
      JSON.stringify([old.prompt, old.visual, old.choices]),
    );
  }
  const library = initialLibrary('数表');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const index = session.questions.findIndex((q) =>
    q.id.endsWith('-q-right-edge'),
  );
  for (const draft of ['wrap', 'none']) {
    session.responses[index]!.draft = draft;
    session.responses[index] = submitResponse(
      session.questions[index]!,
      session.responses[index]!,
    );
  }
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
  const bad = JSON.parse(exportBackup(library));
  bad.data.sessions[0].questions[index].visual.value = 100;
  expect(() => parseBackup(JSON.stringify(bad))).toThrow(Error);
});

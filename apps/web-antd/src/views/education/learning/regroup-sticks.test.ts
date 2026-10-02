import type { RegroupSticksVisual } from './regroup-sticks';
import type { Answer, Lesson } from './types';

import { expect, it } from 'vitest';

import {
  sujiaoCarryAddDraft as add,
  sujiaoBorrowSubtractDraft as subtract,
} from '../content/sujiao-regrouping';
import { exportBackup, parseBackup } from './backup';
import { createSession, evaluate, submitResponse } from './engine';
import { isRegroupSticksVisual, regroupStickGroups } from './regroup-sticks';
import { initialLibrary } from './storage';

it('preserves place-value quantity across every legal exchange while only adding or removing the specified amount', () => {
  for (let value = 10; value <= 99; value++) {
    for (let amount = 1; amount <= 9; amount++) {
      for (const operation of ['add', 'subtract'] as const) {
        const original: RegroupSticksVisual = {
          kind: 'regroup-sticks',
          tens: Math.floor(value / 10),
          ones: value % 10,
          operation,
          amount,
          stage: 'original',
        };
        const valid =
          operation === 'add'
            ? (value % 10) + amount >= 10 && value + amount <= 99
            : value % 10 < amount;
        expect(isRegroupSticksVisual(original)).toBe(valid);
        if (!valid) continue;
        const start = regroupStickGroups(original);
        const middle = regroupStickGroups({ ...original, stage: 'regroup' });
        const result = regroupStickGroups({ ...original, stage: 'result' });
        const total = (g: typeof start) => g.bundles * 10 + g.loose;
        expect(total(start)).toBe(value);
        expect(total(middle)).toBe(
          operation === 'add' ? value + amount : value,
        );
        expect(total(result)).toBe(
          operation === 'add' ? value + amount : value - amount,
        );
        expect(result.loose).toBeGreaterThanOrEqual(0);
        expect(result.loose).toBeLessThan(10);
        expect(middle.loose).toBeGreaterThanOrEqual(10);
        expect(middle.loose).toBeLessThanOrEqual(18);
      }
    }
  }
  expect(
    regroupStickGroups({
      kind: 'regroup-sticks',
      tens: 3,
      ones: 0,
      amount: 4,
      operation: 'subtract',
      stage: 'regroup',
    }),
  ).toEqual({ bundles: 2, loose: 10 });
  expect(
    regroupStickGroups({
      kind: 'regroup-sticks',
      tens: 3,
      ones: 8,
      amount: 2,
      operation: 'add',
      stage: 'result',
    }),
  ).toEqual({ bundles: 4, loose: 0 });
});
it('rejects ambiguous shapes, illegal digit ranges, non-regroup operations and extra answer fields', () => {
  const model: RegroupSticksVisual = {
    kind: 'regroup-sticks',
    tens: 2,
    ones: 7,
    amount: 5,
    operation: 'add',
    stage: 'original',
  };
  for (const invalid of [
    null,
    [],
    { ...model, operation: ['add'] },
    { ...model, stage: ['original'] },
    { ...model, tens: 0 },
    { ...model, tens: 2.5 },
    { ...model, ones: 10 },
    { ...model, ones: -1 },
    { ...model, amount: 0 },
    { ...model, amount: 10 },
    { ...model, amount: [5] },
    { ...model, stage: 'answer' },
    { ...model, result: 32 },
    { ...model, ones: 1, amount: 2 },
    { ...model, tens: 9 },
    { ...model, operation: 'subtract', ones: 8 },
  ]) {
    expect(isRegroupSticksVisual(invalid)).toBe(false);
    expect(() => regroupStickGroups(invalid as RegroupSticksVisual)).toThrow(
      Error,
    );
  }
});
it('checks independently derived carry and borrow answers, complete condition selections and changed review data', () => {
  const scenarios: { lesson: Lesson; main: Answer[]; review: Answer[] }[] = [
    {
      lesson: add,
      main: [
        32,
        12,
        3,
        2,
        3,
        2,
        '0',
        5,
        '0',
        '0',
        40,
        ['exact', 'more'],
        32,
        27,
      ],
      review: [
        53,
        13,
        5,
        3,
        4,
        3,
        '0',
        7,
        '0',
        '0',
        60,
        ['exact', 'more'],
        53,
        46,
      ],
    },
    {
      lesson: subtract,
      main: [
        26,
        12,
        2,
        6,
        2,
        4,
        '0',
        6,
        '0',
        '0',
        26,
        ['more', 'target'],
        26,
        32,
      ],
      review: [
        43,
        11,
        4,
        3,
        1,
        7,
        '0',
        8,
        '0',
        '0',
        53,
        ['more', 'target'],
        43,
        51,
      ],
    },
  ];
  for (const { lesson, main, review } of scenarios) {
    expect(lesson.questions).toHaveLength(18);
    expect(lesson.reviewQuestions).toHaveLength(14);
    lesson.questions.slice(0, 14).forEach((q, i) => {
      expect(evaluate(q.rule, main[i]!)).toBe(true);
      if (q.visual)
        expect(q.visual).toMatchObject({
          kind: 'regroup-sticks',
          stage: 'original',
        });
    });
    lesson.reviewQuestions!.forEach((q, i) => {
      expect(evaluate(q.rule, review[i]!)).toBe(true);
      const original = lesson.questions[i]!;
      expect(q.prompt).not.toBe(original.prompt);
      expect(q.knowledge).toBe(original.knowledge);
      if (q.visual) expect(q.visual).not.toEqual(original.visual);
    });
    expect(
      evaluate(
        lesson.questions[11]!.rule,
        lesson === add ? ['more'] : ['target'],
      ),
    ).toBe(false);
  }
});
it('retains skipped exchange tasks, wrong result history and original source snapshots through strict backup', () => {
  const library = initialLibrary('换十');
  for (const lesson of [add, subtract]) {
    const s = createSession(
      lesson,
      'sujiao-math-p1-lower-9787574312951',
      library.activeProfileId,
    );
    const i = s.questions.findIndex((q) => q.id.endsWith('-q-result'));
    for (const draft of lesson === add ? [22, 32] : [36, 26]) {
      s.responses[i]!.draft = draft;
      s.responses[i] = submitResponse(s.questions[i]!, s.responses[i]!);
    }
    expect(s.responses[i]!.submissions.map((x) => x.correct)).toEqual([
      false,
      true,
    ]);
    expect(
      s.responses
        .filter((_, j) => s.questions[j]!.rule.kind === 'manual')
        .every((r) => r.submissions.length === 0),
    ).toBe(true);
    library.sessions.push(s);
  }
  expect(parseBackup(exportBackup(library)).data.sessions).toEqual(
    library.sessions,
  );
  const bad = JSON.parse(exportBackup(library));
  const i = bad.data.sessions[0].questions.findIndex(
    (q: { visual?: unknown }) => q.visual,
  );
  bad.data.sessions[0].questions[i].visual.stage = ['original'];
  expect(() => parseBackup(JSON.stringify(bad))).toThrow(Error);
});

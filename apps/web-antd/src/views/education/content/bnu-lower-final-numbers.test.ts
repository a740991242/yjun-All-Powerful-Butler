import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  bnuFinalDataRows,
  isBnuFinalDataVisual,
} from '../learning/bnu-final-data';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { newReviewQuestions } from '../learning/review';
import { bnuLowerBook } from './bnu-lower';
import {
  bnuLowerFinalNumberApplicationsLesson as app,
  bnuLowerFinalNumberMapping as mapping,
  bnuLowerFinalNumberReviewLesson as review,
} from './bnu-lower-final-numbers';
import { bnuLowerFinalSource as source } from './bnu-lower-final-source';
import { mathBooks } from './math';
const now = '2026-10-06T09:00:00.000Z';
it('maps all thirteen90–92 original activities to both complete packs while keeping eleven geometry/practice activities pending', () => {
  expect(mapping.map((m) => [m.page, m.sourceActivity])).toEqual(
    source.activities.filter((a) => a.page <= 92).map((a) => [a.page, a.key]),
  );
  expect(source.activities.filter((a) => a.page > 92)).toHaveLength(11);
  const final = required(bnuLowerBook.units.find((u) => u.id === 'final'));
  expect(final.lessons.slice(0, 2)).toEqual([review, app]);
  expect(final.lessons[2]?.id).toBe('bnu-lower-final-geometry');
  expect(final.lessons[3]?.status).toBe('preparing');
  for (const [lesson, steps, objective, manual, reflection] of [
    [review, 12, 17, 13, 5],
    [app, 14, 20, 9, 5],
  ] as const) {
    expect(lesson.steps).toHaveLength(steps);
    expect(
      lesson.questions.filter(
        (q) => !['manual', 'reflection'].includes(q.rule.kind),
      ),
    ).toHaveLength(objective);
    expect(
      lesson.questions.filter((q) => q.rule.kind === 'manual'),
    ).toHaveLength(manual);
    expect(
      lesson.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(reflection);
    const qs = new Map(
      lesson.questions.map((q) => [q.id.slice(lesson.id.length + 1), q]),
    );
    const mapped = mapping.filter((m) => m.lesson === lesson.id);
    expect(
      new Set(
        mapped.flatMap((m) => [...m.objective, ...m.manual, ...m.records]),
      ),
    ).toEqual(new Set(qs.keys()));
    for (const m of mapped) {
      for (const n of m.steps) expect(lesson.steps[n - 1]).toBeDefined();
      for (const name of m.manual)
        expect(qs.get(name)?.rule.kind).toBe('manual');
      for (const name of m.records)
        expect(qs.get(name)?.rule.kind).toBe('reflection');
    }
    for (const q of lesson.questions)
      if (q.rule.kind === 'reflection')
        expect(evaluate(q.rule, '待做，未交流')).toBeNull();
  }
});
it('independently verifies every objective answer, including all four columns, scopes, complete ranks and three different pairs', () => {
  const cases: [typeof review, [string, Answer][]][] = [
    [
      review,
      [
        ['composition', [3, 2]],
        ['neighbors', [31, 33]],
        ['beads', 5],
        ['exchange', 'clear'],
        ['add-one', [6, 8]],
        ['subtract-one', [5, 3]],
        ['add-two', [9, 5]],
        ['subtract-two', [8, 0]],
        ['alignment', 'clear'],
        ['subtract-order', 'clear'],
        ['eighteen-nine', 9],
        ['life-condition', 'clear'],
        ['rabbit', 39],
        ['sheep-geese', 24],
        ['farm-total', 85],
        ['rabbit-relevant', ['A', 'C']],
        ['site-zero', 0],
      ],
    ],
    [
      app,
      [
        ['forward', [26, 28, 30, 32]],
        ['backward', [59, 58, 55, 54]],
        ['composition-37', [3, 7]],
        ['composition-24', [2, 4]],
        ['composition-51', [5, 1]],
        ['compare-1', '='],
        ['compare-2', '>'],
        ['compare-3', '<'],
        ['compare-4', '<'],
        ['rescue', 45],
        ['line-add', 13],
        ['line-subtract', 12],
        ['pandas', [6, 7, 13]],
        ['cabbages', [24, 24, 48]],
        ['rings-first', ['B', 'C']],
        ['rings-second', ['C', 'D']],
        ['rings-third', ['A', 'B']],
        ['ranks', [4, 2, 3, 1]],
        ['rank-difference', 1],
        ['site-zero', 0],
      ],
    ],
  ];
  for (const [lesson, answers] of cases) {
    const q = (key: string) =>
      required(lesson.questions.find((q) => q.id === `${lesson.id}-${key}`));
    expect(
      lesson.questions
        .filter((q) => !['manual', 'reflection'].includes(q.rule.kind))
        .map((q) => q.id)
        .toSorted(),
    ).toEqual(answers.map(([key]) => q(key).id).toSorted());
    for (const [key, answer] of answers)
      expect(evaluate(q(key).rule, answer), key).toBe(true);
  }
  const q = (key: string) =>
    required(app.questions.find((q) => q.id.endsWith(`-${key}`)));
  for (const [key, wrong] of [
    ['rescue', 77],
    ['rescue', 13],
    ['cabbages', [24, 0, 24]],
    ['ranks', [1, 2, 3, 4]],
    ['rank-difference', 7],
    ['backward', [59, 55, 58, 54]],
    ['rings-third', ['A', 'C']],
  ] as [string, Answer][])
    expect(evaluate(q(key).rule, wrong)).toBe(false);
});
it('keeps all eight closed table diagrams free of result/rank fields and validates the game against all six distinct pairs', () => {
  for (const scene of ['farm', 'rescue', 'rings', 'rope'] as const)
    for (const variant of ['main', 'review'] as const) {
      const v = { kind: 'bnu-final-data' as const, scene, variant };
      expect(isBnuFinalDataVisual(v)).toBe(true);
      const rows = bnuFinalDataRows(v);
      expect(
        rows.every(
          (r) => !('answer' in r) && !('rank' in r) && !('result' in r),
        ),
      ).toBe(true);
      if (scene === 'farm' || scene === 'rescue')
        expect(rows.at(-1)?.quantity).toBeUndefined();
      if (scene === 'rope')
        expect(rows.map((r) => r.rankBlank)).toEqual(['A', 'B', 'C', 'D']);
      rows[0]!.quantity = 999;
      expect(bnuFinalDataRows(v)[0]?.quantity).not.toBe(999);
    }
  for (const extra of [
    { result: 45 },
    { rows: [] },
    { scene: ['farm'] },
    { scene: 'unknown' },
    { variant: 'other' },
  ])
    expect(
      isBnuFinalDataVisual({
        kind: 'bnu-final-data',
        scene: 'farm',
        variant: 'main',
        ...extra,
      }),
    ).toBe(false);
  for (const [variant, scores, targetOne, targetTwo] of [
    ['main', [24, 12, 30, 32], 42, 62],
    ['review', [18, 14, 22, 26], 36, 48],
  ] as const) {
    const pairs = scores.flatMap((a, i) =>
      scores.slice(i + 1).map((b, k) => ({
        ids: [
          String.fromCodePoint(65 + i),
          String.fromCodePoint(65 + i + k + 1),
        ],
        sum: a + b,
      })),
    );
    expect(pairs).toHaveLength(6);
    expect(pairs.filter((p) => p.sum === targetOne).map((p) => p.ids)).toEqual([
      ['B', 'C'],
    ]);
    expect(pairs.filter((p) => p.sum === targetTwo).map((p) => p.ids)).toEqual([
      ['C', 'D'],
    ]);
    expect(
      pairs
        .filter((p) => p.sum < targetOne && p.sum < targetTwo)
        .map((p) => p.ids),
    ).toEqual([['A', 'B']]);
    expect(
      bnuFinalDataRows({ kind: 'bnu-final-data', scene: 'rings', variant }).map(
        (r) => r.quantity,
      ),
    ).toEqual(scores);
  }
});
it('retains old PEP snapshots, partial0 fields, wrong/correct histories and schema1 while refusing injected condition tables', () => {
  const book = required(
    mathBooks.find((b) => b.id === 'pep-math-p1-upper-2024'),
  );
  const old = createSession(
    required(
      book.units
        .flatMap((u) => u.lessons)
        .find((l) => l.status === 'available'),
    ),
    book.id,
    'child',
    { seed: 1, now },
  );
  const snapshot = JSON.parse(JSON.stringify(old));
  const sessions = [old];
  for (const lesson of [review, app]) {
    const s = createSession(lesson, bnuLowerBook.id, 'child', { seed: 2, now });
    const i = s.questions.findIndex((q) =>
      q.id.endsWith(lesson === review ? '-rabbit' : '-rescue'),
    );
    const q = required(s.questions[i]);
    const r = required(s.responses[i]);
    r.draft = 1;
    const wrong = submitResponse(q, r, now);
    wrong.draft = lesson === review ? 39 : 45;
    s.responses[i] = submitResponse(q, wrong, now);
    required(
      s.responses.find((r) => r.questionId.endsWith('-site-zero')),
    ).draft = 0;
    if (lesson === review)
      required(
        s.responses.find((r) => r.questionId.endsWith('-subtract-two')),
      ).draft = [null, 0];
    sessions.push(s);
    const fresh = newReviewQuestions(lesson, s, [s]);
    expect(fresh).toHaveLength(lesson === review ? 7 : 8);
    expect(
      newReviewQuestions(lesson, s, [
        s,
        { ...s, id: 'seen', questions: fresh },
      ]),
    ).toHaveLength(0);
  }
  const raw = exportBackup(
    {
      schemaVersion: 1,
      profiles: [{ id: 'child', nickname: '验证', createdAt: now }],
      activeProfileId: 'child',
      sessions,
    },
    now,
  );
  const restored = parseBackup(raw).data;
  expect(restored.sessions).toEqual(JSON.parse(JSON.stringify(sessions)));
  expect(restored.sessions[0]).toEqual(snapshot);
  for (const s of restored.sessions.slice(1))
    expect(
      s.responses.flatMap((r) => r.submissions.map((x) => x.correct)),
    ).toEqual([false, true]);
  for (const extra of [{ result: 39 }, { rows: [] }, { scene: 'unknown' }]) {
    const bad = JSON.parse(raw);
    Object.assign(
      bad.data.sessions[1].questions.find((q: { id: string }) =>
        q.id.endsWith('-rabbit'),
      ).visual,
      extra,
    );
    expect(() => parseBackup(JSON.stringify(bad))).toThrow(
      'educationLearning.invalidBackup',
    );
  }
});

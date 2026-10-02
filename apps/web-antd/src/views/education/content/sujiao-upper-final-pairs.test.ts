import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate } from '../learning/engine';
import {
  isSolidRecomposeVisual,
  solidRecomposeCanvas,
  solidRecomposeData,
} from '../learning/solid-recompose';
import { sujiaoUpperFinalPairsLesson as lesson } from './sujiao-upper-final-pairs';
it('keeps two sorting rules independent and checks complete two-piece geometry rather than a shared shape name', () => {
  expect(lesson.questions).toHaveLength(18);
  expect(lesson.reviewQuestions).toHaveLength(12);
  for (const review of [false, true]) {
    const qs = review ? lesson.reviewQuestions! : lesson.questions;
    const q = (key: string) =>
      qs.find((q) => q.knowledge === `${lesson.id}-${key}`)!;
    expect(
      evaluate(
        q('curved-rule').rule,
        review ? ['cube', 'cuboid'] : ['cylinder', 'sphere'],
      ),
    ).toBe(true);
    expect(
      evaluate(
        q('flat-rule').rule,
        review ? ['sphere'] : ['cube', 'cuboid', 'cylinder'],
      ),
    ).toBe(true);
    expect(
      evaluate(
        q('flat-rule').rule,
        review ? ['cube', 'cuboid'] : ['cylinder', 'sphere'],
      ),
    ).toBe(false);
    expect(
      evaluate(q('cube-pair').rule, review ? ['B', 'C'] : ['A', 'B']),
    ).toBe(true);
    expect(evaluate(q('cylinder-pair').rule, review ? 'C' : 'A')).toBe(true);
    expect(evaluate(q('cuboid-condition').rule, 'always')).toBe(false);
    for (const scene of ['pair-cubes', 'pair-cylinders'] as const) {
      const model = {
        kind: 'solid-recompose' as const,
        scene,
        variant: review ? ('review' as const) : ('main' as const),
      };
      expect(isSolidRecomposeVisual(model)).toBe(true);
      expect(isSolidRecomposeVisual({ ...model, answer: ['A'] })).toBe(false);
      const data = solidRecomposeData(model);
      expect(data.input).toHaveLength(2);
      if (scene === 'pair-cubes') {
        expect(data.input.map((p) => p.cells.length)).toEqual([1, 1]);
        expect(data.choices.map((ps) => ps[0]!.cells.length)).toEqual(
          review ? [3, 2, 2] : [2, 2, 1],
        );
        for (const p of data.choices.flat()) {
          expect(new Set(p.cells.map((c) => c.join(','))).size).toBe(
            p.cells.length,
          );
          const before = JSON.stringify(p.cells);
          const draw = solidRecomposeCanvas(p.cells);
          expect(JSON.stringify(p.cells)).toBe(before);
          expect(
            draw.every(
              (p) =>
                p.x >= 0 && p.y - 18 >= 0 && p.x + 50 <= 240 && p.y + 32 <= 220,
            ),
          ).toBe(true);
        }
      } else {
        expect(data.input.map((p) => p.height)).toEqual(
          review ? [2, 2] : [1, 1],
        );
        expect(data.choices[review ? 2 : 0]!.map((p) => p.height)).toEqual([
          review ? 4 : 2,
        ]);
        expect(data.choices[1]).toHaveLength(2);
        expect(data.choices.flat().every((p) => p.segmented === false)).toBe(
          true,
        );
      }
    }
  }
  expect(
    evaluate(
      lesson.reviewQuestions!.find(
        (q) => q.knowledge === `${lesson.id}-cube-pair`,
      )!.rule,
      ['A', 'B'],
    ),
  ).toBe(false);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    5,
  );
  const now = '2026-10-02T10:00:00.000Z';
  const session = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  const data = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [session],
  };
  expect(parseBackup(exportBackup(data, now)).data.sessions[0]).toEqual(
    session,
  );
});

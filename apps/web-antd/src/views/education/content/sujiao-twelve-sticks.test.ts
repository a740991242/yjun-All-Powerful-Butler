import type { Answer, StickOutlineVisual } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import {
  displayStickSegments,
  isStickOutlineVisual,
  stickSegments,
  stickSideCount,
} from '../learning/stick-outline';
import { initialLibrary } from '../learning/storage';
import { sujiaoTwelveSticksDraft as lesson } from './sujiao-twelve-sticks';

it('builds four closed equal-unit 12-stick outlines within the viewbox without changing old layouts', () => {
  for (const layout of [
    'twelve-square',
    'twelve-rectangle',
    'twelve-triangle',
    'twelve-slanted',
  ] as const)
    for (const turn of [0, 90] as const) {
      const model: StickOutlineVisual = { kind: 'stick-outline', layout, turn };
      expect(isStickOutlineVisual(model)).toBe(true);
      const segments = stickSegments(model);
      const displayed = displayStickSegments(model);
      expect(segments).toHaveLength(12);
      expect(stickSideCount(model)).toBe(layout === 'twelve-triangle' ? 3 : 4);
      const lengths = displayed.map(([a, b]) =>
        Math.hypot(a.x - b.x, a.y - b.y),
      );
      for (let i = 0; i < segments.length; i++) {
        const [a, b] = segments[i]!;
        const next = segments[(i + 1) % segments.length]![0];
        expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeCloseTo(1, 12);
        expect(b.x).toBeCloseTo(next.x, 12);
        expect(b.y).toBeCloseTo(next.y, 12);
        expect(lengths[i]).toBeCloseTo(lengths[0]!, 10);
        for (const point of displayed[i]!) {
          expect(point.x).toBeGreaterThanOrEqual(40);
          expect(point.x).toBeLessThanOrEqual(280);
          expect(point.y).toBeGreaterThanOrEqual(40);
          expect(point.y).toBeLessThanOrEqual(280);
        }
      }
      const cross = (
        a: { x: number; y: number },
        b: { x: number; y: number },
        c: { x: number; y: number },
      ) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
      for (let i = 0; i < segments.length; i++)
        for (let j = i + 1; j < segments.length; j++) {
          const [a, b] = segments[i]!;
          const [c, d] = segments[j]!;
          expect(
            cross(a, b, c) * cross(a, b, d) < -1e-8 &&
              cross(c, d, a) * cross(c, d, b) < -1e-8,
          ).toBe(false);
        }
      expect(isStickOutlineVisual({ ...model, answer: 12 })).toBe(false);
    }
  for (const layout of [
    'square',
    'slanted-four',
    'rectangle',
    'slanted-six',
    'triangle',
    'six-sided',
  ] as const) {
    const model: StickOutlineVisual = {
      kind: 'stick-outline',
      layout,
      turn: 0,
    };
    for (const [a, b] of displayStickSegments(model))
      expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeCloseTo(80, 10);
  }
});
it('checks roots versus sides, changed horizontal/vertical directions and independent manual tasks', () => {
  const main: Answer[] = [
    12,
    4,
    12,
    4,
    12,
    3,
    12,
    4,
    [4, 2],
    'no',
    'no',
    'many',
  ];
  const review: Answer[] = [
    12,
    4,
    12,
    4,
    12,
    3,
    12,
    4,
    [2, 4],
    'no',
    'no',
    'many',
  ];
  expect(lesson.steps).toHaveLength(5);
  expect(lesson.questions).toHaveLength(18);
  expect(lesson.reviewQuestions).toHaveLength(12);
  lesson.questions
    .slice(0, 12)
    .forEach((q, i) => expect(evaluate(q.rule, main[i]!)).toBe(true));
  lesson.reviewQuestions!.forEach((q, i) => {
    expect(evaluate(q.rule, review[i]!)).toBe(true);
    expect(q.knowledge).toBe(lesson.questions[i]!.knowledge);
    if (q.visual) expect(q.visual).not.toEqual(lesson.questions[i]!.visual);
  });
  expect(evaluate(lesson.questions[1]!.rule, 12)).toBe(false);
  expect(evaluate(lesson.questions[5]!.rule, 12)).toBe(false);
  expect(evaluate(lesson.questions[8]!.rule, [8, 4])).toBe(false);
  expect(evaluate(lesson.reviewQuestions![8]!.rule, [4, 2])).toBe(false);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    4,
  );
  expect(
    lesson.questions.filter((q) => q.rule.kind === 'reflection'),
  ).toHaveLength(2);
});
it('preserves new visual snapshots and partial drafts, without implicitly completing physical work', () => {
  const library = initialLibrary('12根摆图');
  const s = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const i = s.questions.findIndex((q) =>
    q.id.endsWith('-q-horizontal-vertical'),
  );
  s.responses[i]!.draft = [4, null];
  library.sessions.push(s);
  expect(
    parseBackup(exportBackup(library)).data.sessions[0]!.responses[i]!.draft,
  ).toEqual([4, null]);
  for (const draft of [
    [8, 4],
    [4, 2],
  ]) {
    s.responses[i]!.draft = draft;
    s.responses[i] = submitResponse(s.questions[i]!, s.responses[i]!);
  }
  expect(s.responses[i]!.submissions.map((x) => x.correct)).toEqual([
    false,
    true,
  ]);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(s);
  expect(
    s.responses
      .filter((_, j) =>
        ['manual', 'reflection'].includes(s.questions[j]!.rule.kind),
      )
      .every((r) => r.submissions.length === 0),
  ).toBe(true);
});

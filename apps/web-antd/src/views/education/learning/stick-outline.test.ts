import type { StickOutlineVisual } from './types';

import { expect, it } from 'vitest';

import { sujiaoEqualSticksDraft as lesson } from '../content/sujiao-equal-sticks';
import { exportBackup, parseBackup } from './backup';
import { createSession, evaluate, statistics, submitResponse } from './engine';
import {
  displayStickSegments,
  isStickOutlineVisual,
  stickSegments,
  stickSideCount,
} from './stick-outline';
import { initialLibrary } from './storage';
const layouts: StickOutlineVisual['layout'][] = [
  'square',
  'slanted-four',
  'rectangle',
  'slanted-six',
  'triangle',
  'six-sided',
];
it('draws equal-length, nonzero sticks with a closed non-crossing outline and preserves length under rotation', () => {
  for (const layout of layouts)
    for (const turn of [0, 90] as const) {
      const model: StickOutlineVisual = { kind: 'stick-outline', layout, turn };
      expect(isStickOutlineVisual(model)).toBe(true);
      const displayed = displayStickSegments(model);
      const segments = stickSegments(model);
      expect(segments).toHaveLength(layouts.indexOf(layout) < 2 ? 4 : 6);
      segments.forEach(([a, b], i) => {
        expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeCloseTo(1, 12);
        expect(b.x).toBeCloseTo(segments[(i + 1) % segments.length]![0].x, 12);
        expect(b.y).toBeCloseTo(segments[(i + 1) % segments.length]![0].y, 12);
        const [u, v] = displayed[i]!;
        expect(Math.hypot(u.x - v.x, u.y - v.y)).toBeCloseTo(80, 10);
        for (const point of [u, v]) {
          expect(point.x).toBeGreaterThan(0);
          expect(point.x).toBeLessThan(320);
          expect(point.y).toBeGreaterThan(0);
          expect(point.y).toBeLessThan(320);
        }
      });
      const cross = (
        a: { x: number; y: number },
        b: { x: number; y: number },
        c: { x: number; y: number },
      ) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
      // The change of direction, not a collinear endpoint, defines an outer corner.
      const corners = segments.filter(
        ([a, b], i) =>
          Math.abs(cross(a, b, segments[(i + 1) % segments.length]![1])) > 1e-8,
      ).length;
      expect(stickSideCount(model)).toBe(corners);
      for (let i = 0; i < segments.length; i++)
        for (let j = i + 1; j < segments.length; j++) {
          const [a, b] = segments[i]!;
          const [c, d] = segments[j]!;
          expect(
            cross(a, b, c) * cross(a, b, d) < -1e-8 &&
              cross(c, d, a) * cross(c, d, b) < -1e-8,
          ).toBe(false);
        }
    }
});
it('strictly bounds layouts and rotation without accepting derived answers or arbitrary unequal sticks', () => {
  for (const model of [
    null,
    [],
    {},
    { kind: 'stick-outline', layout: 'circle', turn: 0 },
    { kind: 'stick-outline', layout: 'square', turn: 45 },
    { kind: 'stick-outline', layout: 'square', turn: '90' },
    { kind: 'stick-outline', layout: 'square', turn: 0, answer: 4 },
    { kind: 'stick-outline', layout: 'square', turn: 0, lengths: [1, 2, 1, 2] },
  ])
    expect(isStickOutlineVisual(model)).toBe(false);
});
it('questions independently distinguish stick counts and straight-side counts in changed review figures', () => {
  expect(lesson.reviewQuestions).toHaveLength(14);
  for (const questions of [lesson.questions, lesson.reviewQuestions!])
    for (let index = 0; index < 6; index++) {
      const count = questions.find((q) => q.id.endsWith(`-${index}-sticks`))!;
      const sides = questions.find((q) => q.id.endsWith(`-${index}-sides`))!;
      const visual = count.visual;
      if (visual?.kind !== 'stick-outline') throw new Error('missing sticks');
      expect(evaluate(count.rule, stickSegments(visual).length)).toBe(true);
      expect(evaluate(sides.rule, stickSideCount(visual))).toBe(true);
      if (index >= 2 && index < 5) expect(evaluate(sides.rule, 6)).toBe(false);
    }
  for (const review of lesson.reviewQuestions!) {
    const original = lesson.questions.find(
      (q) => q.knowledge === review.knowledge,
    )!;
    expect(review.prompt).not.toBe(original.prompt);
    if (review.visual) expect(review.visual).not.toEqual(original.visual);
  }
});
it('backs up a six-sticks-versus-four-sides error, retry and independent physical-work status', () => {
  const library = initialLibrary('摆棒测试');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  session.phase = 'practice';
  const index = session.questions.findIndex((q) => q.id.endsWith('-2-sides'));
  session.responses[index]!.draft = 6;
  session.responses[index] = submitResponse(
    session.questions[index]!,
    session.responses[index]!,
  );
  session.responses[index]!.draft = 4;
  session.responses[index] = submitResponse(
    session.questions[index]!,
    session.responses[index]!,
  );
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  expect(statistics(session).manual).toBe(0);
  const broken = structuredClone(library);
  const visual = broken.sessions[0]!.questions[index]!.visual!;
  Object.assign(visual, { turn: 45 });
  expect(() => parseBackup(exportBackup(broken))).toThrow(Error);
});

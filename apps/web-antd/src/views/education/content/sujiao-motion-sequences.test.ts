import type { MotionSequencesVisual } from '../learning/motion-sequences';
import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import {
  isMotionSequencesVisual,
  meetingPositions,
  motionSequenceFrames,
  planeNoseDirection,
  planeTurnAngle,
  projectedPlane,
  slidePosition,
} from '../learning/motion-sequences';
import { initialLibrary } from '../learning/storage';
import { sujiaoMotionSequencesDraft as lesson } from './sujiao-motion-sequences';
it('uses three distinct fixed frames with continuous downwards motion, two opposite lanes and a limited rigid turn', () => {
  for (const variant of ['main', 'review'] as const)
    for (const scene of ['slide', 'meet', 'turn'] as const) {
      const model: MotionSequencesVisual = {
        kind: 'motion-sequences',
        variant,
        scene,
      };
      expect(isMotionSequencesVisual(model)).toBe(true);
      expect(
        motionSequenceFrames(model).toSorted((a, b) =>
          String(a).localeCompare(String(b)),
        ),
      ).toEqual([0, 1, 2]);
      const slide = [0, 1, 2].map((t) => slidePosition(model, t));
      expect(slide.map((p) => p[1])).toEqual([35, 95, 155]);
      expect(slide.map((p) => p[0])).toEqual(
        variant === 'main' ? [50, 140, 230] : [250, 160, 70],
      );
      const cars = [0, 1, 2].map((t) => meetingPositions(model, t));
      expect(cars[1]).toEqual([150, 150]);
      expect(cars[0]![0] < cars[0]![1]).toBe(variant === 'main');
      expect(cars[2]![0] > cars[2]![1]).toBe(variant === 'main');
      expect(Math.abs(cars[0]![0] - cars[0]![1])).toBe(
        Math.abs(cars[2]![0] - cars[2]![1]),
      );
      expect([0, 1, 2].map((t) => planeTurnAngle(model, t))).toEqual(
        variant === 'main' ? [-90, 0, 90] : [90, 0, -90],
      );
      expect([0, 1, 2].map((t) => planeNoseDirection(model, t))).toEqual(
        variant === 'main'
          ? ['left', 'toward', 'right']
          : ['right', 'toward', 'left'],
      );
      for (const angle of [-90, 0, 90]) {
        const plane = projectedPlane(angle);
        expect(plane).toHaveLength(12);
        expect(plane.map((p) => p.layer)).toEqual(
          plane.map((p) => p.layer).toSorted((a, b) => a - b),
        );
        for (const surface of plane)
          for (const point of surface.points.split(' ')) {
            const [x, y] = point.split(',').map(Number);
            expect(x).toBeGreaterThan(20);
            expect(x).toBeLessThan(280);
            expect(y).toBeGreaterThan(10);
            expect(y).toBeLessThan(140);
          }
      }
    }
  expect(projectedPlane(-90)).not.toEqual(projectedPlane(90));
});
it('projects the same aircraft with nose at the stated side and mirrored side silhouettes rather than swapping unrelated drawings', () => {
  const points = (angle: number) =>
    projectedPlane(angle).flatMap((s) =>
      s.points
        .split(' ')
        .map((p) => p.split(',').map(Number) as [number, number]),
    );
  const front = points(0);
  const left = points(-90);
  const right = points(90);
  expect(Math.min(...left.map((p) => p[0]))).toBeCloseTo(71.6, 8);
  expect(Math.max(...right.map((p) => p[0]))).toBeCloseTo(228.4, 8);
  expect(
    front.some(
      ([x, y]) =>
        Math.abs(x - 150) < 1e-8 &&
        Math.abs(y - (80 + 2.8 * 28 * Math.sin(Math.PI / 9))) < 1e-8,
    ),
  ).toBe(true);
  const signature = (p: [number, number][]) =>
    p
      .map(([x, y]) => `${x.toFixed(6)},${y.toFixed(6)}`)
      .toSorted((a, b) => String(a).localeCompare(String(b)));
  expect(signature(left.map(([x, y]) => [300 - x, y]))).toEqual(
    signature(right),
  );
});
it('changes actual orders and endpoints in review and does not use distance or unspecified cycles to force time', () => {
  const main: Answer[] = [
    'CAB',
    'C',
    'B',
    'BCA',
    'B',
    'A',
    'BAC',
    'B',
    'C',
    1,
    2,
    'no',
    'no',
    'ask',
    'ask',
  ];
  const review: Answer[] = [
    'BCA',
    'B',
    'A',
    'CAB',
    'C',
    'B',
    'BCA',
    'B',
    'A',
    1,
    2,
    'no',
    'no',
    'ask',
    'ask',
  ];
  expect(lesson.steps).toHaveLength(6);
  expect(lesson.questions).toHaveLength(20);
  expect(lesson.reviewQuestions).toHaveLength(15);
  for (let i = 0; i < 15; i++) {
    expect(evaluate(lesson.questions[i]!.rule, main[i]!)).toBe(true);
    expect(evaluate(lesson.reviewQuestions![i]!.rule, review[i]!)).toBe(true);
    expect(lesson.questions[i]!.knowledge).toBe(
      lesson.reviewQuestions![i]!.knowledge,
    );
    if (lesson.questions[i]!.visual)
      expect(lesson.questions[i]!.visual).not.toEqual(
        lesson.reviewQuestions![i]!.visual,
      );
  }
  for (const i of [0, 1, 2, 3, 4, 5, 6, 8])
    expect(evaluate(lesson.reviewQuestions![i]!.rule, main[i]!)).toBe(false);
  expect(evaluate(lesson.questions[9]!.rule, 3)).toBe(false);
  expect(evaluate(lesson.questions[10]!.rule, 6)).toBe(false);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    3,
  );
  expect(
    lesson.questions.filter((q) => q.rule.kind === 'reflection'),
  ).toHaveLength(2);
  expect(lesson.questions[13]!.visual).toBeUndefined();
  expect(lesson.questions[14]!.visual).toBeUndefined();
});
it('preserves diagrams, wrong-first ordering and old record semantics while rejecting unsupported source conditions', () => {
  const library = initialLibrary('运动过程');
  const s = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const i = s.questions.findIndex((q) => q.id.endsWith('-q-order-slide'));
  s.responses[i]!.draft = 'ABC';
  library.sessions.push(s);
  expect(
    parseBackup(exportBackup(library)).data.sessions[0]!.responses[i]!.draft,
  ).toBe('ABC');
  s.responses[i] = submitResponse(s.questions[i]!, s.responses[i]!);
  s.responses[i]!.draft = 'CAB';
  s.responses[i] = submitResponse(s.questions[i]!, s.responses[i]!);
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
  const base = { kind: 'motion-sequences', variant: 'main', scene: 'slide' };
  for (const patch of [
    { variant: ['main'] },
    { variant: 'other' },
    { scene: ['slide'] },
    { scene: 'fly' },
    { answer: 'CAB' },
    { direction: 'up' },
    { cycles: 2 },
  ]) {
    expect(isMotionSequencesVisual({ ...base, ...patch })).toBe(false);
    const damaged = structuredClone(library);
    Object.assign(damaged.sessions[0]!.questions[i]!.visual!, patch);
    expect(() => parseBackup(exportBackup(damaged))).toThrow(Error);
  }
  const a = motionSequenceFrames(base as MotionSequencesVisual);
  a[0] = 99;
  expect(motionSequenceFrames(base as MotionSequencesVisual)).toEqual([
    1, 2, 0,
  ]);
});

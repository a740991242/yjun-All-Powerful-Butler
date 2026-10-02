import type { RectangleCutVisual } from './types';

import { expect, it } from 'vitest';

import { sujiaoPlaneCuttingDraft as lesson } from '../content/sujiao-plane-cutting';
import { exportBackup, parseBackup } from './backup';
import { createSession, evaluate, statistics, submitResponse } from './engine';
import { fold } from './fold';
import {
  isRectangleCutVisual,
  rectangleCutLabels,
  rectangleCutPieces,
} from './rectangle-cut';
import { initialLibrary } from './storage';

it('draws two equal pieces with labels inside the specified regions for all supported proportions and cuts', () => {
  for (const width of [4, 6] as const)
    for (const cut of ['vertical', 'horizontal', 'diagonal'] as const) {
      const model: RectangleCutVisual = { kind: 'rectangle-cut', width, cut };
      expect(isRectangleCutVisual(model)).toBe(true);
      const pieces = rectangleCutPieces(model).map((polygon) =>
        polygon.split(' ').map((point) => point.split(',').map(Number)),
      );
      const areas = pieces.map(
        (points) =>
          Math.abs(
            fold(points, 0, (sum, p, i) => {
              const next = points[(i + 1) % points.length]!;
              return sum + p[0]! * next[1]! - p[1]! * next[0]!;
            }),
          ) / 2,
      );
      expect(areas).toEqual([(width * 40 * 80) / 2, (width * 40 * 80) / 2]);
      expect(pieces[0]).toHaveLength(cut === 'diagonal' ? 3 : 4);
      const labels = rectangleCutLabels(model);
      labels.forEach(([x, y], i) => {
        expect(x).toBeGreaterThan(0);
        expect(x).toBeLessThan(width * 40);
        expect(y).toBeGreaterThan(0);
        expect(y).toBeLessThan(80);
        if (cut === 'vertical') expect(x < width * 20).toBe(i === 0);
        if (cut === 'horizontal') expect(y < 40).toBe(i === 0);
        if (cut === 'diagonal')
          expect(y < (x * 80) / (width * 40)).toBe(i === 0);
      });
      if (cut === 'vertical') {
        const side = pieces[0]!;
        const w = side[1]![0]! - side[0]![0]!;
        const h = side[2]![1]! - side[1]![1]!;
        expect(w === h).toBe(width === 4);
      }
    }
});
it('rejects unknown dimensions, arbitrary cut lines and extra solution data', () => {
  const model = { kind: 'rectangle-cut', width: 4, cut: 'diagonal' };
  for (const width of [0, 2, 5, 4.5, '4', Number.NaN])
    expect(isRectangleCutVisual({ ...model, width })).toBe(false);
  for (const cut of ['slant', 'middle', null, 0])
    expect(isRectangleCutVisual({ ...model, cut })).toBe(false);
  for (const extra of [{ height: 3 }, { answer: 'triangle' }, { pieces: [] }])
    expect(isRectangleCutVisual({ ...model, ...extra })).toBe(false);
});
it('does not generalize a square-producing cut or accept arbitrary slanted and unspecified folds', () => {
  for (const [review, questions] of [
    [false, lesson.questions],
    [true, lesson.reviewQuestions!],
  ] as const) {
    const q = (suffix: string) =>
      questions.find(
        (q) => q.id === `${lesson.id}-${review ? 'r' : 'q'}-${suffix}`,
      )!;
    expect(
      evaluate(q('shape-vertical').rule, review ? 'rectangle' : 'square'),
    ).toBe(true);
    expect(
      evaluate(q('shape-vertical').rule, review ? 'square' : 'rectangle'),
    ).toBe(false);
    expect(evaluate(q('shape-horizontal').rule, 'rectangle')).toBe(true);
    expect(evaluate(q('shape-diagonal').rule, 'triangle')).toBe(true);
    expect(evaluate(q('pieces').rule, 2)).toBe(true);
    expect(evaluate(q('same').rule, 'yes')).toBe(true);
    for (const suffix of ['any-rectangle', 'any-slant', 'fold', 'join'])
      expect(evaluate(q(suffix).rule, 'no')).toBe(true);
    expect(evaluate(q('parallelogram').rule, 'parallelogram')).toBe(true);
  }
  expect(lesson.reviewQuestions).toHaveLength(10);
  expect(lesson.steps[3]!.text).toContain('从正方形沿对角线分出的两块');
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    3,
  );
});
it('retains cut conditions and wrong-first history while keeping real cutting separate from diagram answers', () => {
  const state = initialLibrary('剪图测试');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    state.activeProfileId,
  );
  session.phase = 'practice';
  const i = session.questions.findIndex((q) =>
    q.id.endsWith('-q-shape-vertical'),
  );
  session.responses[i]!.draft = 'rectangle';
  session.responses[i] = submitResponse(
    session.questions[i]!,
    session.responses[i]!,
  );
  session.responses[i]!.draft = 'square';
  session.responses[i] = submitResponse(
    session.questions[i]!,
    session.responses[i]!,
  );
  state.sessions.push(session);
  expect(parseBackup(exportBackup(state)).data.sessions[0]).toEqual(session);
  expect(session.responses[i]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  expect(statistics(session).manual).toBe(0);
  const damaged = structuredClone(state);
  const visual = damaged.sessions[0]!.questions[i]!.visual;
  if (visual?.kind !== 'rectangle-cut') throw new Error('missing cut');
  Object.assign(visual, { width: 5 });
  expect(() => parseBackup(exportBackup(damaged))).toThrow(Error);
});

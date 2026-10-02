import type { CompositeShapesVisual } from './types';

import { expect, it } from 'vitest';

import { sujiaoCompositeCountingDraft as lesson } from '../content/sujiao-composite-counting';
import { exportBackup, parseBackup } from './backup';
import {
  compositeGroups,
  compositeSegments,
  compositeTotal,
  isCompositeShapesVisual,
} from './composite-shapes';
import { createSession, evaluate, statistics, submitResponse } from './engine';
import { initialLibrary } from './storage';

it('counts distinct drawn boundaries by positions, including composed regions without counting rectangles as squares', () => {
  for (const layout of [
    'rectangle-strip',
    'square-grid',
    'triangle-fan',
  ] as const)
    for (const divisions of [2, 3, 4] as const) {
      const model: CompositeShapesVisual = {
        kind: 'composite-shapes',
        layout,
        divisions,
      };
      if (divisions === 4 && layout !== 'triangle-fan') continue;
      expect(isCompositeShapesVisual(model)).toBe(true);
      const boundaries = new Set<string>();
      const bySpan = Array.from({ length: divisions }, () => 0);
      if (layout === 'square-grid') {
        for (let left = 0; left < divisions; left++)
          for (let right = left + 1; right <= divisions; right++)
            for (let top = 0; top < divisions; top++)
              for (let bottom = top + 1; bottom <= divisions; bottom++) {
                if (right - left !== bottom - top) continue;
                boundaries.add(`${left},${top}:${right},${bottom}`);
                bySpan[right - left - 1]!++;
              }
      } else {
        for (let left = 0; left < divisions; left++)
          for (let right = left + 1; right <= divisions; right++) {
            boundaries.add(`${left}:${right}`);
            bySpan[right - left - 1]!++;
          }
      }
      expect(compositeTotal(model)).toBe(boundaries.size);
      expect(compositeGroups(model)).toEqual(bySpan);
      const segments = compositeSegments(model);
      expect(segments).toHaveLength(
        (divisions - 1) * (layout === 'square-grid' ? 2 : 1),
      );
      for (const [x1, y1, x2, y2] of segments) {
        const width = layout === 'square-grid' ? 180 : 240;
        const height = (() => {
          if (layout === 'square-grid') return 180;
          return layout === 'rectangle-strip' ? 40 : 140;
        })();
        for (const x of [x1, x2]) {
          expect(x).toBeGreaterThanOrEqual(0);
          expect(x).toBeLessThanOrEqual(width);
        }
        for (const y of [y1, y2]) {
          expect(y).toBeGreaterThanOrEqual(0);
          expect(y).toBeLessThanOrEqual(height);
        }
        if (layout === 'triangle-fan')
          expect([x1, y1, y2]).toEqual([120, 0, 140]);
      }
    }
});
it('rejects unsupported layouts, out-of-range subdivisions and added answer or hidden-line fields', () => {
  const model = {
    kind: 'composite-shapes',
    layout: 'square-grid',
    divisions: 2,
  };
  for (const divisions of [0, 1, 4, 5, 2.5, '2', Number.NaN])
    expect(isCompositeShapesVisual({ ...model, divisions })).toBe(false);
  expect(
    isCompositeShapesVisual({
      ...model,
      layout: 'rectangle-strip',
      divisions: 4,
    }),
  ).toBe(false);
  expect(
    isCompositeShapesVisual({ ...model, layout: 'triangle-fan', divisions: 4 }),
  ).toBe(true);
  for (const layout of ['circle-grid', 'triangle-grid', null])
    expect(isCompositeShapesVisual({ ...model, layout })).toBe(false);
  for (const extra of [{ answer: 5 }, { hidden: true }, { diagonals: true }])
    expect(isCompositeShapesVisual({ ...model, ...extra })).toBe(false);
});
it('keeps smallest-region questions separate from total and grouped counts in both practice and changed review diagrams', () => {
  for (const [review, questions, expected] of [
    [false, lesson.questions, [6, 5, 10]],
    [true, lesson.reviewQuestions!, [3, 14, 6]],
  ] as const) {
    ['rectangle-strip', 'square-grid', 'triangle-fan'].forEach((layout, i) => {
      const q = (suffix: string) =>
        questions.find(
          (q) =>
            q.id === `${lesson.id}-${review ? 'r' : 'q'}-${layout}-${suffix}`,
        )!;
      const visual = q('total').visual;
      if (visual?.kind !== 'composite-shapes')
        throw new Error('missing composite figure');
      expect(evaluate(q('total').rule, expected[i]!)).toBe(true);
      const groups = compositeGroups(visual);
      expect(evaluate(q('total').rule, groups[0]!)).toBe(false);
      expect(evaluate(q('small').rule, groups[0]!)).toBe(true);
      expect(evaluate(q('groups').rule, groups)).toBe(true);
      expect(evaluate(q('groups').rule, groups.toReversed())).toBe(false);
    });
  }
  for (const q of lesson.reviewQuestions!) {
    const original = lesson.questions.find(
      (old) => old.knowledge === q.knowledge,
    )!;
    expect(q.prompt).not.toBe(original.prompt);
    if (q.visual) expect(q.visual).not.toEqual(original.visual);
  }
});
it('backs up subdivisions, partial grouped counts and wrong-first answers without confirming drawing activities', () => {
  const state = initialLibrary('数图测试');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    state.activeProfileId,
  );
  session.phase = 'practice';
  const index = session.questions.findIndex((q) =>
    q.id.endsWith('-q-rectangle-strip-total'),
  );
  session.responses[index]!.draft = 3;
  session.responses[index] = submitResponse(
    session.questions[index]!,
    session.responses[index]!,
  );
  session.responses[index]!.draft = 6;
  session.responses[index] = submitResponse(
    session.questions[index]!,
    session.responses[index]!,
  );
  const groups = session.questions.findIndex((q) =>
    q.id.endsWith('-q-rectangle-strip-groups'),
  );
  session.responses[groups]!.draft = [3, null, 1];
  state.sessions.push(session);
  expect(parseBackup(exportBackup(state)).data.sessions[0]).toEqual(session);
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  expect(statistics(session).manual).toBe(0);
  const damaged = structuredClone(state);
  const visual = damaged.sessions[0]!.questions[index]!.visual;
  if (visual?.kind !== 'composite-shapes') throw new Error('missing model');
  Object.assign(visual, { divisions: 4 });
  expect(() => parseBackup(exportBackup(damaged))).toThrow(Error);
});

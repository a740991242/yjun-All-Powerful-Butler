import { expect, it } from 'vitest';

import { sujiaoUpperSolidRecomposeLesson as lesson } from '../content/sujiao-upper-solid-recompose';
import { exportBackup, parseBackup } from './backup';
import { createSession } from './engine';
import {
  isSolidRecomposeVisual,
  solidPieceLayers,
  solidPieceUnits,
  solidRecomposeCanvas,
  solidRecomposeData,
} from './solid-recompose';
it('keeps whole pieces, height shares and physical units distinct with complete depth and layer geometry', () => {
  for (const variant of ['main', 'review'] as const) {
    const m = (
      scene:
        | 'count-corner'
        | 'count-rows'
        | 'count-stair'
        | 'cube-join'
        | 'cube-split'
        | 'cylinder-join'
        | 'cylinder-split',
    ) => ({ kind: 'solid-recompose' as const, variant, scene });
    const review = variant === 'review';
    expect(
      solidRecomposeData(m('cube-join')).input.map(solidPieceUnits),
    ).toEqual(review ? [2, 3] : [1, 1, 2]);
    expect(
      solidRecomposeData(m('cylinder-join')).input.map((p) => [
        p.height,
        p.segmented,
      ]),
    ).toEqual([
      [1, false],
      [review ? 3 : 2, false],
    ]);
    for (const [scene, total, layers] of [
      ['count-stair', review ? 5 : 4, review ? [3, 1, 1] : [3, 1]],
      ['count-corner', review ? 7 : 5, review ? [3, 3, 1] : [3, 2]],
      ['count-rows', review ? 8 : 6, [review ? 8 : 6]],
    ] as const) {
      const piece = solidRecomposeData(m(scene)).input[0]!;
      expect(piece.cells).toHaveLength(total);
      expect(solidPieceLayers(piece).map((l) => l.length)).toEqual(layers);
      expect(new Set(piece.cells.map((c) => c.join(','))).size).toBe(total);
      const before = JSON.stringify(piece.cells);
      const draw = solidRecomposeCanvas(piece.cells);
      expect(JSON.stringify(piece.cells)).toBe(before);
      expect(
        draw.every(
          (p) =>
            p.x >= 0 && p.y - 18 >= 0 && p.x + 50 <= 240 && p.y + 32 <= 220,
        ),
      ).toBe(true);
      expect(solidPieceLayers(piece).flat()).toHaveLength(total);
    }
    expect(solidRecomposeData(m('cylinder-split')).input[0]!.segmented).toBe(
      true,
    );
  }
});
it('round-trips fixed visual models and rejects forged arbitrary geometry or leaked answers', () => {
  const model = {
    kind: 'solid-recompose',
    scene: 'count-corner',
    variant: 'main',
  };
  expect(isSolidRecomposeVisual(model)).toBe(true);
  for (const value of [
    null,
    [],
    { ...model, scene: ['count-corner'] },
    { ...model, variant: 'old' },
    { ...model, answer: 5 },
    { ...model, cells: [[0, 0, 0]] },
    { kind: 'solid-recompose', scene: 'count-corner' },
  ])
    expect(isSolidRecomposeVisual(value)).toBe(false);
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
  const q = session.questions.find(
    (q) => q.visual?.kind === 'solid-recompose',
  )!;
  q.visual = { ...model, scene: 'unknown' } as unknown as typeof q.visual;
  expect(() => exportBackup(data, now)).toThrow(
    'educationLearning.invalidRecord',
  );
});

import { expect, it } from 'vitest';

import { bnuUpperBook } from '../content/bnu';
import { bnuFinalSolidsLesson as lesson } from '../content/bnu-final-solids';
import { exportBackup, parseBackup } from './backup';
import {
  bnuFinalMaterials,
  bnuFinalRobot,
  isBnuFinalSolidsVisual,
} from './bnu-final-solids';
import { createSession } from './engine';
import { initialLibrary } from './storage';

it('keeps all pieces including rotated antennae inside the robot view and does not mutate source inventories', () => {
  const shapes = ['cuboid', 'cylinder', 'cube', 'sphere'];
  for (const variant of ['main', 'review'] as const) {
    const pieces = bnuFinalRobot(variant);
    expect(
      shapes.map((shape) => pieces.filter((p) => p.shape === shape).length),
    ).toEqual(variant === 'main' ? [2, 8, 2, 4] : [1, 6, 2, 2]);
    expect(new Set(pieces.map((p) => p.label)).size).toBe(pieces.length);
    for (const piece of pieces) {
      const { x, y, width, height } = piece;
      const cx = x + width / 2;
      const cy = y + height / 2;
      const angle = ((piece.rotate ?? 0) * Math.PI) / 180;
      for (const [dx, dy] of [
        [-width / 2, -height / 2],
        [width / 2, -height / 2],
        [-width / 2, height / 2],
        [width / 2, height / 2],
      ]) {
        const px =
          cx + Number(dx) * Math.cos(angle) - Number(dy) * Math.sin(angle);
        const py =
          cy + Number(dx) * Math.sin(angle) + Number(dy) * Math.cos(angle);
        expect(px).toBeGreaterThanOrEqual(0);
        expect(px).toBeLessThanOrEqual(360);
        expect(py).toBeGreaterThanOrEqual(0);
        expect(py).toBeLessThanOrEqual(400);
      }
    }
  }
  const first = bnuFinalRobot('main');
  first.pop();
  expect(bnuFinalRobot('main')).toHaveLength(16);
  const materials = bnuFinalMaterials('main');
  materials[0]?.shapes.pop();
  expect(bnuFinalMaterials('main').map((g) => g.shapes.length)).toEqual([8, 8]);
});
it('strictly accepts fixed scene and variant only, rejects answer injection and retains schema-one backups', () => {
  for (const scene of ['objects', 'materials', 'robot', 'stability'])
    for (const variant of ['main', 'review'])
      expect(
        isBnuFinalSolidsVisual({ kind: 'bnu-final-solids', scene, variant }),
      ).toBe(true);
  for (const value of [
    { kind: 'bnu-final-solids', scene: 'other', variant: 'main' },
    { kind: 'bnu-final-solids', scene: ['robot'], variant: 'main' },
    { kind: 'bnu-final-solids', scene: 'robot', variant: 'other' },
    {
      kind: 'bnu-final-solids',
      scene: 'robot',
      variant: 'main',
      answers: [2, 8, 2, 4],
    },
  ])
    expect(isBnuFinalSolidsVisual(value)).toBe(false);
  const library = initialLibrary('隔离图模型');
  library.sessions.push(
    createSession(lesson, bnuUpperBook.id, library.activeProfileId),
  );
  const original = exportBackup(library);
  expect(parseBackup(original).data).toEqual(
    JSON.parse(JSON.stringify(library)),
  );
  for (const extra of [{ scene: 'other' }, { answer: [2, 8, 2, 4] }]) {
    const data = JSON.parse(original);
    Object.assign(data.data.sessions[0].questions[0].visual, extra);
    expect(() => parseBackup(JSON.stringify(data))).toThrow(
      'educationLearning.invalidBackup',
    );
  }
});

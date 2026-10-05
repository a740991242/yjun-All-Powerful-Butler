import type { BnuFoldOneVisual, FoldOnePoint } from './bnu-fold-one';

import { describe, expect, it } from 'vitest';

import en from '../../../locales/langs/en-US/educationLearning.json';
import zh from '../../../locales/langs/zh-CN/educationLearning.json';
import { bnuLowerBook } from '../content/bnu-lower';
import { bnuLowerRecognizeShapesLesson } from '../content/bnu-lower-recognize-shapes';
import { exportBackup, parseBackup } from './backup';
import {
  bnuFoldOneBoundary,
  bnuFoldOnePieces,
  bnuFoldScenes,
  foldOneArea,
  isBnuFoldOneVisual,
} from './bnu-fold-one';
import { createSession } from './engine';
import { required } from './required';
import { hull } from './shape-join';
import { initialLibrary } from './storage';

const visual = (scene: BnuFoldOneVisual['scene']): BnuFoldOneVisual => ({
  kind: 'bnu-fold-one',
  scene,
  variant: 'main',
});
const distance2 = (a: FoldOnePoint, b: FoldOnePoint) =>
  (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
const sides = (p: FoldOnePoint[]) =>
  p
    .map((a, i) => distance2(a, required(p[(i + 1) % p.length])))
    .toSorted((a, b) => a - b);
/** Independent normalized-axis check with tolerance for shared irrational endpoints. */
function interiorsOverlap(a: FoldOnePoint[], b: FoldOnePoint[]) {
  for (const p of [a, b])
    for (let i = 0; i < p.length; i++) {
      const end = required(p[(i + 1) % p.length]);
      const start = required(p[i]);
      const length = Math.hypot(end[0] - start[0], end[1] - start[1]);
      const nx = (end[1] - start[1]) / length;
      const ny = (start[0] - end[0]) / length;
      const ap = a.map(([x, y]) => x * nx + y * ny);
      const bp = b.map(([x, y]) => x * nx + y * ny);
      if (
        Math.min(Math.max(...ap), Math.max(...bp)) -
          Math.max(Math.min(...ap), Math.min(...bp)) <=
        1e-8
      )
        return false;
    }
  return true;
}
describe('fixed original folding and composition diagrams', () => {
  it('accepts only known three-field snapshots without coercion or imported geometry', () => {
    for (const scene of bnuFoldScenes)
      for (const variant of ['main', 'review'])
        expect(isBnuFoldOneVisual({ ...visual(scene), variant })).toBe(true);
    for (const bad of [
      null,
      [],
      {},
      { ...visual('four-triangles'), scene: ['four-triangles'] },
      { ...visual('four-triangles'), variant: 1 },
      { ...visual('four-triangles'), scene: 'other' },
      { ...visual('four-triangles'), answer: 4 },
      { ...visual('four-triangles'), pieces: [] },
      {
        ...visual('four-triangles'),
        scene: { toString: () => 'four-triangles' },
      },
    ])
      expect(isBnuFoldOneVisual(bad)).toBe(false);
  });
  it('preserves the same four congruent triangles in a square, large triangle and trapezoid without gaps or overlapping interiors', () => {
    for (const scene of [
      'four-triangles',
      'joined-triangle',
      'joined-trapezoid',
    ] as const) {
      const polygons = bnuFoldOnePieces(visual(scene)).map((p) =>
        required(p.polygon),
      );
      expect(polygons).toHaveLength(4);
      for (const p of polygons) {
        expect(foldOneArea(p)).toBeCloseTo(3600, 8);
        sides(p).forEach((s, i) =>
          expect(s).toBeCloseTo(required([7200, 7200, 14_400][i]), 8),
        );
      }
      for (let i = 0; i < 4; i++)
        for (let j = i + 1; j < 4; j++)
          expect(
            interiorsOverlap(required(polygons[i]), required(polygons[j])),
          ).toBe(false);
      const outer = hull(polygons.flat().map(([x, y]) => ({ x, y }))).map(
        ({ x, y }): FoldOnePoint => [x, y],
      );
      const boundary = bnuFoldOneBoundary(visual(scene));
      expect(outer.length).toBe(scene === 'joined-triangle' ? 3 : 4);
      expect(foldOneArea(outer)).toBeCloseTo(14_400, 8);
      expect(foldOneArea(boundary)).toBeCloseTo(14_400, 8);
      expect(outer.toSorted((a, b) => a[0] - b[0] || a[1] - b[1])).toEqual(
        boundary.toSorted((a, b) => a[0] - b[0] || a[1] - b[1]),
      );
    }
  });
  it('distinguishes square diagonal halves from unequal-leg triangle halves and complementary semicircles', () => {
    for (const p of bnuFoldOnePieces(visual('square-diagonal')))
      expect(sides(required(p.polygon))).toEqual([25_600, 25_600, 51_200]);
    for (const p of bnuFoldOnePieces(visual('triangle-mid')))
      expect(sides(required(p.polygon))).toEqual([14_400, 25_600, 40_000]);
    for (const scene of ['square-mid', 'rectangle-mid'] as const) {
      const [a, b] = bnuFoldOnePieces(visual(scene)).map((p) =>
        required(p.polygon),
      );
      expect(sides(required(a))).toEqual(sides(required(b)));
      expect(interiorsOverlap(required(a), required(b))).toBe(false);
    }
    const halves = bnuFoldOnePieces(visual('circle-mid'));
    expect(halves.map((p) => p.arc?.radius)).toEqual([80, 80]);
    expect(halves.map((p) => p.arc?.sweep)).toEqual([1, 0]);
    expect(halves[0]?.arc?.start).toEqual(halves[1]?.arc?.start);
    expect(halves[0]?.arc?.end).toEqual(halves[1]?.arc?.end);
  });
  it('keeps all four copy patterns and both original artwork inventories, bounded labels and genuine semicircles', () => {
    expect(
      [
        'copy-triangle',
        'copy-slant',
        'copy-mushroom',
        'copy-flag',
        'flower',
        'fish',
      ].map(
        (scene) =>
          bnuFoldOnePieces(visual(scene as BnuFoldOneVisual['scene'])).length,
      ),
    ).toEqual([2, 2, 2, 3, 7, 8]);
    for (const scene of bnuFoldScenes)
      for (const piece of bnuFoldOnePieces(visual(scene))) {
        for (const [x, y] of [...(piece.polygon ?? []), piece.label]) {
          expect(x).toBeGreaterThan(10);
          expect(x).toBeLessThan(350);
          expect(y).toBeGreaterThan(10);
          expect(y).toBeLessThan(270);
        }
        if (piece.arc) {
          expect(
            Math.sqrt(distance2(piece.arc.start, piece.arc.end)),
          ).toBeCloseTo(2 * piece.arc.radius, 10);
          expect(piece.polygon).toBeNull();
          expect(piece.path).toContain(`0 0 ${piece.arc.sweep}`);
        }
      }
    expect(
      bnuFoldOnePieces(visual('flower')).filter((p) => p.curved),
    ).toHaveLength(4);
    expect(
      bnuFoldOnePieces(visual('fish')).filter((p) => p.curved),
    ).toHaveLength(4);
    const pieces = bnuFoldOnePieces(visual('circle-mid'));
    required(required(pieces[0]).arc).start[0] = 999;
    required(pieces[0]).label[0] = 999;
    expect(bnuFoldOnePieces(visual('circle-mid'))[0]?.arc?.start[0]).toBe(100);
    expect(bnuFoldOnePieces(visual('circle-mid'))[0]?.label[0]).toBe(180);
    const square = bnuFoldOnePieces(visual('four-triangles'));
    required(required(square[0]).polygon)[0] = [999, 999];
    expect(bnuFoldOnePieces(visual('four-triangles'))[0]?.polygon?.[0]).toEqual(
      [120, 80],
    );
    required(bnuFoldOneBoundary(visual('four-triangles'))[0])[0] = 999;
    expect(bnuFoldOneBoundary(visual('four-triangles'))[0]).toEqual([120, 80]);
  });
  it('round-trips new diagrams alongside unchanged old sessions under schema 1 and rejects extra fields', () => {
    const library = initialLibrary('折拼验证');
    const old = createSession(
      bnuLowerRecognizeShapesLesson,
      bnuLowerBook.id,
      library.activeProfileId,
    );
    const lesson = {
      ...bnuLowerRecognizeShapesLesson,
      id: 'fold-diagram-test-only',
      questions: bnuFoldScenes.map((scene, index) => ({
        ...required(bnuLowerRecognizeShapesLesson.questions[0]),
        id: `fold-test-${index}`,
        visual: visual(scene),
      })),
    };
    const current = createSession(
      lesson,
      bnuLowerBook.id,
      library.activeProfileId,
    );
    library.sessions.push(old, current);
    const raw = exportBackup(library);
    expect(JSON.parse(raw).data.schemaVersion).toBe(1);
    expect(parseBackup(raw).data.sessions).toEqual(
      JSON.parse(JSON.stringify([old, current])),
    );
    for (const extra of [
      { answer: 4 },
      { scene: ['four-triangles'] },
      { variant: 'future' },
      { polygon: [] },
    ]) {
      const bad = JSON.parse(raw);
      Object.assign(bad.data.sessions[1].questions[0].visual, extra);
      expect(() => parseBackup(JSON.stringify(bad))).toThrow(
        'educationLearning.invalidBackup',
      );
    }
  });
});

it('keeps Chinese and English observation captions and equivalent arc descriptions free of requested classification and piece-count answers', () => {
  for (const scene of bnuFoldScenes) {
    const key = `bnuFold_${scene}` as keyof typeof zh;
    expect(zh[key]).toMatch(/^折剪拼观察图 /);
    expect(en[key]).toMatch(/^Folding and composition diagram /);
  }
  expect(zh.bnuFoldCurvedPiece).not.toContain('半圆');
  expect(en.bnuFoldCurvedPiece).not.toContain('semicircle');
  for (const text of [zh.bnuFoldCurvedPiece, en.bnuFoldCurvedPiece])
    for (const token of ['{letter}', '{points}', '{radius}', '{side}'])
      expect(text).toContain(token);
});

import type { BnuTangramVisual, TangramPoint } from './bnu-tangram';

import { expect, it } from 'vitest';

import en from '../../../locales/langs/en-US/educationLearning.json';
import zh from '../../../locales/langs/zh-CN/educationLearning.json';
import { mathBooks } from '../content/math';
import { exportBackup, parseBackup } from './backup';
import {
  bnuTangramHeight,
  bnuTangramPieces,
  bnuTangramScenes,
  isBnuTangramVisual,
} from './bnu-tangram';
import { createSession } from './engine';
import { required } from './required';
import { hull, overlaps } from './shape-join';
import { initialLibrary } from './storage';

const visual = (scene: BnuTangramVisual['scene']): BnuTangramVisual => ({
  kind: 'bnu-tangram',
  scene,
  variant: 'main',
});
const squaredSides = (points: TangramPoint[]) =>
  points
    .map(([x, y], i) => {
      const b = required(points[(i + 1) % points.length]);
      return (x - b[0]) ** 2 + (y - b[1]) ** 2;
    })
    .toSorted((a, b) => a - b);
function area(points: TangramPoint[]) {
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const a = required(points[i]);
    const b = required(points[(i + 1) % points.length]);
    sum += a[0] * b[1] - a[1] * b[0];
  }
  return Math.abs(sum) / 2;
}
const asPoints = (points: TangramPoint[]) => points.map(([x, y]) => ({ x, y }));

it('uses only fixed scenes and two display variants, rejecting coercion and arbitrary geometry fields', () => {
  for (const scene of bnuTangramScenes)
    for (const variant of ['main', 'review'])
      expect(isBnuTangramVisual({ ...visual(scene), variant })).toBe(true);
  for (const bad of [
    null,
    [],
    {},
    { ...visual('square'), kind: 'tangram' },
    { ...visual('square'), scene: ['square'] },
    { ...visual('square'), variant: 0 },
    { ...visual('square'), scene: 'other' },
    { ...visual('square'), pieces: [] },
    { ...visual('square'), answer: 5 },
    { ...visual('square'), width: 100 },
    { ...visual('square'), scene: { toString: () => 'square' } },
  ])
    expect(isBnuTangramVisual(bad)).toBe(false);
});
it('reconstructs the original numbered seven-piece square with disjoint interiors, exact size groups and complete outer area', () => {
  const pieces = bnuTangramPieces(visual('square'));
  expect(pieces.map((p) => p.id)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  expect(pieces.filter((p) => p.points.length === 3).map((p) => p.id)).toEqual([
    1, 2, 4, 6, 7,
  ]);
  const expectedSides = [
    [20_000, 20_000, 40_000],
    [20_000, 20_000, 40_000],
    [5000, 5000, 10_000, 10_000],
    [5000, 5000, 10_000],
    [5000, 5000, 5000, 5000],
    [5000, 5000, 10_000],
    [10_000, 10_000, 20_000],
  ];
  expect(pieces.map((p) => squaredSides(p.points))).toEqual(expectedSides);
  expect(pieces.map((p) => area(p.points))).toEqual([
    10_000, 10_000, 5000, 2500, 5000, 2500, 5000,
  ]);
  for (let i = 0; i < 7; i++)
    for (let j = i + 1; j < 7; j++)
      expect(
        overlaps(
          asPoints(required(pieces[i]).points),
          asPoints(required(pieces[j]).points),
        ),
      ).toBe(false);
  const boundary = hull(pieces.flatMap((p) => asPoints(p.points))).map(
    ({ x, y }): TangramPoint => [x, y],
  );
  expect(boundary).toEqual([
    [80, 60],
    [280, 60],
    [280, 260],
    [80, 260],
  ]);
  expect(area(boundary)).toBe(40_000);
  const para = required(pieces.find((p) => p.id === 3)).points;
  const square = required(pieces.find((p) => p.id === 5)).points;
  for (const points of [para, square])
    for (let i = 0; i < 2; i++) {
      const a = required(points[i]);
      const b = required(points[i + 1]);
      const c = required(points[(i + 2) % 4]);
      const d = required(points[(i + 3) % 4]);
      expect([b[0] - a[0], b[1] - a[1]]).toEqual([c[0] - d[0], c[1] - d[1]]);
    }
  const dot = (points: TangramPoint[]) => {
    const a = required(points[0]);
    const b = required(points[1]);
    const c = required(points[2]);
    return (a[0] - b[0]) * (c[0] - b[0]) + (a[1] - b[1]) * (c[1] - b[1]);
  };
  expect(dot(para)).not.toBe(0);
  expect(dot(square)).toBe(0);
});
it('preserves each selected original piece across every layout and checks both larger triangle constructions independently', () => {
  const source = new Map(
    bnuTangramPieces(visual('square')).map((p) => [p.id, p]),
  );
  for (const scene of bnuTangramScenes) {
    const pieces = bnuTangramPieces(visual(scene));
    expect(new Set(pieces.map((p) => p.id)).size).toBe(pieces.length);
    for (const p of pieces) {
      expect(squaredSides(p.points)).toEqual(
        squaredSides(required(source.get(p.id)).points),
      );
      expect(area(p.points)).toBe(area(required(source.get(p.id)).points));
      for (const [x, y] of [...p.points, p.label]) {
        expect(x).toBeGreaterThanOrEqual(20);
        expect(x).toBeLessThanOrEqual(340);
        expect(y).toBeGreaterThanOrEqual(20);
        expect(y).toBeLessThanOrEqual(bnuTangramHeight(visual(scene)) - 20);
      }
    }
    for (let i = 0; i < pieces.length; i++)
      for (let j = i + 1; j < pieces.length; j++)
        expect(
          overlaps(
            asPoints(required(pieces[i]).points),
            asPoints(required(pieces[j]).points),
          ),
        ).toBe(false);
    expect(bnuTangramPieces({ ...visual(scene), variant: 'review' })).toEqual(
      pieces,
    );
  }
  for (const [scene, ids, total] of [
    ['large-triangle', [1, 2], 20_000],
    ['small-triangle', [4, 6], 5000],
  ] as const) {
    const pieces = bnuTangramPieces(visual(scene));
    expect(pieces.map((p) => p.id)).toEqual(ids);
    const boundary = hull(pieces.flatMap((p) => asPoints(p.points))).map(
      ({ x, y }): TangramPoint => [x, y],
    );
    expect(boundary).toHaveLength(3);
    expect(area(boundary)).toBe(total);
    expect(pieces.map((p) => area(p.points))).toEqual([total / 2, total / 2]);
  }
  expect(bnuTangramPieces(visual('trace')).map((p) => p.id)).toEqual([3, 5, 7]);
  expect(bnuTangramPieces(visual('goose-head')).map((p) => p.id)).toEqual([
    3, 4,
  ]);
  expect(bnuTangramPieces(visual('fish-head')).map((p) => p.id)).toEqual([
    1, 2,
  ]);
});
it('provides fresh mutable copies without corrupting original geometry or labels and keeps bilingual captions neutral', () => {
  const first = bnuTangramPieces(visual('square'));
  required(first[0]).label[0] = 999;
  required(required(first[0]).points)[0] = [999, 999];
  expect(bnuTangramPieces(visual('square'))[0]?.points[0]).toEqual([80, 60]);
  expect(bnuTangramPieces(visual('square'))[0]?.label[0]).toBe(180);
  expect(zh.tangramDiagram).toBe('编号纸片观察图');
  expect(en.tangramDiagram).toBe('Numbered-piece observation diagram');
  for (const text of [zh.tangramPiece, en.tangramPiece]) {
    expect(text).toContain('{id}');
    expect(text).toContain('{points}');
    expect(text).not.toMatch(
      /三角形|正方形|平行四边形|triangle|square|parallelogram/i,
    );
  }
});
it('round-trips all fixed visuals in schema one alongside unchanged historical PEP questions and refuses injected piece positions', () => {
  const library = initialLibrary('七巧板验证');
  const book = required(
    mathBooks.find((b) => b.id === 'pep-math-p1-upper-2024'),
  );
  const oldLesson = required(
    book.units.flatMap((u) => u.lessons).find((l) => l.status === 'available'),
  );
  const old = createSession(oldLesson, book.id, library.activeProfileId);
  const lesson = {
    ...oldLesson,
    id: 'tangram-diagram-test-only',
    questions: bnuTangramScenes.map((scene, i) => ({
      ...required(oldLesson.questions[0]),
      id: `tangram-fixture-${i}`,
      visual: visual(scene),
    })),
  };
  const current = createSession(lesson, book.id, library.activeProfileId);
  library.sessions.push(old, current);
  const raw = exportBackup(library);
  expect(JSON.parse(raw).data.schemaVersion).toBe(1);
  expect(parseBackup(raw).data.sessions).toEqual(
    JSON.parse(JSON.stringify([old, current])),
  );
  for (const extra of [
    { pieces: [{ id: 1, points: [] }] },
    { scene: ['square'] },
    { variant: 'other' },
    { answer: 5 },
    { width: 360 },
  ]) {
    const bad = JSON.parse(raw);
    Object.assign(bad.data.sessions[1].questions[0].visual, extra);
    expect(() => parseBackup(JSON.stringify(bad))).toThrow(
      'educationLearning.invalidBackup',
    );
  }
});

import { expect, it } from 'vitest';

import { sujiaoCircularNumbersDraft } from '../content/sujiao-circular-numbers';
import { exportBackup, parseBackup } from './backup';
import {
  circularNeighbor,
  circularNumberCells,
  isCircularNumberArrayVisual,
} from './circular-number-array';
import { createSession } from './engine';
import { initialLibrary } from './storage';
it('lays out four rings and ten clockwise sectors, distinguishes wrapping from outward movement', () => {
  for (const start of [20, 40] as const) {
    const cells = circularNumberCells({
      kind: 'circular-number-array',
      start,
      hidden: [
        [0, 2],
        [1, 5],
        [2, 8],
        [3, 0],
      ],
    });
    expect(cells).toHaveLength(40);
    expect(new Set(cells.map((c) => c.value)).size).toBe(40);
    expect(
      cells.filter((c) => !c.known).map((c) => [c.letter, c.value]),
    ).toEqual([
      ['K', start + 2],
      ['L', start + 15],
      ['M', start + 28],
      ['N', start + 30],
    ]);
    for (let ring = 0; ring < 4; ring++)
      for (let sector = 0; sector < 10; sector++) {
        const index = ring * 10 + sector;
        expect(cells[index]?.value).toBe(start + index);
        const clockwise = circularNeighbor(ring, sector, 'clockwise')!;
        const next = cells[clockwise[0] * 10 + clockwise[1]]!;
        expect(next.value - cells[index]!.value).toBe(sector === 9 ? -9 : 1);
        const outward = circularNeighbor(ring, sector, 'outward');
        if (ring === 3) expect(outward).toBeNull();
        else
          expect(
            cells[outward![0] * 10 + outward![1]]!.value - cells[index]!.value,
          ).toBe(10);
      }
  }
});
it('limits layout and coordinates, rejects duplicate blanks and extra hidden answers', () => {
  const valid = { kind: 'circular-number-array', start: 20, hidden: [[0, 2]] };
  expect(isCircularNumberArrayVisual(valid)).toBe(true);
  for (const value of [
    null,
    [],
    { ...valid, start: 99 },
    { ...valid, start: [20] },
    { ...valid, hidden: [[4, 0]] },
    { ...valid, hidden: [[0, 10]] },
    { ...valid, hidden: [[0, -1]] },
    { ...valid, hidden: [[0, 0.5]] },
    {
      ...valid,
      hidden: [
        [0, 0],
        [0, 0],
      ],
    },
    { ...valid, hidden: [[0, 0, 1]] },
    { ...valid, answer: 22 },
  ])
    expect(isCircularNumberArrayVisual(value)).toBe(false);
  for (const position of [
    [-1, 0],
    [4, 0],
    [0, 10],
    [0, Number.NaN],
    [0.5, 0],
  ])
    expect(() =>
      circularNeighbor(position[0]!, position[1]!, 'clockwise'),
    ).toThrow(Error);
});
it('roundtrips snapshots and rejects numeric answer injection or a visual as grading rule', () => {
  const library = initialLibrary('圆形数阵');
  library.sessions.push(
    createSession(
      sujiaoCircularNumbersDraft,
      'sujiao-math-p1-lower-9787574312951',
      library.activeProfileId,
    ),
  );
  const backup = JSON.parse(exportBackup(library));
  const index = library.sessions[0]!.questions.findIndex(
    (q) => q.visual?.kind === 'circular-number-array',
  );
  expect(index).toBeGreaterThanOrEqual(0);
  const q = backup.data.sessions[0].questions[index];
  expect(
    parseBackup(JSON.stringify(backup)).data.sessions[0]?.questions[index]
      ?.visual,
  ).toEqual(q.visual);
  q.visual.answers = [22, 35, 48, 50];
  expect(() => parseBackup(JSON.stringify(backup))).toThrow(Error);
  delete q.visual.answers;
  q.visual.hidden = [
    [0, 2],
    [0, 2],
  ];
  expect(() => parseBackup(JSON.stringify(backup))).toThrow(Error);
  q.visual.hidden = [[0, 2]];
  q.rule = q.visual;
  expect(() => parseBackup(JSON.stringify(backup))).toThrow(Error);
});

import { expect, it } from 'vitest';

import { sujiaoUpperTenTablesLesson as lesson } from '../content/sujiao-upper-ten-tables';
import { exportBackup, parseBackup } from './backup';
import { createSession } from './engine';
import {
  isTenTablesVisual,
  tenArithmeticRows,
  tenTableRows,
  tenTableSymbols,
} from './ten-tables';
it('includes all five chains, nine circle rows and both full equation columns without mutating row order', () => {
  for (const variant of ['main', 'review'] as const) {
    const model = (display: 'add-sub' | 'five-chains' | 'nine-rows') => ({
      kind: 'ten-tables' as const,
      display,
      variant,
    });
    expect(tenTableRows(model('five-chains'))).toEqual(
      variant === 'main' ? [1, 2, 3, 4, 5] : [5, 4, 3, 2, 1],
    );
    const rows = tenTableRows(model('nine-rows'));
    expect(rows).toEqual(
      variant === 'main'
        ? [1, 2, 3, 4, 5, 6, 7, 8, 9]
        : [9, 8, 7, 6, 5, 4, 3, 2, 1],
    );
    for (const left of rows) {
      const symbols = tenTableSymbols(left).split(', ');
      expect(symbols).toHaveLength(10);
      expect(symbols.filter((s) => s === 'A')).toHaveLength(left);
      expect(symbols.filter((s) => s === 'B')).toHaveLength(10 - left);
    }
    expect(tenArithmeticRows(model('add-sub'))).toEqual(
      variant === 'main'
        ? { add: [1, 3, 5, 7, 9], subtract: [2, 4, 6, 8, 10] }
        : { add: [9, 7, 5, 3, 1], subtract: [10, 8, 6, 4, 2] },
    );
  }
  expect(
    tenTableRows({
      kind: 'ten-tables',
      display: 'five-chains',
      variant: 'main',
    }),
  ).toEqual([1, 2, 3, 4, 5]);
});
it('preserves fixed table visual snapshots and rejects unknown or embedded-answer fields', () => {
  const model = { kind: 'ten-tables', display: 'nine-rows', variant: 'main' };
  expect(isTenTablesVisual(model)).toBe(true);
  for (const v of [
    null,
    [],
    { ...model, display: ['nine-rows'] },
    { ...model, variant: 'old' },
    { ...model, answers: [9, 8, 7] },
    { ...model, rows: 9 },
    { kind: 'ten-tables', display: 'nine-rows' },
  ])
    expect(isTenTablesVisual(v)).toBe(false);
  const now = '2026-10-02T10:00:00.000Z';
  const s = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  const data = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [s],
  };
  expect(parseBackup(exportBackup(data, now)).data.sessions[0]).toEqual(s);
  const q = s.questions.find((q) => q.visual?.kind === 'ten-tables')!;
  q.visual = { ...model, display: 'unknown' } as unknown as typeof q.visual;
  expect(() => exportBackup(data, now)).toThrow(
    'educationLearning.invalidRecord',
  );
});

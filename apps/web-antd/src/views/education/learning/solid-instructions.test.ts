import { expect, it } from 'vitest';

import { sujiaoUpperSolidInstructionsLesson as lesson } from '../content/sujiao-upper-solid-instructions';
import { exportBackup, parseBackup } from './backup';
import { createSession } from './engine';
import {
  isSolidInstructionsVisual,
  solidInstructionItems,
} from './solid-instructions';

it('keeps seven unique identities across ground and stack, with a shared center, and two full support chains', () => {
  for (const variant of ['main', 'review'] as const) {
    const cross = solidInstructionItems({
      kind: 'solid-instructions',
      arrangement: 'cross',
      variant,
    });
    expect(new Set(cross.map((p) => p.label)).size).toBe(7);
    expect(cross.every((p) => p.shape === 'cube')).toBe(true);
    const ground = cross.filter((p) =>
      ['back', 'center', 'front', 'left', 'right'].includes(p.role),
    );
    const stack = cross.filter((p) =>
      ['center', 'lowerTop', 'upperTop'].includes(p.role),
    );
    expect(ground).toHaveLength(5);
    expect(stack).toHaveLength(3);
    expect(new Set([...ground, ...stack].map((p) => p.label)).size).toBe(7);
    const bridge = solidInstructionItems({
      kind: 'solid-instructions',
      arrangement: 'bridge',
      variant,
    });
    expect(bridge.map((p) => p.shape)).toEqual([
      'cylinder',
      'cylinder',
      'cuboid',
      'cube',
      'cube',
      'sphere',
      'sphere',
    ]);
    expect(new Set(bridge.map((p) => p.label)).size).toBe(7);
  }
});

it('rejects unknown/extra/missing model data and preserves verified diagram snapshots in backups', () => {
  const visual = {
    kind: 'solid-instructions',
    arrangement: 'cross',
    variant: 'main',
  };
  expect(isSolidInstructionsVisual(visual)).toBe(true);
  for (const bad of [
    null,
    [],
    { ...visual, variant: ['main'] },
    { ...visual, arrangement: 'line' },
    { ...visual, answer: 7 },
    { ...visual, depth: 1 },
    { kind: 'solid-instructions', variant: 'main' },
  ])
    expect(isSolidInstructionsVisual(bad)).toBe(false);
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
  const q = s.questions.find((q) => q.visual?.kind === 'solid-instructions')!;
  for (const bad of [
    { ...visual, variant: 'unknown' },
    { ...visual, answer: 7 },
    { ...visual, arrangement: ['cross'] },
  ]) {
    const forged = structuredClone(data);
    const target = forged.sessions[0]!.questions.find((x) => x.id === q.id)!;
    Object.assign(target, { visual: bad });
    expect(() => parseBackup(exportBackup(forged, now))).toThrow(
      'educationLearning.invalidRecord',
    );
  }
});

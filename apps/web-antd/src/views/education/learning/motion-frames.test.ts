import { expect, it } from 'vitest';

import { sujiaoMotionOrderDraft } from '../content/sujiao-motion-order';
import { exportBackup, parseBackup } from './backup';
import { createSession } from './engine';
import { isMotionFramesVisual, motionScene } from './motion-frames';
import { initialLibrary } from './storage';
it('accepts only known frame scenes and variants without chronology or extra answer fields', () => {
  for (const scene of ['approach', 'depart', 'pass'])
    for (const variant of ['main', 'review'])
      expect(
        isMotionFramesVisual({ kind: 'motion-frames', scene, variant }),
      ).toBe(true);
  for (const value of [
    null,
    [],
    { kind: 'motion-frames', scene: 'approach', variant: ['main'] },
    { kind: 'motion-frames', scene: 'other', variant: 'main' },
    { kind: ['motion-frames'], scene: 'pass', variant: 'main' },
    { kind: 'motion-frames', scene: 'pass', variant: 'main', order: 'BCA' },
  ])
    expect(isMotionFramesVisual(value)).toBe(false);
  const s = motionScene({
    kind: 'motion-frames',
    scene: 'pass',
    variant: 'main',
  });
  s.positions[0] = 0;
  expect(
    motionScene({ kind: 'motion-frames', scene: 'pass', variant: 'main' })
      .positions,
  ).toEqual([225, 65, 145]);
});
it('roundtrips fixed frame snapshots and rejects answer-bearing visuals or visuals substituted for rules', () => {
  const data = initialLibrary('三幅图');
  data.sessions.push(
    createSession(
      sujiaoMotionOrderDraft,
      'sujiao-math-p1-lower-9787574312951',
      data.activeProfileId,
    ),
  );
  const backup = JSON.parse(exportBackup(data));
  const q = backup.data.sessions[0].questions.find(
    (x: { visual?: { kind: string } }) => x.visual?.kind === 'motion-frames',
  );
  expect(parseBackup(JSON.stringify(backup)).data.sessions).toEqual(
    data.sessions,
  );
  q.visual.order = 'BAC';
  expect(() => parseBackup(JSON.stringify(backup))).toThrow(Error);
  delete q.visual.order;
  q.visual.scene = ['approach'];
  expect(() => parseBackup(JSON.stringify(backup))).toThrow(Error);
  q.visual.scene = 'approach';
  q.rule = q.visual;
  expect(() => parseBackup(JSON.stringify(backup))).toThrow(Error);
});

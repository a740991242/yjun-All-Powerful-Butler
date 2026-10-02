import { expect, it } from 'vitest';

import { sujiaoOcclusionDraft } from '../content/sujiao-occlusion';
import { exportBackup, parseBackup } from './backup';
import { createSession } from './engine';
import { isOcclusionViewsVisual, occlusionScene } from './occlusion-views';
import { initialLibrary } from './storage';
it('uses only fixed opaque known arrangements, rejecting transparent scenes and answer maps', () => {
  for (const variant of ['main', 'review'])
    expect(isOcclusionViewsVisual({ kind: 'occlusion-views', variant })).toBe(
      true,
    );
  for (const value of [
    null,
    [],
    { kind: ['occlusion-views'], variant: 'main' },
    { kind: 'occlusion-views', variant: ['main'] },
    { kind: 'occlusion-views', variant: 'other' },
    { kind: 'occlusion-views', variant: 'main', transparent: true },
    { kind: 'occlusion-views', variant: 'main', answers: ['2', '4', '3', '1'] },
  ])
    expect(isOcclusionViewsVisual(value)).toBe(false);
  const s = occlusionScene('main');
  expect(s.views).toEqual(['hidden', 'left', 'front', 'right']);
  expect(occlusionScene('review').views).toEqual([
    'front',
    'right',
    'hidden',
    'left',
  ]);
  s.candidates[0] = 'left';
  expect(occlusionScene('main').candidates[0]).toBe('right');
});
it('roundtrips scene snapshots and rejects extra cup visibility answers, invalid variants or diagrams as rules', () => {
  const data = initialLibrary('盒与杯');
  data.sessions.push(
    createSession(
      sujiaoOcclusionDraft,
      'sujiao-math-p1-lower-9787574312951',
      data.activeProfileId,
    ),
  );
  const backup = JSON.parse(exportBackup(data));
  const q = backup.data.sessions[0].questions.find(
    (q: { visual?: { kind: string } }) => q.visual?.kind === 'occlusion-views',
  );
  expect(parseBackup(JSON.stringify(backup)).data.sessions).toEqual(
    data.sessions,
  );
  q.visual.hiddenObserver = 'A';
  expect(() => parseBackup(JSON.stringify(backup))).toThrow(Error);
  delete q.visual.hiddenObserver;
  q.visual.variant = ['main'];
  expect(() => parseBackup(JSON.stringify(backup))).toThrow(Error);
  q.visual.variant = 'main';
  q.rule = q.visual;
  expect(() => parseBackup(JSON.stringify(backup))).toThrow(Error);
});

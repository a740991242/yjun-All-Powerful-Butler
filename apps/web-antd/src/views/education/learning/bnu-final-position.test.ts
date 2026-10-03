import { expect, it } from 'vitest';

import { bnuUpperBook } from '../content/bnu';
import { bnuFinalPositionTimeLesson as lesson } from '../content/bnu-final-position';
import { exportBackup, parseBackup } from './backup';
import {
  bnuFinalAnnexCards,
  bnuFinalClockCards,
  bnuFinalFlower,
  bnuFinalPositionItems,
  isBnuFinalPositionVisual,
} from './bnu-final-position';
import { isClockVisual } from './clock';
import { createSession } from './engine';
import { required } from './required';
import { initialLibrary } from './storage';
it('accepts only fixed scenes and keeps original inventories independent and within the flower canvas', () => {
  for (const scene of [
    'flower-blank',
    'flower-filled',
    'items',
    'clocks',
    'annex',
  ])
    for (const variant of ['main', 'review'])
      expect(
        isBnuFinalPositionVisual({
          kind: 'bnu-final-position',
          scene,
          variant,
        }),
      ).toBe(true);
  const visual = {
    kind: 'bnu-final-position',
    scene: 'items',
    variant: 'main',
  };
  for (const invalid of [
    null,
    [],
    { ...visual, scene: 'unknown' },
    { ...visual, scene: ['items'] },
    { ...visual, variant: 0 },
    { ...visual, answer: ['上面'] },
  ])
    expect(isBnuFinalPositionVisual(invalid)).toBe(false);
  for (const variant of ['main', 'review'] as const) {
    const slots = bnuFinalFlower(variant);
    expect(slots.filter((s) => s.sample)).toHaveLength(1);
    for (const s of slots) {
      expect(s.x - 36).toBeGreaterThanOrEqual(0);
      expect(s.x + 36).toBeLessThanOrEqual(300);
      expect(s.y - 32).toBeGreaterThanOrEqual(0);
      expect(s.y + 32).toBeLessThanOrEqual(300);
    }
    for (const card of bnuFinalClockCards(variant))
      expect(isClockVisual(card.clock)).toBe(true);
  }
  expect(isClockVisual({ kind: 'clock', hour: 3, minute: 15 })).toBe(false);
  required(bnuFinalAnnexCards('main')[0]).color = 'green';
  expect(bnuFinalAnnexCards('main')[0]?.color).toBe('yellow');
  const items = bnuFinalPositionItems('main');
  required(items[0]).row = 2;
  expect(bnuFinalPositionItems('main')[0]?.row).toBe(1);
});
it('preserves original clock and fixed diagrams in old-schema snapshots and rejects injected answers', () => {
  const library = initialLibrary('固定位置图');
  const session = createSession(
    lesson,
    bnuUpperBook.id,
    library.activeProfileId,
  );
  library.sessions.push(session);
  const source = exportBackup(library);
  expect(parseBackup(source).data.sessions[0]).toEqual(
    JSON.parse(JSON.stringify(session)),
  );
  const index = session.questions.findIndex(
    (q) => q.visual?.kind === 'bnu-final-position',
  );
  expect(index).toBeGreaterThanOrEqual(0);
  for (const extra of [
    { scene: 'other' },
    { variant: ['main'] },
    { answer: ['上面'] },
  ]) {
    const bad = JSON.parse(source);
    Object.assign(bad.data.sessions[0].questions[index].visual, extra);
    expect(() => parseBackup(JSON.stringify(bad))).toThrow(
      'educationLearning.invalidBackup',
    );
  }
});

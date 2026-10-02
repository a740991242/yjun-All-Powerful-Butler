import { expect, it } from 'vitest';

import {
  initialCardGame,
  isCardGameVisual,
  replayCardGame,
} from '../learning/card-game';
import { sujiaoTakeTenLesson as lesson } from './sujiao-take-ten';
it('teaches both source-verified modes and keeps gameplay separate from objective mastery', () => {
  expect(lesson.page).toBe(75);
  expect(lesson.review.notes).toContain('75～77');
  expect(lesson.questions.filter((q) => q.rule.kind !== 'manual')).toHaveLength(
    7,
  );
  expect(lesson.reviewQuestions).toHaveLength(7);
  const games = lesson.questions.filter((q) => q.visual?.kind === 'card-game');
  expect(
    games.map((q) => q.visual?.kind === 'card-game' && q.visual.mode),
  ).toEqual(['pair', 'multi']);
  for (const task of games) {
    expect(task.rule.kind).toBe('manual');
    expect(isCardGameVisual(task.visual)).toBe(true);
    if (task.visual?.kind === 'card-game')
      expect(replayCardGame(task.visual, initialCardGame())?.scores).toEqual([
        0, 0,
      ]);
  }
  expect(lesson.steps.some((step) => step.visual?.kind === 'card-game')).toBe(
    false,
  );
  expect(lesson.parentTip).toContain('不强制速度');
});

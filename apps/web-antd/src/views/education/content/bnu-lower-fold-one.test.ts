import { expect, it } from 'vitest';

import { bnuFoldScenes, isBnuFoldOneVisual } from '../learning/bnu-fold-one';
import { evaluate } from '../learning/engine';
import {
  foldOutline,
  foldShape,
  isPaperFoldVisual,
} from '../learning/paper-fold';
import { bnuLowerFoldOneLesson as lesson } from './bnu-lower-fold-one';
import { bnuLowerFoldOneSource as source } from './bnu-lower-fold-one-source';
import { bnuLowerUnitSixAudit as audit } from './bnu-lower-unit-six-audit';

it('covers all source activity types and independent physical confirmations', () => {
  expect(lesson.status).toBe('available');
  expect(lesson.steps).toHaveLength(16);
  expect(lesson.questions).toHaveLength(39);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    18,
  );
  expect(
    lesson.questions.filter((q) => q.rule.kind === 'reflection'),
  ).toHaveLength(3);
  expect(lesson.reviewQuestions).toHaveLength(6);
  const keys = new Set(
    [...lesson.questions, ...lesson.reviewQuestions!].map((q) => q.id),
  );
  expect(keys.size).toBe(45);
  const scenes = lesson.steps.flatMap((s) =>
    s.visual?.kind === 'bnu-fold-one' ? [s.visual.scene] : [],
  );
  expect(scenes.toSorted()).toEqual([...bnuFoldScenes].toSorted());
  for (const step of lesson.steps) {
    expect(step.activity?.length).toBeGreaterThan(10);
    if (step.visual?.kind === 'bnu-fold-one')
      expect(isBnuFoldOneVisual(step.visual)).toBe(true);
    if (step.visual?.kind === 'paper-fold') {
      expect(isPaperFoldVisual(step.visual)).toBe(true);
      expect(foldShape(step.visual)).toBe('square');
      expect(foldOutline(step.visual)).toEqual([
        [0, 0],
        [2, 0],
        [2, 2],
        [0, 2],
      ]);
    }
  }
  const prose = lesson.steps.map((s) => s.text).join(' ');
  expect(prose).toContain('非正方形');
  expect(prose).toContain('第三张照片');
  expect(prose).toContain('下排右到左');
  expect(prose).toContain('其他比例');
  expect(prose).toContain('不表示只有两种答案');
  for (const q of [...lesson.questions, ...lesson.reviewQuestions!])
    if (q.rule.kind === 'choice')
      expect(
        q.choices?.filter(
          (c) => c.id === (q.rule.kind === 'choice' ? q.rule.value : undefined),
        ),
      ).toHaveLength(1);
});

it('maps all seven read-page activities to the correct steps and task kinds without closing remaining unit pages', () => {
  const activities = audit.activities.filter((a) => a.lesson === lesson.id);
  expect(activities.map((a) => [a.page, a.sourceActivity])).toEqual(
    source.activities.map((a) => [a.page, a.key]),
  );
  const kinds = new Map(
    lesson.questions.map((q) => [
      q.id.slice(lesson.id.length + 1),
      q.rule.kind,
    ]),
  );
  for (const a of activities) {
    for (const step of a.steps) expect(lesson.steps[step - 1]).toBeDefined();
    for (const key of a.objective)
      expect(['choice', 'number']).toContain(kinds.get(key));
    for (const key of a.manual) expect(kinds.get(key)).toBe('manual');
    for (const key of a.records) expect(kinds.get(key)).toBe('reflection');
  }
  expect(new Set(activities.flatMap((a) => a.manual)).size).toBe(18);
  expect(audit.pendingPrintedPages).toEqual([]);
  expect(audit.status).toBe('original-teaching-mapped');
  for (const q of lesson.questions.filter(
    (q) => q.rule.kind === 'manual' || q.rule.kind === 'reflection',
  ))
    expect(evaluate(q.rule, 'confirmed')).toBeNull();
});

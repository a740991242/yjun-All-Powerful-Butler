import { expect, it } from 'vitest';

import { circularNumberCells } from '../learning/circular-number-array';
import { sujiaoCircularNumbersDraft as draft } from './sujiao-circular-numbers';
import { sujiaoLowerLessons } from './sujiao-lower';
it('covers the circular layout with changed-start review and separate actual tasks', () => {
  expect(draft.page).toBe(47);
  expect(sujiaoLowerLessons.find((l) => l.id === draft.id)?.status).toBe(
    'available',
  );
  expect(draft.questions).toHaveLength(21);
  expect(draft.reviewQuestions).toHaveLength(16);
  expect(draft.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    3,
  );
  expect(
    draft.questions.filter((q) => q.rule.kind === 'reflection'),
  ).toHaveLength(2);
  for (const q of draft.questions.filter(
    (q) => q.rule.kind === 'number' || q.rule.kind === 'choice',
  )) {
    const r = draft.reviewQuestions?.find((r) => r.knowledge === q.knowledge);
    expect(r).toBeDefined();
    expect(q.visual?.kind).toBe('circular-number-array');
    if (
      q.visual?.kind !== 'circular-number-array' ||
      r?.visual?.kind !== 'circular-number-array'
    )
      throw new Error('missing scene');
    expect(q.visual.start).toBe(20);
    expect(r.visual.start).toBe(40);
    if (
      q.knowledge.includes('-blank-') &&
      q.rule.kind === 'number' &&
      r.rule.kind === 'number'
    ) {
      const main = circularNumberCells(q.visual).find(
        (c) => c.letter === q.knowledge.at(-1),
      );
      expect(q.rule.value).toBe(main?.value);
      expect(r.rule.value).toBe(q.rule.value + 20);
    }
  }
  expect(
    draft.questions.find((q) => q.knowledge.endsWith('-wrap'))?.rule,
  ).toEqual({ kind: 'number', value: 30 });
  expect(
    draft.reviewQuestions?.find((q) => q.knowledge.endsWith('-wrap'))?.rule,
  ).toEqual({ kind: 'number', value: 50 });
  expect(draft.parentTip).toContain('原图不同');
});

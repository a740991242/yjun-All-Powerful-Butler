import { expect, it } from 'vitest';

import { sujiaoLowerLessons } from './sujiao-lower';
import { sujiaoViewpointJugDraft as draft } from './sujiao-viewpoint-jug';
it('releases the verified original jug activity without replacing other observation courses', () => {
  expect(draft.page).toBe(79);
  const published = sujiaoLowerLessons.find((lesson) => lesson.id === draft.id);
  expect(published?.status).toBe('available');
  expect(
    sujiaoLowerLessons.some(
      (lesson) => lesson.id === 'sj-lower-viewpoint-house',
    ),
  ).toBe(true);
  expect(draft.questions).toHaveLength(18);
  expect(draft.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    4,
  );
  expect(
    draft.questions.filter((q) => q.rule.kind === 'reflection'),
  ).toHaveLength(2);
  expect(draft.reviewQuestions).toHaveLength(12);
  for (const q of draft.questions.filter((q) =>
    ['choice', 'number'].includes(q.rule.kind),
  )) {
    const review = draft.reviewQuestions?.find(
      (r) => r.knowledge === q.knowledge,
    );
    expect(review).toBeDefined();
    expect(q.visual).toEqual({ kind: 'viewpoint-jug', variant: 'main' });
    expect(review?.visual).toEqual({
      kind: 'viewpoint-jug',
      variant: 'review',
    });
  }
  const main = draft.questions.find((q) => q.knowledge.endsWith('observer-A'));
  const review = draft.reviewQuestions?.find((q) =>
    q.knowledge.endsWith('observer-A'),
  );
  expect(main?.rule).toEqual({ kind: 'choice', value: '4' });
  expect(review?.rule).toEqual({ kind: 'choice', value: '3' });
  expect(draft.parentTip).toContain('不透明');
  expect(draft.parentTip).toContain('79');
});

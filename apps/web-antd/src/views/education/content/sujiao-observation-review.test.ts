import { expect, it } from 'vitest';

import { sujiaoLowerBook, sujiaoLowerLessons } from './sujiao-lower';
import { sujiaoObservationAudit as audit } from './sujiao-observation-audit';
import { sujiaoObservationReviewDraft as draft } from './sujiao-observation-review';
it('maps each inspected observation page to actual implemented knowledge and activities', () => {
  expect(audit.pages.map((p) => p.page)).toEqual([78, 79, 80, 81, 82, 83, 84]);
  expect(audit.finalTeacherReview).toBe('not-verified');
  for (const page of audit.pages)
    for (const evidence of page.evidence) {
      const lesson = sujiaoLowerLessons.find((l) => l.id === evidence.lesson);
      expect(lesson?.status).toBe('available');
      const q = lesson?.questions.find(
        (q) => q.knowledge === evidence.knowledge,
      );
      expect(q).toBeDefined();
      if (evidence.knowledge.includes('-manual-'))
        expect(q?.rule.kind).toBe('manual');
      if (evidence.knowledge.includes('-evaluation-'))
        expect(q?.rule.kind).toBe('reflection');
    }
  const unit = sujiaoLowerBook.units.find((u) => u.id === 'u7');
  expect(unit?.lessons).toHaveLength(6);
  expect(unit?.lessons.every((l) => l.status === 'available')).toBe(true);
  expect(
    sujiaoLowerBook.units.some((u) =>
      u.lessons.some((l) => l.status === 'preparing'),
    ),
  ).toBe(false);
});
it('keeps real room, bag, numbered views and future drawing separate from three ungraded evaluations', () => {
  expect(draft.questions).toHaveLength(17);
  expect(draft.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    6,
  );
  const evaluations = draft.questions.filter(
    (q) => q.rule.kind === 'reflection',
  );
  expect(evaluations.map((q) => q.knowledge)).toEqual(
    ['viewpoints', 'sequence', 'careful'].map(
      (k) => `sj-lower-observation-review-evaluation-${k}`,
    ),
  );
  expect(draft.reviewQuestions).toHaveLength(8);
  for (const q of draft.questions.filter((q) => q.rule.kind === 'choice'))
    expect(
      draft.reviewQuestions?.some((r) => r.knowledge === q.knowledge),
    ).toBe(true);
  expect(
    draft.questions.find((q) => q.knowledge.endsWith('-jug-side'))?.rule,
  ).toEqual({ kind: 'choice', value: 'right' });
  expect(
    draft.reviewQuestions?.find((q) => q.knowledge.endsWith('-jug-side'))?.rule,
  ).toEqual({ kind: 'choice', value: 'left' });
  expect(
    draft.questions.find((q) => q.knowledge.endsWith('-manual-future'))?.prompt,
  ).toContain('允许不同合理距离');
  expect(draft.parentTip).toContain('自评不作能力分数');
});

import { expect, it } from 'vitest';

import { sujiaoCalculationUnitAudit as audit } from './sujiao-calculation-unit-audit';
import { sujiaoLowerBook, sujiaoLowerLessons } from './sujiao-lower';

it('checks every inspected page against available tasks and checks the implemented original unit', () => {
  expect(audit.pages.map((page) => page.page)).toEqual([
    57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
  ]);
  expect(audit.status).toBe('original-teaching-implemented');
  expect(audit.finalTeacherReview).toBe('not-verified');
  for (const page of audit.pages)
    for (const [id, keys] of page.evidence) {
      const lesson = sujiaoLowerLessons.find((lesson) => lesson.id === id)!;
      expect(lesson?.status, `${page.page}/${id}`).toBe('available');
      for (const key of keys) {
        const question = lesson.questions.find(
          (q) => q.knowledge === `${id}-${key}`,
        )!;
        expect(question, `${page.page}/${id}/${key}`).toBeDefined();
        if (key.startsWith('manual-'))
          expect(question.rule.kind).toBe('manual');
        if (key === 'own-question' || key.startsWith('evaluation-'))
          expect(question.rule.kind).toBe('reflection');
      }
    }
  expect(audit.gaps).toEqual([]);
  const review = sujiaoLowerLessons.find(
    (lesson) => lesson.id === 'sj-lower-calculation-review',
  )!;
  for (const gap of audit.resolvedGaps)
    for (const key of gap.evidence)
      expect(
        review.questions.some((q) => q.knowledge === `${review.id}-${key}`),
      ).toBe(true);
  expect(audit.resolvedGaps.map((gap) => gap.id)).toEqual([
    'estimate-tens',
    'compare-without-calculating',
    'own-question-activity',
    'independent-evaluations',
    'subtract-two-digit-exploration',
  ]);
  expect(
    sujiaoLowerBook.units
      .find((unit) => unit.id === 'u5')
      ?.lessons.some((lesson) => lesson.status === 'preparing'),
  ).toBe(false);
});

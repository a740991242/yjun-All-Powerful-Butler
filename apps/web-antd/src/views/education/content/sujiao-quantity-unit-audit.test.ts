import { expect, it } from 'vitest';

import { sujiaoLowerBook, sujiaoLowerLessons } from './sujiao-lower';
import { sujiaoQuantityUnitAudit as audit } from './sujiao-quantity-unit-audit';

it('maps all seven inspected pages to exact available knowledge and actual tasks', () => {
  expect(audit.pages.map((page) => page.page)).toEqual([
    71, 72, 73, 74, 75, 76, 77,
  ]);
  expect(audit.finalTeacherReview).toBe('not-verified');
  for (const page of audit.pages)
    for (const [id, keys] of page.evidence) {
      const lesson = sujiaoLowerLessons.find((lesson) => lesson.id === id)!;
      expect(lesson.status).toBe('available');
      for (const key of keys) {
        const question = lesson.questions.find(
          (q) => q.knowledge === `${id}-${key}`,
        )!;
        expect(question, `${page.page}/${id}/${key}`).toBeDefined();
        if (key.startsWith('manual-'))
          expect(question.rule.kind).toBe('manual');
        if (key.startsWith('evaluation-'))
          expect(question.rule.kind).toBe('reflection');
      }
    }
  expect(
    sujiaoLowerBook.units
      .find((u) => u.id === 'u6')
      ?.lessons.some((l) => l.status === 'preparing'),
  ).toBe(false);
  expect(
    sujiaoLowerBook.units
      .find((u) => u.id === 'u5')
      ?.lessons.some((l) => l.status === 'preparing'),
  ).toBe(false);
});

import { expect, it } from 'vitest';

import { sujiaoJoiningUnitAudit as audit } from './sujiao-joining-unit-audit';
import { sujiaoLowerBook, sujiaoLowerLessons } from './sujiao-lower';

it('maps all four inspected practice pages to specific available tasks without claiming final teacher review', () => {
  expect(audit.pages.map((p) => p.page)).toEqual([32, 33, 34, 35]);
  expect(audit.finalTeacherReview).toBe('not-verified');
  expect(audit.gaps).toEqual([]);
  for (const page of audit.pages)
    for (const [id, keys] of page.evidence) {
      const lesson = sujiaoLowerLessons.find((l) => l.id === id)!;
      expect(lesson?.status, `${page.page}/${id}`).toBe('available');
      for (const key of keys) {
        const question = lesson.questions.find(
          (q) => q.knowledge === `${id}-${key}`,
        )!;
        expect(question, `${page.page}/${id}/${key}`).toBeDefined();
        if (key.startsWith('manual-'))
          expect(question.rule.kind).toBe('manual');
        if (key.startsWith('reflection') || key === 'art-story')
          expect(question.rule.kind).toBe('reflection');
      }
    }
  expect(
    sujiaoLowerBook.units
      .find((u) => u.id === audit.unit)
      ?.lessons.some((l) => l.status === 'preparing'),
  ).toBe(false);
  expect(
    sujiaoLowerBook.units
      .find((u) => u.id === 'review')
      ?.lessons.some((l) => l.status === 'preparing'),
  ).toBe(false);
  expect(
    sujiaoLowerBook.units
      .find((u) => u.id === 'u1')
      ?.lessons.some((l) => l.status === 'preparing'),
  ).toBe(false);
});

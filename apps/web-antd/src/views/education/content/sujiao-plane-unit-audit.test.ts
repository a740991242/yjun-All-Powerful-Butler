import { expect, it } from 'vitest';

import { sujiaoLowerBook, sujiaoLowerLessons } from './sujiao-lower';
import { sujiaoPlaneUnitAudit as audit } from './sujiao-plane-unit-audit';

it('maps every inspected page to available specific tasks while keeping other unfinished units', () => {
  expect(audit.pages.map((p) => p.page)).toEqual([
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ]);
  expect(audit.finalTeacherReview).toBe('not-verified');
  for (const page of audit.pages)
    for (const [id, keys] of page.evidence) {
      const lesson = sujiaoLowerLessons.find((l) => l.id === id)!;
      expect(lesson?.status, `${page.page}/${id}`).toBe('available');
      for (const key of keys) {
        const q = lesson.questions.find(
          (item) => item.knowledge === `${id}-${key}`,
        )!;
        expect(q, `${page.page}/${id}/${key}`).toBeDefined();
        if (key.startsWith('manual-')) expect(q.rule.kind).toBe('manual');
        if (key.startsWith('evaluation-'))
          expect(q.rule.kind).toBe('reflection');
      }
    }
  expect(
    sujiaoLowerBook.units
      .find((u) => u.id === 'u2')
      ?.lessons.some((l) => l.status === 'preparing'),
  ).toBe(false);
  expect(
    sujiaoLowerBook.units
      .find((u) => u.id === 'review')
      ?.lessons.some((l) => l.status === 'preparing'),
  ).toBe(false);
});

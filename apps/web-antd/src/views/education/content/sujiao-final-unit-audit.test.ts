import { expect, it } from 'vitest';

import { sujiaoFinalUnitAudit as audit } from './sujiao-final-unit-audit';
import { sujiaoLowerBook, sujiaoLowerLessons } from './sujiao-lower';

it('maps every inspected final activity to released tasks without claiming final teacher review', () => {
  expect(audit.pages.map((p) => p.page)).toEqual([88, 89, 90, 91, 92, 93, 94]);
  expect(audit.status).toBe('original-teaching-implemented');
  expect(audit.finalTeacherReview).toBe('not-verified');
  expect(audit.gaps).toHaveLength(0);
  expect(audit.resolvedGaps).toHaveLength(7);
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
      .find((u) => u.id === audit.unit)
      ?.lessons.some((l) => l.status === 'preparing'),
  ).toBe(false);
  expect(
    sujiaoLowerBook.units
      .find((u) => u.id === 'u1')
      ?.lessons.some((l) => l.status === 'preparing'),
  ).toBe(false);
  expect(
    sujiaoLowerBook.units
      .find((u) => u.id === 'shape-joining')
      ?.lessons.some((l) => l.status === 'preparing'),
  ).toBe(false);
});

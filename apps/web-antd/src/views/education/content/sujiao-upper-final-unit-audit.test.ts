import { expect, it } from 'vitest';

import { sujiaoBooks } from './sujiao';
import { sujiaoUpperFinalUnitAudit as audit } from './sujiao-upper-final-unit-audit';
it('maps actually viewed final pages to exact tasks without treating partial examples as complete', () => {
  expect(audit.pages.map((p) => p.page)).toEqual([88, 89, 90, 91, 92, 93, 94]);
  expect(audit.status).toBe('original-teaching-implemented');
  expect(audit.finalTeacherReview).toBe('not-verified');
  const unit = sujiaoBooks[0]!.units.find((u) => u.id === 'review')!;
  expect(unit.lessons.some((l) => l.status === 'preparing')).toBe(false);
  for (const page of audit.pages)
    for (const [id, keys] of page.evidence) {
      const lesson = unit.lessons.find((l) => l.id === id);
      expect(lesson?.status, `${page.page}/${id}`).toBe('available');
      for (const key of keys)
        expect(
          lesson!.questions.some((q) => q.knowledge === key),
          `${page.page}/${key}`,
        ).toBe(true);
    }
  for (const gap of audit.resolvedGaps)
    for (const key of gap.evidence)
      expect(
        unit.lessons
          .flatMap((l) => l.questions)
          .find((q) => q.knowledge === key)?.rule.kind,
        key,
      ).toBe('manual');
  expect(audit.gaps).toHaveLength(0);
});

import { expect, it } from 'vitest';

import { sujiaoBooks } from './sujiao';
import { sujiaoUpperFourthUnitAudit as audit } from './sujiao-upper-fourth-unit-audit';
it('maps thirteen viewed pages to exact available knowledge and preserves concrete unfinished teaching', () => {
  expect(audit.pages.map((p) => p.page)).toEqual(
    Array.from({ length: 13 }, (_, i) => i + 62),
  );
  expect(audit.status).toBe('original-teaching-implemented');
  expect(audit.finalTeacherReview).toBe('not-verified');
  expect(audit.resolvedGaps).toHaveLength(6);
  expect(audit.gaps).toHaveLength(0);
  const unit = sujiaoBooks[0]!.units.find((u) => u.id === 'u4')!;
  expect(unit.lessons.some((l) => l.status === 'preparing')).toBe(false);
  for (const page of audit.pages)
    for (const [id, keys] of page.evidence) {
      const lesson = unit.lessons.find((l) => l.id === id);
      expect(lesson?.status, `${page.page}/${id}`).toBe('available');
      for (const key of keys)
        expect(
          lesson!.questions.some((q) => q.knowledge === key),
          `${page.page}/${id}/${key}`,
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
});

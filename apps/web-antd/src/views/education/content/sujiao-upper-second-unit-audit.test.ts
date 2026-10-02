import { expect, it } from 'vitest';

import { sujiaoBooks } from './sujiao';
import { sujiaoUpperSecondUnitAudit as audit } from './sujiao-upper-second-unit-audit';

it('maps all 18 printed pages to actual tasks with independent actual evidence and reflection for all eight activity groups', () => {
  expect(audit.pages.map((p) => p.page)).toEqual(
    Array.from({ length: 18 }, (_, i) => i + 35),
  );
  expect(audit.status).toBe('original-teaching-implemented');
  expect(audit.finalTeacherReview).toBe('not-verified');
  expect(audit.gaps).toHaveLength(0);
  expect(audit.resolvedGaps).toHaveLength(8);
  const unit = sujiaoBooks[0]!.units.find((u) => u.id === 'u2')!;
  expect(unit.lessons.some((l) => l.status === 'preparing')).toBe(false);
  for (const gap of audit.resolvedGaps)
    for (const key of gap.evidence) {
      const q = unit.lessons
        .flatMap((l) => l.questions)
        .find((q) => q.knowledge === key);
      expect(q, key).toBeDefined();
      if (key.includes('-actual-')) expect(q!.rule.kind).toBe('manual');
    }
  for (const page of audit.pages)
    for (const [id, keys] of page.evidence) {
      const lesson = unit.lessons.find((l) => l.id === id)!;
      expect(lesson?.status, id).toBe('available');
      for (const key of keys)
        expect(
          lesson.questions.some((q) => q.knowledge === `${id}-${key}`),
          `${page.page}/${id}/${key}`,
        ).toBe(true);
    }
  for (const gap of audit.resolvedGaps)
    for (const page of gap.pages)
      expect(audit.pages.some((p) => p.page === page)).toBe(true);
});

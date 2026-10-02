import { expect, it } from 'vitest';

import { sujiaoBooks } from './sujiao';
import { sujiaoUpperFifthUnitAudit as audit } from './sujiao-upper-fifth-unit-audit';
it('maps ten actually viewed same-edition pages to current lessons without counting generic activities as complete coverage', () => {
  expect(audit.pages.map((p) => p.page)).toEqual(
    Array.from({ length: 10 }, (_, i) => 78 + i),
  );
  expect(audit.isbn).toBe('978-7-5743-1099-5');
  expect(audit.status).toBe('original-teaching-implemented');
  expect(audit.finalTeacherReview).toBe('not-verified');
  expect(audit.resolvedGaps).toHaveLength(6);
  expect(audit.gaps).toHaveLength(0);
  const unit = sujiaoBooks[0]!.units.find((u) => u.id === 'u5')!;
  expect(unit.lessons.every((l) => l.status === 'available')).toBe(true);
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
  expect(audit.scope).toContain('不是20或进位加法');
  expect(audit.pages.find((p) => p.page === 86)!.boundary).toContain(
    '另有完整三十条整月逐条对应',
  );
  expect(audit.gaps).toEqual([]);
});

import { expect, it } from 'vitest';

import { sujiaoBooks } from './sujiao';
import { sujiaoUpperFirstUnitAudit as audit } from './sujiao-upper-first-unit-audit';

it('maps all 21 pages to released actual tasks while keeping final teacher review separate', () => {
  expect(audit.pages.map((p) => p.page)).toEqual(
    Array.from({ length: 21 }, (_, i) => i + 11),
  );
  expect(audit.status).toBe('original-teaching-implemented');
  expect(audit.finalTeacherReview).toBe('not-verified');
  expect(audit.gaps).toHaveLength(0);
  const upper = sujiaoBooks.find((b) => b.volume === 'upper')!;
  const unit = upper.units.find((u) => u.id === 'u1')!;
  expect(unit.lessons.some((l) => l.status === 'preparing')).toBe(false);
  expect(audit.resolvedGaps).toHaveLength(6);
  for (const page of [...audit.pages, ...audit.resolvedGaps])
    for (const [id, keys] of page.evidence) {
      const lesson = unit.lessons.find((l) => l.id === id)!;
      expect(lesson?.status, id).toBe('available');
      for (const key of keys) {
        const task = lesson.questions.find(
          (q) => q.knowledge === `${id}-${key}`,
        )!;
        if (key.startsWith('actual-')) expect(task.rule.kind).toBe('manual');
        if (key.startsWith('evaluation-'))
          expect(task.rule.kind).toBe('reflection');
        expect(
          lesson.questions.some((q) => q.knowledge === `${id}-${key}`),
          `${'page' in page ? page.page : page.id}/${id}/${key}`,
        ).toBe(true);
      }
    }
  for (const resolved of audit.resolvedGaps)
    for (const page of resolved.pages)
      expect(audit.pages.some((p) => p.page === page)).toBe(true);
});

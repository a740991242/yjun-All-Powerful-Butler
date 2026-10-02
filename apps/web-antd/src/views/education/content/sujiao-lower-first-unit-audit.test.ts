import { expect, it } from 'vitest';

import { sujiaoLowerBook, sujiaoLowerLessons } from './sujiao-lower';
import { sujiaoLowerFirstUnitAudit as audit } from './sujiao-lower-first-unit-audit';

it('maps printed first-unit activities to actual released tasks and keeps final review separate', () => {
  expect(audit.pages.map((p) => p.page)).toEqual(
    Array.from({ length: 21 }, (_, i) => i + 1),
  );
  expect(audit.status).toBe('original-teaching-implemented');
  expect(audit.finalTeacherReview).toBe('not-verified');
  expect(audit.pages[0].evidence).toHaveLength(0);
  expect(audit.gaps).toHaveLength(0);
  expect(audit.resolvedGaps).toHaveLength(6);
  for (const page of [...audit.pages, ...audit.resolvedGaps])
    for (const [id, keys] of page.evidence) {
      const lesson = sujiaoLowerLessons.find((l) => l.id === id)!;
      expect(lesson?.status, id).toBe('available');
      for (const key of keys) {
        const q = lesson.questions.find((q) => q.knowledge === `${id}-${key}`)!;
        expect(q, `${id}/${key}`).toBeDefined();
        if (
          key.startsWith('manual-') ||
          key.startsWith('physical-') ||
          key.startsWith('own-') ||
          key === 'strategy-expression' ||
          key === 'quantity-conservation'
        )
          expect(q.rule.kind).toBe('manual');
        if (key.startsWith('evaluation-') || key.startsWith('reflection-'))
          expect(q.rule.kind).toBe('reflection');
      }
    }
  expect(
    sujiaoLowerBook.units
      .flatMap((u) => u.lessons)
      .some((l) => l.status === 'preparing'),
  ).toBe(false);
  expect(sujiaoLowerBook.units[0]!.lessons.map((l) => l.id)).toContain(
    'sj-lower-first-practice',
  );
  expect(sujiaoLowerBook.units[0]!.lessons.map((l) => l.id)).toContain(
    'sj-lower-first-review',
  );
});

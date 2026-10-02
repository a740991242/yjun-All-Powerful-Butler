import { expect, it } from 'vitest';

import { sujiaoLowerBook, sujiaoLowerLessons } from './sujiao-lower';
import { sujiaoNumberUnitAudit as audit } from './sujiao-number-unit-audit';
it('maps all eleven inspected pages to actual available tasks including explicit linked three-number selection and comparison', () => {
  expect(audit.pages.map((p) => p.page)).toEqual(
    Array.from({ length: 11 }, (_, i) => 42 + i),
  );
  expect(audit.status).toBe('original-teaching-implemented');
  expect(audit.finalTeacherReview).toBe('not-verified');
  expect(audit.gaps).toHaveLength(0);
  for (const page of audit.pages)
    for (const evidence of page.evidence) {
      const lesson = sujiaoLowerLessons.find((l) => l.id === evidence.lesson);
      expect(lesson?.status).toBe('available');
      const question = lesson?.questions.find(
        (q) => q.knowledge === evidence.knowledge,
      );
      expect(question, evidence.knowledge).toBeDefined();
      if (evidence.knowledge.includes('-manual-'))
        expect(question?.rule.kind).toBe('manual');
    }
  expect(
    sujiaoLowerBook.units
      .find((u) => u.id === 'u4')
      ?.lessons.some((l) => l.status === 'preparing'),
  ).toBe(false);
});
it('keeps actual counting separate from three open evaluations', () => {
  const lesson = sujiaoLowerLessons.find(
    (l) => l.id === 'sj-lower-number-unit-review',
  )!;
  expect(
    lesson.questions
      .filter((q) => q.rule.kind === 'reflection')
      .map((q) => q.knowledge),
  ).toEqual(
    ['composition', 'comparison', 'reasoning'].map(
      (k) => `${lesson.id}-evaluation-${k}`,
    ),
  );
  const classroom = lesson.questions.find(
    (q) => q.knowledge === `${lesson.id}-manual-classroom`,
  )!;
  expect(classroom.rule.kind).toBe('manual');
  expect(classroom.prompt).toContain('分别数桌子和椅子');
  expect(classroom.prompt).toContain('无条件保留待做');
});

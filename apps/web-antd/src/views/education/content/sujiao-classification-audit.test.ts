import { expect, it } from 'vitest';

import { sujiaoClassificationAudit as audit } from './sujiao-classification-audit';
import { sujiaoLowerBook, sujiaoLowerLessons } from './sujiao-lower';
import { blankSurveyTable } from './sujiao-surveys';
it('maps six inspected classification pages to available objective, actual and ungraded tasks', () => {
  expect(audit.pages.map((p) => p.page)).toEqual([36, 37, 38, 39, 40, 41]);
  expect(audit.finalTeacherReview).toBe('not-verified');
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
  const unit = sujiaoLowerBook.units.find((u) => u.id === 'u3');
  expect(unit?.lessons).toHaveLength(9);
  expect(unit?.lessons.every((l) => l.status === 'available')).toBe(true);
  expect(unit?.lessons.at(-1)?.id).toBe('sj-lower-classification-review');
  expect(
    sujiaoLowerBook.units
      .find((u) => u.id === 'u1')
      ?.lessons.some((l) => l.status === 'preparing'),
  ).toBe(false);
});
it('keeps real coloring, survey and library work separate from two open evaluations and unknown counts', () => {
  const lesson = sujiaoLowerLessons.find(
    (l) => l.id === 'sj-lower-classification-review',
  )!;
  const manual = lesson.questions.filter((q) => q.rule.kind === 'manual');
  expect(manual).toHaveLength(6);
  expect(manual[0]?.prompt).toContain('涂');
  expect(manual[3]?.prompt).toContain('真实两类调查');
  expect(manual[4]?.prompt).toContain('管理员');
  expect(
    lesson.questions
      .filter((q) => q.rule.kind === 'reflection')
      .map((q) => q.knowledge),
  ).toEqual(['classification', 'expression'].map((k) => `${lesson.id}-${k}`));
  expect(
    blankSurveyTable().rows.every((r) => r.count === null && r.marks === null),
  ).toBe(true);
});

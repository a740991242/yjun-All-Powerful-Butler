import { expect, it } from 'vitest';

import { sujiaoLowerBook, sujiaoLowerLessons } from './sujiao-lower';
import { sujiaoMathComicAudit as audit } from './sujiao-math-comic-audit';

it('maps the three inspected pages to actual story, drawing, exhibition and reflection tasks', () => {
  expect(audit.pages.map((page) => page.page)).toEqual([85, 86, 87]);
  expect(audit.finalTeacherReview).toBe('not-verified');
  const lesson = sujiaoLowerLessons.find(
    (item) => item.id === 'sj-lower-math-comic',
  )!;
  expect(lesson.status).toBe('available');
  expect(lesson.version).toBe(2);
  for (const page of audit.pages)
    for (const key of page.evidence) {
      const question = lesson.questions.find(
        (item) => item.knowledge === `${lesson.id}-${key}`,
      )!;
      expect(question, key).toBeDefined();
      if (key.startsWith('manual-')) expect(question.rule.kind).toBe('manual');
      if (key.startsWith('reflection-'))
        expect(question.rule.kind).toBe('reflection');
    }
  expect(
    sujiaoLowerBook.units
      .find((unit) => unit.id === 'math-comic')
      ?.lessons.map((lesson) => lesson.id),
  ).toEqual(['sj-lower-math-comic']);
  expect(
    sujiaoLowerBook.units
      .find((unit) => unit.id === 'review')
      ?.lessons.some((lesson) => lesson.status === 'preparing'),
  ).toBe(false);
});

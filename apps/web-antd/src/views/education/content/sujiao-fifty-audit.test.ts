import { expect, it } from 'vitest';

import { sujiaoFiftyAudit as audit } from './sujiao-fifty-audit';
import { sujiaoLowerBook, sujiaoLowerLessons } from './sujiao-lower';
it('maps four inspected practice pages to actual version-two tasks and removes only this completed placeholder', () => {
  expect(audit.pages.map((p) => p.page)).toEqual([53, 54, 55, 56]);
  expect(audit.finalTeacherReview).toBe('not-verified');
  const lesson = sujiaoLowerLessons.find((l) => l.id === 'sj-lower-fifty')!;
  expect(lesson.status).toBe('available');
  expect(lesson.version).toBe(2);
  for (const page of audit.pages)
    for (const key of page.evidence) {
      const q = lesson.questions.find(
        (q) => q.knowledge === `${lesson.id}-${key}`,
      );
      expect(q, key).toBeDefined();
      if (key.startsWith('manual-')) expect(q!.rule.kind).toBe('manual');
      if (key.startsWith('reflection-'))
        expect(q!.rule.kind).toBe('reflection');
    }
  expect(
    sujiaoLowerBook.units
      .find((u) => u.id === 'fifty')
      ?.lessons.map((l) => l.id),
  ).toEqual(['sj-lower-fifty']);
  expect(
    sujiaoLowerBook.units
      .find((u) => u.id === 'u5')
      ?.lessons.some((l) => l.status === 'preparing'),
  ).toBe(true);
});

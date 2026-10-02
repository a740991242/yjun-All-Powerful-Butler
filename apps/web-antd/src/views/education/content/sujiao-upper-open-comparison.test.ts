import { expect, it } from 'vitest';

import { evaluate } from '../learning/engine';
import { sujiaoBooks } from './sujiao';
import { sujiaoUpperOpenComparisonLesson as lesson } from './sujiao-upper-open-comparison';

it('registers full-range open chains with changed review bounds and independent actual drawings', () => {
  expect(sujiaoBooks[0]!.units.find((u) => u.id === 'u2')!.lessons).toContain(
    lesson,
  );
  expect(lesson.questions).toHaveLength(10);
  expect(lesson.reviewQuestions).toHaveLength(7);
  const question = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find(
      (q) => q.knowledge === `${lesson.id}-${key}`,
    )!;
  expect(evaluate(question('greater-than').rule, [6])).toBe(true);
  expect(evaluate(question('greater-than', true).rule, [6])).toBe(false);
  expect(evaluate(question('descending-pair').rule, [7, 6])).toBe(true);
  expect(evaluate(question('descending-pair', true).rule, [7, 6])).toBe(false);
  expect(evaluate(question('descending-pair', true).rule, [5, 0])).toBe(true);
  expect(evaluate(question('two-groups-around').rule, [6, 8])).toBe(true);
  expect(evaluate(question('two-groups-around', true).rule, [6, 8])).toBe(
    false,
  );
  expect(evaluate(question('two-groups-around', true).rule, [0, 9])).toBe(true);
  for (const tasks of [lesson.questions, lesson.reviewQuestions!])
    for (const q of tasks) {
      if (q.rule.kind === 'choice')
        expect(q.choices!.filter((c) => evaluate(q.rule, c.id))).toHaveLength(
          1,
        );
    }
  expect(
    lesson.questions
      .filter((q) => q.rule.kind === 'manual')
      .map((q) => q.knowledge),
  ).toEqual(
    [
      'actual-open-writings',
      'actual-two-group-drawings',
      'actual-explanation',
    ].map((key) => `${lesson.id}-${key}`),
  );
});

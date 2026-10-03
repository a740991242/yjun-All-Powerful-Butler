import { expect, it } from 'vitest';

import { chineseBooks } from './content/chinese';
import { createEthicsBooks } from './content/ethics';
import { sujiaoBooks } from './content/sujiao';
import { findTextbook } from './content/textbooks';
import { suzhouGenericCourses } from './generic-courses';
import {
  regionalActionPath,
  regionalApplicationPlan,
} from './regional-application';

it('selects three real courses in either volume without school or year data', () => {
  const books = [
    ...chineseBooks,
    ...sujiaoBooks,
    ...createEthicsBooks((key) => key),
  ];
  for (const volume of ['upper', 'lower'] as const) {
    const actions = suzhouGenericCourses(volume);
    expect(actions.map((action) => [action.subject, action.edition])).toEqual([
      ['chinese', 'pep-2024'],
      ['math', 'sujiao'],
      ['ethics', 'pep-2024'],
    ]);
    for (const action of actions) {
      expect(action.volume).toBe(volume);
      expect(regionalActionPath(action)).toBe(
        `/education/primary/p1/${action.subject}/${action.edition}/${volume}`,
      );
      const textbook = findTextbook(action.subject, action.edition, volume);
      expect(textbook).toBeDefined();
      const book = books.find((item) => item.id === textbook?.id);
      expect(book).toBeDefined();
      expect(
        book?.units.some((unit) =>
          unit.lessons.some((lesson) => lesson.status === 'available'),
        ),
      ).toBe(true);
    }
  }
});

it('does not manufacture school adoption or English and returns independent actions', () => {
  const actions = suzhouGenericCourses('lower');
  const query = {
    province: 'jiangsu',
    city: 'suzhou',
    school: '',
    academicYear: '2026-2027',
    stage: 'primary',
    grade: 'p1',
    subject: 'math',
    volume: 'lower',
    schoolSystem: 'unknown',
  } as const;
  const before = regionalApplicationPlan(query);
  expect(before.find((row) => row.subject === 'math')?.resolution.status).toBe(
    'unknown',
  );
  expect(actions.some((action) => String(action.subject) === 'english')).toBe(
    false,
  );
  const first = actions[0];
  if (!first) throw new Error('missing course');
  first.volume = 'upper';
  expect(
    suzhouGenericCourses('lower').every((action) => action.volume === 'lower'),
  ).toBe(true);
  expect(regionalApplicationPlan(query)).toEqual(before);
});

it('rejects invalid volumes rather than silently selecting upper', () => {
  for (const value of [
    null,
    undefined,
    '',
    'Upper',
    'both',
    0,
    ['upper'],
    {},
  ]) {
    expect(suzhouGenericCourses(value)).toEqual([]);
  }
});

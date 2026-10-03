import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { bnuSchoolLesson, bnuUpperBook, bnuUpperSource } from './bnu';
import {
  bnuDifferenceLesson,
  bnuHiddenLesson,
  bnuTwoStepLesson,
} from './bnu-applications';
import {
  bnuClassificationLesson,
  bnuRoomSortLesson,
} from './bnu-classification';
import { bnuClassroomLesson } from './bnu-classroom';
import { bnuComparisonLesson } from './bnu-comparison';
import { bnuFiveAddLesson } from './bnu-five-add';
import {
  bnuFiveOrganizeLesson,
  bnuFiveSubtractLesson,
} from './bnu-five-finish';
import { bnuCountOrderLesson, bnuZeroLesson } from './bnu-numbers';
import { bnuOrganizeLesson } from './bnu-organize';
import {
  bnuSchoolGamesLesson,
  bnuSchoolHarvestLesson,
} from './bnu-school-activities';
import { bnuSixNineRelationsLesson } from './bnu-six-nine-relations';
import { bnuSixTenLesson } from './bnu-six-ten';
import { bnuTenPartitionsLesson } from './bnu-ten';
import {
  bnuTenFactTablesLesson,
  bnuTenOrganizeGameLesson,
} from './bnu-ten-finish';
import { editionTarget } from './edition-targets';
import { mathBooks } from './math';
import { findTextbook } from './textbooks';

it('registers an independent partial upper book without borrowing PEP scope or inventing a lower book', () => {
  expect(bnuUpperBook.units.map((unit) => [unit.title, unit.page])).toEqual([
    ['我上学啦', 2],
    ['生活中的数', 12],
    ['5以内数加与减', 29],
    ['介绍我的教室', 40],
    ['整理与分类', 43],
    ['10以内数加与减', 48],
    ['一起做游戏', 70],
    ['有趣的立体图形', 72],
    ['记录我的一天', 78],
    ['总复习', 81],
  ]);
  expect(findTextbook('math', 'bnu-2024', 'upper')?.id).toBe(bnuUpperBook.id);
  expect(editionTarget('math', 'bnu-2024', 'lower')?.status).toBe('preparing');
  expect(findTextbook('math', 'bnu-2024', 'lower')).toBeUndefined();
  expect(editionTarget('chinese', 'bnu-2024', 'upper')).toBeUndefined();
  const lessons = bnuUpperBook.units.flatMap((unit) => unit.lessons);
  expect(lessons.filter((lesson) => lesson.status === 'available')).toEqual([
    bnuSchoolLesson,
    bnuSchoolGamesLesson,
    bnuSchoolHarvestLesson,
    bnuCountOrderLesson,
    bnuZeroLesson,
    bnuSixTenLesson,
    bnuComparisonLesson,
    bnuOrganizeLesson,
    bnuFiveAddLesson,
    bnuFiveSubtractLesson,
    bnuFiveOrganizeLesson,
    bnuClassroomLesson,
    bnuRoomSortLesson,
    bnuClassificationLesson,
    bnuSixNineRelationsLesson,
    bnuTenPartitionsLesson,
    bnuTwoStepLesson,
    bnuDifferenceLesson,
    bnuHiddenLesson,
    bnuTenFactTablesLesson,
    bnuTenOrganizeGameLesson,
  ]);
  for (const lesson of lessons.filter((item) => item.status === 'preparing')) {
    expect(lesson.questions).toEqual([]);
    expect(lesson.steps).toEqual([]);
  }
  expect(bnuUpperSource.isbn).toBeNull();
  expect(bnuUpperSource.printing).toBeNull();
  expect(mathBooks.map((book) => book.id)).toEqual([
    'pep-math-p1-upper-2024',
    'pep-math-p1-lower-2024',
  ]);
});

it('distinguishes counts, identifiers and unknown age, with actually different review conditions', () => {
  const byId = (suffix: string) =>
    required(
      bnuSchoolLesson.questions.find((question) =>
        question.id.endsWith(suffix),
      ),
    );
  for (const [suffix, answer] of [
    ['q1', 3],
    ['q2', '班级编号'],
    ['q3', 4],
    ['q4', '喜欢的书的本数'],
    ['q5', '不要'],
    ['q6', '不能'],
  ] as const)
    expect(evaluate(byId(suffix).rule, answer)).toBe(true);
  expect(evaluate(byId('q3').rule, 2)).toBe(false);
  expect(evaluate(byId('q6').rule, '能')).toBe(false);
  expect(() => evaluate(byId('q1').rule, null)).toThrow(
    'educationLearning.answerRequired',
  );
  const review = required(bnuSchoolLesson.reviewQuestions?.[0]);
  expect(evaluate(review.rule, 5)).toBe(true);
  expect(evaluate(review.rule, 3)).toBe(false);
});

it('preserves independent session identity, mistakes and partial drafts through the unchanged backup schema', () => {
  const now = '2026-10-03T00:00:00.000Z';
  const session = createSession(bnuSchoolLesson, bnuUpperBook.id, 'child', {
    seed: 7,
    now,
  });
  const index = session.questions.findIndex((question) =>
    question.id.endsWith('q1'),
  );
  const question = required(session.questions[index]);
  const response = required(session.responses[index]);
  response.draft = 2;
  const wrong = submitResponse(question, response, now);
  wrong.draft = 3;
  session.responses[index] = submitResponse(question, wrong, now);
  expect(
    required(session.responses[index]).submissions.map((item) => item.correct),
  ).toEqual([false, true]);
  const open = required(
    session.responses.find((item) => item.questionId.endsWith('q3')),
  );
  open.draft = 0;
  const manual = required(
    session.questions.find((item) => item.rule.kind === 'manual'),
  );
  expect(evaluate(manual.rule, 'confirmed')).toBeNull();
  const data = {
    schemaVersion: 1 as const,
    profiles: [{ id: 'child', nickname: '测试', createdAt: now }],
    activeProfileId: 'child',
    sessions: [session],
  };
  expect(parseBackup(exportBackup(data, now)).data).toEqual(
    JSON.parse(JSON.stringify(data)),
  );
});

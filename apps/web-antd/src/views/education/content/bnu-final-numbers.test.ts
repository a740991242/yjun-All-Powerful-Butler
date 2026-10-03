import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { bnuUpperBook } from './bnu';
import { bnuFinalNumberTalkLesson as lesson } from './bnu-final-numbers';

const by = (suffix: string) =>
  required(lesson.questions.find((q) => q.id === `${lesson.id}-${suffix}`));

it('accepts every legal open drawing quantity, including zero, while rejecting equality and out-of-range numbers', () => {
  for (let circles = -1; circles <= 11; circles++)
    for (let triangles = -1; triangles <= 11; triangles++)
      expect(evaluate(by('open-drawing').rule, [circles, triangles])).toBe(
        circles > 4 && circles <= 10 && triangles >= 0 && triangles < 6,
      );
  expect(evaluate(by('open-drawing').rule, [10, 0])).toBe(true);
  expect(evaluate(by('open-drawing').rule, [5, 5])).toBe(true);
  expect(() => evaluate(by('open-drawing').rule, [5, null])).toThrow(
    'educationLearning.answerRequired',
  );
  expect(evaluate(by('paper-limit').rule, '满足，11比4多')).toBe(true);
  expect(evaluate(by('equal').rule, '两项都不满足')).toBe(true);
});

it('covers all three source expressions and distinguishes units, unknown basket contents and grouped people', () => {
  for (const [suffix, answer] of [
    ['q1', 4],
    ['unit', '不同，是根与筐'],
    ['basket', '不能，根数还需点数'],
    ['add-zero', 7],
    ['subtract', 5],
    ['story-order', '起初10，先取走3，再添1'],
    ['tree-groups', 4],
    ['children', 8],
    ['question-scope', '不能，所数对象不同'],
    ['unknown-tools', '保留待核对，再逐个观察'],
  ] as const)
    expect(evaluate(by(suffix).rule, answer)).toBe(true);
  expect(evaluate(by('two-step').rule, [7, 8])).toBe(true);
  expect(evaluate(by('two-step').rule, [8, 7])).toBe(false);
  expect(evaluate(by('children').rule, 4)).toBe(false);
  expect(evaluate(by('tree-groups').rule, 8)).toBe(false);
  expect(by('children').visual).toEqual({
    kind: 'count-groups',
    groups: [2, 2, 2, 2],
  });
});

it('retains every physical activity and open record separately without releasing the rest of the final review', () => {
  expect(lesson.steps).toHaveLength(6);
  expect(lesson.questions).toHaveLength(25);
  const physical = lesson.questions.filter((q) => q.rule.kind === 'manual');
  expect(physical.map((q) => q.id.split('-actual-')[1])).toEqual([
    'meaning',
    'draw',
    'calculate',
    'story',
    'plant-observe',
    'exchange',
  ]);
  for (const q of physical) expect(evaluate(q.rule, 'confirmed')).toBeNull();
  const open = lesson.questions.filter((q) => q.rule.kind === 'reflection');
  expect(open.map((q) => q.id.slice(lesson.id.length + 1))).toEqual([
    'meaning-record',
    'story-record',
    'plant-question',
    'reflection',
    'plan',
  ]);
  for (const q of open)
    expect(evaluate(q.rule, '未做，保留待核对。')).toBeNull();
  const final = required(
    bnuUpperBook.units.find((unit) => unit.id === 'final'),
  );
  expect(final.lessons[0]).toEqual(lesson);
  expect(final.lessons.some((item) => item.status === 'preparing')).toBe(true);
});

it('preserves incomplete zero drafts, corrected answers and independent story records in schema-one backups', () => {
  const now = '2026-10-04T00:00:00.000Z';
  const session = createSession(lesson, 'bnu-math-p1-upper-2024', 'child', {
    now,
    seed: 7,
  });
  const drawing = required(
    session.responses.find((q) => q.questionId.endsWith('-open-drawing')),
  );
  drawing.draft = [0, null];
  const story = required(
    session.responses.find((q) => q.questionId.endsWith('-story-record')),
  );
  story.draft = '自编故事：7张纸卡，没有再添加，仍7张。尚未向同伴讲。';
  const data = {
    schemaVersion: 1 as const,
    profiles: [{ id: 'child', nickname: '隔离核对', createdAt: now }],
    activeProfileId: 'child',
    sessions: [session],
  };
  expect(parseBackup(exportBackup(data, now)).data).toEqual(
    JSON.parse(JSON.stringify(data)),
  );
  const index = session.questions.findIndex((q) =>
    q.id.endsWith('-open-drawing'),
  );
  const question = required(session.questions[index]);
  drawing.draft = [4, 6];
  const wrong = submitResponse(question, drawing, now);
  expect(wrong.submissions[0]?.correct).toBe(false);
  wrong.draft = [10, 0];
  session.responses[index] = submitResponse(question, wrong, now);
  expect(
    required(session.responses[index]).submissions.map(
      (attempt) => attempt.correct,
    ),
  ).toEqual([false, true]);
  expect(parseBackup(exportBackup(data, now)).data.sessions[0]).toEqual(
    JSON.parse(JSON.stringify(session)),
  );
});

it('changes all review conditions and keeps their valid answers independent from main practice', () => {
  const review = required(lesson.reviewQuestions);
  expect(review).toHaveLength(4);
  expect(evaluate(required(review[0]).rule, 6)).toBe(true);
  expect(evaluate(required(review[0]).rule, 4)).toBe(false);
  expect(evaluate(required(review[1]).rule, [10, 0])).toBe(true);
  expect(evaluate(required(review[1]).rule, [5, 5])).toBe(false);
  expect(evaluate(required(review[2]).rule, [7, 10])).toBe(true);
  expect(evaluate(required(review[2]).rule, [7, 8])).toBe(false);
  expect(evaluate(required(review[3]).rule, '不能，支数还需点数')).toBe(true);
});

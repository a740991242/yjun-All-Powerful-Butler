import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate } from '../learning/engine';
import { required } from '../learning/required';
import {
  isSeatGridVisual,
  seatNeighbour,
  seatPosition,
} from '../learning/seat-grid';
import { bnuClassroomLesson as lesson } from './bnu-classroom';

const q = (suffix: string) =>
  required(lesson.questions.find((item) => item.id.endsWith(`-${suffix}`)));
it('matches every directional answer to the actual fixed three-by-three model', () => {
  const visual = required(q('q1').visual);
  expect(isSeatGridVisual(visual)).toBe(true);
  if (visual.kind !== 'seat-grid') throw new Error('Expected seat grid');
  expect(evaluate(q('q1').rule, required(visual.rows[1]).length)).toBe(true);
  const position = required(seatPosition(visual, '戊'));
  expect(evaluate(q('q2').rule, position.row)).toBe(true);
  expect(evaluate(q('q3').rule, position.column)).toBe(true);
  for (const [suffix, label, direction] of [
    ['q4', '戊', 'front'],
    ['q5', '戊', 'rear'],
    ['q6', '戊', 'left'],
    ['q7', '丁', 'right'],
  ] as const)
    expect(
      evaluate(
        q(suffix).rule,
        required(seatNeighbour(visual, label, direction)),
      ),
    ).toBe(true);
  expect(seatNeighbour(visual, '丁', 'left')).toBeUndefined();
  expect(evaluate(q('q8').rule, '没有')).toBe(true);
  expect(evaluate(q('q9').rule, '能')).toBe(false);
  expect(evaluate(q('q10').rule, '能认定')).toBe(false);
  expect(evaluate(q('q11').rule, '不能')).toBe(true);
  expect(evaluate(q('q12').rule, '高低位置')).toBe(true);
});
it('changes review targets and preserves new diagrams and empty drafts in schema-one backups', () => {
  const fresh = required(lesson.reviewQuestions);
  expect(fresh).toHaveLength(4);
  const visual = required(fresh[0]?.visual);
  if (visual.kind !== 'seat-grid') throw new Error('Expected review seat grid');
  expect(isSeatGridVisual(visual)).toBe(true);
  expect(
    evaluate(required(fresh[0]).rule, required(seatPosition(visual, '柳')).row),
  ).toBe(true);
  expect(
    evaluate(
      required(fresh[1]).rule,
      required(seatNeighbour(visual, '荷', 'left')),
    ),
  ).toBe(true);
  expect(seatNeighbour(visual, '杏', 'right')).toBeUndefined();
  expect(evaluate(required(fresh[2]).rule, '没有')).toBe(true);
  expect(evaluate(required(fresh[3]).rule, 1)).toBe(true);
  for (const item of fresh)
    expect(
      lesson.questions.some(
        (old) => old.id === item.id || old.prompt === item.prompt,
      ),
    ).toBe(false);
  const now = '2026-10-03T00:00:00.000Z';
  const session = createSession(lesson, 'bnu-math-p1-upper-2024', 'child', {
    seed: 40,
    now,
  });
  required(
    session.responses.find((item) => item.questionId.endsWith('-q2')),
  ).draft = 0;
  required(
    session.responses.find((item) => item.questionId.endsWith('-q3')),
  ).draft = null;
  const data = {
    schemaVersion: 1 as const,
    profiles: [{ id: 'child', nickname: '隔离测试', createdAt: now }],
    activeProfileId: 'child',
    sessions: [session],
  };
  expect(parseBackup(exportBackup(data, now)).data).toEqual(
    JSON.parse(JSON.stringify(data)),
  );
});
it('separates seven actual activities, three reflections and future plans from scored answers', () => {
  expect(lesson.steps).toHaveLength(6);
  expect(lesson.questions).toHaveLength(22);
  const actual = lesson.questions.filter((item) => item.rule.kind === 'manual');
  const reflections = lesson.questions.filter(
    (item) => item.rule.kind === 'reflection',
  );
  expect(actual).toHaveLength(7);
  expect(reflections).toHaveLength(3);
  for (const item of actual)
    expect(evaluate(item.rule, 'confirmed')).toBeNull();
  for (const item of reflections)
    expect(evaluate(item.rule, '实际反馈或未来计划')).toBeNull();
});

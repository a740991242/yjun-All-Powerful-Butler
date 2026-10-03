import type { LibraryState } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  bnuFinalAnnexCards,
  bnuFinalClockCards,
  bnuFinalFlower,
  bnuFinalPositionItems,
} from '../learning/bnu-final-position';
import { clockHands } from '../learning/clock';
import { createSession, evaluate } from '../learning/engine';
import { createStudyLibrary } from '../learning/library';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { bnuUpperBook } from './bnu';
import { bnuFinalPositionTimeLesson as lesson } from './bnu-final-position';
const by = (suffix: string) =>
  required(lesson.questions.find((q) => q.id === `${lesson.id}-${suffix}`));
it('preserves all four drawing directions, all eight item positions and the specified references', () => {
  expect(
    bnuFinalFlower('main').map((s) => [s.label, s.x, s.y, s.shape, s.sample]),
  ).toEqual([
    ['A', 150, 40, 'square', false],
    ['B', 40, 150, 'triangle', false],
    ['C', 150, 260, 'circle', false],
    ['D', 260, 150, 'star', true],
  ]);
  expect(evaluate(by('flower-fill').rule, ['正方形', '三角形', '圆'])).toBe(
    true,
  );
  expect(evaluate(by('flower-fill').rule, ['三角形', '正方形', '圆'])).toBe(
    false,
  );
  expect(evaluate(by('flower-star').rule, '右边')).toBe(true);
  const items = bnuFinalPositionItems('main');
  expect(items.map((s) => [s.name, s.row, s.column])).toEqual([
    ['sun', 1, 1],
    ['balloon', 1, 2],
    ['moon', 1, 3],
    ['house', 1, 4],
    ['lamp', 2, 1],
    ['pencilCup', 2, 2],
    ['pinwheel', 2, 3],
    ['clock', 2, 4],
  ]);
  for (const [suffix, answer] of [
    ['q1', '上面'],
    ['balloon', '右边'],
    ['lamp', '左边'],
    ['cup', '下面'],
  ] as const)
    expect(evaluate(by(suffix).rule, answer)).toBe(true);
  expect(evaluate(by('front').rule, '不能，前后要说明实际面对方向')).toBe(true);
});
it('matches every original clock with correct long and half-hour short hands, without inventing time of day', () => {
  const clocks = bnuFinalClockCards('main');
  expect(clocks.map((c) => [c.clock.hour, c.clock.minute])).toEqual([
    [12, 0],
    [3, 30],
    [8, 30],
    [10, 30],
  ]);
  expect(clocks.map((c) => clockHands(c.clock))).toEqual([
    { hour: 0, minute: 0 },
    { hour: 105, minute: 180 },
    { hour: 255, minute: 180 },
    { hour: 315, minute: 180 },
  ]);
  for (const [index, answer] of ['12时', '3时半', '8时半', '10时半'].entries())
    expect(evaluate(by(`clock-${index + 1}`).rule, answer)).toBe(true);
  expect(evaluate(by('half-between').rule, '3与4之间')).toBe(true);
  expect(evaluate(by('half-between').rule, '正好指4')).toBe(false);
  expect(evaluate(by('long-hands').rule, [12, 6, 6, 6])).toBe(true);
  expect(evaluate(by('period').rule, '不能，还需要日期和时段信息')).toBe(true);
});
it('connects all nine original appendix cards without inventing a formal unit or mixing criteria', () => {
  expect(
    bnuFinalAnnexCards('main').map((c) => [c.label, c.color, c.shape]),
  ).toEqual([
    ['A', 'yellow', 'circle'],
    ['B', 'blue', 'square'],
    ['C', 'yellow', 'triangle'],
    ['D', 'blue', 'circle'],
    ['E', 'green', 'triangle'],
    ['F', 'blue', 'triangle'],
    ['G', 'green', 'square'],
    ['H', 'green', 'circle'],
    ['I', 'yellow', 'square'],
  ]);
  for (const [suffix, answer] of [
    ['circle', ['A', 'D', 'H']],
    ['square', ['B', 'G', 'I']],
    ['triangle', ['C', 'E', 'F']],
    ['yellow', ['A', 'C', 'I']],
    ['blue', ['B', 'D', 'F']],
    ['green', ['E', 'G', 'H']],
  ] as const)
    expect(evaluate(by(`annex-${suffix}`).rule, [...answer])).toBe(true);
  expect(evaluate(by('annex-green').rule, ['E', 'G'])).toBe(false);
  expect(evaluate(by('annex-shape-counts').rule, [3, 3, 3])).toBe(true);
  expect(evaluate(by('annex-color-counts').rule, [3, 3, 3])).toBe(true);
  expect(bnuUpperBook.units.some((u) => u.page === 87)).toBe(false);
});
it('keeps eight actual tasks and four personal records separate, including unobserved events and future plans', () => {
  expect(lesson.steps).toHaveLength(6);
  expect(lesson.questions).toHaveLength(35);
  const manual = lesson.questions.filter((q) => q.rule.kind === 'manual');
  expect(manual.map((q) => q.id.replace(`${lesson.id}-actual-`, ''))).toEqual([
    'position',
    'flower',
    'items',
    'clock-match',
    'clock-dial',
    'record',
    'exchange',
    'annex',
  ]);
  for (const q of manual) expect(evaluate(q.rule, 'confirmed')).toBeNull();
  const reflections = lesson.questions.filter(
    (q) => q.rule.kind === 'reflection',
  );
  expect(reflections).toHaveLength(4);
  for (const q of reflections)
    expect(evaluate(q.rule, '尚未观察，准备下次记录。')).toBeNull();
  const final = required(bnuUpperBook.units.find((u) => u.id === 'final'));
  expect(final.lessons.map((l) => l.page)).toEqual([81, 82, 83, 84, 85, 86]);
  expect(final.lessons.every((l) => l.status === 'available')).toBe(true);
});
it('changes every review reference or condition and round trips partial zero and blank directions through schema1', () => {
  const review = required(lesson.reviewQuestions);
  const good = [['圆', '正方形', '三角形'], '下面', '5时半', ['A', 'E', 'H']];
  const stale = [['正方形', '三角形', '圆'], '上面', '12时', ['E', 'G', 'H']];
  for (const [index, q] of review.entries()) {
    expect(evaluate(q.rule, required(good[index]))).toBe(true);
    expect(evaluate(q.rule, required(stale[index]))).toBe(false);
  }
  expect(bnuFinalPositionItems('review').map((c) => c.name)).toEqual([
    'clock',
    'moon',
    'pencilCup',
    'lamp',
    'house',
    'sun',
    'balloon',
    'pinwheel',
  ]);
  const library = initialLibrary('隔离86页');
  const session = createSession(
    lesson,
    bnuUpperBook.id,
    library.activeProfileId,
  );
  required(
    session.responses.find((r) => r.questionId.endsWith('-long-hands')),
  ).draft = [0, null, 0, null];
  required(
    session.responses.find((r) => r.questionId.endsWith('-flower-fill')),
  ).draft = ['正方形', '', ''];
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(
    JSON.parse(JSON.stringify(session)),
  );
});
it('still rejects an explicitly preparing course after the last upper placeholder is removed', async () => {
  let stored: LibraryState | null = null;
  const app = createStudyLibrary({
    load: async () => stored,
    save: async (value) => {
      stored = structuredClone(value);
    },
  });
  await app.initialize('未完课守卫');
  await expect(
    app.start({ ...lesson, status: 'preparing' }, bnuUpperBook.id),
  ).rejects.toThrow('educationLearning.notAvailable');
  expect(app.state.value?.sessions).toHaveLength(0);
});

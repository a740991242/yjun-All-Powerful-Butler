import type { Answer, Lesson } from '../learning/types';

import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, statistics } from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { bnuLowerAncientCountLesson } from './bnu-lower';
import {
  bnuLowerFindTracesLesson as find,
  bnuLowerShadowTheatreLesson as shadow,
  bnuLowerTracePrintLesson as trace,
} from './bnu-lower-shapes';

function check(lesson: Lesson, answers: readonly Answer[], review = false) {
  const questions = (
    review ? required(lesson.reviewQuestions) : lesson.questions
  ).filter((q) => !['manual', 'reflection'].includes(q.rule.kind));
  expect(questions).toHaveLength(answers.length);
  questions.forEach((q, i) => {
    expect(evaluate(q.rule, required(answers[i])), q.id).toBe(true);
    if (q.rule.kind === 'choice') {
      expect(
        q.choices?.some((c) => c.id === answers[i]),
        q.id,
      ).toBe(true);
      for (const alternative of required(q.choices).filter(
        (c) => c.id !== answers[i],
      ))
        expect(evaluate(q.rule, alternative.id), q.id).toBe(false);
    }
  });
}
describe('bNU lower printed 18–23 shapes and shadows', () => {
  it('independently checks all main and changed review answers', () => {
    expect([
      trace.questions.length,
      find.questions.length,
      shadow.questions.length,
    ]).toEqual([19, 32, 19]);
    check(trace, [
      'rectangle',
      'square',
      'triangle',
      'circle',
      '不是',
      '不一定，要重新观察',
      '先写预测再描印并比对',
      '不一定，可能是其它轮廓',
    ]);
    check(trace, ['circle', 'triangle', 'rectangle', 'square'], true);
    check(find, [
      'rectangle',
      'square',
      'triangle',
      'circle',
      'square',
      'square',
      'square',
      'rectangle',
      'rectangle',
      'rectangle',
      '圆',
      '不能，是滚印展开痕迹',
      'triangle',
      'rectangle',
      'triangle',
      'square',
      'square',
      'rectangle',
      'rectangle',
      '不能，还要看物体和接触处',
      '不是，只选了三个面',
      '不一定，要实际叠放比较',
    ]);
    check(find, ['circle', 'triangle', 'rectangle', 'square', 'square'], true);
    check(shadow, [
      ['sprout', 'grow', 'flower', 'fruit'],
      '不能，不同时间不能相加成四盆',
      '不是，是选择故事角色',
      'A',
      '变大',
      '变小',
      '固定灯屏和手势只移手的位置',
      '不是，板的大小没变',
      '不能，还需要物体和照明条件',
      '不能，实际做过才确认',
    ]);
    check(shadow, ['B', '更近', '不能，多项条件都改变', '幕布后'], true);
  });
  it('keeps physical operations and open personal records separate from objective scores', () => {
    for (const [lesson, steps, manual, records] of [
      [trace, 5, 8, 3],
      [find, 7, 8, 2],
      [shadow, 5, 6, 3],
    ] as const) {
      expect(lesson.steps).toHaveLength(steps);
      expect(
        lesson.questions.filter((q) => q.rule.kind === 'manual'),
      ).toHaveLength(manual);
      const reflections = lesson.questions.filter(
        (q) => q.rule.kind === 'reflection',
      );
      expect(reflections).toHaveLength(records);
      for (const q of reflections)
        expect(evaluate(q.rule, '未做，准备下次尝试')).toBeNull();
      const session = createSession(
        lesson,
        'bnu-math-p1-lower-2024',
        'test-profile',
      );
      expect(statistics(session).manual).toBe(0);
      expect(new Set(lesson.questions.map((q) => q.id)).size).toBe(
        lesson.questions.length,
      );
      expect(lesson.parentTip).toContain('原创');
    }
    expect(find.steps[3]?.text).toContain('不能说圆柱有一个长方形平面');
    expect(shadow.steps[2]?.text).toContain('灯与屏固定');
    expect(trace.steps[0]?.text).toContain('不规则轮廓');
  });
  it('backs up all three new lesson snapshots alongside an unchanged old first-unit snapshot', () => {
    const library = initialLibrary('图形');
    library.sessions = [bnuLowerAncientCountLesson, trace, find, shadow].map(
      (lesson) =>
        createSession(
          lesson,
          'bnu-math-p1-lower-2024',
          library.activeProfileId,
        ),
    );
    const original = structuredClone(library.sessions[0]);
    expect(parseBackup(exportBackup(library)).data.sessions).toEqual(
      library.sessions,
    );
    expect(library.sessions[0]).toEqual(original);
  });
});

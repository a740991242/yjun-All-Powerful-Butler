import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { required } from '../learning/required';
import { mathBooks } from './math';
import { planePracticeLessons } from './math-plane-practice';

const find = (course: number, suffix: string) =>
  required(
    required(planePracticeLessons[course]).questions.find((q) =>
      q.id.endsWith(`-${suffix}`),
    ),
  );
describe('pep plane observation and physical construction', () => {
  it('counts by shape independently of size and orientation and distinguishes absent triangles from blanks', () => {
    for (const [suffix, value] of [
      ['q1', 2],
      ['q2', 2],
      ['q3', 2],
      ['q4', 0],
    ] as const) {
      const q = find(0, suffix);
      expect(evaluate(q.rule, value)).toBe(true);
      expect(evaluate(q.rule, value + 1)).toBe(false);
    }
    expect(() => evaluate(find(0, 'q4').rule, null)).toThrow(
      'educationLearning.answerRequired',
    );
    expect(evaluate(find(0, 'q5').rule, '平行四边形')).toBe(true);
    expect(evaluate(find(0, 'q6').rule, '球的弯曲表面')).toBe(false);
    expect(evaluate(find(0, 'q6').rule, '圆柱的平底')).toBe(true);
  });
  it('separates pieces, external outlines, missing equal cells and a repeated shape-size group', () => {
    for (const [suffix, value] of [
      ['q1', 4],
      ['q3', 3],
      ['q5', 7],
    ] as const) {
      expect(evaluate(find(1, suffix).rule, value)).toBe(true);
      expect(evaluate(find(1, suffix).rule, value + 1)).toBe(false);
    }
    const tiles = find(1, 'q3').visual;
    if (tiles?.kind !== 'tile-grid') throw new Error('tile fixture missing');
    expect(tiles.cells.flat().filter((filled) => !filled)).toHaveLength(3);
    expect(evaluate(find(1, 'q2').rule, '三角形')).toBe(true);
    expect(evaluate(find(1, 'q2').rule, '长方形')).toBe(false);
    expect(evaluate(find(1, 'q4').rule, '较大正方形')).toBe(true);
    expect(evaluate(find(1, 'q4').rule, '较小圆')).toBe(false);
    expect(evaluate(find(1, 'q6').rule, '不能')).toBe(true);
    expect(evaluate(find(1, 'q7').rule, '正方形、三角形')).toBe(true);
    expect(evaluate(find(1, 'q7').rule, '三角形、正方形')).toBe(false);
    expect(evaluate(find(1, 'q8').rule, '圆')).toBe(true);
    expect(evaluate(find(1, 'q8').rule, '正方形')).toBe(false);
    const review = required(
      planePracticeLessons[1]?.reviewQuestions?.find((q) =>
        q.id.endsWith('-r1'),
      ),
    );
    expect(evaluate(review.rule, 0)).toBe(true);
    expect(() => evaluate(review.rule, null)).toThrow(
      'educationLearning.answerRequired',
    );
  });
  it('preserves real-activity and reflection evidence separately from objective scores and roundtrips every visual snapshot', () => {
    const now = '2026-10-03T00:00:00.000Z';
    for (const course of planePracticeLessons) {
      const session = createSession(course, 'pep-math-p1-lower-2024', 'child', {
        seed: 17,
        now,
      });
      for (const [index, q] of session.questions.entries()) {
        if (q.rule.kind !== 'manual' && q.rule.kind !== 'reflection') continue;
        const response = required(session.responses[index]);
        response.draft =
          q.rule.kind === 'manual'
            ? 'confirmed'
            : '测试记录：反思独立保存，不自动评分。';
        session.responses[index] = submitResponse(q, response, now);
        expect(session.responses[index]?.submissions[0]?.correct).toBeNull();
      }
      expect(statistics(session).accuracy).toBeNull();
      expect(statistics(session).independent).toBe(0);
      expect(statistics(session).reflections).toBe(2);
      const state = {
        schemaVersion: 1 as const,
        activeProfileId: 'child',
        profiles: [{ id: 'child', nickname: '学习者', createdAt: now }],
        sessions: [session],
      };
      expect(parseBackup(exportBackup(state)).data).toEqual(state);
    }
  });
  it('keeps both original v1 courses and snapshots before the independent additions', () => {
    const book = required(mathBooks.find((b) => b.volume === 'lower'));
    const unit = required(book.units.find((u) => u.id === 'u1'));
    expect(unit.lessons.map((l) => l.id)).toEqual([
      'ml-flat',
      'ml-flat-join',
      'ml-plane-observe',
      'ml-plane-build',
    ]);
    for (const original of unit.lessons.slice(0, 2)) {
      expect(original.version).toBe(1);
      expect(original.questions).toHaveLength(6);
    }
    expect(required(unit.lessons[0]).questions.map((q) => q.id)).toEqual(
      Array.from({ length: 6 }, (_, i) => `ml-flat-q${i + 1}`),
    );
    const ids = unit.lessons.flatMap((l) =>
      [...l.questions, ...(l.reviewQuestions ?? [])].map((q) => q.id),
    );
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('accepts every usable circular base and rejects incomplete or extra face choices', () => {
    for (const course of planePracticeLessons) {
      if (course.id !== 'ml-plane-observe') continue;
      for (const group of [course.questions, course.reviewQuestions ?? []]) {
        const circular = required(group.find((q) => q.id.endsWith('-face-1')));
        const correct = ['圆柱的圆形底面', '圆锥的圆形底面'];
        expect(evaluate(circular.rule, correct)).toBe(true);
        expect(evaluate(circular.rule, correct.toReversed())).toBe(true);
        expect(evaluate(circular.rule, ['圆柱的圆形底面'])).toBe(false);
        expect(evaluate(circular.rule, [...correct, '球的弯曲表面'])).toBe(
          false,
        );
        expect(
          evaluate(required(group.find((q) => q.id.endsWith('-face-2'))).rule, [
            '三棱柱的三角形端面',
          ]),
        ).toBe(true);
        expect(
          evaluate(required(group.find((q) => q.id.endsWith('-face-3'))).rule, [
            '三向长度各不同的长方体的一个面',
          ]),
        ).toBe(true);
        expect(
          evaluate(required(group.find((q) => q.id.endsWith('-face-3'))).rule, [
            '正方体的一个面',
          ]),
        ).toBe(false);
      }
    }
  });
  it('keeps source activities distinct and roundtrips a partial multi-select and both attempt histories', () => {
    const now = '2026-10-04T00:00:00.000Z';
    const counts = [9, 13];
    for (const [index, course] of planePracticeLessons.entries()) {
      expect(course.version).toBe(2);
      const physical = course.questions.filter((q) =>
        q.id.includes('-complete-source-'),
      );
      expect(physical).toHaveLength(required(counts[index]));
      expect(physical.every((q) => q.rule.kind === 'manual')).toBe(true);
      const session = createSession(course, 'pep-math-p1-lower-2024', 'child', {
        now,
        seed: 71,
      });
      if (index === 0) {
        const questionIndex = session.questions.findIndex((q) =>
          q.id.endsWith('-q-face-1'),
        );
        const q = required(session.questions[questionIndex]);
        const response = required(session.responses[questionIndex]);
        response.draft = ['圆柱的圆形底面'];
        session.responses[questionIndex] = submitResponse(q, response, now);
        const retry = required(session.responses[questionIndex]);
        retry.draft = ['圆柱的圆形底面', '圆锥的圆形底面'];
        session.responses[questionIndex] = submitResponse(q, retry, now);
        expect(
          session.responses[questionIndex]?.submissions.map((a) => a.correct),
        ).toEqual([false, true]);
      }
      const state = {
        schemaVersion: 1 as const,
        activeProfileId: 'child',
        profiles: [{ id: 'child', nickname: '测试', createdAt: now }],
        sessions: [session],
      };
      expect(parseBackup(exportBackup(state)).data).toEqual(state);
      expect(
        course.questions
          .slice(0, index === 0 ? 12 : 19)
          .every((q) => !q.id.includes('-complete-')),
      ).toBe(true);
      expect(course.steps).toHaveLength(index === 0 ? 6 : 7);
      expect(course.reviewQuestions).toHaveLength(index === 0 ? 7 : 6);
    }
    const build = required(planePracticeLessons[1]);
    expect(
      evaluate(
        required(
          build.questions.find((q) => q.id.endsWith('-complete-tangram-size')),
        ).rule,
        '不是',
      ),
    ).toBe(true);
    expect(
      evaluate(
        required(build.questions.find((q) => q.id.endsWith('-complete-seam')))
          .rule,
        '算',
      ),
    ).toBe(false);
    expect(
      required(build.questions.find((q) => q.id.endsWith('-p3-eight-targets')))
        .prompt,
    ).toContain('八张');
    expect(
      required(
        build.questions.find((q) => q.id.endsWith('-p4-rectangle-square')),
      ).prompt,
    ).toContain('长方形和正方形');
    expect(
      required(build.questions.find((q) => q.id.endsWith('-p6-staggered-wall')))
        .prompt,
    ).toContain('不把本站方格缺3块');
  });
});

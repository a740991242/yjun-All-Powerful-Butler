import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { required } from '../learning/required';
import { newReviewQuestions } from '../learning/review';
import { initialLibrary } from '../learning/storage';
import { mathBooks } from './math';
import { lowerFinalGrowthLesson as lesson } from './math-lower-final-growth';
const book = () => required(mathBooks.find((b) => b.volume === 'lower'));
const q = (suffix: string) =>
  required(lesson.questions.find((q) => q.id === `ml-final-growth-${suffix}`));
describe('complete autonomous knowledge map and nine independent experience reviews', () => {
  it('keeps all nine named aspects distinct and checks only the five objective framework tasks', () => {
    const aspects = [
      'interest',
      'asking',
      'difficulty',
      'independent',
      'help',
      'checking',
      'expressing',
      'listening',
      'cooperating',
    ];
    for (const a of aspects) {
      expect(q(`m-${a}`).rule.kind).toBe('manual');
      expect(q(`f-${a}`).rule.kind).toBe('reflection');
      expect(q(`m-${a}`).prompt).toContain('没有或不确定');
      expect(q(`m-${a}`).prompt).toContain('确认不是已经具备此能力');
    }
    const answers = [
      ['数的认识', '数的运算', '数量关系'],
      [99 + 1, 46 + 27, 72 - 36, 17 - 7],
      '未来计划',
      [
        '注明自己尝试与帮助范围',
        '注明实际发生与未来计划',
        '没有经历时如实写没有',
      ],
      '不能',
    ];
    answers.forEach((a, i) =>
      expect(evaluate(q(`q${i + 1}`).rule, a)).toBe(true),
    );
    expect(lesson.questions).toHaveLength(29);
    expect(lesson.steps).toHaveLength(6);
    [
      [98 + 2, 47 + 26, 71 - 35, 19 - 8],
      '尚未发生的计划',
      '不能',
      ['倾听他人的方法', '与他人共同合作'],
    ].forEach((a, i) =>
      expect(evaluate(required(lesson.reviewQuestions?.[i]).rule, a)).toBe(
        true,
      ),
    );
    expect(evaluate(q('q3').rule, '已经合作完成')).toBe(false);
    expect(evaluate(q('q5').rule, '能')).toBe(false);
  });
  it('does not infer growth from objective accuracy, positive wording or confirmed reflection activity', () => {
    const s = createSession(lesson, book().id, 'child', { seed: 1 });
    for (const [i, question] of s.questions.entries()) {
      if (
        question.rule.kind !== 'manual' &&
        question.rule.kind !== 'reflection'
      )
        continue;
      required(s.responses[i]).draft =
        question.rule.kind === 'manual'
          ? 'confirmed'
          : `${question.id}：本学期没有这类经历，未来计划另列。`;
      s.responses[i] = submitResponse(question, required(s.responses[i]));
      expect(s.responses[i]?.submissions[0]?.correct).toBeNull();
    }
    expect(statistics(s).accuracy).toBeNull();
    expect(s.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
      12,
    );
    expect(
      s.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(12);
    expect(
      s.responses
        .filter((r) => r.submissions.length)
        .map((r) => r.submissions[0]?.correct),
    ).toEqual(Array.from({ length: 24 }, () => null));
  });
  it('preserves original final sessions, each separate reflection and incomplete method drafts in backups', () => {
    const state = initialLibrary('真实回顾核验');
    const oldLesson = required(
      book()
        .units.flatMap((u) => u.lessons)
        .find((l) => l.id === 'ml-review'),
    );
    const old = createSession(oldLesson, book().id, state.activeProfileId, {
      seed: 1,
    });
    state.sessions.push(old);
    const before = JSON.stringify(old);
    const s = createSession(lesson, book().id, state.activeProfileId, {
      seed: 2,
    });
    for (const [i, question] of s.questions.entries()) {
      if (question.rule.kind === 'reflection')
        required(s.responses[i]).draft = `${question.id}：没有经历，计划另列。`;
      if (question.id.endsWith('-q2'))
        required(s.responses[i]).draft = [100, null, 36, 10];
    }
    state.sessions.push(s);
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
    expect(JSON.stringify(state.sessions[0])).toBe(before);
    expect(
      new Set(
        s.responses
          .filter((r) => typeof r.draft === 'string')
          .map((r) => r.draft),
      ).size,
    ).toBe(12);
  });
  it('registers the standalone cross-topic course and offers four new framework variants only after a real mistake', () => {
    expect(
      book()
        .units.flatMap((u) => u.lessons)
        .some((l) => l.id === lesson.id),
    ).toBe(true);
    const s = createSession(lesson, book().id, 'child', { seed: 2 });
    expect(newReviewQuestions(lesson, s, [s])).toEqual([]);
    const index = s.questions.findIndex((q) => q.id === 'ml-final-growth-q2');
    required(s.responses[index]).draft = [99, 73, 36, 10];
    s.responses[index] = submitResponse(
      required(s.questions[index]),
      required(s.responses[index]),
    );
    const fresh = newReviewQuestions(lesson, s, [s]);
    expect(fresh.map((q) => q.id)).toEqual(
      required(lesson.reviewQuestions).map((q) => q.id),
    );
    const r = createSession(lesson, book().id, 'child', {
      mode: 'review',
      originalSessionId: s.id,
      questions: fresh,
    });
    expect(newReviewQuestions(lesson, s, [s, r])).toEqual([]);
  });
});

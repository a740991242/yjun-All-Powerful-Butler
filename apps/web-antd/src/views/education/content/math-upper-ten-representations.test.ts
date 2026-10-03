import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { newReviewQuestions } from '../learning/review';
import { initialLibrary } from '../learning/storage';
import { mathBooks } from './math';
import { upperTenRepresentationsLesson as lesson } from './math-upper-ten-representations';

const book = () => required(mathBooks.find((b) => b.volume === 'upper'));
const q = (suffix: string) =>
  required(lesson.questions.find((q) => q.id === `${lesson.id}-${suffix}`));
describe('six-to-nine context counting and representations', () => {
  it('checks each amount, digit and fixed ten-cell capacity independently without counting blank cells', () => {
    for (const n of [6, 7, 8, 9]) {
      expect(evaluate(q(`dots${n}`).rule, n)).toBe(true);
      expect(q(`dots${n}`).visual).toEqual({ kind: 'count', count: n });
      expect(evaluate(q(`symbol${n}`).rule, String(n))).toBe(true);
      expect(evaluate(q(`frame${n}`).rule, [n, 10 - n, 10])).toBe(true);
      expect(evaluate(q(`frame${n}`).rule, [n, 10, 10])).toBe(false);
      expect(q(`frame${n}`).visual).toEqual({ kind: 'ten-cells' });
    }
    expect(evaluate(q('groups').rule, [5 + 1, 6 + 1, 7 + 1, 8 + 1])).toBe(true);
    expect(evaluate(q('groups').rule, [30, 30, 30, 30])).toBe(false);
    expect(q('m1').prompt).toContain('不补造原书强制分类任务');
    expect(q('m2').prompt).toContain('全部四幅');
    expect(q('m3').prompt).toContain('每幅先恢复原量');
  });
  it('covers every original zero-to-nine position and all requested neighbor fields', () => {
    const sequence = Array.from({ length: 10 }, (_, n) => n);
    expect(evaluate(q('sequence').rule, sequence)).toBe(true);
    expect(() => evaluate(q('sequence').rule, sequence.slice(1))).toThrow(
      'educationLearning.answerRequired',
    );
    expect(
      evaluate(
        q('sequence').rule,
        sequence.map((n) => n + 1),
      ),
    ).toBe(false);
    const neighbors = [6 - 1, 6 + 1, 7 - 1, 7 + 1, 8 - 1, 8 + 1, 9 - 1];
    expect(evaluate(q('neighbors').rule, neighbors)).toBe(true);
    expect(evaluate(q('neighbors').rule, [6, 6, 7, 7, 8, 8, 9])).toBe(false);
    expect(q('sequence').visual).toEqual({
      kind: 'number-line',
      minimum: 0,
      maximum: 9,
      value: 6,
    });
  });
  it('retains twelve old courses and partial zero, validates exact board/state in strict backup and does not auto-confirm activities', () => {
    const unit = required(book().units.find((u) => u.id === 'u2'));
    expect(unit.lessons.slice(0, 12).map((l) => l.id)).toEqual([
      'mu-ten',
      'mu-ten-sequence',
      'mu-ten-compare',
      'mu-ten-partition',
      'mu-ten-addsub',
      'mu-story',
      'mu-chain',
      'mu-ten-full-partition',
      'mu-ten-relations',
      'mu-ten-applications',
      'mu-ten-full-cards',
      'mu-ten-unit-summary',
    ]);
    expect(unit.lessons[12]).toEqual(lesson);
    const state = initialLibrary('数量表示');
    const old = createSession(
      required(unit.lessons[0]),
      book().id,
      state.activeProfileId,
      { seed: 1 },
    );
    const snapshot = JSON.stringify(old);
    state.sessions.push(old);
    const session = createSession(lesson, book().id, state.activeProfileId, {
      seed: 2,
    });
    const index = session.questions.findIndex((q) =>
      q.id.endsWith('-sequence'),
    );
    required(session.responses[index]).draft = [
      0,
      null,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
    ];
    session.tools = {
      'step-1': { tenCells: [0, 2, 4, 6, 8, 9] },
      [`question-${q('frame6').id}`]: { tenCells: [0, 1, 2, 3, 4, 5] },
    };
    for (const [index, question] of session.questions.entries()) {
      if (!['manual', 'reflection'].includes(question.rule.kind)) continue;
      required(session.responses[index]).draft =
        question.rule.kind === 'manual'
          ? 'confirmed'
          : '未做原图纸笔，计划另记。';
      session.responses[index] = submitResponse(
        question,
        required(session.responses[index]),
      );
      expect(session.responses[index]?.submissions[0]?.correct).toBeNull();
    }
    expect(session.questions).toHaveLength(21);
    expect(
      session.questions.filter((q) => q.rule.kind === 'manual'),
    ).toHaveLength(4);
    expect(
      session.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(2);
    expect(session.activities).toEqual([]);
    state.sessions.push(session);
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
    expect(JSON.stringify(state.sessions[0])).toBe(snapshot);
    const raw = JSON.parse(exportBackup(state));
    raw.data.sessions[1].tools['step-1'].tenCells = [10];
    expect(() => parseBackup(JSON.stringify(raw))).toThrow(
      'educationLearning.invalidBackup',
    );
    const extra = JSON.parse(exportBackup(state));
    const frame = extra.data.sessions[1].questions.find((q: { id: string }) =>
      q.id.endsWith('-frame6'),
    );
    frame.visual.value = 6;
    expect(() => parseBackup(JSON.stringify(extra))).toThrow(
      'educationLearning.invalidBackup',
    );
    const wrongBinding = JSON.parse(exportBackup(state));
    wrongBinding.data.sessions[1].tools[`question-${q('dots6').id}`] = {
      tenCells: [0],
    };
    expect(() => parseBackup(JSON.stringify(wrongBinding))).toThrow(
      'educationLearning.invalidBackup',
    );
  });
  it('changes group order, field order and selected number in new reviews, retaining the original mistake', () => {
    const session = createSession(lesson, book().id, 'child', { seed: 3 });
    const index = session.questions.findIndex((q) => q.id.endsWith('-groups'));
    required(session.responses[index]).draft = [30, 30, 30, 30];
    session.responses[index] = submitResponse(
      required(session.questions[index]),
      required(session.responses[index]),
    );
    const snapshot = JSON.stringify(session);
    const fresh = newReviewQuestions(lesson, session, [session]);
    expect(fresh).toHaveLength(4);
    const answers = [
      [9, 6, 8, 7],
      [10 - 8, 8, 10],
      [9 - 1, 0, 9],
      ['已知6个贝壳'],
    ];
    answers.forEach((answer, index) =>
      expect(evaluate(required(fresh[index]).rule, answer)).toBe(true),
    );
    expect(evaluate(required(fresh[0]).rule, [6, 7, 8, 9])).toBe(false);
    expect(evaluate(required(fresh[1]).rule, [8, 2, 10])).toBe(false);
    expect(
      evaluate(required(fresh[3]).rule, ['已知6个贝壳', '旁边石头数量未知']),
    ).toBe(false);
    const review = createSession(lesson, book().id, 'child', {
      mode: 'review',
      originalSessionId: session.id,
      questions: fresh,
    });
    expect(newReviewQuestions(lesson, session, [session, review])).toEqual([]);
    expect(JSON.stringify(session)).toBe(snapshot);
  });
});

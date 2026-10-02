import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { gridPathLength } from '../learning/grid-paths';
import { mathBooks } from './math';
import { sujiaoFirstUnitReviewDraft } from './sujiao-first-unit-review';

describe('sujiao first unit integrative draft', () => {
  it('matches the actual grid paths and arithmetic groups with changed review material', () => {
    const lesson = sujiaoFirstUnitReviewDraft;
    expect(lesson.status).toBe('preparing');
    expect(
      mathBooks.flatMap((book) =>
        book.units.flatMap((unit) => unit.lessons.map((item) => item.id)),
      ),
    ).not.toContain(lesson.id);
    for (const tasks of [lesson.questions, lesson.reviewQuestions!]) {
      const longest = tasks.find((question) =>
        question.id.endsWith('-longest'),
      )!;
      if (longest.visual?.kind !== 'grid-paths')
        throw new Error('Expected paths');
      const paths = longest.visual.paths;
      const ordered = [...paths].toSorted(
        (a, b) => gridPathLength(a.points) - gridPathLength(b.points),
      );
      expect(evaluate(longest.rule, ordered.at(-1)!.id)).toBe(true);
      expect(
        evaluate(
          tasks.find((question) => question.id.endsWith('-shortest'))!.rule,
          ordered[0]!.id,
        ),
      ).toBe(true);
      expect(
        evaluate(
          tasks.find((question) => question.id.endsWith('-bent-count'))!.rule,
          gridPathLength(paths[0]!.points),
        ),
      ).toBe(true);
      const sum = tasks.find((question) => question.id.endsWith('-sum-group'))!;
      const target = Number(sum.prompt.match(/\d/)![0]);
      const expected = sum
        .choices!.filter(
          (choice) =>
            choice.label
              .split(' + ')
              .map(Number)
              .reduce((a, b) => a + b) === target,
        )
        .map((choice) => choice.id);
      expect(evaluate(sum.rule, expected)).toBe(true);
      expect(
        evaluate(
          sum.rule,
          sum.choices!.map((choice) => choice.id),
        ),
      ).toBe(false);
      const order = tasks.find((question) => question.id.endsWith('-order'))!;
      expect(evaluate(order.rule, ['1', '2', '3', '4'])).toBe(true);
      expect(evaluate(order.rule, ['2', '1', '3', '4'])).toBe(false);
    }
    for (const [index, main] of lesson.questions
      .filter((question) => question.rule.kind !== 'manual')
      .entries()) {
      const review = lesson.reviewQuestions![index]!;
      expect(review.knowledge).toBe(main.knowledge);
      expect(
        JSON.stringify({ prompt: review.prompt, visual: review.visual }),
      ).not.toBe(JSON.stringify({ prompt: main.prompt, visual: main.visual }));
    }
  });

  it('retains the diagram snapshot and manual reflection without treating it as mastery', () => {
    const now = '2026-10-01T05:00:00.000Z';
    const session = createSession(
      sujiaoFirstUnitReviewDraft,
      'unregistered-source-draft',
      'child',
      { now, seed: 11 },
    );
    session.phase = 'practice';
    const index = session.questions.findIndex((question) =>
      question.id.endsWith('-longest'),
    );
    session.responses[index] = submitResponse(
      session.questions[index]!,
      { ...session.responses[index]!, draft: 'A' },
      now,
    );
    for (const [position, question] of session.questions.entries()) {
      const draft = (() => {
        if (question.rule.kind === 'number' || question.rule.kind === 'choice')
          return question.rule.value;
        return (() => {
          if (question.rule.kind === 'set' || question.rule.kind === 'sequence')
            return question.rule.values;
          return (() => {
            if (question.rule.kind === 'steps') return question.rule.values;
            return (() => {
              if (question.rule.kind === 'partition')
                return [1, question.rule.total - 1];
              return question.rule.kind === 'reflection'
                ? '我会摆积木算加法，还想练减法。'
                : 'confirmed';
            })();
          })();
        })();
      })();
      session.responses[position] = submitResponse(
        question,
        { ...session.responses[position]!, draft },
        now,
      );
    }
    expect(statistics(session).manual).toBe(2);
    expect(statistics(session).reflections).toBe(2);
    expect(
      session.responses[index]!.submissions.map((item) => item.correct),
    ).toEqual([false, true]);
    const json = exportBackup(
      {
        schemaVersion: 1,
        activeProfileId: 'child',
        profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
        sessions: [session],
      },
      now,
    );
    expect(parseBackup(json).data.sessions[0]).toEqual(session);
    const corrupt = JSON.parse(json);
    const diagram = corrupt.data.sessions[0].questions.find(
      (question: { visual?: { kind: string } }) =>
        question.visual?.kind === 'grid-paths',
    );
    diagram.visual.paths[0].points[0][0] = 100;
    expect(() => parseBackup(JSON.stringify(corrupt))).toThrow(Error);
  });
});

it('accepts every positive pair for the target sum and checks ordered arithmetic patterns', () => {
  for (const tasks of [
    sujiaoFirstUnitReviewDraft.questions,
    sujiaoFirstUnitReviewDraft.reviewQuestions!,
  ]) {
    const parts = tasks.find((q) => q.rule.kind === 'partition')!;
    if (parts.rule.kind !== 'partition')
      throw new Error('Expected multi-answer partition');
    for (let a = 1; a < parts.rule.total; a++) {
      expect(evaluate(parts.rule, [a, parts.rule.total - a])).toBe(true);
    }
    expect(evaluate(parts.rule, [0, parts.rule.total])).toBe(false);
    expect(evaluate(parts.rule, [1, parts.rule.total])).toBe(false);
    for (const q of tasks.filter((q) => q.rule.kind === 'steps')) {
      if (q.rule.kind !== 'steps') throw new Error('Expected pattern');
      const expressions = [...q.prompt.matchAll(/(\d+) ([+-]) (\d+)/g)];
      const values = expressions.map((m) =>
        m[2] === '+'
          ? Number(m[1]) + Number(m[3])
          : Number(m[1]) - Number(m[3]),
      );
      expect(evaluate(q.rule, values)).toBe(true);
      expect(evaluate(q.rule, [...values].toReversed())).toBe(false);
    }
    const selected = tasks.find((q) => q.id.endsWith('-same-addend'))!;
    expect(evaluate(selected.rule, ['a', 'b'])).toBe(true);
    expect(evaluate(selected.rule, ['c', 'd'])).toBe(false);
  }
});

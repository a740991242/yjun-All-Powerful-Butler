import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import {
  isQueueVisual,
  queueNeighbours,
  queuePosition,
} from '../learning/queue';
import { sujiaoNineConsolidationLesson as lesson } from './sujiao-nine-consolidation';

describe('unit 2 arithmetic organization and long queues', () => {
  it('counts people, identifies the front and applies removals without confusing rank with quantity', () => {
    for (const [review, tasks] of [
      lesson.questions,
      lesson.reviewQuestions!,
    ].entries()) {
      const total = tasks.find((q) => q.id.endsWith('-total'))!;
      const rank = tasks.find((q) => q.id.endsWith('-rank'))!;
      const changed = tasks.find((q) => q.id.endsWith('-removed'))!;
      if (total.visual?.kind !== 'queue' || changed.visual?.kind !== 'queue')
        throw new Error('Expected queue');
      expect(isQueueVisual(total.visual)).toBe(true);
      expect(total.visual.labels).toHaveLength(review ? 9 : 8);
      expect(evaluate(total.rule, review ? 9 : 8)).toBe(true);
      expect(evaluate(total.rule, review ? 10 : 9)).toBe(false);
      const target = review ? '小安' : '小星';
      expect(queuePosition(total.visual, target)).toBe(review ? 9 : 8);
      expect(evaluate(rank.rule, queuePosition(total.visual, target)!)).toBe(
        true,
      );
      expect(evaluate(changed.rule, review ? 8 : 7)).toBe(true);
      expect(evaluate(changed.rule, review ? 9 : 8)).toBe(false);
      const sides = queueNeighbours(total.visual, target)!;
      expect(sides.before + sides.after + 1).toBe(total.visual.labels.length);
      expect(
        evaluate(tasks.find((q) => q.id.endsWith('-neighbours'))!.rule, [
          sides.before,
          sides.after,
        ]),
      ).toBe(true);
      const lastRemoved = {
        ...total.visual,
        labels:
          total.visual.front === 'left'
            ? total.visual.labels.slice(0, -1)
            : total.visual.labels.slice(1),
      };
      const front = review ? '小星' : '小禾';
      expect(queuePosition(lastRemoved, front)).toBe(1);
    }
  });

  it('separates row and column sums, accepts every positive two-part sum and changes review contexts', () => {
    const objective = lesson.questions.filter((q) => q.rule.kind !== 'manual');
    expect(objective).toHaveLength(11);
    expect(lesson.reviewQuestions).toHaveLength(11);
    for (const [review, tasks] of [
      lesson.questions,
      lesson.reviewQuestions!,
    ].entries()) {
      const rows = tasks.find((q) => q.id.endsWith('-rows'))!;
      const columns = tasks.find((q) => q.id.endsWith('-columns'))!;
      expect(evaluate(rows.rule, review ? [6, 4, 6] : [6, 6, 4])).toBe(true);
      expect(evaluate(columns.rule, review ? [6, 6, 4] : [4, 6, 6])).toBe(true);
      expect(evaluate(rows.rule, review ? [6, 6, 4] : [4, 6, 6])).toBe(false);
      const sum = tasks.find((q) => q.id.endsWith('-sum'))!;
      const total = review ? 8 : 9;
      for (let first = 0; first <= total; first++) {
        expect(evaluate(sum.rule, [first, total - first])).toBe(
          first > 0 && first < total,
        );
      }
      expect(
        evaluate(tasks.find((q) => q.id.endsWith('-classify'))!.rule, [
          'a',
          'b',
        ]),
      ).toBe(true);
      expect(
        evaluate(tasks.find((q) => q.id.endsWith('-classify'))!.rule, [
          'a',
          'c',
        ]),
      ).toBe(false);
      expect(
        evaluate(
          tasks.find((q) => q.id.endsWith('-addition-pattern'))!.rule,
          review ? [4, 5, 6, 7] : [3, 4, 5, 6],
        ),
      ).toBe(true);
      expect(
        evaluate(
          tasks.find((q) => q.id.endsWith('-subtraction-pattern'))!.rule,
          review ? [7, 6, 5, 4] : [8, 7, 6, 5],
        ),
      ).toBe(true);
    }
    for (const [i, q] of objective.entries()) {
      const review = lesson.reviewQuestions![i]!;
      expect(review.knowledge).toBe(q.knowledge);
      expect(
        JSON.stringify({ prompt: review.prompt, visual: review.visual }),
      ).not.toBe(JSON.stringify({ prompt: q.prompt, visual: q.visual }));
    }
  });

  it('round-trips nine-person review snapshots and first mistakes without counting manual tasks as objective correct', () => {
    const now = '2026-10-01T10:00:00.000Z';
    const session = createSession(
      lesson,
      'sujiao-math-p1-upper-2024',
      'child',
      { now, seed: 29, mode: 'review', questions: lesson.reviewQuestions },
    );
    session.phase = 'practice';
    const index = session.questions.findIndex(
      (q) => q.visual?.kind === 'queue' && q.rule.kind === 'number',
    );
    const q = session.questions[index]!;
    session.responses[index] = submitResponse(
      q,
      { ...session.responses[index]!, draft: 0 },
      now,
    );
    for (const [i, q] of session.questions.entries()) {
      const rule = q.rule;
      const draft = (() => {
        if (rule.kind === 'number' || rule.kind === 'choice') return rule.value;
        return (() => {
          if (rule.kind === 'steps' || rule.kind === 'set') return rule.values;
          return rule.kind === 'partition' ? [1, rule.total - 1] : 'confirmed';
        })();
      })();
      session.responses[i] = submitResponse(
        q,
        { ...session.responses[i]!, draft },
        now,
      );
    }
    expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual(
      [false, true],
    );
    const data = {
      schemaVersion: 1 as const,
      activeProfileId: 'child',
      profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
      sessions: [session],
    };
    expect(parseBackup(exportBackup(data, now)).data.sessions[0]).toEqual(
      session,
    );
    const corrupt = JSON.parse(exportBackup(data, now));
    corrupt.data.sessions[0].questions[index].visual.labels = [
      ...'甲乙丙丁戊己庚辛壬癸',
    ];
    expect(() => parseBackup(JSON.stringify(corrupt))).toThrow(Error);
    const main = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
      now,
      seed: 29,
    });
    main.phase = 'practice';
    for (const [i, q] of main.questions.entries()) {
      if (q.rule.kind === 'manual')
        main.responses[i] = submitResponse(
          q,
          { ...main.responses[i]!, draft: 'confirmed' },
          now,
        );
    }
    expect(statistics(main).manual).toBe(4);
    expect(statistics(main).finalCorrect).toBe(0);
  });
});

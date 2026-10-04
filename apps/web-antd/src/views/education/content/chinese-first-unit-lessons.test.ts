import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { upperCharacters } from './characters';
import { chineseBooks } from './chinese';
import { firstChineseLesson } from './chinese-first-lesson';
import {
  firstUnitChineseLessons,
  firstUnitPageAudits,
} from './chinese-first-unit-lessons';

it('matches inspected ranges without inventing publication metadata or expanding writing scope', () => {
  expect(firstUnitPageAudits.map((audit) => audit.pages)).toEqual([
    [9, 10],
    [11, 12],
    [13, 14],
  ]);
  for (const audit of firstUnitPageAudits) {
    expect(audit.recognize).toBe(upperCharacters[audit.itemId]!.recognize);
    expect(audit.write).toBe(upperCharacters[audit.itemId]!.write);
    expect(audit.isbn).toBeNull();
    expect(audit.editionDate).toBeNull();
    expect(audit.printingDate).toBeNull();
    const lesson = firstUnitChineseLessons[audit.itemId]!;
    expect(chineseBooks[0]!.units.flatMap((unit) => unit.lessons)).toContain(
      lesson,
    );
    expect(
      lesson.questions.filter((question) => question.rule.kind === 'manual'),
    ).toHaveLength(4);
    expect(
      lesson.questions.filter(
        (question) => question.rule.kind === 'reflection',
      ),
    ).toHaveLength(1);
    expect(
      lesson.questions.find((question) =>
        question.id.endsWith('-manual-write'),
      )!.material,
    ).toBe([...audit.write].join('　'));
    expect(lesson.review.notes).toContain('第三方');
  }
});
it('preserves wrong attempts, manual evidence and reflection independently and supplies actual new review contexts', () => {
  const now = '2026-10-01T00:00:00.000Z';
  for (const lesson of Object.values(firstUnitChineseLessons)) {
    const session = createSession(lesson, chineseBooks[0]!.id, 'child', {
      seed: 12,
      now,
    });
    session.phase = 'practice';
    let missed: string | undefined;
    for (const [index, question] of session.questions.entries()) {
      if (question.rule.kind === 'choice') {
        const expected = question.rule.value;
        expect(evaluate(question.rule, question.rule.value)).toBe(true);
        for (const candidate of question.choices!)
          if (candidate.id !== question.rule.value)
            expect(evaluate(question.rule, candidate.id)).toBe(false);
        if (!missed) {
          missed = question.knowledge;
          session.responses[index] = submitResponse(
            question,
            {
              ...session.responses[index]!,
              draft: question.choices!.find((choice) => choice.id !== expected)!
                .id,
            },
            now,
          );
        }
      }
      const answer = (() => {
        if (question.rule.kind === 'choice') return question.rule.value;
        return question.rule.kind === 'manual' ? 'confirmed' : '还想练字';
      })();
      session.responses[index] = submitResponse(
        question,
        { ...session.responses[index]!, draft: answer },
        now,
      );
      if (question.rule.kind !== 'choice')
        expect(
          session.responses[index]!.submissions.at(-1)!.correct,
        ).toBeNull();
    }
    expect(statistics(session).manual).toBe(4);
    const review = newReviewQuestions(lesson, session, [session]);
    expect(review).toHaveLength(1);
    expect(review[0]!.knowledge).toBe(missed);
    for (const question of lesson.reviewQuestions!) {
      const main = lesson.questions.find(
        (original) => original.knowledge === question.knowledge,
      )!;
      expect(main.prompt).not.toBe(question.prompt);
      if (question.rule.kind !== 'choice')
        throw new Error('expected objective review');
      expect(evaluate(question.rule, question.rule.value)).toBe(true);
    }
    expect(
      parseBackup(
        exportBackup({
          schemaVersion: 1,
          activeProfileId: 'child',
          profiles: [{ id: 'child', nickname: '陪读', createdAt: now }],
          sessions: [session],
        }),
      ).data.sessions[0],
    ).toEqual(session);
  }
});

it('independently verifies all first-unit formal recognition and context answers in both practice forms', () => {
  const cases = [
    {
      lesson: firstChineseLesson,
      main: [
        '天',
        '地',
        '人',
        '你',
        '我',
        '他',
        '1',
        '2',
        '3',
        '小林',
        '爸爸',
        '弟弟',
      ],
      review: [
        '天',
        '地',
        '人',
        '你',
        '我',
        '他',
        '2',
        '3',
        '1',
        '爸爸',
        '小林',
        '哥哥',
      ],
    },
    {
      lesson: firstUnitChineseLessons['u1-2']!,
      main: [
        '一',
        '二',
        '三',
        '四',
        '五',
        '上',
        '下',
        '下面',
        '横中线',
        '竖中线',
        '横',
      ],
      review: [
        '一',
        '二',
        '三',
        '四',
        '五',
        '上',
        '下',
        '上面',
        '左右方向',
        '上下方向',
        '横',
      ],
    },
    {
      lesson: firstUnitChineseLessons['u1-3']!,
      main: [
        '口',
        '耳',
        '目',
        '手',
        '足',
        '站',
        '坐',
        '耳',
        '目',
        '手',
        '不是',
      ],
      review: [
        '口',
        '耳',
        '目',
        '手',
        '足',
        '站',
        '坐',
        '耳',
        '目',
        '手',
        '不是',
      ],
    },
    {
      lesson: firstUnitChineseLessons['u1-4']!,
      main: [
        '日',
        '月',
        '山',
        '川',
        '水',
        '火',
        '田',
        '禾',
        '日',
        '田',
        '观察形状并联系事物',
      ],
      review: [
        '日',
        '月',
        '山',
        '川',
        '水',
        '火',
        '田',
        '禾',
        '日',
        '田',
        '观察形状并联系事物',
      ],
    },
  ];
  let inspected = 0;
  for (const { lesson, main, review } of cases) {
    expect(lesson.prerequisite).toContain('不要求');
    expect(lesson.parentTip).toContain('教材');
    for (const [questions, answers] of [
      [lesson.questions, main],
      [lesson.reviewQuestions!, review],
    ] as const) {
      const objective = questions.filter((q) => q.rule.kind === 'choice');
      expect(objective).toHaveLength(answers.length);
      for (const [index, q] of objective.entries()) {
        const answer = answers[index]!;
        expect(q.rule).toEqual({ kind: 'choice', value: answer });
        expect(q.choices!.filter((c) => c.id === answer)).toHaveLength(1);
        expect(q.prompt.trim().length).toBeGreaterThan(0);
        expect(q.hint.trim().length).toBeGreaterThan(0);
        expect(q.explanation.trim().length).toBeGreaterThan(0);
        for (const choice of q.choices!)
          expect(evaluate(q.rule, choice.id)).toBe(choice.id === answer);
        inspected++;
      }
    }
  }
  expect(inspected).toBe(90);
});

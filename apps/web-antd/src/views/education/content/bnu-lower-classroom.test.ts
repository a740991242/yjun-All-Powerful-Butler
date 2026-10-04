import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { bnuLowerAncientCountLesson } from './bnu-lower';
import { bnuLowerClassroomLesson as lesson } from './bnu-lower-classroom';

it('checks all given-rule answers independently without collapsing repeated pieces into one position', () => {
  const objective = lesson.questions.filter(
    (q) => !['manual', 'reflection'].includes(q.rule.kind),
  );
  const answers = [
    2,
    '2-circle',
    '1-circle',
    6,
    '2-circle',
    '2-circle',
    '2-triangle',
    3,
    2,
    2,
    '不能，需说明规则并讨论依据',
    '听取意见后商量并明确分工',
    '各部分规则说清并检查重复',
    '不能，要看真实活动分别回顾',
    ['spring', 'summer', 'autumn', 'winter'],
    4,
    12,
  ];
  expect(objective).toHaveLength(17);
  for (const [index, q] of objective.entries()) {
    const answer = required(answers[index]);
    expect(evaluate(q.rule, answer), q.id).toBe(true);
    if (q.rule.kind === 'choice')
      for (const option of required(q.choices).filter((c) => c.id !== answer))
        expect(evaluate(q.rule, option.id), q.id).toBe(false);
  }
  const unit = required(
    lesson.questions.find((q) => q.id.endsWith('-three-unit')),
  );
  expect(evaluate(unit.rule, 2)).toBe(false);
  const types = required(
    lesson.questions.find((q) => q.id.endsWith('-three-types')),
  );
  expect(evaluate(types.rule, 3)).toBe(false);
  expect(lesson.steps).toHaveLength(7);
  expect(lesson.questions).toHaveLength(36);
});
it('uses changed starting order in all four reviews and rejects copying the old continuation', () => {
  const reviews = required(lesson.reviewQuestions);
  expect(reviews).toHaveLength(4);
  const answers = ['1-circle', '2-circle', '2-triangle', '2-circle'];
  const oldAnswers = ['2-circle', '1-circle', '2-circle', '2-triangle'];
  for (const [index, q] of reviews.entries()) {
    expect(evaluate(q.rule, required(answers[index]))).toBe(true);
    expect(evaluate(q.rule, required(oldAnswers[index]))).toBe(false);
    expect(q.visual).not.toEqual(
      lesson.questions.find((main) =>
        main.id.endsWith(index < 2 ? 'two-next-7' : 'three-next-7'),
      )?.visual,
    );
  }
});
it('keeps real design, cooperation, listening and three evaluations separate from webpage mastery', () => {
  const manual = lesson.questions.filter((q) => q.rule.kind === 'manual');
  const records = lesson.questions.filter((q) => q.rule.kind === 'reflection');
  expect(manual).toHaveLength(12);
  expect(records).toHaveLength(7);
  for (const suffix of [
    'evaluation-design',
    'evaluation-cooperate',
    'evaluation-listen',
  ]) {
    expect(
      manual.some((q) =>
        q.id.endsWith(`-actual-${suffix.replace('evaluation', 'evaluate')}`),
      ),
    ).toBe(true);
    expect(records.some((q) => q.id.endsWith(`-${suffix}`))).toBe(true);
  }
  for (const q of records)
    expect(evaluate(q.rule, '未做，准备下次尝试')).toBeNull();
  expect(lesson.steps[6]?.text).toContain('不自动打星');
  expect(lesson.parentTip).toContain('不能独自做后确认已小组合作');
});
it('preserves a pending choice and misconception/retry alongside an old lesson without confirming real cooperation', () => {
  const library = initialLibrary('装饰');
  const old = createSession(
    bnuLowerAncientCountLesson,
    'bnu-math-p1-lower-2024',
    library.activeProfileId,
  );
  const session = createSession(
    lesson,
    'bnu-math-p1-lower-2024',
    library.activeProfileId,
  );
  session.phase = 'practice';
  const index = session.questions.findIndex((q) =>
    q.id.endsWith('-two-next-7'),
  );
  required(session.responses[index]).draft = '1-circle';
  library.sessions = [old, session];
  expect(parseBackup(exportBackup(library)).data.sessions).toEqual(
    library.sessions,
  );
  session.responses[index] = submitResponse(
    required(session.questions[index]),
    required(session.responses[index]),
  );
  required(session.responses[index]).draft = '2-circle';
  session.responses[index] = submitResponse(
    required(session.questions[index]),
    required(session.responses[index]),
  );
  expect(
    required(session.responses[index]).submissions.map((s) => s.correct),
  ).toEqual([false, true]);
  expect(statistics(session).manual).toBe(0);
  expect(parseBackup(exportBackup(library)).data.sessions).toEqual(
    library.sessions,
  );
});

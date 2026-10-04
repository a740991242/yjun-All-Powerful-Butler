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
import { bnuLowerComplementLesson } from './bnu-lower-complement';
import { bnuLowerMeetingLesson as lesson } from './bnu-lower-meeting';
import { bnuLowerMeetingAudit as audit } from './bnu-lower-meeting-audit';

const q = (suffix: string) =>
  required(
    lesson.questions.find((item) => item.id === `${lesson.id}-${suffix}`),
  );
it('independently checks all source quantities, relations, eight calculations and both complete rows', () => {
  const answers = [
    11,
    7,
    4,
    7,
    [11, 7, 4],
    '先约定类别，再逐个数',
    4,
    4,
    11,
    '已有7把椅子',
    0,
    0,
    3,
    '不能，还需总需条件',
    12,
    6,
    6,
    '还差6把',
    12,
    7,
    5,
    12,
    4,
    5,
    6,
    9,
    9,
    6,
    3,
    8,
    [2, 6, 10, 4],
    [2, 2, 4],
    [5, 10],
    [6, 7, 8, 9, 10, 11],
    [4, 5, 6, 7, 8, 9],
    '各表自己的减数',
    '少1',
  ];
  const objective = lesson.questions.filter(
    (item) => !['manual', 'reflection'].includes(item.rule.kind),
  );
  expect(objective).toHaveLength(37);
  for (const [i, item] of objective.entries())
    expect(evaluate(item.rule, required(answers[i])), item.id).toBe(true);
  expect(lesson.steps).toHaveLength(9);
  expect(lesson.questions).toHaveLength(51);
  expect(evaluate(q('missing').rule, 18)).toBe(false);
  expect(evaluate(q('full-chairs').rule, 4)).toBe(false);
  expect(evaluate(q('shovel-missing').rule, 12)).toBe(false);
  expect(evaluate(q('apple-after').rule, 5)).toBe(false);
  expect(evaluate(q('symbols').rule, '圆固定代表十人')).toBe(false);
  expect(evaluate(q('parts').rule, [2, 2, 10, 4])).toBe(false);
  expect(evaluate(q('table-six').rule, [5, 6, 7, 8, 9, 10])).toBe(false);
  expect(evaluate(q('table-seven').rule, [5, 6, 7, 8, 9, 10])).toBe(false);
  expect(q('table-six').prompt).toContain('六个待填');
  expect(q('table-seven').prompt).toContain('六个待填');
});
it('distinguishes sufficient zero, spare quantity, missing conditions and an independently authored question', () => {
  expect(evaluate(q('zero-missing').rule, 0)).toBe(true);
  expect(evaluate(q('extra-missing').rule, 0)).toBe(true);
  expect(evaluate(q('extra-spare').rule, 3)).toBe(true);
  expect(() => evaluate(q('zero-missing').rule, null)).toThrow(
    'educationLearning.answerRequired',
  );
  expect(evaluate(q('extra-missing').rule, -3)).toBe(false);
  expect(evaluate(q('unknown').rule, '能，未知就填0')).toBe(false);
  expect(q('own-question').prompt).toContain('不限本站示例');
  expect(
    lesson.questions.filter((item) => item.rule.kind === 'manual'),
  ).toHaveLength(10);
  expect(
    lesson.questions.filter((item) => item.rule.kind === 'reflection'),
  ).toHaveLength(4);
  for (const item of lesson.questions.filter((item) =>
    ['manual', 'reflection'].includes(item.rule.kind),
  ))
    expect(
      evaluate(
        item.rule,
        item.rule.kind === 'manual'
          ? 'confirmed'
          : '尚未实际尝试，下次计划另记',
      ),
    ).toBeNull();
});
it('changes each review condition rather than repeating main prompts and rejects copied row and apple values', () => {
  const review = required(lesson.reviewQuestions);
  const answers = [[5, 5], 0, 5, [7, 8, 9, 10, 11], [3, 11]];
  expect(review).toHaveLength(5);
  for (const [i, item] of review.entries()) {
    expect(evaluate(item.rule, required(answers[i])), item.id).toBe(true);
    expect(
      lesson.questions.some(
        (main) => main.id === item.id || main.prompt === item.prompt,
      ),
    ).toBe(false);
  }
  expect(evaluate(required(review[0]).rule, [4, 4])).toBe(false);
  expect(evaluate(required(review[2]).rule, 6)).toBe(false);
  expect(evaluate(required(review[3]).rule, [6, 7, 8, 9, 10])).toBe(false);
  expect(evaluate(required(review[4]).rule, [5, 12])).toBe(false);
});
it('backs up a partial six-place row and real zero with retry history and the unchanged earlier lesson snapshot', () => {
  const library = initialLibrary('开会');
  const old = createSession(
    bnuLowerComplementLesson,
    'bnu-math-p1-lower-2024',
    library.activeProfileId,
  );
  const snapshot = JSON.parse(JSON.stringify(old));
  const session = createSession(
    lesson,
    'bnu-math-p1-lower-2024',
    library.activeProfileId,
  );
  session.phase = 'practice';
  library.sessions = [old, session];
  const i = session.questions.findIndex(
    (item) => item.id === `${lesson.id}-table-six`,
  );
  required(session.responses[i]).draft = [6, null, null, null, null, null];
  const zero = session.responses.find(
    (item) => item.questionId === `${lesson.id}-zero-missing`,
  );
  required(zero).draft = 0;
  expect(parseBackup(exportBackup(library)).data.sessions).toEqual(
    library.sessions,
  );
  required(session.responses[i]).draft = [5, 6, 7, 8, 9, 10];
  session.responses[i] = submitResponse(
    required(session.questions[i]),
    required(session.responses[i]),
  );
  required(session.responses[i]).draft = [6, 7, 8, 9, 10, 11];
  session.responses[i] = submitResponse(
    required(session.questions[i]),
    required(session.responses[i]),
  );
  expect(
    required(session.responses[i]).submissions.map((item) => item.correct),
  ).toEqual([false, true]);
  expect(statistics(session).manual).toBe(0);
  const restored = parseBackup(exportBackup(library)).data;
  expect(restored.sessions).toEqual(library.sessions);
  expect(restored.sessions[0]).toEqual(snapshot);
});
it('maps every main task to the original three and six page activities without claiming later pages', () => {
  const represented = new Set<string>();
  expect(audit.activities).toHaveLength(9);
  expect(audit.activities.filter((item) => item.page === 33)).toHaveLength(3);
  expect(audit.activities.filter((item) => item.page === 34)).toHaveLength(6);
  for (const item of audit.activities) {
    expect(item.lesson).toBe(lesson.id);
    for (const n of item.steps) expect(lesson.steps[n - 1]).toBeDefined();
    for (const [kind, ids] of [
      ['objective', item.objective],
      ['manual', item.manual],
      ['reflection', item.records],
    ] as const)
      for (const suffix of ids) {
        const current = q(suffix);
        expect(
          kind === 'objective'
            ? !['manual', 'reflection'].includes(current.rule.kind)
            : current.rule.kind === kind,
        ).toBe(true);
        represented.add(current.id);
      }
  }
  expect([...represented].toSorted()).toEqual(
    lesson.questions.map((item) => item.id).toSorted(),
  );
  expect(audit.scope).toContain('35页起仍制作中');
});

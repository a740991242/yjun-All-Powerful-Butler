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
import { bnuLowerMeetingLesson } from './bnu-lower-meeting';
import {
  bnuParachuteMail,
  bnuLowerParachuteLesson as lesson,
} from './bnu-lower-parachute';
import { bnuLowerParachuteAudit as audit } from './bnu-lower-parachute-audit';

const q = (suffix: string) =>
  required(
    lesson.questions.find((item) => item.id === `${lesson.id}-${suffix}`),
  );
it('independently checks every source count, comparison direction, twelve cards and all complete groups', () => {
  const answers = [
    14,
    6,
    7,
    [14, 6, 8],
    [14, 7, 7],
    '红比蓝多7个',
    0,
    [11, 8, 3],
    [13, 6, 7],
    '第一排比第二排多3本',
    [11, 5, 6],
    '昨天与今天各自下蛋数',
    [9, 9, 9],
    '原数和减数都加1',
    [5, 6, 7],
    [9, 0],
    '摘16个的人',
    9,
    [5, 14, 15],
    9,
    10,
    8,
    9,
    7,
    9,
    6,
    7,
    8,
    9,
    8,
    9,
    7,
    8,
    ['卡5'],
    ['卡3', '卡6', '卡11'],
    ['卡1', '卡7', '卡9', '卡12'],
    ['卡2', '卡4', '卡8', '卡10'],
    1,
    '女生比男生多1人',
    17,
    '不能，还需每组数量',
    '含义不同，不能直接当同一个量',
  ];
  const objective = lesson.questions.filter(
    (item) => !['manual', 'reflection'].includes(item.rule.kind),
  );
  expect(objective).toHaveLength(42);
  expect(answers).toHaveLength(42);
  for (const [i, item] of objective.entries())
    expect(evaluate(item.rule, required(answers[i])), item.id).toBe(true);
  expect(lesson.questions).toHaveLength(57);
  expect(lesson.steps).toHaveLength(9);
  expect(evaluate(q('red-yellow').rule, [14, 6, 20])).toBe(false);
  expect(evaluate(q('red-blue').rule, [7, 14, 7])).toBe(false);
  expect(evaluate(q('egg-meaning').rule, '鸡棚里鸡的只数')).toBe(false);
  expect(evaluate(q('books').rule, [11, 8, 19])).toBe(false);
  expect(evaluate(q('shapes').rule, [6, 14, 15])).toBe(false);
  expect(evaluate(q('group-8').rule, ['卡1'])).toBe(false);
  expect(
    evaluate(q('group-9').rule, ['卡2', '卡4', '卡8', '卡10', '卡12']),
  ).toBe(false);
  expect(bnuParachuteMail).toEqual([
    [11, 3, 8],
    [11, 2, 9],
    [11, 4, 7],
    [15, 6, 9],
    [12, 6, 6],
    [15, 8, 7],
    [15, 7, 8],
    [13, 4, 9],
    [13, 5, 8],
    [12, 3, 9],
    [16, 9, 7],
    [12, 4, 8],
  ]);
});
it('accepts every legal free difference in the explicit site range, with equal groups and zero separate from unknown', () => {
  for (const [rule, difference] of [
    [q('free-difference').rule, 9],
    [required(lesson.reviewQuestions?.[2]).rule, 7],
  ] as const)
    for (let a = 0; a <= 20; a++)
      for (let b = 0; b <= 20; b++)
        expect(evaluate(rule, [a, b]), `${difference}/${a}/${b}`).toBe(
          a - b === difference,
        );
  expect(evaluate(q('free-difference').rule, [9, 0])).toBe(true);
  expect(evaluate(q('free-difference').rule, [20, 11])).toBe(true);
  expect(evaluate(q('free-difference').rule, [21, 12])).toBe(false);
  expect(evaluate(q('zero-difference').rule, 0)).toBe(true);
  expect(() => evaluate(q('zero-difference').rule, null)).toThrow(
    'educationLearning.answerRequired',
  );
  expect(evaluate(q('unknown').rule, '能，未知就填0')).toBe(false);
  expect(q('own-formulas').prompt).toContain('不限本站');
  expect(lesson.parentTip).toContain('不将本站明示女生9男生8冒原图已核准分组');
  expect(q('original-children').rule.kind).toBe('reflection');
  expect(
    lesson.questions.filter((item) => item.rule.kind === 'manual'),
  ).toHaveLength(10);
  expect(
    lesson.questions.filter((item) => item.rule.kind === 'reflection'),
  ).toHaveLength(5);
  for (const item of lesson.questions.filter((item) =>
    ['manual', 'reflection'].includes(item.rule.kind),
  ))
    expect(
      evaluate(
        item.rule,
        item.rule.kind === 'manual'
          ? 'confirmed'
          : '原分组尚未确定，记录待核对，未来再尝试',
      ),
    ).toBeNull();
});
it('changes review numbers, target difference, card set and explicit groups instead of reusing the main answers', () => {
  const review = required(lesson.reviewQuestions);
  const answers = [4, [14, 8, 6], [7, 0], ['卡4'], 4];
  expect(review).toHaveLength(5);
  for (const [i, item] of review.entries()) {
    expect(evaluate(item.rule, required(answers[i])), item.id).toBe(true);
    expect(
      lesson.questions.some(
        (main) => main.id === item.id || main.prompt === item.prompt,
      ),
    ).toBe(false);
  }
  expect(evaluate(required(review[0]).rule, 8)).toBe(false);
  expect(evaluate(required(review[1]).rule, [11, 5, 6])).toBe(false);
  expect(evaluate(required(review[2]).rule, [9, 0])).toBe(false);
  expect(evaluate(required(review[3]).rule, ['卡3', '卡6', '卡11'])).toBe(
    false,
  );
  expect(evaluate(required(review[4]).rule, 1)).toBe(false);
});
it('backs up a partial subtraction pair and true zero, preserving boundary retries and the earlier complete snapshot', () => {
  const library = initialLibrary('比较');
  const old = createSession(
    bnuLowerMeetingLesson,
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
    (item) => item.id === `${lesson.id}-free-difference`,
  );
  required(session.responses[i]).draft = [9, null];
  required(
    session.responses.find(
      (item) => item.questionId === `${lesson.id}-zero-difference`,
    ),
  ).draft = 0;
  expect(parseBackup(exportBackup(library)).data.sessions).toEqual(
    library.sessions,
  );
  required(session.responses[i]).draft = [14, 6];
  session.responses[i] = submitResponse(
    required(session.questions[i]),
    required(session.responses[i]),
  );
  required(session.responses[i]).draft = [20, 11];
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
it('maps all tasks to ten source activities and preserves the unresolved original role classification honestly', () => {
  const represented = new Set<string>();
  expect(audit.activities).toHaveLength(10);
  expect(audit.activities.filter((item) => item.page === 35)).toHaveLength(2);
  expect(audit.activities.filter((item) => item.page === 36)).toHaveLength(3);
  expect(audit.activities.filter((item) => item.page === 37)).toHaveLength(5);
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
  expect(audit.scope).toContain('不冒自动核准');
  expect(audit.scope).toContain('38页起仍制作中');
});

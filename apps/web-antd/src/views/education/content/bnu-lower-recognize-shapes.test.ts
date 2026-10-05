import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { isPlaneCardsVisual } from '../learning/plane-cards';
import { required } from '../learning/required';
import { newReviewQuestions } from '../learning/review';
import { bnuSchoolLesson, bnuUpperBook } from './bnu';
import { bnuLowerBook } from './bnu-lower';
import {
  bnuRecognizeFirstCards,
  bnuRecognizeLastCards,
  bnuRecognizeTrainParts,
  bnuRecognizeWheels,
  bnuLowerRecognizeShapesLesson as lesson,
} from './bnu-lower-recognize-shapes';
import { bnuLowerRecognizeShapesSource as source } from './bnu-lower-recognize-shapes-source';
import { bnuLowerUnitSixAudit as audit } from './bnu-lower-unit-six-audit';

const question = (suffix: string) =>
  required(lesson.questions.find((x) => x.id === `${lesson.id}-${suffix}`));

it('covers all eleven category positions using two legal diagrams rather than widening the ten-card contract', () => {
  expect(lesson.steps).toHaveLength(10);
  expect(lesson.questions).toHaveLength(43);
  expect(
    [...bnuRecognizeFirstCards.cards, ...bnuRecognizeLastCards.cards].map(
      (x) => x.shape,
    ),
  ).toEqual([
    'rectangle',
    'triangle',
    'circle',
    'square',
    'circle',
    'square',
    'triangle',
    'rectangle',
    'rectangle',
    'triangle',
    'square',
  ]);
  const answers = [
    'rectangle',
    'triangle',
    'circle',
    'square',
    'circle',
    'square',
    'triangle',
    'rectangle',
    'rectangle',
    'triangle',
    'square',
  ];
  answers.forEach((value, index) => {
    expect(evaluate(question(`row-${index + 1}`).rule, value)).toBe(true);
    expect(
      evaluate(
        question(`row-${index + 1}`).rule,
        value === 'square' ? 'rectangle' : 'square',
      ),
    ).toBe(false);
  });
  for (const visual of [
    bnuRecognizeFirstCards,
    bnuRecognizeLastCards,
    bnuRecognizeTrainParts,
    bnuRecognizeWheels,
  ])
    expect(isPlaneCardsVisual(visual)).toBe(true);
  expect(
    isPlaneCardsVisual({
      kind: 'plane-cards',
      cards: [...bnuRecognizeFirstCards.cards, ...bnuRecognizeLastCards.cards],
    }),
  ).toBe(false);
  expect(evaluate(question('row-count-square').rule, 3)).toBe(true);
  expect(evaluate(question('row-count-rectangle').rule, 6)).toBe(false);
  expect(required(lesson.steps[3]).text).toContain('第11图斜放是正方形');
});

it('keeps four given colors and counts each confirmed train component once without treating open lines as shapes', () => {
  for (const [shape, color] of [
    ['triangle', 'red'],
    ['circle', 'green'],
    ['rectangle', 'blue'],
    ['square', 'yellow'],
  ] as const) {
    expect(evaluate(question(`color-${shape}`).rule, color)).toBe(true);
    expect(evaluate(question(`color-${shape}`).rule, 'personal-choice')).toBe(
      false,
    );
  }
  for (const [shape, count] of [
    ['square', 1],
    ['triangle', 1],
    ['rectangle', 5],
    ['circle', 8],
  ] as const) {
    expect(evaluate(question(`train-${shape}`).rule, count)).toBe(true);
    const cards =
      shape === 'circle'
        ? bnuRecognizeWheels.cards
        : bnuRecognizeTrainParts.cards;
    expect(cards.filter((x) => x.shape === shape)).toHaveLength(count);
  }
  expect(evaluate(question('train-rectangle').rule, 6)).toBe(false);
  expect(evaluate(question('train-circle').rule, 11)).toBe(false);
  expect(evaluate(question('site-zero').rule, 0)).toBe(true);
  expect(() => evaluate(question('site-zero').rule, null)).toThrow(
    'educationLearning.answerRequired',
  );
  expect(required(lesson.steps[6]).text).toContain('不补造分割线');
  expect(required(lesson.steps[7]).text).toContain('不是原图所有白色区域总数');
  expect(required(lesson.steps[8]).text).toContain('不从烟囱名称强猜长方形');
});

it('preserves ten real activities and three open records without objective grades or completed plans', () => {
  const manual = lesson.questions.filter((x) => x.rule.kind === 'manual');
  const records = lesson.questions.filter((x) => x.rule.kind === 'reflection');
  expect(manual.map((x) => x.id.slice(lesson.id.length + 1))).toEqual([
    'actual-footprint',
    'actual-four-traces',
    'actual-eleven',
    'actual-turn',
    'actual-predict',
    'actual-trace-check',
    'actual-boat',
    'actual-rocket',
    'actual-train',
    'actual-share',
  ]);
  expect(records).toHaveLength(3);
  manual.forEach((x) => expect(evaluate(x.rule, 'confirmed')).toBeNull());
  records.forEach((x) => expect(evaluate(x.rule, '未做；下次试')).toBeNull());
  expect(lesson.parentTip).toContain('不复制原书比例');
});

it('restores zero drafts, wrong-then-right category attempts and unchanged historical upper records in schema one', () => {
  const now = '2026-10-05T01:00:00.000Z';
  const old = createSession(bnuSchoolLesson, bnuUpperBook.id, 'child', {
    seed: 1,
    now,
  });
  const oldSnapshot = JSON.parse(JSON.stringify(old));
  const session = createSession(lesson, bnuLowerBook.id, 'child', {
    seed: 2,
    now,
  });
  const index = session.questions.findIndex((x) => x.id.endsWith('-row-11'));
  const item = required(session.questions[index]);
  let response = required(session.responses[index]);
  response.draft = 'rectangle';
  response = submitResponse(item, response, now);
  response.draft = 'square';
  session.responses[index] = submitResponse(item, response, now);
  expect(
    required(session.responses[index]).submissions.map((x) => x.correct),
  ).toEqual([false, true]);
  required(
    session.responses.find((x) => x.questionId.endsWith('-site-zero')),
  ).draft = 0;
  const data = {
    schemaVersion: 1 as const,
    profiles: [{ id: 'child', nickname: '测试', createdAt: now }],
    activeProfileId: 'child',
    sessions: [old, session],
  };
  const restored = parseBackup(exportBackup(data, now)).data;
  expect(restored).toEqual(JSON.parse(JSON.stringify(data)));
  expect(restored.sessions[0]).toEqual(oldSnapshot);
  expect(restored.sessions[1]?.lessonVersion).toBe(1);
});

it('offers all eight changed-condition reviews after a real mistake and does not replay already seen reviews', () => {
  const now = '2026-10-05T01:00:00.000Z';
  const session = createSession(lesson, bnuLowerBook.id, 'child', {
    seed: 3,
    now,
  });
  const index = session.questions.findIndex((x) => x.id.endsWith('-row-11'));
  const response = required(session.responses[index]);
  response.draft = 'rectangle';
  session.responses[index] = submitResponse(
    required(session.questions[index]),
    response,
    now,
  );
  const available = newReviewQuestions(lesson, session, [session]);
  expect(available).toHaveLength(8);
  const answers = [
    'triangle',
    'rectangle',
    'circle',
    'square',
    2,
    2,
    '不能，需要重新预测和验证',
    '不必须，自由配色与原指定任务不同',
  ];
  available.forEach((x, i) =>
    expect(evaluate(x.rule, required(answers[i]))).toBe(true),
  );
  expect(
    available.every(
      (x) =>
        !lesson.questions.some(
          (original) => original.id === x.id || original.prompt === x.prompt,
        ),
    ),
  ).toBe(true);
  const seen = { ...session, id: 'seen-review', questions: available };
  expect(newReviewQuestions(lesson, session, [session, seen])).toHaveLength(0);
});

it('maps every read-page activity to actual steps and task kinds while keeping all remaining unit pages pending', () => {
  expect(audit.status).toBe('partial-original-teaching');
  expect(audit.finalTeacherReview).toBe('not-verified');
  expect(
    audit.activities
      .filter((x) => x.lesson === lesson.id)
      .map((x) => [x.page, x.sourceActivity]),
  ).toEqual(source.activities.map((x) => [x.page, x.key]));
  const kinds = new Map(
    lesson.questions.map((x) => [
      x.id.slice(lesson.id.length + 1),
      x.rule.kind,
    ]),
  );
  for (const activity of audit.activities.filter(
    (x) => x.lesson === lesson.id,
  )) {
    expect(activity.lesson).toBe(lesson.id);
    for (const step of activity.steps)
      expect(lesson.steps[step - 1]).toBeDefined();
    for (const suffix of activity.objective)
      expect(['choice', 'number']).toContain(kinds.get(suffix));
    for (const suffix of activity.manual)
      expect(kinds.get(suffix)).toBe('manual');
    for (const suffix of activity.records)
      expect(kinds.get(suffix)).toBe('reflection');
  }
  expect(audit.pendingPrintedPages).toEqual([84, 85, 86]);
  expect(
    bnuLowerBook.units
      .find((x) => x.id === 'u6')
      ?.lessons.map((x) => [x.id, x.status, x.page]),
  ).toEqual([
    [lesson.id, 'available', 76],
    ['bnu-lower-fold-one', 'available', 78],
    ['bnu-lower-tangram-recognize', 'available', 80],
    ['bnu-lower-tangram-patterns', 'available', 81],
    ['bnu-lower-tangram-practice', 'available', 82],
    ['bnu-lower-patterns', 'available', 83],
    ['bnu-lower-u6-pending', 'preparing', 84],
  ]);
});

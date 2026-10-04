import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { bnuLowerCountBeansLesson } from './bnu-lower-count-beans';
import { bnuLowerRedFruitLesson as lesson } from './bnu-lower-red-fruit';
import { bnuLowerRedFruitAudit as audit } from './bnu-lower-red-fruit-audit';
import { bnuLowerRedFruitSource as source } from './bnu-lower-red-fruit-source';

const q = (suffix: string) =>
  required(lesson.questions.find((x) => x.id === `${lesson.id}-${suffix}`));
it('independently checks every fixed comparison, numeral, method and complete card set', () => {
  const answers: [string, Answer][] = [
    ['story-counts', [21, 18]],
    ['count-up', [19, 20, 21]],
    ['benchmark', '21比20多，18不到20'],
    ['larger-fruit', 21],
    ['decorations', '不能，图中装饰不是新增给定数量'],
    ['do-read', [21, 18]],
    ['do-sign', '>'],
    ['same-representations', '不相加，是同一个21的两种表示'],
    ['write-read', [32, 34, 100, 99]],
    ['write-thirties', '<'],
    ['write-hundred', '>'],
    ['hundred-beads', 1],
    ['ninety-nine-beads', 18],
    ['bead-comparison', '不能，要按数位表示的数比较'],
    ['same-tens', '看个位的2与4'],
    ['ruler-ticks', [35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]],
    ['ruler-nontick', '能，46大于45，不要求是刻度标数'],
    ['ruler-direction', '从小到大'],
    ['practice-read', [45, 54, 79, 80, 100, 89]],
    ['practice-forty', '<'],
    ['practice-seventy', '<'],
    ['practice-last', '>'],
    ['practice-eighty-ones', 0],
    ['open-equal', '不能，相等不满足小于'],
    ['open-original-range', '101符合原大小关系，但超出本次网页范围'],
    ['connect-less', ['8', '29', '59', '55', '17']],
    ['connect-greater', ['73', '62', '100', '86']],
    ['equal-sixty', '两边都不能，60等于60'],
    ['all-card-count', 9],
  ];
  const ticks = q('ruler-ticks').rule;
  expect(ticks.kind).toBe('steps');
  if (ticks.kind === 'steps') expect(ticks.values).toHaveLength(14);
  expect(answers).toHaveLength(29);
  for (const [suffix, answer] of answers)
    expect(evaluate(q(suffix).rule, answer), suffix).toBe(true);
  const wrong: [string, Answer][] = [
    ['story-counts', [18, 21]],
    ['do-read', [3, 9]],
    ['same-representations', '相加，两幅图就42'],
    ['write-hundred', '<'],
    ['hundred-beads', 100],
    ['ninety-nine-beads', 99],
    ['practice-read', [45, 54, 79, 80, 100, 99]],
    ['practice-seventy', '>'],
    ['connect-less', ['8', '29', '59', '55']],
    ['connect-less', ['8', '29', '59', '55', '17', '62']],
    ['connect-greater', ['73', '62', '100', '86', '86']],
  ];
  for (const [suffix, answer] of wrong)
    expect(evaluate(q(suffix).rule, answer)).toBe(false);
});
it('accepts every integer satisfying each original strict comparison within the explicit website range', () => {
  const conditions: [string, (n: number) => boolean][] = [
    ['ruler-above45', (n) => n > 45],
    ['ruler-below90', (n) => n < 90],
    ['open-above15', (n) => n > 15],
    ['open-above89', (n) => n > 89],
    ['open-below30', (n) => n < 30],
    ['open-below80', (n) => n < 80],
  ];
  for (const [suffix, condition] of conditions) {
    expect(q(suffix).rule.kind).toBe('number-interval');
    expect(q(suffix).prompt).toContain('0～100的整数');
    for (let n = -1; n <= 101; n++)
      expect(evaluate(q(suffix).rule, n), `${suffix}:${n}`).toBe(
        n >= 0 && n <= 100 && condition(n),
      );
    expect(() => evaluate(q(suffix).rule, null)).toThrow(
      'educationLearning.answerRequired',
    );
    expect(() => evaluate(q(suffix).rule, '0')).toThrow(
      'educationLearning.answerRequired',
    );
  }
  expect(evaluate(q('ruler-above45').rule, 46)).toBe(true);
  expect(evaluate(q('open-above89').rule, 100)).toBe(true);
  expect(evaluate(q('open-below30').rule, 0)).toBe(true);
  expect(evaluate(q('open-below80').rule, 80)).toBe(false);
});
it('maps all fifty-one tasks to all seven original activities and separates actual actions from records and plans', () => {
  expect(lesson.steps).toHaveLength(8);
  expect(lesson.questions).toHaveLength(51);
  expect(audit.activities.map((x) => [x.page, x.sourceActivity])).toEqual(
    source.activities.map((x) => [x.page, x.key]),
  );
  const covered: string[] = [];
  for (const a of audit.activities) {
    for (const step of a.steps) expect(lesson.steps[step - 1]).toBeDefined();
    for (const [kind, suffixes] of [
      ['objective', a.objective],
      ['manual', a.manual],
      ['reflection', a.records],
    ] as const)
      for (const suffix of suffixes) {
        const task = q(suffix);
        expect(
          kind === 'objective'
            ? !['manual', 'reflection'].includes(task.rule.kind)
            : task.rule.kind === kind,
        ).toBe(true);
        covered.push(task.id);
      }
  }
  expect(covered.toSorted()).toEqual(
    lesson.questions.map((x) => x.id).toSorted(),
  );
  const actual = lesson.questions.filter((x) => x.rule.kind === 'manual');
  const records = lesson.questions.filter((x) => x.rule.kind === 'reflection');
  expect(actual).toHaveLength(12);
  expect(records).toHaveLength(4);
  for (const task of actual)
    expect(evaluate(task.rule, 'confirmed')).toBeNull();
  for (const task of records)
    expect(evaluate(task.rule, '尚未做，准备另记')).toBeNull();
});
it('changes all review conditions, includes equal-sixty exclusion and preserves strict numeric drafts and old snapshots', () => {
  const reviews = required(lesson.reviewQuestions);
  const answers: Answer[] = ['<', 100, 0, ['0', '59'], ['61', '99']];
  expect(reviews).toHaveLength(5);
  for (const [index, task] of reviews.entries()) {
    expect(evaluate(task.rule, required(answers[index]))).toBe(true);
    expect(
      lesson.questions.some(
        (old) => old.id === task.id || old.prompt === task.prompt,
      ),
    ).toBe(false);
  }
  expect(evaluate(reviews[3]!.rule, ['0', '59', '60'])).toBe(false);
  expect(evaluate(reviews[4]!.rule, ['61', '99', '60'])).toBe(false);
  const library = initialLibrary('红果比较');
  const old = createSession(
    bnuLowerCountBeansLesson,
    'bnu-math-p1-lower-2024',
    library.activeProfileId,
  );
  const snapshot = structuredClone(old);
  const session = createSession(
    lesson,
    'bnu-math-p1-lower-2024',
    library.activeProfileId,
  );
  library.sessions = [old, session];
  const index = session.questions.findIndex((x) =>
    x.id.endsWith('-open-below30'),
  );
  const question = required(session.questions[index]);
  for (const draft of [30, 0, 29])
    session.responses[index] = submitResponse(question, {
      ...required(session.responses[index]),
      draft,
    });
  expect(session.responses[index]!.submissions.map((x) => x.correct)).toEqual([
    false,
    true,
    true,
  ]);
  session.responses[index]!.draft = 0;
  const restored = parseBackup(exportBackup(library)).data;
  expect(restored.sessions[0]).toEqual(snapshot);
  expect(restored.sessions[1]).toEqual(session);
  for (const draft of ['0', [0], 0.5, 100_001]) {
    const bad = JSON.parse(exportBackup(library));
    bad.data.sessions[1].responses[index].draft = draft;
    expect(() => parseBackup(JSON.stringify(bad))).toThrow(
      'educationLearning.invalidBackup',
    );
  }
  const bad = JSON.parse(exportBackup(library));
  bad.data.sessions[1].questions[index].rule.answer = 0;
  expect(() => parseBackup(JSON.stringify(bad))).toThrow(
    'educationLearning.invalidBackup',
  );
});

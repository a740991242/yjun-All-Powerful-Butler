import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  hundredWeatherRows,
  isBnuHundredWeatherVisual,
} from '../learning/bnu-hundred-weather';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { exchangePlaceValue, placeValue } from '../learning/place-value';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { bnuLowerAroundNumbersLesson } from './bnu-lower-around-numbers';
import { bnuLowerCountHundredLesson as lesson } from './bnu-lower-count-hundred';
import { bnuLowerCountHundredAudit as audit } from './bnu-lower-count-hundred-audit';
import { bnuLowerCountHundredSource as source } from './bnu-lower-count-hundred-source';
const q = (suffix: string) =>
  required(
    lesson.questions.find((item) => item.id === `${lesson.id}-${suffix}`),
  );
it('independently checks all original quantities and every complete counting path to one hundred', () => {
  const answers: [string, number | number[] | string][] = [
    ['eggs-parts', [9, 9, 1, 100]],
    ['eggs-right', 100],
    ['empty-tray', '不能，盒格不是鸡蛋'],
    ['sticks-parts', [9, 10, 100]],
    ['make-ten', [10, 0, 100]],
    ['bundle-keeps', '没有，仍十根，只改捆法'],
    ['source-total', 100],
    ['hundred-parts', [10, 1, 100]],
    ['after-ninety-nine', 100],
    ['zero-ones', 0],
    ['bundle-unit', '1大捆表示100根，不是1根'],
    ['seventy-four-parts', [7, 4, 74]],
    ['count-first', [75, 76, 77, 78, 79, 80, 81, 82, 83, 84]],
    ['count-middle', [85, 86, 87, 88, 89, 90, 91, 92, 93, 94]],
    ['count-last', [95, 96, 97, 98, 99, 100]],
    ['tens-path', [84, 94, 95, 96, 97, 98, 99, 100]],
    ['no-overshoot', '不能，添十是104，需处理最后六个一'],
    ['down-sequence', [50, 40, 30, 20, 10, 0]],
    ['up-sequence', [62, 72, 82, 92]],
    ['directions', '一条每次少十，一条每次多十'],
    ['practice-sticks', [6, 7, 67]],
    ['practice-blocks', [8, 8, 88]],
    ['from-sixty-seven', [77, 87, 97, 98, 99, 100]],
    ['from-eighty-eight', [98, 99, 100]],
    ['weather-sunny-rows', [10, 0, 3, 7, 4, 6, 5]],
    ['weather-cloudy-rows', [0, 10, 7, 3, 6, 4, 5]],
    ['weather-total', [35, 35, 70]],
    ['whole-icon', '不能，整格只是一项记录'],
    ['month', '不能这样推断，图未说明是一自然月'],
    ['unknown-weather', '不能，新记录数量未知'],
    ['zero-no-cloud', 0],
    ['keeps-quantity', '仍100根，表示方式改变'],
  ];
  expect(answers).toHaveLength(32);
  for (const [suffix, answer] of answers)
    expect(evaluate(q(suffix).rule, answer), suffix).toBe(true);
  const path = ['count-first', 'count-middle', 'count-last'].flatMap(
    (suffix) => {
      const rule = q(suffix).rule;
      if (rule.kind !== 'steps') throw new Error('Expected counting steps');
      return rule.values;
    },
  );
  expect(path).toEqual(Array.from({ length: 26 }, (_, i) => 75 + i));
  const incorrect: [string, number | number[]][] = [
    ['sticks-parts', [9, 9, 99]],
    ['source-total', 99],
    ['tens-path', [84, 94, 104, 105, 106, 107, 108, 109]],
    ['from-sixty-seven', [77, 87, 97, 107, 108, 109]],
    ['weather-total', [70, 35, 105]],
    ['count-first', [74, 75, 76, 77, 78, 79, 80, 81, 82, 83]],
  ];
  for (const [suffix, answer] of incorrect)
    expect(evaluate(q(suffix).rule, answer)).toBe(false);
  expect(() => evaluate(q('zero-ones').rule, null)).toThrow(
    'educationLearning.answerRequired',
  );
});
it('counts every fixed weather cell independently and rejects extra or unknown diagram fields', () => {
  expect(hundredWeatherRows('main')).toEqual(source.weather.rows);
  expect(
    hundredWeatherRows('main').map(
      (row) => [...row].filter((x) => x === 'S').length,
    ),
  ).toEqual([10, 0, 3, 7, 4, 6, 5]);
  expect(
    hundredWeatherRows('review').map(
      (row) => [...row].filter((x) => x === 'S').length,
    ),
  ).toEqual([2, 4, 2, 4]);
  for (const [variant, rows, columns, sunny, cloudy] of [
    ['main', 7, 10, 35, 35],
    ['review', 4, 5, 12, 8],
  ] as const) {
    expect(
      isBnuHundredWeatherVisual({ kind: 'bnu-hundred-weather', variant }),
    ).toBe(true);
    const data = hundredWeatherRows(variant);
    expect(data).toHaveLength(rows);
    for (const row of data) {
      expect(row).toHaveLength(columns);
      expect(row).toMatch(/^[SC]+$/);
    }
    expect(data.join('').replaceAll('C', '')).toHaveLength(sunny);
    expect(data.join('').replaceAll('S', '')).toHaveLength(cloudy);
  }
  for (const bad of [
    null,
    [],
    {},
    { kind: 'bnu-hundred-weather' },
    { kind: 'bnu-hundred-weather', variant: 'old' },
    { kind: 'bnu-hundred-weather', variant: 'main', answer: 35 },
  ])
    expect(isBnuHundredWeatherVisual(bad)).toBe(false);
});
it('maps all fifty-three tasks to the seven source activities, keeping actual work and personal records ungraded', () => {
  expect(lesson.steps).toHaveLength(9);
  expect(lesson.questions).toHaveLength(53);
  expect(audit.activities.map((x) => [x.page, x.sourceActivity])).toEqual(
    source.activities.map((x) => [x.page, x.key]),
  );
  const manual = lesson.questions.filter((x) => x.rule.kind === 'manual');
  const records = lesson.questions.filter((x) => x.rule.kind === 'reflection');
  expect(manual).toHaveLength(14);
  expect(records).toHaveLength(7);
  for (const item of manual)
    expect(evaluate(item.rule, 'confirmed')).toBeNull();
  for (const item of records)
    expect(evaluate(item.rule, '尚未做，未来计划另记')).toBeNull();
  const covered = new Set<string>();
  for (const activity of audit.activities) {
    for (const step of activity.steps)
      expect(lesson.steps[step - 1]).toBeDefined();
    for (const [kind, suffixes] of [
      ['objective', activity.objective],
      ['manual', activity.manual],
      ['reflection', activity.records],
    ] as const)
      for (const suffix of suffixes) {
        const item = q(suffix);
        expect(
          kind === 'objective'
            ? !['manual', 'reflection'].includes(item.rule.kind)
            : item.rule.kind === kind,
        ).toBe(true);
        covered.add(item.id);
      }
  }
  expect([...covered].toSorted()).toEqual(
    lesson.questions.map((x) => x.id).toSorted(),
  );
});
it('preserves one hundred through every split and bundle and keeps the original nine tens plus ten ones state', () => {
  let state = exchangePlaceValue(100, undefined, 'split-hundred');
  expect(placeValue(100, state)).toMatchObject({
    hundreds: 0,
    tens: 10,
    ones: 0,
    value: 100,
  });
  state = exchangePlaceValue(100, state, 'split-ten');
  expect(placeValue(100, state)).toMatchObject({
    hundreds: 0,
    tens: 9,
    ones: 10,
    value: 100,
  });
  state = exchangePlaceValue(100, state, 'bundle-ten');
  expect(placeValue(100, state)).toMatchObject({
    hundreds: 0,
    tens: 10,
    ones: 0,
    value: 100,
  });
  state = exchangePlaceValue(100, state, 'bundle-hundred');
  expect(placeValue(100, state)).toMatchObject({
    hundreds: 1,
    tens: 0,
    ones: 0,
    value: 100,
  });
  expect(exchangePlaceValue(100, state, 'bundle-hundred')).toEqual(state);
});
it('uses genuinely changed review conditions and preserves partial ten-field drafts, retries, real zero and old snapshots in strict backup', () => {
  const review = required(lesson.reviewQuestions);
  expect(review).toHaveLength(5);
  const answers = [
    [9, 8, 98],
    [96, 97, 98, 99, 100],
    [61, 51, 41],
    [12, 8, 20],
    '不能，须知道一捆里有几根',
  ];
  for (const [i, item] of review.entries()) {
    expect(evaluate(item.rule, required(answers[i]))).toBe(true);
    expect(
      lesson.questions.some(
        (old) => old.prompt === item.prompt || old.id === item.id,
      ),
    ).toBe(false);
  }
  expect(evaluate(review[3]!.rule, [35, 35, 70])).toBe(false);
  const library = initialLibrary('数到一百');
  const old = createSession(
    bnuLowerAroundNumbersLesson,
    'bnu-math-p1-lower-2024',
    library.activeProfileId,
  );
  const oldCopy = structuredClone(old);
  const session = createSession(
    lesson,
    'bnu-math-p1-lower-2024',
    library.activeProfileId,
  );
  library.sessions = [old, session];
  const index = session.questions.findIndex(
    (x) => x.id === `${lesson.id}-count-first`,
  );
  session.responses[index]!.draft = [
    75,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ];
  session.tools = {
    'step-1': { placeValue: { value: 100, hundreds: 0, tens: 9 } },
  };
  expect(parseBackup(exportBackup(library)).data).toEqual(library);
  for (const answer of [
    [74, 75, 76, 77, 78, 79, 80, 81, 82, 83],
    [75, 76, 77, 78, 79, 80, 81, 82, 83, 84],
  ]) {
    session.responses[index]!.draft = answer;
    session.responses[index] = submitResponse(
      session.questions[index]!,
      session.responses[index]!,
    );
  }
  const zeroIndex = session.questions.findIndex(
    (x) => x.id === `${lesson.id}-zero-ones`,
  );
  session.responses[zeroIndex]!.draft = 0;
  session.responses[zeroIndex] = submitResponse(
    session.questions[zeroIndex]!,
    session.responses[zeroIndex]!,
  );
  const restored = parseBackup(exportBackup(library)).data;
  expect(restored.sessions[0]).toEqual(oldCopy);
  expect(restored.sessions[1]).toEqual(session);
  expect(
    restored.sessions[1]!.responses[index]!.submissions.map((x) => x.correct),
  ).toEqual([false, true]);
  const bad = JSON.parse(exportBackup(library));
  const visual = bad.data.sessions[1].questions.find(
    (x: { visual?: unknown }) => x.visual,
  )?.visual;
  expect(visual).toBeDefined();
  visual.answer = 35;
  expect(() => parseBackup(JSON.stringify(bad))).toThrow(
    'educationLearning.invalidBackup',
  );
});

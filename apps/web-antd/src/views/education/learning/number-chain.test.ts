import type { NumberChainRule } from './number-chain';

import { expect, it } from 'vitest';

import { sujiaoUpperOpenComparisonLesson as lesson } from '../content/sujiao-upper-open-comparison';
import { exportBackup, parseBackup } from './backup';
import { createSession, evaluate, submitResponse } from './engine';
import { isNumberChainRule, matchesNumberChain } from './number-chain';
import { sparseArray } from './sparse-array';
import { initialLibrary } from './storage';

it('accepts exactly all coupled alternatives rather than checking each blank independently', () => {
  const rule: NumberChainRule = {
    kind: 'number-chain',
    minimum: 0,
    maximum: 9,
    direction: 'descending',
    values: [8, null, null],
  };
  const around: NumberChainRule = {
    ...rule,
    direction: 'ascending',
    values: [null, 7, null],
  };
  let descendingCount = 0;
  let aroundCount = 0;
  for (let a = 0; a <= 9; a++)
    for (let b = 0; b <= 9; b++) {
      const descending = matchesNumberChain(rule, [a, b]);
      const ascending = matchesNumberChain(around, [a, b]);
      expect(descending).toBe(a < 8 && a > b);
      expect(ascending).toBe(a < 7 && b > 7);
      if (descending) descendingCount++;
      if (ascending) aroundCount++;
    }
  expect(descendingCount).toBe(28);
  expect(aroundCount).toBe(14);
  expect(matchesNumberChain(rule, [3, 5])).toBe(false);
  expect(matchesNumberChain(rule, [7, 7])).toBe(false);
  expect(matchesNumberChain(rule, [1, 0])).toBe(true);
  expect(matchesNumberChain(around, [0, 9])).toBe(true);
  for (const answer of [
    sparseArray(2),
    ['1', 0],
    [null, 0],
    [1.5, 0],
    [1, -1],
    [10, 0],
    [1],
    [1, 0, 0],
  ])
    expect(matchesNumberChain(rule, answer)).toBe(false);
});

it('validates feasible anchored chains, including two anchors and strict range boundaries', () => {
  const rule: NumberChainRule = {
    kind: 'number-chain',
    minimum: 0,
    maximum: 9,
    direction: 'ascending',
    values: [1, null, 3],
  };
  expect(isNumberChainRule(rule)).toBe(true);
  expect(matchesNumberChain(rule, [2])).toBe(true);
  for (const bad of [
    { ...rule, values: [1, null, 2] },
    { ...rule, values: [null, 0, null] },
    { ...rule, values: [null, 9, null] },
    { ...rule, values: [9, null] },
    { ...rule, direction: 'descending', values: [1, null, null] },
    { ...rule, direction: 'sideways' },
    { ...rule, minimum: -1 },
    { ...rule, maximum: 100 },
    { ...rule, minimum: 9 },
    { ...rule, values: [1, 2, 3] },
    { ...rule, values: [null, null] },
    { ...rule, values: sparseArray(3) },
    { ...rule, values: ['1', null, 3] },
    { ...rule, values: [0.5, null, 3] },
    { ...rule, values: [1, null, 10] },
    { ...rule, answer: [2] },
  ])
    expect(isNumberChainRule(bad)).toBe(false);
  for (const direction of ['ascending', 'descending'] as const)
    for (let anchor = 0; anchor <= 9; anchor++) {
      for (const values of [
        [anchor, null, null],
        [null, anchor, null],
        [null, null, anchor],
      ]) {
        const model = { ...rule, direction, values };
        let possible = false;
        for (let a = 0; a <= 9; a++)
          for (let b = 0; b <= 9; b++) {
            let i = 0;
            const complete = values.map((n) => (n === null ? [a, b][i++]! : n));
            if (
              direction === 'ascending'
                ? complete[0]! < complete[1]! && complete[1]! < complete[2]!
                : complete[0]! > complete[1]! && complete[1]! > complete[2]!
            )
              possible = true;
          }
        expect(isNumberChainRule(model)).toBe(possible);
      }
    }
});

it('backs up alternative correct pairs, partial zero drafts and incorrect attempts with strict validation', () => {
  const library = initialLibrary('开放比较');
  const s = createSession(
    lesson,
    'sujiao-math-p1-upper-2024',
    library.activeProfileId,
  );
  const i = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-descending-pair`,
  );
  for (const draft of [
    [3, 5],
    [7, 6],
    [1, 0],
  ])
    s.responses[i] = submitResponse(s.questions[i]!, {
      ...s.responses[i]!,
      draft,
    });
  expect(s.responses[i]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
    true,
  ]);
  s.responses[i]!.draft = [null, 0];
  library.sessions.push(s);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(s);
  for (const draft of [[0], ['0', null], [0, 0.5], [0, 1, 2]]) {
    const bad = JSON.parse(exportBackup(library));
    bad.data.sessions[0].responses[i].draft = draft;
    expect(() => parseBackup(JSON.stringify(bad))).toThrow(Error);
  }
  const forged = JSON.parse(exportBackup(library));
  forged.data.sessions[0].responses[i].submissions[0].correct = true;
  expect(() => parseBackup(JSON.stringify(forged))).toThrow(Error);
  const injected = JSON.parse(exportBackup(library));
  injected.data.sessions[0].questions[i].rule.answer = [1, 0];
  expect(() => parseBackup(JSON.stringify(injected))).toThrow(Error);
  expect(evaluate(s.questions[i]!.rule, [0, 0])).toBe(false);
});

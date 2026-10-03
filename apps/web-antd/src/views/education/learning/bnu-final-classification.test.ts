import { expect, it } from 'vitest';

import { bnuUpperBook } from '../content/bnu';
import { bnuFinalClassificationLesson as lesson } from '../content/bnu-final-classification';
import { exportBackup, parseBackup } from './backup';
import {
  bnuFinalAnimals,
  bnuFinalClassificationObjects,
  isBnuFinalClassificationVisual,
} from './bnu-final-classification';
import { createSession } from './engine';
import { required } from './required';
import { initialLibrary } from './storage';
it('accepts only the fixed diagram contract and returns independent full inventories', () => {
  for (const scene of ['legs', 'habitat', 'motion', 'objects'])
    for (const variant of ['main', 'review'])
      expect(
        isBnuFinalClassificationVisual({
          kind: 'bnu-final-classification',
          scene,
          variant,
        }),
      ).toBe(true);
  const visual = {
    kind: 'bnu-final-classification',
    scene: 'motion',
    variant: 'main',
  };
  for (const invalid of [
    null,
    [],
    { ...visual, scene: 'unknown' },
    { ...visual, variant: 1 },
    { ...visual, answers: ['A'] },
    { ...visual, scene: ['motion'] },
  ])
    expect(isBnuFinalClassificationVisual(invalid)).toBe(false);
  const animals = bnuFinalAnimals('legs', 'main');
  required(animals[0]).name = 'changed';
  expect(bnuFinalAnimals('legs', 'main')[0]?.name).toBe('chicken');
  const objects = bnuFinalClassificationObjects('main');
  required(objects[0]).size = 'small';
  expect(bnuFinalClassificationObjects('main')[0]?.size).toBe('large');
  expect(bnuFinalClassificationObjects('review').map((c) => c.label)).toEqual([
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
  ]);
});
it('round trips all source conditions through schema1 and rejects injected scene or answers', () => {
  const library = initialLibrary('固定分类图');
  const session = createSession(
    lesson,
    bnuUpperBook.id,
    library.activeProfileId,
  );
  library.sessions.push(session);
  const backup = exportBackup(library);
  const diagramIndex = session.questions.findIndex(
    (q) => q.visual?.kind === 'bnu-final-classification',
  );
  expect(diagramIndex).toBeGreaterThanOrEqual(0);
  expect(parseBackup(backup).data.sessions[0]).toEqual(
    JSON.parse(JSON.stringify(session)),
  );
  for (const scene of ['unknown', ['legs']]) {
    const bad = JSON.parse(backup);
    bad.data.sessions[0].questions[diagramIndex].visual.scene = scene;
    expect(() => parseBackup(JSON.stringify(bad))).toThrow(
      'educationLearning.invalidBackup',
    );
  }
  const injected = JSON.parse(backup);
  injected.data.sessions[0].questions[diagramIndex].visual.answers = ['A'];
  expect(() => parseBackup(JSON.stringify(injected))).toThrow(
    'educationLearning.invalidBackup',
  );
});

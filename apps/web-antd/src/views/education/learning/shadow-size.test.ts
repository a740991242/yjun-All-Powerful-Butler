import { expect, it } from 'vitest';

import { bnuLowerShadowTheatreLesson as lesson } from '../content/bnu-lower-shapes';
import { exportBackup, parseBackup } from './backup';
import { createSession, statistics, submitResponse } from './engine';
import { required } from './required';
import { isShadowSizeVisual, shadowScenes } from './shadow-size';
import { initialLibrary } from './storage';

it('keeps light, screen and opaque object fixed in size and changes only axial object position', () => {
  const main = shadowScenes({ kind: 'shadow-size', variant: 'main' });
  const review = shadowScenes({ kind: 'shadow-size', variant: 'review' });
  expect(main.map((s) => s.objectX)).toEqual([100, 200]);
  expect(review.map((s) => s.objectX)).toEqual([200, 100]);
  for (const scene of [...main, ...review]) {
    expect([
      scene.lampX,
      scene.screenX,
      scene.centerY,
      scene.objectHalf,
    ]).toEqual([24, 296, 85, 10]);
    // Independently check both ray slopes, so a reversed distance rule cannot pass.
    const objectSlope = 10 / (scene.objectX - 24);
    expect(scene.shadowHalf / 272).toBeCloseTo(objectSlope, 12);
    expect(scene.centerY - scene.shadowHalf).toBeGreaterThan(30);
    expect(scene.centerY + scene.shadowHalf).toBeLessThan(135);
  }
  expect(required(main[0]).shadowHalf).toBeGreaterThan(
    required(main[1]).shadowHalf,
  );
  expect(required(review[0]).shadowHalf).toBeLessThan(
    required(review[1]).shadowHalf,
  );
  expect(required(main[0]).shadowHalf).toBeCloseTo(35.7894736842, 8);
  expect(required(main[1]).shadowHalf).toBeCloseTo(15.4545454545, 8);
});

it('accepts only the two fixed diagrams and rejects arbitrary conditions or hidden answers', () => {
  for (const variant of ['main', 'review'])
    expect(isShadowSizeVisual({ kind: 'shadow-size', variant })).toBe(true);
  for (const value of [
    null,
    {},
    [],
    { kind: 'shadow-size' },
    { kind: 'shadow-size', variant: 'other' },
    { kind: 'shadow-size', variant: ['main'] },
    { kind: 'shadow-size', variant: { toString: () => 'main' } },
    { kind: 'shadow-size', variant: 'main', answer: 'A' },
    { kind: 'shadow-size', variant: 'main', objectX: 2 },
    { kind: 'shadow-size', variant: 'main', screenX: 300 },
  ])
    expect(isShadowSizeVisual(value)).toBe(false);
});

it('preserves a pending choice, wrong submission and correction without confirming a physical experiment', () => {
  const library = initialLibrary('影子');
  const session = createSession(
    lesson,
    'bnu-math-p1-lower-2024',
    library.activeProfileId,
  );
  session.phase = 'practice';
  const index = session.questions.findIndex((q) => q.id.endsWith('-bigger'));
  const question = required(session.questions[index]);
  const response = required(session.responses[index]);
  response.draft = 'B';
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
  session.responses[index] = submitResponse(question, response);
  required(session.responses[index]).draft = 'A';
  session.responses[index] = submitResponse(
    question,
    required(session.responses[index]),
  );
  expect(
    required(session.responses[index]).submissions.map((s) => s.correct),
  ).toEqual([false, true]);
  expect(statistics(session).manual).toBe(0);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
  const damaged = structuredClone(library);
  Object.assign(
    required(required(required(damaged.sessions[0]).questions[index]).visual),
    { answer: 'A' },
  );
  expect(() => parseBackup(exportBackup(damaged))).toThrow(Error);
});

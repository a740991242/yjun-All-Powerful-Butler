import type { JoinAction } from './shape-join';
import type { ThreePieceJoinState } from './three-piece-join';

import { describe, expect, it } from 'vitest';

import { sujiaoThreePieceJoinDraft as lesson } from '../content/sujiao-three-piece-join';
import { exportBackup, parseBackup } from './backup';
import { createSession, statistics, submitResponse } from './engine';
import { fold } from './fold';
import { initialLibrary } from './storage';
import {
  initialThreePieceJoin,
  isThreePieceJoinState,
  moveThreePiece,
  threePiecePoints,
  threePieceShape,
} from './three-piece-join';

const rectangle: ThreePieceJoinState = {
  selected: 1,
  pieces: [
    { x: 1, y: 1, turn: 0 },
    { x: 3, y: 1, turn: 0 },
    { x: 3, y: 1, turn: 2 },
  ],
};
const parallelogram: ThreePieceJoinState = {
  selected: 1,
  pieces: [
    { x: 1, y: 1, turn: 0 },
    { x: 0, y: 1, turn: 2 },
    { x: 3, y: 1, turn: 0 },
  ],
};
describe('fixed rectangle and two triangle composition', () => {
  it('recognizes filled outer boundaries rather than internal seams, contact or gaps', () => {
    expect(threePieceShape(rectangle)).toBe('rectangle');
    expect(threePieceShape(parallelogram)).toBe('parallelogram');
    expect(threePieceShape(initialThreePieceJoin())).toBeNull();
    const gap = structuredClone(rectangle);
    gap.pieces[0].x = 0;
    expect(isThreePieceJoinState(gap)).toBe(true);
    expect(threePieceShape(gap)).toBeNull();
    const concave = structuredClone(rectangle);
    concave.pieces[2] = { x: 3, y: 2, turn: 0 };
    expect(isThreePieceJoinState(concave)).toBe(true);
    expect(threePieceShape(concave)).toBeNull();
  });
  it('rejects malformed, sparse, overlapping and orientation-dependent off-board states', () => {
    const overlapping = structuredClone(rectangle);
    overlapping.pieces[2].turn = 0;
    const beyond = structuredClone(initialThreePieceJoin());
    beyond.pieces[0] = { x: 5, y: 0, turn: 0 };
    const sparse = structuredClone(rectangle);
    Reflect.deleteProperty(sparse.pieces, '1');
    for (const value of [
      null,
      {},
      { ...rectangle, selected: 3 },
      { ...rectangle, answer: 'rectangle' },
      overlapping,
      beyond,
      sparse,
      { ...rectangle, pieces: rectangle.pieces.slice(0, 2) },
    ])
      expect(isThreePieceJoinState(value)).toBe(false);
    beyond.pieces[0].turn = 1;
    expect(isThreePieceJoinState(beyond)).toBe(true);
    beyond.pieces[0].y = 3;
    expect(isThreePieceJoinState(beyond)).toBe(false);
    expect(() => moveThreePiece(overlapping, 'left')).toThrow('invalidRecord');
  });
  it('preserves materials, other pieces and prior state for every placement and control in three meaningful layouts', () => {
    const actions: JoinAction[] = ['left', 'right', 'up', 'down', 'rotate'];
    for (const base of [initialThreePieceJoin(), rectangle, parallelogram])
      for (const selected of [0, 1, 2])
        for (let x = 0; x < 6; x++)
          for (let y = 0; y < 4; y++)
            for (let turn = 0; turn < 4; turn++) {
              const state = structuredClone(base);
              state.selected = selected;
              state.pieces[selected] = { x, y, turn };
              if (!isThreePieceJoinState(state)) continue;
              const before = structuredClone(state);
              for (const action of actions) {
                const next = moveThreePiece(state, action);
                expect(isThreePieceJoinState(next)).toBe(true);
                for (let index = 0; index < 3; index++) {
                  if (index !== selected)
                    expect(next.pieces[index]).toEqual(state.pieces[index]);
                  const points = threePiecePoints(next.pieces[index]!, index);
                  const twiceArea = Math.abs(
                    fold(points, 0, (sum, p, i) => {
                      const q = points[(i + 1) % points.length]!;
                      return sum + p.x * q.y - p.y * q.x;
                    }),
                  );
                  expect(twiceArea).toBe(index === 0 ? 4 : 1);
                }
              }
              expect(state).toEqual(before);
            }
  });
  it('reaches both valid compositions from the spread-out start using only permitted moves and selections', () => {
    let state = initialThreePieceJoin();
    const run = (selected: number, actions: JoinAction[]) => {
      state = { ...state, selected };
      for (const action of actions) {
        const next = moveThreePiece(state, action);
        expect(next).not.toEqual(state);
        state = next;
      }
    };
    run(1, ['left', 'down']);
    run(2, ['up', 'up', 'left', 'left']);
    expect(threePieceShape(state)).toBe('rectangle');
    run(1, ['up', 'rotate', 'rotate', 'left', 'left', 'left', 'down']);
    run(2, ['right', 'rotate', 'rotate', 'left']);
    expect(threePieceShape(state)).toBe('parallelogram');
    expect(initialThreePieceJoin()).not.toEqual(state);
  });
});

it('keeps tool positions and first-error history through backups, rejecting collisions and wrong question bindings', () => {
  const library = initialLibrary('三片拼组');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const manual = session.questions.find((q) => q.rule.kind === 'manual')!;
  session.tools = {
    'step-2': { threePieceJoin: parallelogram },
    [`question-${manual.id}`]: { threePieceJoin: rectangle },
  };
  session.phase = 'practice';
  const index = session.questions.findIndex((q) => q.id.endsWith('-q-turn'));
  session.responses[index]!.draft = 'no';
  session.responses[index] = submitResponse(
    session.questions[index]!,
    session.responses[index]!,
  );
  session.responses[index]!.draft = 'yes';
  session.responses[index] = submitResponse(
    session.questions[index]!,
    session.responses[index]!,
  );
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  expect(statistics(session).manual).toBe(0);
  for (const key of [
    `question-${session.questions[index]!.id}`,
    'question-unknown',
  ]) {
    const bad = structuredClone(library);
    bad.sessions[0]!.tools = { [key]: { threePieceJoin: rectangle } };
    expect(() => parseBackup(exportBackup(bad))).toThrow(Error);
  }
  const collision = structuredClone(library);
  collision.sessions[0]!.tools!['step-2']!.threePieceJoin!.pieces[2] = {
    ...rectangle.pieces[1],
  };
  collision.sessions[0]!.tools!['step-2']!.threePieceJoin!.pieces[0] = {
    ...rectangle.pieces[0],
  };
  collision.sessions[0]!.tools!['step-2']!.threePieceJoin!.pieces[1] = {
    ...rectangle.pieces[1],
  };
  expect(() => parseBackup(exportBackup(collision))).toThrow(Error);
});

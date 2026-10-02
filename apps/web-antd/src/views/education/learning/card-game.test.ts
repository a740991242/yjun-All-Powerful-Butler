import type { CardGameState, CardGameVisual } from './types';

import { describe, expect, it } from 'vitest';

import {
  hasTen,
  initialCardGame,
  isCardGameState,
  isCardGameVisual,
  replayCardGame,
} from './card-game';

const model: CardGameVisual = {
  kind: 'card-game',
  mode: 'pair',
  decks: [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [2, 9, 1, 3, 4, 5, 6, 7, 8],
  ],
};
const draws = (count: number): CardGameState => ({
  ...initialCardGame(),
  actions: Array.from({ length: count }, () => ({ type: 'draw' })),
});
describe('take ten card game', () => {
  it('takes endpoints and intervening cards, preserves draw turns and counts cards rather than values', () => {
    const state = draws(4);
    state.actions.push(
      { type: 'claim', player: 1, ids: [0, 3] },
      { type: 'draw' },
    );
    expect(replayCardGame(model, state)).toEqual({
      cards: [{ id: 4, value: 3 }],
      draws: 5,
      scores: [0, 4],
      ended: false,
      lastClaim: 4,
    });
  });
  it('handles repeated values from separate decks, including multi-card claims', () => {
    const multi: CardGameVisual = {
      ...model,
      mode: 'multi',
      decks: [
        [1, 8, 2, 3, 4, 5, 6, 7, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
      ],
    };
    const state = draws(3);
    state.actions.push({ type: 'claim', player: 0, ids: [0, 1, 2] });
    expect(replayCardGame(multi, state)?.scores).toEqual([3, 0]);
    expect(replayCardGame({ ...multi, mode: 'pair' }, state)).toBeNull();
  });
  it('rejects impossible draws, claims, selection, extra score fields and broken decks', () => {
    expect(replayCardGame(model, draws(19))).toBeNull();
    for (const selection of [[0, 0], [18], [1.5], [7]])
      expect(
        replayCardGame(model, { ...draws(2), selected: selection }),
      ).toBeNull();
    for (const selection of [
      [0, 0],
      [0, 17],
      [0, 1],
    ])
      expect(
        replayCardGame(model, {
          ...draws(2),
          actions: [
            ...draws(2).actions,
            { type: 'claim', player: 0, ids: selection },
          ],
        }),
      ).toBeNull();
    expect(isCardGameState({ ...initialCardGame(), scores: [100, 0] })).toBe(
      false,
    );
    expect(
      isCardGameVisual({
        ...model,
        decks: [Array.from({ length: 9 }, () => 1), model.decks[1]],
      }),
    ).toBe(false);
    expect(isCardGameVisual({ ...model, answers: [1, 9] })).toBe(false);
  });
  it('allows finishing only after all cards are drawn and no valid ten remains', () => {
    expect(
      replayCardGame(model, {
        ...draws(2),
        actions: [...draws(2).actions, { type: 'finish' }],
      }),
    ).toBeNull();
    expect(
      replayCardGame(model, {
        ...draws(18),
        actions: [...draws(18).actions, { type: 'finish' }],
      }),
    ).toBeNull();
    const state = draws(18);
    while (true) {
      const board = replayCardGame(model, state)!;
      const pair = board.cards.flatMap((card, i) =>
        board.cards
          .slice(i + 1)
          .filter((other) => other.value + card.value === 10)
          .map((other) => [card.id, other.id]),
      )[0];
      if (!pair) break;
      state.actions.push({ type: 'claim', player: 0, ids: pair });
    }
    state.actions.push({ type: 'finish' });
    const board = replayCardGame(model, state)!;
    expect(board.ended).toBe(true);
    expect(board.cards.length + board.scores[0] + board.scores[1]).toBe(18);
    state.actions.push({ type: 'draw' });
    expect(replayCardGame(model, state)).toBeNull();
  });
  it('distinguishes pair and multi availability without reusing a single card', () => {
    const cards = [
      { id: 0, value: 1 },
      { id: 1, value: 1 },
      { id: 2, value: 8 },
    ];
    expect(hasTen(cards, 'pair')).toBe(false);
    expect(hasTen(cards, 'multi')).toBe(true);
    expect(hasTen([{ id: 0, value: 5 }], 'multi')).toBe(false);
  });
});

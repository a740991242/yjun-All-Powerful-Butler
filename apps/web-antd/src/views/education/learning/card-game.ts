import type { CardGameState, CardGameVisual } from './types';

import { fold } from './fold';

function record(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
function ids(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.length <= 9 &&
    value.every((id) => Number.isInteger(id) && id >= 0 && id < 18) &&
    new Set(value).size === value.length
  );
}
export function isCardGameVisual(value: unknown): value is CardGameVisual {
  return (
    record(value) &&
    Object.keys(value).length === 3 &&
    value.kind === 'card-game' &&
    ['multi', 'pair'].includes(String(value.mode)) &&
    Array.isArray(value.decks) &&
    value.decks.length === 2 &&
    value.decks.every(
      (deck) =>
        Array.isArray(deck) &&
        deck.length === 9 &&
        deck.every((n) => Number.isInteger(n) && n >= 1 && n <= 9) &&
        new Set(deck).size === 9,
    )
  );
}
export function initialCardGame(): CardGameState {
  return { actions: [], selected: [], claimer: 0 };
}
export function isCardGameState(value: unknown): value is CardGameState {
  return (
    record(value) &&
    Object.keys(value).length === 3 &&
    (value.claimer === 0 || value.claimer === 1) &&
    ids(value.selected) &&
    Array.isArray(value.actions) &&
    value.actions.length <= 28 &&
    value.actions.every(
      (action) =>
        record(action) &&
        ((['draw', 'finish'].includes(String(action.type)) &&
          Object.keys(action).length === 1) ||
          (action.type === 'claim' &&
            Object.keys(action).length === 3 &&
            (action.player === 0 || action.player === 1) &&
            ids(action.ids) &&
            action.ids.length >= 2)),
    )
  );
}
export interface CardGameBoard {
  cards: { id: number; value: number }[];
  draws: number;
  scores: [number, number];
  ended: boolean;
  lastClaim: number;
}
/** Replay facts from the saved deck and actions; imported scores are never trusted. */
export function replayCardGame(
  model: CardGameVisual,
  state: unknown,
): CardGameBoard | null {
  if (!isCardGameVisual(model) || !isCardGameState(state)) return null;
  const board: CardGameBoard = {
    cards: [],
    draws: 0,
    scores: [0, 0],
    ended: false,
    lastClaim: 0,
  };
  for (const action of state.actions) {
    if (board.ended) return null;
    if (action.type === 'draw') {
      if (board.draws >= 18) return null;
      const player = board.draws % 2 === 0 ? 0 : 1;
      const value = model.decks[player][Math.floor(board.draws / 2)];
      if (value === undefined) return null;
      board.cards.push({ id: board.draws++, value });
    } else if (action.type === 'finish') {
      if (board.draws !== 18 || hasTen(board.cards, model.mode)) return null;
      board.ended = true;
    } else {
      if (model.mode === 'pair' && action.ids.length !== 2) return null;
      const positions = action.ids.map((id) =>
        board.cards.findIndex((card) => card.id === id),
      );
      if (positions.some((position) => position < 0)) return null;
      const total = fold(
        board.cards.filter((card) => action.ids.includes(card.id)),
        0,
        (sum, card) => sum + card.value,
      );
      if (total !== 10) return null;
      const first = Math.min(...positions);
      const count = Math.max(...positions) - first + 1;
      board.cards.splice(first, count);
      board.scores[action.player] += count;
      board.lastClaim = count;
    }
  }
  if (
    state.selected.some((id) => !board.cards.some((card) => card.id === id)) ||
    (model.mode === 'pair' && state.selected.length > 2) ||
    (board.ended && state.selected.length > 0)
  )
    return null;
  return board;
}
export function hasTen(
  cards: CardGameBoard['cards'],
  mode: CardGameVisual['mode'],
): boolean {
  if (mode === 'pair')
    return cards.some((card, i) =>
      cards.slice(i + 1).some((other) => card.value + other.value === 10),
    );
  const sums = new Set([0]);
  for (const card of cards) {
    for (const sum of [...sums]) {
      if (sum + card.value === 10) return true;
      if (sum + card.value < 10) sums.add(sum + card.value);
    }
  }
  return false;
}

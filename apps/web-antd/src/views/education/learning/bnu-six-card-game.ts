import { fold } from './fold';

export type BnuSixCardGameVisual = { kind: 'bnu-six-card-game' };
export type SixCard = { id: string; value: number };
export type SixCardRound = {
  deck: SixCard[];
  hand: SixCard[];
  stopped: boolean;
};
export function isBnuSixCardGameVisual(
  value: unknown,
): value is BnuSixCardGameVisual {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value).length === 1 &&
    'kind' in value &&
    value.kind === 'bnu-six-card-game'
  );
}
export function newSixCardRound(): SixCardRound {
  return {
    deck: ['A', 'B', 'C', 'D'].flatMap((group) =>
      Array.from({ length: 5 }, (_, index) => ({
        id: `${group}${index + 1}`,
        value: index + 1,
      })),
    ),
    hand: [],
    stopped: false,
  };
}
export function sixCardTotal(round: SixCardRound) {
  return fold(round.hand, 0, (sum, card) => sum + card.value);
}
export function sixCardStatus(
  round: SixCardRound,
): 'active' | 'finished' | 'out' {
  if (sixCardTotal(round) > 6) return 'out';
  if (round.stopped) return 'finished';
  return 'active';
}
export function drawSixCard(
  round: SixCardRound,
  index: number,
): null | SixCardRound {
  if (sixCardStatus(round) !== 'active') return null;
  if (!Number.isSafeInteger(index) || index < 0 || index >= round.deck.length)
    throw new Error('educationLearning.invalidRecord');
  const card = round.deck[index];
  if (!card) throw new Error('educationLearning.invalidRecord');
  return {
    deck: round.deck.filter((_, position) => position !== index),
    hand: [...round.hand, card],
    stopped: false,
  };
}
export function stopSixCard(round: SixCardRound): SixCardRound {
  return sixCardStatus(round) === 'active'
    ? { ...round, stopped: true }
    : round;
}

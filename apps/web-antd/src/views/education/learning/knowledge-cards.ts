import type { Visual } from './types';

import { required } from './required';

// Fixed examples keep saved cards bounded: no recursive cards or external content.
export const knowledgeCards: {
  topic: string;
  equation: string;
  visual: Exclude<Visual, { kind: 'knowledge-map' }>;
}[] = [
  {
    topic: 'numbers',
    equation: '17 = 10 + 7',
    visual: { kind: 'place-value', value: 17 },
  },
  {
    topic: 'calculation',
    equation: '8 + 6 = 8 + 2 + 4 = 10 + 4 = 14',
    visual: { kind: 'ten-frame', left: 8, right: 6 },
  },
  {
    topic: 'relations',
    equation: '5 + 7 = 12；12 − 5 = 7；12 − 7 = 5',
    visual: { kind: 'count', count: 5, other: 7 },
  },
  {
    topic: 'shapes',
    equation: '1 + 1 + 1 + 1 = 4',
    visual: {
      kind: 'block-cards',
      cards: [
        { shape: 'cuboid', color: 'red' },
        { shape: 'cube', color: 'blue' },
        { shape: 'cylinder', color: 'yellow' },
        { shape: 'sphere', color: 'red' },
      ],
    },
  },
];

export function isKnowledgeCard(value: unknown): value is number {
  return (
    Number.isInteger(value) &&
    typeof value === 'number' &&
    value >= 0 &&
    value < knowledgeCards.length
  );
}

export function selectedKnowledgeCard(index: number | undefined) {
  return required(knowledgeCards[isKnowledgeCard(index) ? index : 0]);
}

import type { QueueVisual } from './types';

import { describe, expect, it } from 'vitest';

import { isQueueVisual, queueNeighbours, queuePosition } from './queue';

describe('explicit queue direction', () => {
  it('reverses positions without changing quantity, and excludes self from either side', () => {
    for (const labels of [
      ['甲', '乙'],
      ['甲', '乙', '丙'],
      ['甲', '乙', '丙', '丁'],
      ...[5, 6, 7, 8, 9].map((count) => [
        ...'甲乙丙丁戊己庚辛壬'.slice(0, count),
      ]),
    ]) {
      const left: QueueVisual = { kind: 'queue', labels, front: 'left' };
      const right: QueueVisual = { ...left, front: 'right' };
      expect(isQueueVisual(left)).toBe(true);
      for (const label of labels) {
        expect(queuePosition(left, label)! + queuePosition(right, label)!).toBe(
          labels.length + 1,
        );
        const sides = queueNeighbours(left, label)!;
        expect(sides.before + sides.after + 1).toBe(labels.length);
        expect(queueNeighbours(right, label)).toEqual({
          before: sides.after,
          after: sides.before,
        });
      }
      expect(queuePosition(left, '不存在')).toBeUndefined();
      expect(queueNeighbours(left, '不存在')).toBeUndefined();
      const shortened: QueueVisual = { ...left, labels: labels.slice(1) };
      expect(queuePosition(shortened, labels[1]!)).toBe(1);
      expect(queuePosition(left, labels[1]!)).toBe(2);
    }
  });
  it('rejects missing direction, ambiguous labels and unsupported or oversized diagrams', () => {
    const valid = { kind: 'queue', labels: ['小禾', '小乐'], front: 'left' };
    for (const value of [
      null,
      [],
      {},
      { ...valid, front: 'up' },
      { ...valid, labels: [] },
      { ...valid, labels: ['甲'] },
      { ...valid, labels: [...'甲乙丙丁戊己庚辛壬癸'] },
      { ...valid, labels: ['小禾', '小禾'] },
      { ...valid, labels: [' 甲', '乙'] },
      { ...valid, labels: ['甲\n乙', '丙'] },
      { ...valid, labels: ['超出四个字长度', '乙'] },
      { ...valid, labels: [1, 2] },
      { ...valid, selected: 1 },
    ]) {
      expect(isQueueVisual(value)).toBe(false);
    }
  });
});

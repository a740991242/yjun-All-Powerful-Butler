import type { BeadChainVisual } from './types';
export function beadGroupB(model: BeadChainVisual, index: number): number {
  return model.firstB + index - 1;
}
export function hiddenBeads(model: BeadChainVisual): [number, number] {
  const [start, end] = model.hidden;
  let b = 0;
  for (let i = start; i <= end; i++) b += beadGroupB(model, i);
  return [end - start + 1, b];
}
export function isBeadChainVisual(value: unknown): value is BeadChainVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  if (
    Object.keys(model).length !== 4 ||
    model.kind !== 'bead-chain' ||
    ![1, 2].includes(model.firstB as number) ||
    ![3, 4].includes(model.groups as number) ||
    !Array.isArray(model.hidden) ||
    model.hidden.length !== 2 ||
    ![...model.hidden].every((item) => Number.isInteger(item))
  )
    return false;
  const [start, end] = model.hidden;
  return (
    start >= 2 &&
    end >= start &&
    end < (model.groups as number) &&
    end - start < 2
  );
}

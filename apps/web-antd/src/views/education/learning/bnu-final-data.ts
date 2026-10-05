import { required } from './required';
export interface BnuFinalDataVisual {
  kind: 'bnu-final-data';
  scene: 'farm' | 'rescue' | 'rings' | 'rope';
  variant: 'main' | 'review';
}
export function isBnuFinalDataVisual(
  value: unknown,
): value is BnuFinalDataVisual {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const v = value as Record<string, unknown>;
  return (
    Object.keys(v).length === 3 &&
    v.kind === 'bnu-final-data' &&
    typeof v.scene === 'string' &&
    ['farm', 'rescue', 'rings', 'rope'].includes(v.scene) &&
    (v.variant === 'main' || v.variant === 'review')
  );
}
export interface BnuFinalDataRow {
  id: string;
  name: string;
  quantity?: number;
  more?: number;
  rankBlank?: string;
}
/** Conditions only: no computed rabbit/rescue counts, pair answers, or ranks. */
export function bnuFinalDataRows(
  visual: BnuFinalDataVisual,
): BnuFinalDataRow[] {
  if (!isBnuFinalDataVisual(visual))
    throw new Error('educationLearning.invalidRecord');
  const review = visual.variant === 'review';
  switch (visual.scene) {
    case 'farm': {
      return [
        { id: 'A', name: 'sheep', quantity: review ? 28 : 35 },
        { id: 'B', name: 'geese', quantity: review ? 14 : 11 },
        { id: 'C', name: 'rabbits', more: review ? 5 : 4 },
      ];
    }
    case 'rescue': {
      return [
        { id: 'A', name: 'firstHalf', quantity: review ? 43 : 32 },
        { id: 'B', name: 'secondHalf', more: review ? 12 : 13 },
      ];
    }
    case 'rings': {
      return (review ? [18, 14, 22, 26] : [24, 12, 30, 32]).map(
        (quantity, i) => ({
          id: String.fromCodePoint(65 + i),
          name: required(['elephant', 'deer', 'panda', 'penguin'][i]),
          quantity,
        }),
      );
    }
    case 'rope': {
      return (review ? [83, 87, 82, 86] : [92, 95, 94, 99]).map(
        (quantity, i) => ({
          id: String.fromCodePoint(65 + i),
          name: required(['qiangqiang', 'lele', 'xiaohong', 'huanhuan'][i]),
          quantity,
          rankBlank: String.fromCodePoint(65 + i),
        }),
      );
    }
  }
}

export const bnuFinalPracticeScenes = ['faces', 'cups', 'divisions'] as const;
export interface BnuFinalPracticeVisual {
  kind: 'bnu-final-practice';
  scene: (typeof bnuFinalPracticeScenes)[number];
  variant: 'main' | 'review';
}
export type FinalPracticeMark =
  | 'happy'
  | 'horizontal'
  | 'left'
  | 'right'
  | 'sad'
  | 'vertical';
export function isBnuFinalPracticeVisual(
  value: unknown,
): value is BnuFinalPracticeVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    Object.keys(v).length === 3 &&
    Object.keys(v).every((k) => ['kind', 'scene', 'variant'].includes(k)) &&
    v.kind === 'bnu-final-practice' &&
    bnuFinalPracticeScenes.some((s) => s === v.scene) &&
    (v.variant === 'main' || v.variant === 'review')
  );
}
/** Only the printed givens (or a changed review unit), followed by three unfilled positions. */
export function bnuFinalPracticeCells(
  v: BnuFinalPracticeVisual,
): (FinalPracticeMark | null)[] {
  if (!isBnuFinalPracticeVisual(v))
    throw new Error('educationLearning.invalidRecord');
  const main: Record<BnuFinalPracticeVisual['scene'], FinalPracticeMark[]> = {
    faces: ['happy', 'happy', 'sad', 'happy', 'happy', 'sad'],
    cups: ['right', 'left', 'right', 'left'],
    divisions: ['horizontal', 'vertical', 'horizontal', 'vertical'],
  };
  const review: Record<BnuFinalPracticeVisual['scene'], FinalPracticeMark[]> = {
    faces: ['sad', 'happy', 'happy', 'sad', 'happy', 'happy'],
    cups: ['left', 'right', 'left', 'right'],
    divisions: ['vertical', 'horizontal', 'vertical', 'horizontal'],
  };
  return [...(v.variant === 'main' ? main : review)[v.scene], null, null, null];
}

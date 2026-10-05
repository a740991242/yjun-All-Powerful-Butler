export interface BnuPineconeLineVisual {
  kind: 'bnu-pinecone-line';
  scene: 'add' | 'subtract';
  variant: 'main' | 'review';
}
export function isBnuPineconeLineVisual(
  value: unknown,
): value is BnuPineconeLineVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    Object.keys(v).length === 3 &&
    Object.keys(v).every((k) => ['kind', 'scene', 'variant'].includes(k)) &&
    v.kind === 'bnu-pinecone-line' &&
    (v.scene === 'add' || v.scene === 'subtract') &&
    (v.variant === 'main' || v.variant === 'review')
  );
}
/** Fixed given scales and arrows; callers cannot supply hidden answers or arbitrary ticks. */
export function bnuPineconeLine(visual: BnuPineconeLineVisual) {
  if (!isBnuPineconeLineVisual(visual))
    throw new Error('educationLearning.invalidRecord');
  if (visual.scene === 'add')
    return {
      ticks: [21, 22, 23, 24, 25, 26],
      start: visual.variant === 'main' ? 22 : 23,
      jump: visual.variant === 'main' ? 3 : 2,
      end: 25,
      operation: '+',
    };
  return {
    ticks: [49, 59, 69, 79, 89, 99],
    start: visual.variant === 'main' ? 89 : 99,
    jump: visual.variant === 'main' ? 30 : 20,
    end: visual.variant === 'main' ? 59 : 79,
    operation: '−',
  };
}

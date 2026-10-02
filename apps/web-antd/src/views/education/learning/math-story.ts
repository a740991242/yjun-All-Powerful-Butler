export interface MathStoryVisual {
  kind: 'math-story';
  variant: 'main' | 'review';
}
export function isMathStoryVisual(value: unknown): value is MathStoryVisual {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const m = value as Record<string, unknown>;
  return (
    Object.keys(m).length === 2 &&
    m.kind === 'math-story' &&
    (m.variant === 'main' || m.variant === 'review')
  );
}
/** Only given facts: the final shelf quantity is deliberately not supplied to the drawing. */
export function mathStoryFacts(variant: MathStoryVisual['variant']) {
  return variant === 'main'
    ? { shelf: 12, initial: 24, borrowed: 8, returned: 3 }
    : { shelf: 21, initial: 35, borrowed: 7, returned: 5 };
}

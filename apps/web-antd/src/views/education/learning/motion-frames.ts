export interface MotionFramesVisual {
  kind: 'motion-frames';
  variant: 'main' | 'review';
  scene: 'approach' | 'depart' | 'pass';
}
export function isMotionFramesVisual(
  value: unknown,
): value is MotionFramesVisual {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const m = value as Record<string, unknown>;
  return (
    Object.keys(m).length === 3 &&
    m.kind === 'motion-frames' &&
    (m.variant === 'main' || m.variant === 'review') &&
    (m.scene === 'approach' || m.scene === 'depart' || m.scene === 'pass')
  );
}
/** Fixed original side-view frames; labels identify shuffled pictures, not time. */
export function motionScene(visual: MotionFramesVisual): {
  direction: 'left' | 'right';
  landmark: number;
  positions: number[];
} {
  const review = visual.variant === 'review';
  return {
    direction: review ? 'left' : 'right',
    landmark: (() => {
      if (visual.scene === 'pass') return 150;
      return (() => {
        if (visual.scene === 'approach') return review ? 30 : 270;
        return review ? 270 : 30;
      })();
    })(),
    positions: (() => {
      if (visual.scene === 'approach')
        return review ? [105, 225, 165] : [145, 55, 225];
      return (() => {
        if (visual.scene === 'depart')
          return review ? [205, 65, 135] : [225, 65, 145];
        return review ? [65, 145, 225] : [225, 65, 145];
      })();
    })(),
  };
}

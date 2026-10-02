export interface QuarterCircleVisual {
  kind: 'quarter-circle';
  count: 1 | 2 | 3 | 4;
  layout: 'assembled' | 'separate';
  turn: 0 | 90 | 180 | 270;
}
export function quarterCircleSectors(model: QuarterCircleVisual) {
  const radius = model.layout === 'assembled' ? 95 : 55;
  return Array.from({ length: model.count }, (_, index) => {
    const x = model.layout === 'assembled' ? 150 : 75 + (index % 2) * 150;
    const y =
      model.layout === 'assembled' ? 150 : 75 + Math.floor(index / 2) * 150;
    const angle = model.turn + (model.layout === 'assembled' ? index * 90 : 0);
    const point = (degrees: number) => [
      x + radius * Math.cos((degrees * Math.PI) / 180),
      y + radius * Math.sin((degrees * Math.PI) / 180),
    ];
    const end = point(angle + 90);
    const start = point(angle);
    return {
      x,
      y,
      radius,
      angle,
      path: `M${x} ${y} L${start[0]} ${start[1]} A${radius} ${radius} 0 0 1 ${end[0]} ${end[1]} Z`,
    };
  });
}
export function isQuarterCircleVisual(
  value: unknown,
): value is QuarterCircleVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  return (
    Object.keys(model).length === 4 &&
    model.kind === 'quarter-circle' &&
    typeof model.count === 'number' &&
    Number.isInteger(model.count) &&
    model.count >= 1 &&
    model.count <= 4 &&
    typeof model.layout === 'string' &&
    ['assembled', 'separate'].includes(model.layout) &&
    typeof model.turn === 'number' &&
    [0, 90, 180, 270].includes(model.turn)
  );
}

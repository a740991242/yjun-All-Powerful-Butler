export interface MonthWeatherVisual {
  kind: 'month-weather';
  variant: 'main' | 'review';
}
export type MonthWeatherKind = 'cloudy' | 'rainy' | 'sunny';
export function isMonthWeatherVisual(
  value: unknown,
): value is MonthWeatherVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const m = value as Record<string, unknown>;
  return (
    Object.keys(m).length === 2 &&
    m.kind === 'month-weather' &&
    (m.variant === 'main' || m.variant === 'review')
  );
}
export function monthWeatherRecords(variant: MonthWeatherVisual['variant']) {
  const codes =
    variant === 'main'
      ? [
          1, 2, 3, 2, 1, 1, 3, 1, 3, 1, 2, 3, 1, 1, 1, 2, 1, 2, 3, 3, 3, 2, 3,
          1, 3, 2, 1, 3, 3, 1,
        ]
      : [
          3, 1, 2, 1, 3, 1, 3, 2, 1, 3, 1, 2, 1, 3, 1, 2, 3, 1, 3, 1, 2, 1, 3,
          1, 3, 2, 1, 3, 2, 1,
        ];
  return codes.map((code, index) => ({
    day: index + 1,
    code,
    kind: (() => {
      if (code === 1) return 'sunny';
      return code === 2 ? 'cloudy' : 'rainy';
    })() as MonthWeatherKind,
  }));
}

export interface BnuHundredWeatherVisual {
  kind: 'bnu-hundred-weather';
  variant: 'main' | 'review';
}
export function isBnuHundredWeatherVisual(
  value: unknown,
): value is BnuHundredWeatherVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const data = value as Record<string, unknown>;
  return (
    Object.keys(data).length === 2 &&
    data.kind === 'bnu-hundred-weather' &&
    (data.variant === 'main' || data.variant === 'review')
  );
}
export function hundredWeatherRows(
  variant: BnuHundredWeatherVisual['variant'],
) {
  return variant === 'main'
    ? [
        'SSSSSSSSSS',
        'CCCCCCCCCC',
        'SSSCCCCCCC',
        'CCCSSSSSSS',
        'CCCCCCSSSS',
        'SSSSSSCCCC',
        'CCCCCSSSSS',
      ]
    : ['SSCCC', 'SSSSC', 'CSSCC', 'SSSCS'];
}

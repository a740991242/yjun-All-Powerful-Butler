export function reconcileOrder(saved: unknown, codes: string[]): string[] {
  const valid = Array.isArray(saved)
    ? saved.filter(
        (code): code is string =>
          typeof code === 'string' && codes.includes(code),
      )
    : [];
  return [...new Set([...valid, ...codes])];
}

// Move relative to visible rows while leaving filtered-out rows in place.
export function moveOrder(
  order: string[],
  visible: string[],
  code: string,
  direction: 'down' | 'top' | 'up',
): string[] {
  const index = visible.indexOf(code);
  if (index === -1) return order;
  if (direction === 'top')
    return [code, ...order.filter((item) => item !== code)];
  const target = visible[index + (direction === 'up' ? -1 : 1)];
  if (!target) return order;
  const result = [...order];
  const from = result.indexOf(code);
  const to = result.indexOf(target);
  if (from === -1 || to === -1) return order;
  [result[from], result[to]] = [target, code];
  return result;
}

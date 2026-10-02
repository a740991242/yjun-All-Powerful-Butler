/** Accumulate without mutating the source collection. */
export function fold<T, U>(
  items: readonly T[],
  initial: U,
  combine: (state: U, item: T, index: number) => U,
): U {
  let state = initial;
  for (const [index, item] of items.entries())
    state = combine(state, item, index);
  return state;
}

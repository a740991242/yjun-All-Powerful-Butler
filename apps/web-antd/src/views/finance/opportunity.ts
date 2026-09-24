import type { evaluate } from './wishlist/model';
export type Opportunity = ReturnType<typeof evaluate>;
export type OpportunityFilter =
  | 'all'
  | 'reached'
  | 'wishlist'
  | 'within2'
  | 'within5';
export function matchesOpportunity(
  value: Opportunity | undefined,
  filter: OpportunityFilter,
) {
  if (filter === 'all') return true;
  if (!value) return false;
  if (filter === 'wishlist') return true;
  if (filter === 'reached') return value.status === 'reached';
  return value.gap !== null && value.gap <= (filter === 'within2' ? 2 : 5);
}
export function compareOpportunity(
  a: Opportunity | undefined,
  b: Opportunity | undefined,
) {
  const ag = a?.gap ?? Infinity;
  const bg = b?.gap ?? Infinity;
  if (ag === bg) return 0;
  return ag < bg ? -1 : 1;
}

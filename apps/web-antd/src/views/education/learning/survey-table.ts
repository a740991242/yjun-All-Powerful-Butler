import type { SurveyTableState, SurveyTableVisual } from './types';

import { fold } from './fold';
const record = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const count = (v: unknown): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 60;
export function isSurveyTableVisual(
  value: unknown,
): value is SurveyTableVisual {
  if (
    !record(value) ||
    Object.keys(value).length !== 2 ||
    value.kind !== 'survey-table' ||
    !Array.isArray(value.rows) ||
    value.rows.length < 2 ||
    value.rows.length > 4
  )
    return false;
  let total = 0;
  for (const row of value.rows) {
    if (
      !record(row) ||
      Object.keys(row).length !== 3 ||
      typeof row.label !== 'string' ||
      !row.label.trim() ||
      row.label.length > 40 ||
      (row.count !== null && !count(row.count))
    )
      return false;
    if (
      row.marks !== null &&
      (!record(row.marks) ||
        Object.keys(row.marks).length !== 2 ||
        (row.marks.symbol !== 'circle' && row.marks.symbol !== 'tick') ||
        !count(row.marks.count))
    )
      return false;
    if (
      record(row.marks) &&
      row.count !== null &&
      row.count !== row.marks.count
    )
      return false;
    total += record(row.marks)
      ? Number(row.marks.count)
      : Number(row.count ?? 0);
  }
  return (
    total <= 100 &&
    new Set(value.rows.map((r) => r.label)).size === value.rows.length
  );
}
export function isSurveyTableState(value: unknown): value is SurveyTableState {
  return (
    record(value) &&
    Object.keys(value).length === 1 &&
    Array.isArray(value.counts) &&
    value.counts.length >= 2 &&
    value.counts.length <= 4 &&
    [...value.counts].every((c) => c === null || count(c)) &&
    fold(value.counts, 0, (sum: number, c) => sum + (c ?? 0)) <= 100
  );
}
export function blankSurvey(visual: SurveyTableVisual) {
  return visual.rows.every((row) => row.marks === null && row.count === null);
}
export function matchingSurveyState(
  value: unknown,
  visual: SurveyTableVisual,
): value is SurveyTableState {
  return (
    blankSurvey(visual) &&
    isSurveyTableState(value) &&
    value.counts.length === visual.rows.length
  );
}
export function setSurveyCount(
  visual: SurveyTableVisual,
  state: SurveyTableState,
  index: number,
  value: null | number,
): SurveyTableState {
  if (
    !matchingSurveyState(state, visual) ||
    !Number.isInteger(index) ||
    index < 0 ||
    index >= state.counts.length ||
    (value !== null && !count(value))
  )
    throw new Error('educationLearning.invalidRecord');
  const next = { counts: [...state.counts] };
  next.counts[index] = value;
  return isSurveyTableState(next) ? next : { counts: [...state.counts] };
}

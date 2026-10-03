import type {
  RegionalApplicationQuery,
  RegionalEditionAction,
} from './regional-application';

import { editionTarget } from './content/edition-targets';
import {
  regionalCities,
  regionalProvinces,
  regionalSchools,
} from './regional-locations';

export type RegionalPresetEdition = 'bnu-2024' | 'keep' | 'pep-2024' | 'sujiao';
export interface RegionalPresetEditions {
  chinese: 'keep' | 'pep-2024';
  math: RegionalPresetEdition;
  ethics: 'keep' | 'pep-2024';
}
export interface RegionalPresetScope {
  province: string;
  city: string;
  school: string;
  academicYear: string;
  volume: 'lower' | 'upper';
  schoolSystem: 'six-three';
}
export interface RegionalPreset {
  scope: RegionalPresetScope;
  editions: RegionalPresetEditions;
}
export interface RegionalPresetData {
  schemaVersion: 1;
  entries: RegionalPreset[];
}
export const REGIONAL_PRESETS_KEY = 'butler-grade-one-regional-presets-v1';
export const emptyRegionalEditions = (): RegionalPresetEditions => ({
  chinese: 'keep',
  math: 'keep',
  ethics: 'keep',
});
const subjects = ['chinese', 'math', 'ethics'] as const;
function record(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
function keys(value: Record<string, unknown>, expected: readonly string[]) {
  return (
    Object.keys(value).length === expected.length &&
    expected.every((key) => Object.hasOwn(value, key))
  );
}
function isScope(value: unknown): value is RegionalPresetScope {
  if (
    !record(value) ||
    !keys(value, [
      'province',
      'city',
      'school',
      'academicYear',
      'volume',
      'schoolSystem',
    ])
  )
    return false;
  if (
    typeof value.province !== 'string' ||
    !regionalProvinces.some((id) => id === value.province) ||
    typeof value.city !== 'string' ||
    typeof value.school !== 'string'
  )
    return false;
  if (value.city && !regionalCities(value.province).includes(value.city))
    return false;
  if (
    value.school &&
    !regionalSchools(value.province, value.city).includes(value.school)
  )
    return false;
  return (
    typeof value.academicYear === 'string' &&
    ['2025-2026', '2026-2027'].includes(value.academicYear) &&
    (value.volume === 'upper' || value.volume === 'lower') &&
    value.schoolSystem === 'six-three'
  );
}
function isEditions(value: unknown): value is RegionalPresetEditions {
  return (
    record(value) &&
    keys(value, subjects) &&
    (value.chinese === 'keep' || value.chinese === 'pep-2024') &&
    (value.ethics === 'keep' || value.ethics === 'pep-2024') &&
    (value.math === 'keep' ||
      value.math === 'pep-2024' ||
      value.math === 'sujiao' ||
      value.math === 'bnu-2024')
  );
}
/** A personal navigation setting. It never adds evidence of textbook adoption. */
export function regionalPresetScope(
  query: RegionalApplicationQuery,
): RegionalPresetScope | undefined {
  if (query.stage !== 'primary' || query.grade !== 'p1') return;
  const scope = {
    province: query.province,
    city: query.city,
    school: query.school,
    academicYear: query.academicYear,
    volume: query.volume,
    schoolSystem: query.schoolSystem,
  };
  return isScope(scope) ? scope : undefined;
}
function scopeKey(scope: RegionalPresetScope) {
  return JSON.stringify([
    scope.province,
    scope.city,
    scope.school,
    scope.academicYear,
    scope.volume,
    scope.schoolSystem,
  ]);
}
export function parseRegionalPresets(raw: string): RegionalPresetData {
  if (raw.length > 256_000) throw new Error('regionalPresetInvalid');
  const value: unknown = JSON.parse(raw);
  if (
    !record(value) ||
    !keys(value, ['schemaVersion', 'entries']) ||
    value.schemaVersion !== 1 ||
    !Array.isArray(value.entries) ||
    value.entries.length > 256
  )
    throw new Error('regionalPresetInvalid');
  const entries: RegionalPreset[] = [];
  const seen = new Set<string>();
  for (const item of value.entries) {
    if (
      !record(item) ||
      !keys(item, ['scope', 'editions']) ||
      !isScope(item.scope) ||
      !isEditions(item.editions)
    )
      throw new Error('regionalPresetInvalid');
    const editions = item.editions;
    if (subjects.every((subject) => editions[subject] === 'keep'))
      throw new Error('regionalPresetInvalid');
    const key = scopeKey(item.scope);
    if (seen.has(key)) throw new Error('regionalPresetInvalid');
    seen.add(key);
    entries.push({
      scope: structuredClone(item.scope),
      editions: structuredClone(item.editions),
    });
  }
  return { schemaVersion: 1, entries };
}
export function readRegionalPresets(
  storage: Pick<Storage, 'getItem'>,
): RegionalPresetData {
  const raw = storage.getItem(REGIONAL_PRESETS_KEY);
  return raw === null
    ? { schemaVersion: 1, entries: [] }
    : parseRegionalPresets(raw);
}
export function writeRegionalPresets(
  storage: Pick<Storage, 'setItem'>,
  data: RegionalPresetData,
) {
  const validated = parseRegionalPresets(JSON.stringify(data));
  storage.setItem(REGIONAL_PRESETS_KEY, JSON.stringify(validated));
}
export function findRegionalPreset(
  data: RegionalPresetData,
  query: RegionalApplicationQuery,
): RegionalPreset | undefined {
  const scope = regionalPresetScope(query);
  if (!scope) return;
  const entry = data.entries.find(
    (item) => scopeKey(item.scope) === scopeKey(scope),
  );
  return entry ? structuredClone(entry) : undefined;
}
export function regionalPresetActions(
  query: RegionalApplicationQuery,
  editions: RegionalPresetEditions,
): RegionalEditionAction[] {
  if (!regionalPresetScope(query) || !isEditions(editions)) return [];
  return subjects.flatMap((subject) => {
    const target = editionTarget(subject, editions[subject], query.volume);
    return target?.status === 'available'
      ? [
          {
            subject: target.subject,
            edition: target.edition,
            volume: target.volume,
          },
        ]
      : [];
  });
}
export function saveRegionalPreset(
  data: RegionalPresetData,
  query: RegionalApplicationQuery,
  editions: RegionalPresetEditions,
): RegionalPresetData {
  const scope = regionalPresetScope(query);
  const actions = regionalPresetActions(query, editions);
  const selectedCount = subjects.filter(
    (subject) => editions[subject] !== 'keep',
  ).length;
  if (
    !scope ||
    !isEditions(editions) ||
    actions.length === 0 ||
    actions.length !== selectedCount
  )
    throw new Error('regionalPresetUnavailable');
  return parseRegionalPresets(
    JSON.stringify({
      schemaVersion: 1,
      entries: [
        ...data.entries.filter(
          (item) => scopeKey(item.scope) !== scopeKey(scope),
        ),
        { scope, editions },
      ],
    }),
  );
}
export function removeRegionalPreset(
  data: RegionalPresetData,
  query: RegionalApplicationQuery,
): RegionalPresetData {
  const scope = regionalPresetScope(query);
  return {
    schemaVersion: 1,
    entries: scope
      ? data.entries
          .filter((item) => scopeKey(item.scope) !== scopeKey(scope))
          .map((item) => structuredClone(item))
      : structuredClone(data.entries),
  };
}

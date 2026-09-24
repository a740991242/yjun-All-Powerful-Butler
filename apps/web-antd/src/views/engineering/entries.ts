import { isRecord } from './model';
export interface Entry {
  id: string;
  title: string;
  kind: 'command' | 'regex' | 'snippet' | 'troubleshooting';
  tags: string[];
  content: string;
  updatedAt: string;
}
export function validateEntries(value: unknown): Entry[] {
  if (!Array.isArray(value) || value.length > 1000)
    throw new Error('engineering.invalidImport');
  const ids = new Set<string>();
  return value.map((item) => {
    if (
      !isRecord(item) ||
      typeof item.id !== 'string' ||
      !item.id ||
      item.id.length > 100 ||
      ids.has(item.id) ||
      typeof item.title !== 'string' ||
      !item.title.trim() ||
      item.title.length > 200 ||
      !['command', 'regex', 'snippet', 'troubleshooting'].includes(
        String(item.kind),
      ) ||
      typeof item.content !== 'string' ||
      item.content.length > 100_000 ||
      !Array.isArray(item.tags) ||
      item.tags.length > 30 ||
      !item.tags.every((t) => typeof t === 'string' && t.length <= 100) ||
      typeof item.updatedAt !== 'string' ||
      !Number.isFinite(Date.parse(item.updatedAt))
    )
      throw new Error('engineering.invalidImport');
    ids.add(item.id);
    return {
      id: item.id,
      title: item.title,
      kind: item.kind as Entry['kind'],
      tags: [...item.tags] as string[],
      content: item.content,
      updatedAt: item.updatedAt,
    };
  });
}
export const ENTRY_KEY = 'all-in-one-butler:engineering:entries:v1';
export const ENTRY_CHANGED = 'engineering:entries-changed';
export function readEntries() {
  const raw = localStorage.getItem(ENTRY_KEY);
  return raw === null ? [] : validateEntries(JSON.parse(raw));
}
export function saveEntries(entries: Entry[]) {
  localStorage.setItem(ENTRY_KEY, JSON.stringify(validateEntries(entries)));
  window.dispatchEvent(new Event(ENTRY_CHANGED));
}
export function mergeEntries(old: Entry[], incoming: Entry[]) {
  const map = new Map(old.map((item) => [item.id, item]));
  for (const item of incoming) {
    const existing = map.get(item.id);
    if (
      !existing ||
      Date.parse(item.updatedAt) > Date.parse(existing.updatedAt)
    )
      map.set(item.id, item);
  }
  return validateEntries([...map.values()]);
}

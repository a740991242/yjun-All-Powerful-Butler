import type { Lesson, LibraryState } from './types';

import { describe, expect, it } from 'vitest';

import {
  exportBackup,
  exportBackupFiles,
  isLibraryState,
  MAX_BACKUP_BYTES,
  parseBackup,
  previewMerge,
} from './backup';
import { createSession } from './engine';

const now = '2026-09-30T00:00:00.000Z';
const lesson: Lesson = {
  id: 'backup-fixture',
  title: '备份测试',
  textbookTitle: '测试',
  page: 1,
  goal: '测试',
  prerequisite: '',
  parentTip: '',
  version: 1,
  status: 'available',
  steps: [],
  review: { date: now, reviewer: 'test', notes: 'test' },
  questions: [
    {
      id: 'question-1',
      knowledge: 'test',
      prompt: '有几个？',
      material: '字'.repeat(16_000),
      rule: { kind: 'number', value: 1 },
      hint: '数一数。',
      explanation: '一个。',
    },
  ],
};
function largeLibrary(): LibraryState {
  return {
    schemaVersion: 1,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '备份', createdAt: now }],
    sessions: Array.from({ length: 200 }, (_, index) => ({
      ...createSession(lesson, 'pep-math-p1-upper-2024', 'child', {
        now,
        seed: index,
        mode: index >= 190 ? 'review' : 'lesson',
        originalSessionId: index >= 190 ? 'session-0' : undefined,
      }),
      id: `session-${index}`,
    })),
  };
}
describe('bounded and independently restorable backup files', () => {
  it('partitions all records without mutation, preserving ancestor attempts and allowing reverse-order or repeated imports', () => {
    const source = largeLibrary();
    const before = structuredClone(source);
    expect(isLibraryState(source)).toBe(true);
    expect(() => exportBackup(source, now)).toThrow('backupNeedsParts');
    const files = exportBackupFiles(source, now);
    expect(files.length).toBeGreaterThan(1);
    let restored: LibraryState = { ...source, sessions: [] };
    for (const file of [...files].toReversed()) {
      expect(new TextEncoder().encode(file).length).toBeLessThanOrEqual(
        MAX_BACKUP_BYTES,
      );
      const data = parseBackup(file).data;
      for (const session of data.sessions)
        if (session.originalSessionId)
          expect(
            data.sessions.some(
              (parent) => parent.id === session.originalSessionId,
            ),
          ).toBe(true);
      restored = previewMerge(restored, data).result;
    }
    const sort = (data: LibraryState) =>
      [...data.sessions].toSorted((a, b) => a.id.localeCompare(b.id));
    expect(sort(restored)).toEqual(sort(source));
    for (const file of files) {
      const merge = previewMerge(restored, parseBackup(file).data);
      expect(merge.sessions).toBe(0);
      expect(merge.profiles).toBe(0);
    }
    expect(source).toEqual(before);
  });
  it('rejects invalid export timestamps, preserves single-file compatibility and uses compact JSON near the size limit', () => {
    const full = largeLibrary();
    expect(() => exportBackupFiles(full, 'not a date')).toThrow(
      'invalidRecord',
    );
    const small = { ...full, sessions: full.sessions.slice(0, 1) };
    expect(exportBackupFiles(small, now)).toEqual([exportBackup(small, now)]);
    expect(parseBackup(exportBackup(small, now)).data).toEqual(small);
    const near = { ...full, sessions: [] as LibraryState['sessions'] };
    for (const session of full.sessions.slice(0, 190)) {
      const candidate = { ...near, sessions: [...near.sessions, session] };
      const compact = JSON.stringify({
        format: 'butler-grade-one',
        exportedAt: now,
        data: candidate,
      });
      if (new TextEncoder().encode(compact).length > MAX_BACKUP_BYTES) break;
      near.sessions.push(session);
    }
    const pretty = JSON.stringify(
      { format: 'butler-grade-one', exportedAt: now, data: near },
      null,
      2,
    );
    expect(new TextEncoder().encode(pretty).length).toBeGreaterThan(
      MAX_BACKUP_BYTES,
    );
    expect(exportBackupFiles(near, now)).toHaveLength(1);
    expect(parseBackup(exportBackup(near, now)).data).toEqual(near);
  });
  it('refuses an individually oversized attempt instead of dropping its questions or altering source history', () => {
    const hugeLesson = {
      ...lesson,
      questions: Array.from({ length: 100 }, (_, index) => ({
        ...lesson.questions[0]!,
        id: `question-${index}`,
        prompt: '题'.repeat(16_000),
        hint: '提'.repeat(16_000),
        explanation: '解'.repeat(16_000),
      })),
    };
    const source: LibraryState = {
      schemaVersion: 1,
      activeProfileId: 'child',
      profiles: [{ id: 'child', nickname: '备份', createdAt: now }],
      sessions: [
        createSession(hugeLesson, 'pep-math-p1-upper-2024', 'child', {
          now,
          seed: 1,
        }),
      ],
    };
    expect(isLibraryState(source)).toBe(true);
    expect(() => exportBackupFiles(source, now)).toThrow(
      'backupRecordTooLarge',
    );
    expect(source.sessions[0]!.questions).toHaveLength(100);
  });
});

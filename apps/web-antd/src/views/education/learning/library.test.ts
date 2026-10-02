import type { Lesson, LibraryState } from './types';

import { expect, it } from 'vitest';

import { exportBackup } from './backup';
import { createStudyLibrary } from './library';
import { initialLibrary } from './storage';

const lesson: Lesson = {
  id: 'count',
  textbookTitle: '数一数',
  title: '数一数',
  page: 13,
  goal: '数数',
  prerequisite: '观察',
  parentTip: '点一个数一个',
  version: 1,
  status: 'available',
  steps: [],
  review: { reviewer: 'test', date: '2026-09-30', notes: 'fixture' },
  questions: [
    {
      id: 'q',
      knowledge: 'count',
      prompt: '1+1',
      rule: { kind: 'number', value: 2 },
      hint: '数圆片',
      explanation: '2',
    },
  ],
};
function memory() {
  let stored: LibraryState | null = null;
  let fail = false;
  const repository = {
    load: async () => structuredClone(stored),
    save: async (value: LibraryState) => {
      if (fail) throw new Error('disk full');
      stored = structuredClone(value);
    },
  };
  return {
    repository,
    fail: () => {
      fail = true;
    },
    recover: () => {
      fail = false;
    },
    snapshot: () => stored,
  };
}
it('does not finish unanswered tasks through the library API, but records an explicit skip', async () => {
  const db = memory();
  const app = createStudyLibrary(db.repository);
  await app.initialize('test');
  const attempt = await app.start(lesson, 'book', { mode: 'practice' });
  await expect(app.finish(attempt.id)).rejects.toThrow('finishPending');
  expect(app.activeSession(attempt.id).completedAt).toBeUndefined();
  expect(db.snapshot()?.sessions[0]?.phase).toBe('practice');
  await app.updateSession(attempt.id, (session) => {
    session.responses[0]!.skipped = true;
  });
  await app.finish(attempt.id);
  expect(app.activeSession(attempt.id).phase).toBe('summary');
});
it('restores the same question draft and isolates profiles with immutable completed evidence', async () => {
  const db = memory();
  const app = createStudyLibrary(db.repository);
  await app.initialize('甲');
  const firstProfile = app.activeProfile.value!.id;
  const attempt = await app.start(lesson, 'book');
  await app.updateSession(attempt.id, (session) => {
    session.phase = 'practice';
    session.responses[0]!.draft = 2;
  });
  const restored = createStudyLibrary(db.repository);
  await restored.initialize('unused');
  expect(restored.activeSession(attempt.id).responses[0]!.draft).toBe(2);
  await restored.submit(attempt.id);
  await restored.finish(attempt.id);
  await expect(restored.updateSession(attempt.id, () => {})).rejects.toThrow(
    'completedRecord',
  );
  await restored.addProfile('乙');
  expect(restored.sessions.value).toHaveLength(0);
  expect(() => restored.activeSession(attempt.id)).toThrow('invalidRecord');
  await restored.selectProfile(firstProfile);
  expect(restored.sessions.value).toHaveLength(1);
});
it('keeps unsaved results exportable and retries after storage failure', async () => {
  const db = memory();
  const app = createStudyLibrary(db.repository);
  await app.initialize('甲');
  db.fail();
  await app.start(lesson, 'book');
  expect(app.error.value).toBe('educationLearning.unsaved');
  expect(JSON.parse(app.backup()).data.sessions).toHaveLength(1);
  db.recover();
  expect(await app.persist()).toBe(true);
  expect(db.snapshot()?.sessions).toHaveLength(1);
  expect(app.error.value).toBe('');
});
it('never replaces unknown records when reading fails', async () => {
  let writes = 0;
  const app = createStudyLibrary({
    load: async () => {
      throw new Error('corrupt');
    },
    save: async () => {
      writes++;
    },
  });
  await app.initialize('甲');
  expect(app.state.value).toBeNull();
  expect(app.loaded.value).toBe(true);
  expect(writes).toBe(0);
  await expect(app.addProfile('乙')).rejects.toThrow('storageFailed');
});
it('leaves memory and disk intact if an import write fails', async () => {
  const db = memory();
  const app = createStudyLibrary(db.repository);
  await app.initialize('甲');
  const incoming = exportBackup(initialLibrary('乙'));
  expect(app.previewImport(incoming).profiles).toBe(1);
  const before = structuredClone(app.state.value);
  db.fail();
  await expect(app.importBackup(incoming)).rejects.toThrow('storageFailed');
  expect(app.state.value).toEqual(before);
  expect(db.snapshot()).toEqual(before);
});

it('recovers a failed read without resetting an existing profile', async () => {
  const existing = initialLibrary('原档案');
  let failed = true;
  const app = createStudyLibrary({
    load: async () => {
      if (failed) throw new Error('temporary');
      return structuredClone(existing);
    },
    save: async () => {},
  });
  await app.initialize('新档案');
  failed = false;
  await app.initialize('新档案');
  expect(app.activeProfile.value?.nickname).toBe('原档案');
});

it('preserves partially filled number drafts and negative wrong attempts in backups', async () => {
  const split = structuredClone(lesson);
  split.questions[0]!.rule = {
    kind: 'partition',
    parts: 2,
    minimum: 1,
    total: 4,
  };
  const db = memory();
  const app = createStudyLibrary(db.repository);
  await app.initialize('甲');
  const attempt = await app.start(split, 'book', { mode: 'practice' });
  await app.updateSession(attempt.id, (value) => {
    value.responses[0]!.draft = [1, null];
  });
  expect(JSON.parse(app.backup()).data.sessions[0].responses[0].draft).toEqual([
    1,
    null,
  ]);
  await expect(app.submit(attempt.id)).rejects.toThrow('answerRequired');
  await app.updateSession(attempt.id, (value) => {
    value.responses[0]!.draft = [-1, 5];
  });
  await app.submit(attempt.id);
  expect(
    JSON.parse(app.backup()).data.sessions[0].responses[0].submissions[0]
      .correct,
  ).toBe(false);
});

it('keeps edits made while an import transaction is pending', async () => {
  let writes = 0;
  let stored: LibraryState | null = null;
  let release = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const app = createStudyLibrary({
    load: async () => stored,
    save: async (value) => {
      writes++;
      if (writes === 2) await gate;
      stored = structuredClone(value);
    },
  });
  await app.initialize('甲');
  const importing = app.importBackup(exportBackup(initialLibrary('乙')));
  const session = await app.start(lesson, 'book');
  release();
  await importing;
  expect(app.state.value?.sessions[0]?.id).toBe(session.id);
  expect(app.state.value?.profiles).toHaveLength(2);
  expect(stored).toEqual(app.state.value);
});

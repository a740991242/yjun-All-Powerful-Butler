import type { Lesson, LibraryState, Question, Session } from './types';

import { computed, shallowRef } from 'vue';

import {
  exportBackup,
  exportBackupFiles,
  parseBackup,
  previewMerge,
} from './backup';
import { createSession, mistakes, submitResponse } from './engine';
import { createLibraryStorage, initialLibrary } from './storage';

export interface LibraryRepository {
  load: () => Promise<LibraryState | null>;
  save: (state: LibraryState) => Promise<void>;
}

export function createStudyLibrary(repository?: LibraryRepository) {
  const state = shallowRef<LibraryState | null>(null);
  const loaded = shallowRef(false);
  const storageError = shallowRef('');
  const saving = shallowRef(false);
  const writable = shallowRef(false);
  let adapter = repository;
  let loading: Promise<void> | undefined;
  let revision = 0;
  const activeProfile = computed(() =>
    state.value?.profiles.find(
      (item) => item.id === state.value?.activeProfileId,
    ),
  );
  const sessions = computed(
    () =>
      state.value?.sessions.filter(
        (item) => item.profileId === activeProfile.value?.id,
      ) ?? [],
  );

  async function initialize(nickname: string) {
    if (loaded.value && writable.value) return;
    loading ??= (async () => {
      try {
        adapter ??= createLibraryStorage();
        state.value = (await adapter.load()) ?? initialLibrary(nickname);
        writable.value = true;
        loaded.value = true;
        await persist();
      } catch (error: unknown) {
        storageError.value =
          error instanceof Error &&
          error.message.startsWith('educationLearning.')
            ? error.message
            : 'educationLearning.storageFailed';
        // A failed read must never replace unknown existing records with an empty library.
        writable.value = false;
        loaded.value = true;
      }
    })();
    await loading;
    loading = undefined;
  }

  async function persist(): Promise<boolean> {
    if (!state.value || !adapter || !writable.value) return false;
    const currentRevision = ++revision;
    saving.value = true;
    try {
      await adapter.save(structuredClone(state.value));
      if (currentRevision === revision) storageError.value = '';
      return true;
    } catch {
      if (currentRevision === revision)
        storageError.value = 'educationLearning.unsaved';
      return false;
    } finally {
      if (currentRevision === revision) saving.value = false;
    }
  }

  function library() {
    if (!state.value || !writable.value)
      throw new Error('educationLearning.storageFailed');
    return state.value;
  }
  async function addProfile(nickname: string) {
    const current = library();
    const trimmed = nickname.trim();
    if (!trimmed || trimmed.length > 40 || current.profiles.length >= 64)
      throw new Error('educationLearning.invalidNickname');
    const profile = {
      id: crypto.randomUUID(),
      nickname: trimmed,
      createdAt: new Date().toISOString(),
    };
    state.value = {
      ...current,
      activeProfileId: profile.id,
      profiles: [...current.profiles, profile],
    };
    await persist();
    return profile;
  }
  async function selectProfile(id: string) {
    const current = library();
    if (!current.profiles.some((item) => item.id === id))
      throw new Error('educationLearning.invalidRecord');
    state.value = { ...current, activeProfileId: id };
    await persist();
  }
  async function renameProfile(nickname: string) {
    const current = library();
    const trimmed = nickname.trim();
    if (!trimmed || trimmed.length > 40)
      throw new Error('educationLearning.invalidNickname');
    state.value = {
      ...current,
      profiles: current.profiles.map((item) =>
        item.id === current.activeProfileId
          ? { ...item, nickname: trimmed }
          : item,
      ),
    };
    await persist();
  }
  function activeSession(id: string) {
    const current = library();
    const session = current.sessions.find(
      (item) => item.id === id && item.profileId === current.activeProfileId,
    );
    if (!session) throw new Error('educationLearning.invalidRecord');
    return session;
  }
  async function updateSession(id: string, change: (session: Session) => void) {
    const current = library();
    const session = structuredClone(activeSession(id));
    if (session.completedAt)
      throw new Error('educationLearning.completedRecord');
    change(session);
    session.updatedAt = new Date().toISOString();
    state.value = {
      ...current,
      sessions: current.sessions.map((item) =>
        item.id === id ? session : item,
      ),
    };
    await persist();
    return session;
  }
  async function start(
    lesson: Lesson,
    bookId: string,
    options: {
      mode?: Session['mode'];
      originalSessionId?: string;
      questions?: Question[];
      seed?: number;
    } = {},
  ) {
    if (lesson.status !== 'available')
      throw new Error('educationLearning.notAvailable');
    const current = library();
    const session = createSession(
      lesson,
      bookId,
      current.activeProfileId,
      options,
    );
    state.value = { ...current, sessions: [...current.sessions, session] };
    await persist();
    return session;
  }
  async function submit(id: string) {
    return updateSession(id, (session) => {
      const index = session.questionIndex;
      const question = session.questions[index];
      const response = session.responses[index];
      if (!question || !response || session.phase !== 'practice')
        throw new Error('educationLearning.invalidRecord');
      session.responses[index] = submitResponse(question, response);
    });
  }
  async function finish(id: string) {
    return updateSession(id, (session) => {
      if (
        session.phase !== 'practice' ||
        session.responses.some(
          (response) => !response.skipped && response.submissions.length === 0,
        )
      )
        throw new Error('educationLearning.finishPending');
      session.phase = 'summary';
      session.completedAt = new Date().toISOString();
    });
  }
  function wrongAnswers(bookId?: string) {
    return sessions.value
      .filter((item) => !bookId || item.bookId === bookId)
      .flatMap((session) =>
        mistakes(session).map((question) => ({ session, question })),
      );
  }
  function backup() {
    if (!state.value) throw new Error('educationLearning.storageFailed');
    return exportBackup(state.value);
  }
  function backupFiles() {
    if (!state.value) throw new Error('educationLearning.storageFailed');
    return exportBackupFiles(state.value);
  }
  function previewImport(source: string) {
    return previewMerge(library(), parseBackup(source).data);
  }
  async function importBackup(source: string) {
    // Re-evaluate against the current library even if a preview has been open for a while.
    if (!adapter) throw new Error('educationLearning.storageFailed');
    while (true) {
      const currentRevision = revision;
      const merged = previewImport(source);
      try {
        await adapter.save(merged.result);
      } catch {
        throw new Error('educationLearning.storageFailed');
      }
      // Edits made while the import transaction was pending must also survive.
      if (currentRevision !== revision) continue;
      state.value = merged.result;
      revision++;
      saving.value = false;
      storageError.value = '';
      return merged;
    }
  }
  return {
    state,
    loaded,
    error: storageError,
    saving,
    activeProfile,
    sessions,
    initialize,
    persist,
    addProfile,
    selectProfile,
    renameProfile,
    activeSession,
    updateSession,
    start,
    submit,
    finish,
    wrongAnswers,
    backup,
    backupFiles,
    previewImport,
    importBackup,
  };
}

export const studyLibrary = createStudyLibrary();

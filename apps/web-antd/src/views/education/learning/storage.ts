import type { LibraryState } from './types';

import { isLibraryState } from './backup';

export function initialLibrary(nickname: string): LibraryState {
  const id = crypto.randomUUID();
  return {
    schemaVersion: 1,
    activeProfileId: id,
    profiles: [{ id, nickname, createdAt: new Date().toISOString() }],
    sessions: [],
  };
}

export function createLibraryStorage(factory: IDBFactory = indexedDB) {
  let connection: Promise<IDBDatabase> | undefined;
  function open() {
    connection ??= new Promise<IDBDatabase>((resolve, reject) => {
      const request = factory.open('butler-grade-one', 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains('library'))
          request.result.createObjectStore('library');
      };
      request.addEventListener('error', () =>
        reject(new Error('educationLearning.storageFailed')),
      );
      request.addEventListener('blocked', () =>
        reject(new Error('educationLearning.storageBlocked')),
      );
      request.onsuccess = () => {
        const database = request.result;
        database.addEventListener('versionchange', () => {
          database.close();
          connection = undefined;
        });
        resolve(database);
      };
    }).catch((error: unknown) => {
      connection = undefined;
      throw error;
    });
    return connection;
  }
  async function load(): Promise<LibraryState | null> {
    const database = await open();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction('library', 'readonly');
      const request = transaction.objectStore('library').get('state');
      let result: unknown;
      request.onsuccess = () => {
        result = request.result;
      };
      transaction.oncomplete = () => {
        if (result === undefined) resolve(null);
        else if (isLibraryState(result)) resolve(result);
        else reject(new Error('educationLearning.invalidRecord'));
      };
      const rejectTransaction = () =>
        reject(new Error('educationLearning.storageFailed'));
      transaction.addEventListener('error', rejectTransaction);
      transaction.addEventListener('abort', rejectTransaction);
    });
  }
  // Queue snapshots; an older, slower save must not overwrite a newer one.
  let tail: Promise<void> = Promise.resolve();
  function save(state: LibraryState): Promise<void> {
    if (!isLibraryState(state))
      return Promise.reject(new Error('educationLearning.invalidRecord'));
    const snapshot = structuredClone(state);
    const write = tail
      .catch(() => {})
      .then(async () => {
        const database = await open();
        await new Promise<void>((resolve, reject) => {
          const transaction = database.transaction('library', 'readwrite');
          transaction.objectStore('library').put(snapshot, 'state');
          transaction.oncomplete = () => resolve();
          const rejectTransaction = () =>
            reject(new Error('educationLearning.storageFailed'));
          transaction.addEventListener('error', rejectTransaction);
          transaction.addEventListener('abort', rejectTransaction);
        });
      });
    tail = write;
    return write;
  }
  async function close() {
    const database = await connection;
    database?.close();
    connection = undefined;
  }
  return { load, save, close };
}

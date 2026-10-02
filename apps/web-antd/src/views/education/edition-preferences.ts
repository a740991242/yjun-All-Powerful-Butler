import { ref, watch } from 'vue';

type MathEdition = 'pep-2024' | 'sujiao';
type PreferenceStorage = Pick<Storage, 'getItem' | 'setItem'>;
export const MATH_EDITION_KEY = 'butler-grade-one-math-edition-v1';

/** User navigation preference, not a verified regional textbook assignment. */
export function createMathEditionPreference(
  getStorage: () => PreferenceStorage | undefined,
) {
  const edition = ref<MathEdition>('sujiao');
  const persistenceFailed = ref(false);
  try {
    const saved = getStorage()?.getItem(MATH_EDITION_KEY);
    if (saved === 'pep-2024' || saved === 'sujiao') edition.value = saved;
  } catch {
    persistenceFailed.value = true;
  }
  watch(
    edition,
    (value) => {
      try {
        const storage = getStorage();
        storage?.setItem(MATH_EDITION_KEY, value);
        persistenceFailed.value = !storage;
      } catch {
        persistenceFailed.value = true;
      }
    },
    { flush: 'sync' },
  );
  return { edition, persistenceFailed };
}

// This key is separate from IndexedDB learner profiles, books and session snapshots.
const preference = createMathEditionPreference(() =>
  typeof window === 'undefined' ? undefined : window.localStorage,
);
export const mathEditionPreference = preference.edition;
export const mathEditionPersistenceFailed = preference.persistenceFailed;

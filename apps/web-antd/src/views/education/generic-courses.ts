import type { RegionalEditionAction } from './regional-application';

import { editionTarget } from './content/edition-targets';

/** The user's Suzhou learning preference, independent of school adoption evidence. */
export function suzhouGenericCourses(volume: unknown): RegionalEditionAction[] {
  if (volume !== 'upper' && volume !== 'lower') return [];
  return (['chinese', 'math', 'ethics'] as const).flatMap((subject) => {
    const edition = subject === 'math' ? 'sujiao' : 'pep-2024';
    const target = editionTarget(subject, edition, volume);
    return target?.status === 'available' ? [{ subject, edition, volume }] : [];
  });
}

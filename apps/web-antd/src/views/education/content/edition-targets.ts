import type { Subject, Volume } from '../learning/types';

export interface EditionTarget {
  subject: Subject;
  volume: Volume;
  edition: 'pep-2024' | 'sujiao';
  status: 'available' | 'preparing';
}
/** A planned target is not a textbook, a verified contents list or a session book ID. */
export function editionTarget(
  subject: unknown,
  edition: unknown,
  volume: unknown,
): EditionTarget | undefined {
  if (
    (subject !== 'chinese' && subject !== 'math') ||
    (volume !== 'upper' && volume !== 'lower')
  )
    return;
  if (edition === 'pep-2024')
    return { subject, volume, edition, status: 'available' };
  if (subject === 'math' && edition === 'sujiao')
    return {
      subject,
      volume,
      edition,
      status: 'available',
    };
}

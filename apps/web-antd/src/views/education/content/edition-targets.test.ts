import { describe, expect, it } from 'vitest';

import { chineseBooks } from './chinese';
import { editionTarget } from './edition-targets';
import { mathBooks } from './math';
import { findTextbook } from './textbooks';

describe('textbook edition target boundaries', () => {
  it('preserves the four original textbook identities while planning a separate mathematics target', () => {
    for (const book of [...mathBooks, ...chineseBooks]) {
      expect(
        editionTarget(book.subject, book.edition, book.volume)?.status,
      ).toBe('available');
      expect(findTextbook(book.subject, book.edition, book.volume)?.id).toBe(
        book.id,
      );
    }
    for (const volume of ['upper', 'lower']) {
      expect(editionTarget('math', 'sujiao', volume)).toEqual({
        subject: 'math',
        edition: 'sujiao',
        volume,
        status: 'available',
      });
      if (volume === 'upper')
        expect(findTextbook('math', 'sujiao', volume)?.id).toBe(
          'sujiao-math-p1-upper-2024',
        );
      else
        expect(findTextbook('math', 'sujiao', volume)?.id).toBe(
          'sujiao-math-p1-lower-9787574312951',
        );
    }
  });
  it('never silently maps unknown editions, subjects, volumes or array parameters to the available curriculum', () => {
    for (const args of [
      ['chinese', 'sujiao', 'upper'],
      ['math', 'sujiao', 'middle'],
      ['english', 'pep-2024', 'upper'],
      ['math', 'sujiao-2024', 'lower'],
      [['math'], 'pep-2024', 'upper'],
      ['math', ['sujiao'], 'upper'],
      ['math', 'sujiao', ['lower']],
      ['math', null, 'upper'],
    ])
      expect(
        editionTarget(...(args as [unknown, unknown, unknown])),
      ).toBeUndefined();
  });
});

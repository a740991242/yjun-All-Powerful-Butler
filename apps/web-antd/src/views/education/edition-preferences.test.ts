import { effectScope } from 'vue';

import { describe, expect, it } from 'vitest';

import {
  createMathEditionPreference,
  MATH_EDITION_KEY,
} from './edition-preferences';

describe('math edition navigation preference', () => {
  it('defaults to Sujiao without treating arbitrary saved values as editions', () => {
    for (const saved of [null, '', 'PEP', 'sujiao-lower', 'chinese']) {
      const scope = effectScope();
      const preference = scope.run(() =>
        createMathEditionPreference(() => ({
          getItem: () => saved,
          setItem: () => {},
        })),
      )!;
      expect(preference.edition.value).toBe('sujiao');
      scope.stop();
    }
  });

  it('remembers PEP across module reloads and writes only its own key', () => {
    const values = new Map([
      ['unrelated', 'keep'],
      [MATH_EDITION_KEY, 'sujiao'],
    ]);
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => {
        values.set(key, value);
      },
    };
    const scope = effectScope();
    scope.run(() => {
      const preference = createMathEditionPreference(() => storage);
      preference.edition.value = 'pep-2024';
      expect(createMathEditionPreference(() => storage).edition.value).toBe(
        'pep-2024',
      );
      expect([...values]).toEqual([
        ['unrelated', 'keep'],
        [MATH_EDITION_KEY, 'pep-2024'],
      ]);
    });
    scope.stop();
  });

  it('keeps navigation usable when storage access throws and reports recovery', () => {
    let blocked = true;
    const values = new Map<string, string>();
    const scope = effectScope();
    scope.run(() => {
      const preference = createMathEditionPreference(() => {
        if (blocked) throw new Error('Storage denied');
        return {
          getItem: (key) => values.get(key) ?? null,
          setItem: (key, value) => {
            values.set(key, value);
          },
        };
      });
      expect(preference.persistenceFailed.value).toBe(true);
      preference.edition.value = 'pep-2024';
      expect(preference.edition.value).toBe('pep-2024');
      expect(preference.persistenceFailed.value).toBe(true);
      blocked = false;
      preference.edition.value = 'sujiao';
      expect(preference.persistenceFailed.value).toBe(false);
      expect(values.get(MATH_EDITION_KEY)).toBe('sujiao');
    });
    scope.stop();
  });

  it('reports a failed write without reverting the selected edition', () => {
    const scope = effectScope();
    scope.run(() => {
      const preference = createMathEditionPreference(() => ({
        getItem: () => 'pep-2024',
        setItem: () => {
          throw new Error('Quota exceeded');
        },
      }));
      preference.edition.value = 'sujiao';
      expect(preference.edition.value).toBe('sujiao');
      expect(preference.persistenceFailed.value).toBe(true);
    });
    scope.stop();
  });
});

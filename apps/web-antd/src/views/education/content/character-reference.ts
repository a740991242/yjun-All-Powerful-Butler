import type { CharacterReferenceKind, Volume } from '../learning/types';

import {
  characterSources,
  lowerCharacters,
  upperCharacters,
} from './characters';
import { textbooks } from './textbooks';

export interface CharacterRow {
  id: string;
  unit: string;
  title: string;
  page: number;
  recognize: string;
  write: string;
  writeVerified: boolean;
  additionalReadings: string;
}

export function characterRows(volume: Volume): CharacterRow[] {
  const textbook = textbooks.find(
    (book) => book.subject === 'chinese' && book.volume === volume,
  );
  if (!textbook) return [];
  const scopes = volume === 'upper' ? upperCharacters : lowerCharacters;
  return textbook.units.flatMap((unit) =>
    unit.items.flatMap((item) => {
      const scope = scopes[item.id];
      return scope
        ? [
            {
              id: item.id,
              unit: unit.title,
              title: item.title,
              page: item.page,
              recognize: scope.recognize,
              write: scope.write,
              writeVerified: scope.writeVerified,
              additionalReadings: scope.additionalReadings ?? '',
            },
          ]
        : [];
    }),
  );
}

export function filterCharacters(
  rows: CharacterRow[],
  kind: CharacterReferenceKind,
  query: string,
  course = 'all',
) {
  const search = query.trim();
  return rows.filter((row) => {
    if (course !== 'all' && row.id !== course) return false;
    const scope =
      kind === 'write'
        ? row.write
        : `${row.recognize}${row.additionalReadings}`;
    return !search || `${row.title}${row.unit}${scope}`.includes(search);
  });
}

export function referenceKind(
  title: string,
): CharacterReferenceKind | undefined {
  switch (title) {
    case '识字表': {
      return 'recognize';
    }
    case '写字表': {
      return 'write';
    }
    case '笔画名称表': {
      return 'strokes';
    }
    case '常用偏旁名称表': {
      return 'radicals';
    }
    default: {
      return undefined;
    }
  }
}

export function referencePages(
  volume: Volume,
  kind: CharacterReferenceKind,
): number[] {
  const source = characterSources[volume];
  switch (kind) {
    case 'recognize': {
      return [...source.recognizePages];
    }
    case 'write': {
      return [
        ...source.writePages,
        ...(volume === 'lower'
          ? Object.values(characterSources.lower.verifiedWritingLessonPages)
          : []),
      ].toSorted((left, right) => left - right);
    }
    case 'strokes': {
      return [...source.strokePages];
    }
    case 'radicals': {
      return [...source.radicalPages];
    }
  }
}

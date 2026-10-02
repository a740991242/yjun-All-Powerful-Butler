import { required } from './required';
/** Symbolic directions, not an acoustic trace or a pronunciation assessment. */
export function pinyinTone(character: string) {
  const normalized = character.normalize('NFD');
  if (!/^(?:[a-z]\u0308?[\u0300\u0301\u0304\u030C]?)+$/.test(normalized))
    return null;
  const clusters =
    normalized.match(/[a-z][\u0300\u0301\u0304\u0308\u030C]*/g) ?? [];
  if (
    clusters.some(
      (cluster) => cluster.includes('\u0308') && !cluster.startsWith('u'),
    )
  )
    return null;
  const toned = clusters.filter((cluster) =>
    /[\u0300\u0301\u0304\u030C]/.test(cluster),
  );
  if (toned.length !== 1 || !/^[aeiou]/.test(required(toned[0]))) return null;
  const mark = required(toned[0]).at(-1);
  switch (mark) {
    case '\u0304': {
      return { number: 1, path: 'M8 12 H64' };
    }
    case '\u0301': {
      return { number: 2, path: 'M8 30 L64 8' };
    }
    case '\u030C': {
      return { number: 3, path: 'M8 12 L30 32 L64 8' };
    }
    case '\u0300': {
      return { number: 4, path: 'M8 8 L64 30' };
    }
    default: {
      return null;
    }
  }
}

import type { Book, Unit, Volume } from '../learning/types';

import { required } from '../learning/required';
import { englishQihangDraftLessons } from './english-qihang-drafts';
import { englishQihangSource } from './english-qihang-source';

/** Original foundational activities, separate from formal textbook identities. */
const groups = {
  upper: [
    ['Hello!', 'greetings', 'name'],
    ['Numbers', 'number-words', 'counting'],
    ['Colours', 'colours', 'colour-project'],
    ['School things', 'school-things'],
    ['My classroom', 'classroom'],
  ],
  lower: [
    ['Feelings', 'feelings'],
    ['Family', 'family'],
    ['Pets', 'pets'],
    ['At the farm', 'farm-numbers', 'farm-time'],
    ['My room', 'room', 'room-project'],
  ],
} satisfies Record<Volume, [string, ...string[]][]>;

export function englishPreparationBook(
  volume: unknown,
  title: string,
): Book | undefined {
  if (volume !== 'upper' && volume !== 'lower') return;
  const selected: Volume = volume;
  const units: Unit[] = groups[selected].map(([name, ...suffixes], index) => {
    const lessons = suffixes.map((suffix) => {
      const id = `english-qihang-${selected}-${suffix}-draft`;
      const lesson = englishQihangDraftLessons.find((item) => item.id === id);
      if (!lesson) throw new Error(`Missing original English activity: ${id}`);
      return {
        ...lesson,
        status: 'available' as const,
        textbookTitle: '新启航教师资源对应原创英语启蒙准备课',
      };
    });
    return {
      id: `english-preparation-${selected}-u${index + 1}`,
      title: name,
      page: required(lessons[0]).page,
      lessons,
    };
  });
  return {
    id: `original-english-preparation-p1-${selected}-v1`,
    subject: 'english',
    volume: selected,
    edition: 'original-preparation',
    title,
    source:
      selected === 'upper'
        ? englishQihangSource.upper.url
        : required(englishQihangSource.lower.units[0]).url,
    verifiedAt: englishQihangSource.checkedAt,
    units,
  };
}

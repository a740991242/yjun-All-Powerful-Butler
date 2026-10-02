import type { Answer, Question, Session } from './types';

export type HistoryStatus = 'all' | 'completed' | 'unfinished';
export type HistoryMode = 'all' | Session['mode'];

/** Filter only the supplied profile/book records; never mutate saved ordering. */
export function filterHistory(
  sessions: Session[],
  query: string,
  status: HistoryStatus,
  mode: HistoryMode,
) {
  const search = query.trim().toLocaleLowerCase();
  return sessions
    .filter(
      (session) =>
        (!search || session.lessonTitle.toLocaleLowerCase().includes(search)) &&
        (mode === 'all' || session.mode === mode) &&
        (status === 'all' ||
          (status === 'completed'
            ? !!session.completedAt
            : !session.completedAt)),
    )
    .toSorted(
      (left, right) =>
        right.updatedAt.localeCompare(left.updatedAt) ||
        left.id.localeCompare(right.id),
    );
}

/** Choice labels come from the historical snapshot, not the current course. */
export function answerLabel(question: Question, answer: Answer): string {
  const label = (value: null | number | string) =>
    (() => {
      if (value === null) return '—';
      return typeof value === 'string'
        ? (question.choices?.find((choice) => choice.id === value)?.label ??
            value)
        : String(value);
    })();
  return Array.isArray(answer)
    ? answer.map((item) => label(item)).join('、')
    : label(answer);
}
